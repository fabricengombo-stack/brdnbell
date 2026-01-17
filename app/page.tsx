"use client";

import { useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [wantsAudio, setWantsAudio] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-8">
      <div
        className="relative h-[1080px] w-[1920px] transition-transform duration-300"
        style={{
          transform: `perspective(1400px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        }}
      >
        <video
          className="h-full w-full object-contain"
          src="/ipodvid.mp4"
          muted={!wantsAudio || !isHovering}
          playsInline
          preload="metadata"
          ref={videoRef}
        />
        <div
          className="absolute left-1/2 top-0 h-full w-[70%] -translate-x-1/2"
          onMouseEnter={() => {
            const video = videoRef.current;
            if (!video) return;
            setIsHovering(true);
            video.muted = !wantsAudio;
            video.play();
          }}
          onMouseLeave={() => {
            const video = videoRef.current;
            if (!video) return;
            setIsHovering(false);
            video.pause();
            video.currentTime = 0;
            video.muted = true;
            setTilt({ x: 0, y: 0 });
          }}
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            const rotateX = (0.5 - y) * 4;
            const rotateY = (x - 0.5) * 6;
            setTilt({ x: rotateY, y: rotateX });
          }}
        />
        <button
          className="absolute right-4 top-4 rounded-full border border-white/40 bg-black/60 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          onClick={(event) => {
            event.stopPropagation();
            const video = videoRef.current;
            const nextWantsAudio = !wantsAudio;
            setWantsAudio(nextWantsAudio);
            if (video && isHovering) video.muted = !nextWantsAudio;
          }}
          type="button"
        >
          {wantsAudio ? "Mute" : "Unmute"}
        </button>
        <div className="pointer-events-none absolute left-1/2 top-6 flex -translate-x-1/2 items-center gap-3 text-white/80">
          <span className="text-[11px] uppercase tracking-[0.25em]">
            Move your mouse
          </span>
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 4v12M6 12l4 4 4-4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>
    </main>
  );
}
