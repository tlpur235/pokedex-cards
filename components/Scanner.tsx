"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBox from "./SearchBox";

type Phase = "starting" | "ready" | "scanning" | "error";

/**
 * The scanning experience. Opens the rear camera, lets the user snap a
 * card, sends the frame to /api/identify (Claude vision), then jumps
 * straight to the Pokédex page. A photo-upload fallback covers
 * desktops and denied camera permissions.
 */
export default function Scanner() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("starting");
  const [message, setMessage] = useState<string | null>(null);

  // Start the rear camera on mount; stop it on unmount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setPhase("ready");
      } catch {
        setPhase("error");
        setMessage("Camera unavailable — upload a photo of the card instead.");
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  /** Send a base64 JPEG to the identify API and route to the result. */
  const identify = useCallback(
    async (base64: string) => {
      setPhase("scanning");
      setMessage(null);
      try {
        const res = await fetch("/api/identify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });
        const data = await res.json();
        if (!res.ok || data.error || !data.pokemon) {
          setMessage(data.error ?? "Couldn't read that card — try again.");
          setPhase(streamRef.current ? "ready" : "error");
          return;
        }
        // Hand the card details to the Pokédex page without a long URL.
        sessionStorage.setItem("lastScan", JSON.stringify(data));
        router.push(`/pokemon/${encodeURIComponent(data.pokemon)}?scanned=1`);
      } catch {
        setMessage("Network hiccup — try again.");
        setPhase(streamRef.current ? "ready" : "error");
      }
    },
    [router]
  );

  /** Grab the current camera frame as JPEG. */
  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video || phase !== "ready") return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg", 0.85).split(",")[1];
    identify(base64);
  }, [identify, phase]);

  /** Fallback: read an uploaded photo, downscale, identify. */
  const onFile = useCallback(
    (file: File) => {
      const img = document.createElement("img");
      img.onload = () => {
        const scale = Math.min(1, 1280 / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        identify(canvas.toDataURL("image/jpeg", 0.85).split(",")[1]);
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    },
    [identify]
  );

  return (
    <div className="space-y-5">
      {/* Viewfinder */}
      <div className="panel relative overflow-hidden">
        <div className="relative aspect-[3/4] w-full bg-black">
          <video
            ref={videoRef}
            playsInline
            muted
            className="h-full w-full object-cover"
          />
          {/* Card-shaped guide frame */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative h-[70%] w-[72%] rounded-2xl border-2 border-beam/90">
              {phase !== "scanning" && (
                <span className="absolute left-0 right-0 mx-4 h-0.5 animate-beam rounded bg-beam shadow-[0_0_12px_2px_rgba(79,209,224,0.8)]" />
              )}
            </div>
          </div>
          {/* Scanning overlay */}
          {phase === "scanning" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/80 backdrop-blur-sm">
              <span className="dex-lens h-16 w-16 animate-lens" />
              <p className="font-display font-semibold text-beam">
                Identifying your card…
              </p>
            </div>
          )}
          {phase === "starting" && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/80">
              <p className="text-faded">Starting camera…</p>
            </div>
          )}
        </div>
      </div>

      {message && (
        <p className="rounded-2xl border border-dexred/50 bg-dexred/10 px-4 py-3 text-sm">
          {message}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={capture}
          disabled={phase !== "ready"}
          aria-label="Scan card"
          className="dex-lens h-20 w-20 transition active:scale-90 disabled:opacity-40"
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={phase === "scanning"}
          className="rounded-full border border-edge bg-panel px-5 py-3 font-display text-sm font-semibold transition hover:border-beam disabled:opacity-40"
        >
          Upload a photo
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
        />
      </div>
      <p className="text-center text-sm text-faded">
        Hold the card flat, fill the frame, tap the lens.
      </p>

      {/* No camera / no AI? Searching still works. */}
      <div className="panel space-y-3 p-5">
        <p className="text-sm text-faded">Or look a Pokémon up by name:</p>
        <SearchBox />
      </div>
    </div>
  );
}
