import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles } from 'lucide-react';
import { CakeConfig } from '../../config/birthday.config';
import { createCakeMaterials } from './cake/cakeMaterials';
import { build3DCake, Cake3DHierarchy } from './cake/cakeBuilder';

interface BirthdayCake3DProps {
  candlesLit: boolean;
  isBlowing?: boolean;
  blowProgress?: number;
  onCakeClick?: () => void;
  recipientName?: string;
  cakeConfig?: CakeConfig;
  className?: string;
}

export const BirthdayCake3D: React.FC<BirthdayCake3DProps> = ({
  candlesLit,
  isBlowing = false,
  blowProgress = 0,
  onCakeClick,
  recipientName = 'You',
  cakeConfig,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // References for render loop & 3D hierarchy
  const hierarchyRef = useRef<Cake3DHierarchy | null>(null);
  const prevLitRef = useRef(candlesLit);
  const isDraggingRef = useRef(false);
  const pointerPosRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const cakeRotationRef = useRef({ x: 0.1, y: 0 });
  const idleTimerRef = useRef<any>(null);
  const isUserInteractingRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  const [hasInteracted, setHasInteracted] = useState(false);

  // Sync props to refs
  const candlesLitRef = useRef(candlesLit);
  candlesLitRef.current = candlesLit;
  const isBlowingRef = useRef(isBlowing);
  isBlowingRef.current = isBlowing;
  const blowProgressRef = useRef(blowProgress);
  blowProgressRef.current = blowProgress;

  // Detect candle extinguish event to spawn smoke burst
  useEffect(() => {
    if (prevLitRef.current && !candlesLit) {
      if (hierarchyRef.current) {
        hierarchyRef.current.spawnSmokeBurst();
      }
    }
    prevLitRef.current = candlesLit;
  }, [candlesLit]);

  // Pointer Handlers for 360° Drag & Orbit
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true;
    isUserInteractingRef.current = true;
    setHasInteracted(true);
    pointerPosRef.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { x: 0, y: 0 };

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - pointerPosRef.current.x;
    const deltaY = e.clientY - pointerPosRef.current.y;

    const sensitivityX = 0.007;
    const sensitivityY = 0.003;

    const vx = deltaX * sensitivityX;
    const vy = deltaY * sensitivityY;
    velocityRef.current = { x: vx, y: vy };

    cakeRotationRef.current.y += vx;
    // Tightly clamp vertical tilt angle between -0.08 and 0.20 rad so platter base never cuts off
    cakeRotationRef.current.x = Math.max(
      -0.08,
      Math.min(0.20, cakeRotationRef.current.x + vy)
    );

    pointerPosRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

    // Resume gentle auto-orbit after 2.5 seconds of inactivity
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
    }, 2500);
  }, []);

  // Main Three.js Scene Setup & Render Loop
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 340;
    let height = container.clientHeight || 380;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);

    // Responsive Camera Fitting: Dynamically adapts camera distance to prevent cake sides & base from clipping on any screen or tilt
    const fitCamera = (w: number, h: number) => {
      const aspect = w / h;
      camera.aspect = aspect;

      // Target bounding volume: fits the 10.0-unit platter and full cake height with generous breathing margins
      const targetFitWidth = 13.5;
      const targetFitHeight = 12.8;
      const vFovRad = (36 * Math.PI) / 180;

      // Distance required to satisfy both horizontal and vertical bounds
      const distH = targetFitWidth / (2 * aspect) / Math.tan(vFovRad / 2);
      const distV = targetFitHeight / 2 / Math.tan(vFovRad / 2);
      const targetDist = Math.max(distH, distV, 18.2);

      // Elevated angle looking down at cake center
      camera.position.set(0, 2.5 + targetDist * 0.28, targetDist * 0.94);
      camera.lookAt(0, 2.5, 0);
      camera.updateProjectionMatrix();
    };

    fitCamera(width, height);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // 3. Ambient & Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xFFF9F5, 1.1);
    scene.add(ambientLight);

    // Warm Key Light (Front-Right Sun)
    const keyLight = new THREE.DirectionalLight(0xFFF4EB, 1.6);
    keyLight.position.set(6, 12, 9);
    scene.add(keyLight);

    // Rose Fill Light (Front-Left)
    const fillLight = new THREE.DirectionalLight(0xFCE7F3, 0.85);
    fillLight.position.set(-7, 8, 8);
    scene.add(fillLight);

    // Warm Gold Rim Backlight
    const rimLight = new THREE.DirectionalLight(0xF59E0B, 0.6);
    rimLight.position.set(0, 8, -9);
    scene.add(rimLight);

    // 4. Subtle Ambient Floating Sparkles / Bokeh around the cake
    const sparkleCount = 36;
    const sparkleGeom = new THREE.BufferGeometry();
    const sparklePos = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount; i++) {
      sparklePos[i * 3] = (Math.random() - 0.5) * 14;
      sparklePos[i * 3 + 1] = Math.random() * 9;
      sparklePos[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    sparkleGeom.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3));
    const sparkleMat = new THREE.PointsMaterial({
      color: 0xFCD34D,
      size: 0.18,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const sparkles = new THREE.Points(sparkleGeom, sparkleMat);
    scene.add(sparkles);

    // 5. Build 3D Cake Hierarchy
    const materials = createCakeMaterials(recipientName, cakeConfig);
    const cakeHierarchy = build3DCake(materials, recipientName, cakeConfig);
    scene.add(cakeHierarchy.rootGroup);
    hierarchyRef.current = cakeHierarchy;

    // Center cake vertically with safe upward offset
    cakeHierarchy.cakeGroup.position.y = 0.15;

    // 6. Clock & Render Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Physics / Orbit Inertia
      if (!isDraggingRef.current) {
        // Damping velocity
        velocityRef.current.x *= 0.92;
        velocityRef.current.y *= 0.90;

        cakeRotationRef.current.y += velocityRef.current.x;
        cakeRotationRef.current.x += velocityRef.current.y;

        // Ensure vertical tilt remains within safe boundary even during velocity coasting
        cakeRotationRef.current.x = Math.max(
          -0.08,
          Math.min(0.20, cakeRotationRef.current.x)
        );

        // Smoothly restore tilt to default resting angle (0.0) when released
        cakeRotationRef.current.x += (0.0 - cakeRotationRef.current.x) * 0.04;

        // Auto-orbit when idle
        if (!isUserInteractingRef.current) {
          cakeRotationRef.current.y += 0.0035;
        }
      }

      // Apply rotation to cake group
      cakeHierarchy.cakeGroup.rotation.y = cakeRotationRef.current.y;
      cakeHierarchy.cakeGroup.rotation.x = cakeRotationRef.current.x;

      // Floating gentle bobbing motion elevated safely above platter clipping boundary
      cakeHierarchy.cakeGroup.position.y = 0.15 + Math.sin(time * 1.8) * 0.05;

      // Update flame animations & light flicker with blowProgress
      cakeHierarchy.updateFlames(
        time,
        isBlowingRef.current,
        candlesLitRef.current,
        blowProgressRef.current
      );

      // Update smoke simulation
      cakeHierarchy.updateSmoke(delta);

      // Sparkles slow drift
      sparkles.rotation.y = time * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;

      fitCamera(newWidth, newHeight);
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 8. Cleanup on unmount
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      resizeObserver.disconnect();

      cakeHierarchy.dispose();
      sparkleGeom.dispose();
      sparkleMat.dispose();
      renderer.dispose();
      hierarchyRef.current = null;
    };
  }, [recipientName, JSON.stringify(cakeConfig)]);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center select-none w-full max-w-md sm:max-w-xl mx-auto h-[400px] sm:h-[450px] touch-none ${className}`}
      style={{ touchAction: 'none' }}
      onClick={onCakeClick}
      role="region"
      aria-label="Bánh sinh nhật 3D chân thực, có thể xoay 360 độ và thổi nến"
    >
      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing outline-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

      {/* Warm Ambient Candle Halo Behind Cake */}
      <div
        className={`absolute -z-10 w-72 h-72 rounded-full blur-3xl transition-all duration-1000 pointer-events-none ${
          candlesLit
            ? isBlowing
              ? 'bg-amber-500/35 scale-125'
              : 'bg-amber-400/25 scale-110'
            : 'bg-rose-950/15 scale-75'
        }`}
      />

      {/* 360° Floor Orbit Guide & Hint */}
      <div className="absolute bottom-1.5 flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/95 text-xs font-sans font-medium pointer-events-none transition-opacity duration-300 subcaption-contrast">
        <RotateCw size={12} className="text-[#FFC480] animate-spin-slow" />
        <span className="tracking-wide">
          {hasInteracted ? 'Xoay 360° tự do' : 'Kéo để xoay 360° chiếc bánh'}
        </span>
        <Sparkles size={11} className="text-[#FFC480]" />
      </div>
    </div>
  );
};
