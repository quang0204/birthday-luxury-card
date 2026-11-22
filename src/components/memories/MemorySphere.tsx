import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { Memory } from '../../data/memories';
import { calculateFibonacciSpherePoints } from '../../utils/fibonacciSphere';
import { createMistOrbMesh, createAtmosphereHalo } from './MemoryMistEffect';
import { createMemoryParticles } from './MemoryParticles';
import { createMemoryLighting } from './MemoryLighting';
import { createMemoryPhotoCard, MemoryPhotoCard } from './MemoryPhoto';
import { useSphereRotation } from '../../hooks/useSphereRotation';

interface MemorySphereProps {
  memories: Memory[];
  selectedMemory: Memory | null;
  onSelectMemory: (memory: Memory) => void;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  className?: string;
}

export const MemorySphere: React.FC<MemorySphereProps> = ({
  memories,
  selectedMemory,
  onSelectMemory,
  hoveredId,
  setHoveredId,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Hook for rotation, inertia, and auto-orbit
  const {
    rotationRef,
    isDraggingRef,
    hasMovedRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    updatePhysics,
  } = useSphereRotation();

  // If there are few memories (e.g. 6-8), replicate them so the sphere has 16-18 cards nicely distributed
  const distributedMemories = useMemo(() => {
    if (!memories || memories.length === 0) return [];
    const minCards = Math.max(16, memories.length);
    const result: Memory[] = [];
    for (let i = 0; i < minCards; i++) {
      const base = memories[i % memories.length];
      result.push({
        ...base,
        id: `${base.id}-node-${i}`,
      });
    }
    return result;
  }, [memories]);

  // Main Three.js Scene Setup & Render Loop
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Detect container dimensions
    let width = container.clientWidth || 360;
    let height = container.clientHeight || 420;
    const isMobile = width < 640;

    // Radius and card dimensions based on viewport
    const sphereRadius = isMobile ? 105 : 135;
    const cardWidth = isMobile ? 36 : 44;
    const cardHeight = isMobile ? 29 : 35;
    const defaultCamDist = isMobile ? 310 : 275;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, defaultCamDist);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // 3. Central Rotating Group
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // 4. Mist Orb Mesh (Shader)
    const mistOrb = createMistOrbMesh(sphereRadius);
    sphereGroup.add(mistOrb.mesh);

    // 5. Atmosphere Glow Halo
    const halo = createAtmosphereHalo(sphereRadius);
    sphereGroup.add(halo.mesh);

    // 6. Ambient Floating Particles
    const particles = createMemoryParticles(sphereRadius, isMobile ? 120 : 180);
    scene.add(particles.points);

    // 7. Lighting
    const lighting = createMemoryLighting();
    lighting.lights.forEach((l) => scene.add(l));

    // 8. Place Photo Cards using Fibonacci Sphere Distribution
    const points = calculateFibonacciSpherePoints(distributedMemories.length, sphereRadius + 1.5);
    const photoCards: MemoryPhotoCard[] = [];
    const interactiveMeshes: THREE.Mesh[] = [];

    distributedMemories.forEach((mem, index) => {
      const pt = points[index];
      if (!pt) return;
      const card = createMemoryPhotoCard(mem, pt, cardWidth, cardHeight);
      sphereGroup.add(card.group);
      photoCards.push(card);
      interactiveMeshes.push(card.photoMesh);
    });

    // 9. Raycasting Setup
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2(-999, -999);
    let currentHoveredMesh: THREE.Mesh | null = null;

    // Raycast check helper
    const checkIntersection = () => {
      raycaster.setFromCamera(mouseNDC, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes, false);

      if (intersects.length > 0) {
        const top = intersects[0].object as THREE.Mesh;
        if (top !== currentHoveredMesh) {
          currentHoveredMesh = top;
          const mem = top.userData?.memory as Memory;
          if (mem) {
            setHoveredId(mem.id);
            if (canvas) canvas.style.cursor = 'pointer';
          }
        }
      } else {
        if (currentHoveredMesh !== null) {
          currentHoveredMesh = null;
          setHoveredId(null);
          if (canvas) canvas.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab';
        }
      }
    };

    // 10. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Update rotation from inertia / drag physics
      const currentRot = updatePhysics();
      sphereGroup.rotation.x = currentRot.x;
      sphereGroup.rotation.y = currentRot.y;

      // Update shader & atmosphere
      mistOrb.update(elapsedTime);
      halo.update(elapsedTime);
      particles.update(elapsedTime);
      lighting.update(elapsedTime);

      // Update photo cards hover & selection states
      photoCards.forEach((card) => {
        const isHovered = hoveredId ? card.memory.id === hoveredId : false;
        const isSelected = selectedMemory ? card.memory.id === selectedMemory.id : false;
        card.update(elapsedTime, isHovered, isSelected);
      });

      // Smooth camera zoom when modal is opened vs closed
      const targetCamZ = selectedMemory ? defaultCamDist * 0.88 : defaultCamDist;
      camera.position.z += (targetCamZ - camera.position.z) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // 11. Event Listeners (Mouse & Touch)
    const onMouseDown = (e: MouseEvent) => {
      handlePointerDown(e.clientX, e.clientY);
      if (canvas) canvas.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDraggingRef.current) {
        handlePointerMove(e.clientX, e.clientY);
      } else {
        checkIntersection();
      }
    };

    const onMouseUp = (_e: MouseEvent) => {
      const wasDragging = hasMovedRef.current;
      handlePointerUp();

      if (canvas) canvas.style.cursor = 'grab';

      // If clicked without dragging, select the intersected photo card
      if (!wasDragging && currentHoveredMesh) {
        const mem = currentHoveredMesh.userData?.memory as Memory;
        if (mem) {
          onSelectMemory(mem);
        }
      }
    };

    // Touch handlers with precise tap vs drag
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        handlePointerDown(touch.clientX, touch.clientY);

        const rect = canvas.getBoundingClientRect();
        mouseNDC.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouseNDC.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        checkIntersection();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        handlePointerMove(touch.clientX, touch.clientY);
      }
    };

    const onTouchEnd = (_e: TouchEvent) => {
      const wasDragging = hasMovedRef.current;
      handlePointerUp();

      if (!wasDragging && currentHoveredMesh) {
        const mem = currentHoveredMesh.userData?.memory as Memory;
        if (mem) {
          onSelectMemory(mem);
        }
      }
    };

    // Attach interaction events
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd, { passive: true });

    // 12. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        if (cr.width > 0 && cr.height > 0) {
          width = cr.width;
          height = cr.height;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });

    resizeObserver.observe(container);

    // 13. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();

      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);

      // Dispose 3D resources
      mistOrb.dispose();
      halo.dispose();
      particles.dispose();
      photoCards.forEach((c) => c.dispose());
      renderer.dispose();
    };
  }, [distributedMemories, selectedMemory, onSelectMemory, setHoveredId]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-square max-w-[500px] max-h-[500px] flex items-center justify-center select-none px-4 ${className}`}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing focus:outline-none touch-none"
      />
    </div>
  );
};
