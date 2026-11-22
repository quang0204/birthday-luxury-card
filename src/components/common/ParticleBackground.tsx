import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  opacitySpeed: number;
  color: string;
  isSparkle?: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  len: number;
  speed: number;
  opacity: number;
  angle: number;
}

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleColors = [
      'rgba(255, 94, 142, ', // Rose pink
      'rgba(183, 148, 246, ', // Lavender
      'rgba(252, 211, 77, ', // Champagne gold
      'rgba(255, 255, 255, '  // Pure white star
    ];

    const particleCount = Math.min(Math.floor((width * height) / 22000), 45);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.6,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.4 - 0.1,
        opacity: Math.random() * 0.7 + 0.2,
        opacitySpeed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        isSparkle: i % 7 === 0 // 1 in 7 particles is a 4-point diamond star
      });
    }

    let shootingStar: ShootingStar | null = null;
    let nextShootingStarTime = Date.now() + 2500;

    const spawnShootingStar = () => {
      shootingStar = {
        x: Math.random() * (width * 0.7),
        y: Math.random() * (height * 0.35),
        len: Math.random() * 90 + 70,
        speed: Math.random() * 8 + 10,
        opacity: 0.85,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.18
      };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const now = Date.now();

      // Spawn periodic romantic shooting star
      if (!shootingStar && now > nextShootingStarTime) {
        spawnShootingStar();
        nextShootingStarTime = now + Math.random() * 4000 + 4000;
      }

      // Render floating particles and diamond stars
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.opacitySpeed;

        if (p.opacity > 0.85 || p.opacity < 0.15) {
          p.opacitySpeed = -p.opacitySpeed;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.fillStyle = `${p.color}${p.opacity})`;

        if (p.isSparkle && p.opacity > 0.35) {
          // Delicate 4-point diamond sparkle star
          const s = p.size * 2.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - s);
          ctx.lineTo(p.x + s * 0.25, p.y);
          ctx.lineTo(p.x + s, p.y);
          ctx.lineTo(p.x + s * 0.25, p.y);
          ctx.lineTo(p.x, p.y + s);
          ctx.lineTo(p.x - s * 0.25, p.y);
          ctx.lineTo(p.x - s, p.y);
          ctx.lineTo(p.x - s * 0.25, p.y);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Render shooting star trail with linear gradient
      if (shootingStar) {
        const cos = Math.cos(shootingStar.angle);
        const sin = Math.sin(shootingStar.angle);
        const tailX = shootingStar.x - cos * shootingStar.len;
        const tailY = shootingStar.y - sin * shootingStar.len;

        const grad = ctx.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y);
        grad.addColorStop(0, `rgba(254, 235, 239, 0)`);
        grad.addColorStop(0.7, `rgba(230, 194, 156, ${shootingStar.opacity * 0.6})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${shootingStar.opacity})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(shootingStar.x, shootingStar.y);
        ctx.stroke();

        shootingStar.x += cos * shootingStar.speed;
        shootingStar.y += sin * shootingStar.speed;
        shootingStar.opacity -= 0.016;

        if (shootingStar.opacity <= 0 || shootingStar.x > width + 50 || shootingStar.y > height + 50) {
          shootingStar = null;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
};
