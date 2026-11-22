import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
}

interface FireworksProps {
  active?: boolean;
  burstCount?: number;
  continuous?: boolean;
}

export const Fireworks: React.FC<FireworksProps> = ({ 
  active = true, 
  burstCount = 3, 
  continuous = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!active || reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = [
      '#FF5E8E', // Pink
      '#FCD34D', // Gold
      '#B794F6', // Lavender
      '#6EE7B7', // Emerald mint
      '#60A5FA', // Sky blue
      '#FFFFFF'  // Diamond
    ];

    const rockets: Rocket[] = [];
    const particles: FireworkParticle[] = [];

    const createExplosion = (x: number, y: number, color: string) => {
      const count = 45;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 4 + 1.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          size: Math.random() * 2.5 + 1.2,
          decay: Math.random() * 0.015 + 0.012
        });
      }
    };

    const launchRocket = () => {
      const x = Math.random() * (width * 0.7) + width * 0.15;
      const targetY = Math.random() * (height * 0.45) + height * 0.1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      rockets.push({
        x,
        y: height,
        targetY,
        vy: -(Math.random() * 3 + 8),
        color
      });
    };

    // Initial rockets
    for (let i = 0; i < burstCount; i++) {
      setTimeout(launchRocket, i * 400);
    }

    let intervalId: number | null = null;
    if (continuous) {
      intervalId = window.setInterval(() => {
        if (Math.random() > 0.3) {
          launchRocket();
        }
      }, 1200);
    }

    const loop = () => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      // Update rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;

        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.fill();

        if (r.y <= r.targetY) {
          createExplosion(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // Gravity
        p.vx *= 0.98; // Friction
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (intervalId) clearInterval(intervalId);
      cancelAnimationFrame(animId);
    };
  }, [active, burstCount, continuous, reducedMotion]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
      aria-hidden="true"
    />
  );
};
