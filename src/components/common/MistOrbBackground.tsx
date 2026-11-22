import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Orb {
  x: number;
  y: number;
  baseRadius: number;
  radius: number;
  vx: number;
  vy: number;
  colorStop0: string;
  colorStop1: string;
  pulsePhase: number;
  pulseSpeed: number;
}

interface MistOrbBackgroundProps {
  className?: string;
  interactive?: boolean;
}

/**
 * Mist Orb Animated Background Canvas
 * Inspired by getdesign.md/backgrounds?fx=mist-orb
 * Features dreamy, glowing, ambient blurred orbs with smooth floating physics and organic pulse.
 */
export const MistOrbBackground: React.FC<MistOrbBackgroundProps> = ({
  className = '',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Warm Superr Mist Orbs: Marker Orange, Bubblegum Pink, Sunshine Gold, Soft Violet Mist
    const orbs: Orb[] = [
      {
        x: width * 0.25,
        y: height * 0.3,
        baseRadius: Math.min(width, height) * 0.38,
        radius: Math.min(width, height) * 0.38,
        vx: 0.35,
        vy: 0.25,
        colorStop0: 'rgba(255, 111, 30, 0.35)', // Marker Orange
        colorStop1: 'rgba(255, 111, 30, 0)',
        pulsePhase: 0,
        pulseSpeed: 0.012,
      },
      {
        x: width * 0.75,
        y: height * 0.4,
        baseRadius: Math.min(width, height) * 0.42,
        radius: Math.min(width, height) * 0.42,
        vx: -0.3,
        vy: 0.3,
        colorStop0: 'rgba(255, 102, 207, 0.28)', // Bubblegum Pink
        colorStop1: 'rgba(255, 102, 207, 0)',
        pulsePhase: Math.PI * 0.5,
        pulseSpeed: 0.015,
      },
      {
        x: width * 0.5,
        y: height * 0.75,
        baseRadius: Math.min(width, height) * 0.36,
        radius: Math.min(width, height) * 0.36,
        vx: 0.25,
        vy: -0.35,
        colorStop0: 'rgba(251, 191, 36, 0.26)', // Sunshine Gold
        colorStop1: 'rgba(251, 191, 36, 0)',
        pulsePhase: Math.PI,
        pulseSpeed: 0.01,
      },
      {
        x: width * 0.8,
        y: height * 0.85,
        baseRadius: Math.min(width, height) * 0.32,
        radius: Math.min(width, height) * 0.32,
        vx: -0.2,
        vy: -0.2,
        colorStop0: 'rgba(168, 85, 247, 0.22)', // Soft Violet
        colorStop1: 'rgba(168, 85, 247, 0)',
        pulsePhase: Math.PI * 1.5,
        pulseSpeed: 0.014,
      },
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Screen blend mode creates glowing ethereal atmospheric light
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];

        if (!reducedMotion) {
          orb.x += orb.vx;
          orb.y += orb.vy;

          // Organic breathing pulse
          orb.pulsePhase += orb.pulseSpeed;
          orb.radius = orb.baseRadius + Math.sin(orb.pulsePhase) * (orb.baseRadius * 0.12);

          // Gentle bounce off screen edges
          if (orb.x - orb.radius < -100) {
            orb.x = -100 + orb.radius;
            orb.vx = Math.abs(orb.vx);
          } else if (orb.x + orb.radius > width + 100) {
            orb.x = width + 100 - orb.radius;
            orb.vx = -Math.abs(orb.vx);
          }

          if (orb.y - orb.radius < -100) {
            orb.y = -100 + orb.radius;
            orb.vy = Math.abs(orb.vy);
          } else if (orb.y + orb.radius > height + 100) {
            orb.y = height + 100 - orb.radius;
            orb.vy = -Math.abs(orb.vy);
          }

          // Subtle interaction with mouse/cursor
          if (mouseRef.current.active) {
            const dx = mouseRef.current.x - orb.x;
            const dy = mouseRef.current.y - orb.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 350 && dist > 1) {
              const force = (350 - dist) / 350;
              orb.x += (dx / dist) * force * 1.2;
              orb.y += (dy / dist) * force * 1.2;
            }
          }
        }

        // Radial gradient representing soft mist orb
        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          Math.max(10, orb.radius)
        );
        gradient.addColorStop(0, orb.colorStop0);
        gradient.addColorStop(0.55, orb.colorStop0.replace(/[\d\.]+\)$/, '0.1)'));
        gradient.addColorStop(1, orb.colorStop1);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, Math.max(10, orb.radius), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [reducedMotion, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
};
