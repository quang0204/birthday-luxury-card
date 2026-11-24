"use client";

import React, { useEffect, useRef } from "react";

export interface ArcCursorProps {
  /** Colors for [primary arc, core spark, glow bloom] */
  colors?: string[];
  /** Render mode: "glow" (screen blend for dark theme), "ink" (crisp on light), or "auto" */
  mode?: "auto" | "glow" | "ink";
  /** Number of braided electric filaments (1 to 4) */
  strands?: number;
  /** Width of the core filament line in pixels */
  thickness?: number;
  /** Length of the trailing arc in points/frames */
  length?: number;
  /** Speed of electric crackle and writhing oscillations */
  speed?: number;
  /** Bloom blur radius in pixels */
  glow?: number;
  /** Core brightness and overall opacity (0 to 1) */
  intensity?: number;
  /** Curvature / bend responsiveness */
  bend?: number;
  /** Frequency and amplitude of electric static / crackle */
  crackle?: number;
  /** Subtle brightness flickering */
  flicker?: boolean;
  className?: string;
}

interface Point {
  x: number;
  y: number;
  time: number;
}

export function ArcCursor({
  colors = ["#E77C92", "#FFC0CB", "#FFFFFF"],
  mode = "glow",
  strands = 3,
  thickness = 1.6,
  length = 26,
  speed = 1.4,
  glow = 14,
  intensity = 1.0,
  bend = 1.2,
  crackle = 0.85,
  flicker = true,
  className = "",
}: ArcCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Check if device supports fine hover cursor (disable on mobile touch screens)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth * window.devicePixelRatio);
    let height = (canvas.height = window.innerHeight * window.devicePixelRatio);
    const dpr = window.devicePixelRatio || 1;

    // Track cursor trail
    const points: Point[] = [];
    let currentX = -100;
    let currentY = -100;
    let targetX = -100;
    let targetY = -100;
    let isMoving = false;
    let lastMoveTime = 0;
    let time = 0;

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      lastMoveTime = performance.now();
      isMoving = true;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth * window.devicePixelRatio;
      height = canvas.height = window.innerHeight * window.devicePixelRatio;
    };

    window.addEventListener("resize", onResize, { passive: true });

    // Render loop
    const render = (now: number) => {
      time += 0.04 * speed;

      // Smooth lerp pointer position towards target
      if (currentX < 0) {
        currentX = targetX;
        currentY = targetY;
      } else {
        currentX += (targetX - currentX) * 0.45;
        currentY += (targetY - currentY) * 0.45;
      }

      // Detect if user stopped moving
      if (now - lastMoveTime > 120) {
        isMoving = false;
      }

      // Add new point if moving or keep tail retracting
      if (targetX >= 0) {
        points.unshift({ x: currentX, y: currentY, time: now });
      }

      // Limit trail length or collapse when stationary
      const maxLen = isMoving ? length : Math.max(2, Math.floor(length * 0.3));
      while (points.length > maxLen) {
        points.pop();
      }

      // Clear frame
      ctx.clearRect(0, 0, width, height);

      if (points.length >= 2) {
        ctx.save();
        ctx.scale(dpr, dpr);

        const primaryColor = colors[0] || "#E77C92";
        const sparkColor = colors[1] || "#FFC0CB";
        const coreColor = colors[2] || "#FFFFFF";

        // Screen blending for electric luminescence
        if (mode === "glow" || mode === "auto") {
          ctx.globalCompositeOperation = "screen";
        }

        const flickerAlpha = flicker ? 0.9 + Math.sin(now * 0.05) * 0.1 : 1.0;
        const totalAlpha = Math.min(1.0, intensity * flickerAlpha);

        // Draw multiple braided electric filaments
        for (let s = 0; s < strands; s++) {
          const strandPhase = (s * Math.PI * 2) / strands;
          const strandOffsetFreq = 0.25 * bend;

          // 1. Draw outer soft glow arc
          ctx.beginPath();
          ctx.lineWidth = thickness * (4.5 + s * 0.6);
          ctx.strokeStyle = primaryColor;
          ctx.globalAlpha = 0.22 * totalAlpha;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          if (glow > 0) {
            ctx.shadowColor = primaryColor;
            ctx.shadowBlur = glow;
          }

          for (let i = 0; i < points.length; i++) {
            const pt = points[i];
            const progress = i / points.length; // 0 at cursor, 1 at tail
            const taper = 1 - progress;

            // Electric crackle jitter
            const noise =
              Math.sin(time * 3 + i * 0.8 + strandPhase) *
              Math.cos(time * 2 + i * 0.4) *
              crackle *
              6 *
              taper;
            const orthoX = -(points[Math.min(i + 1, points.length - 1)].y - pt.y) * 0.15;
            const orthoY = (points[Math.min(i + 1, points.length - 1)].x - pt.x) * 0.15;

            const px = pt.x + orthoX * Math.sin(time + i * strandOffsetFreq + strandPhase) + noise;
            const py = pt.y + orthoY * Math.cos(time + i * strandOffsetFreq + strandPhase) + noise;

            if (i === 0) {
              ctx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
            }
          }
          ctx.stroke();

          // 2. Draw intense middle spark arc
          ctx.beginPath();
          ctx.lineWidth = thickness * 2.2;
          ctx.strokeStyle = sparkColor;
          ctx.globalAlpha = 0.65 * totalAlpha;
          ctx.shadowBlur = glow * 0.5;
          ctx.shadowColor = sparkColor;

          for (let i = 0; i < points.length; i++) {
            const pt = points[i];
            const progress = i / points.length;
            const taper = 1 - progress;

            const noise =
              Math.sin(time * 4 + i * 1.2 + strandPhase) *
              crackle *
              3.5 *
              taper;
            const orthoX = -(points[Math.min(i + 1, points.length - 1)].y - pt.y) * 0.08;
            const orthoY = (points[Math.min(i + 1, points.length - 1)].x - pt.x) * 0.08;

            const px = pt.x + orthoX * Math.sin(time * 1.2 + i * strandOffsetFreq + strandPhase) + noise;
            const py = pt.y + orthoY * Math.cos(time * 1.2 + i * strandOffsetFreq + strandPhase) + noise;

            if (i === 0) {
              ctx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
            }
          }
          ctx.stroke();

          // 3. Draw needle-thin ultra-bright hot electric core
          ctx.beginPath();
          ctx.lineWidth = thickness;
          ctx.strokeStyle = coreColor;
          ctx.globalAlpha = 0.95 * totalAlpha;
          ctx.shadowBlur = 4;
          ctx.shadowColor = "#FFFFFF";

          for (let i = 0; i < points.length; i++) {
            const pt = points[i];
            const progress = i / points.length;
            const taper = 1 - progress;

            const noise =
              Math.sin(time * 5 + i * 1.5 + strandPhase) *
              crackle *
              1.8 *
              taper;

            const px = pt.x + noise;
            const py = pt.y + noise;

            if (i === 0) {
              ctx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
            }
          }
          ctx.stroke();
        }

        // Draw hot spark head at cursor tip
        if (targetX >= 0) {
          ctx.beginPath();
          ctx.arc(currentX, currentY, thickness * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = coreColor;
          ctx.shadowColor = primaryColor;
          ctx.shadowBlur = glow;
          ctx.globalAlpha = totalAlpha;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(currentX, currentY, thickness * 4.5, 0, Math.PI * 2);
          ctx.fillStyle = sparkColor;
          ctx.globalAlpha = 0.4 * totalAlpha;
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
    };
  }, [bend, colors, crackle, flicker, glow, intensity, length, mode, speed, strands, thickness]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-[9999] select-none ${className}`}
      aria-hidden="true"
    />
  );
}

export default ArcCursor;
