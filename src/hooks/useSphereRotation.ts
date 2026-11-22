import { useRef, useState, useCallback, useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface UseSphereRotationOptions {
  damping?: number;
  autoRotateSpeed?: number;
  pitchLimitDeg?: number;
  resumeDelayMs?: number;
}

export function useSphereRotation(options: UseSphereRotationOptions = {}) {
  const {
    damping = 0.95,
    autoRotateSpeed = 0.0035,
    pitchLimitDeg = 65,
    resumeDelayMs = 2500,
  } = options;

  const reducedMotion = useReducedMotion();

  // Internal mutable rotation values (in radians)
  const rotationRef = useRef({ x: 0.15, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const lastPointerPosRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const idleTimerRef = useRef<any>(null);
  const isPausedRef = useRef(false);

  // User-facing toggles
  const [autoRotateEnabled, setAutoRotateEnabled] = useState(!reducedMotion);

  const pitchLimitRad = (pitchLimitDeg * Math.PI) / 180;

  // Pause auto rotation temporarily upon user interaction
  const pauseAutoRotateTemporarily = useCallback(() => {
    isPausedRef.current = true;
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, resumeDelayMs);
  }, [resumeDelayMs]);

  // Pointer Down (Mouse or Touch)
  const handlePointerDown = useCallback((clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartPosRef.current = { x: clientX, y: clientY };
    lastPointerPosRef.current = { x: clientX, y: clientY };
    velocityRef.current = { x: 0, y: 0 };
    pauseAutoRotateTemporarily();
  }, [pauseAutoRotateTemporarily]);

  // Pointer Move
  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;

    const deltaX = clientX - lastPointerPosRef.current.x;
    const deltaY = clientY - lastPointerPosRef.current.y;

    const totalDistX = Math.abs(clientX - dragStartPosRef.current.x);
    const totalDistY = Math.abs(clientY - dragStartPosRef.current.y);

    if (totalDistX > 6 || totalDistY > 6) {
      hasMovedRef.current = true;
    }

    // Sensitivity factor
    const sensitivity = 0.0055;
    const vx = deltaY * sensitivity;
    const vy = deltaX * sensitivity;

    velocityRef.current = { x: vx, y: vy };

    // Update rotation directly
    rotationRef.current.y += vy;
    rotationRef.current.x = Math.max(
      -pitchLimitRad,
      Math.min(pitchLimitRad, rotationRef.current.x + vx)
    );

    lastPointerPosRef.current = { x: clientX, y: clientY };
    pauseAutoRotateTemporarily();
  }, [pitchLimitRad, pauseAutoRotateTemporarily]);

  // Pointer Up
  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
    pauseAutoRotateTemporarily();
  }, [pauseAutoRotateTemporarily]);

  // Step function to be called each frame in the render loop
  const updatePhysics = useCallback(() => {
    if (isDraggingRef.current) {
      return rotationRef.current;
    }

    // Apply damping to velocity
    velocityRef.current.x *= damping;
    velocityRef.current.y *= damping;

    // Negligible velocity threshold
    if (Math.abs(velocityRef.current.x) < 0.00005) velocityRef.current.x = 0;
    if (Math.abs(velocityRef.current.y) < 0.00005) velocityRef.current.y = 0;

    // Apply inertia velocity
    rotationRef.current.x = Math.max(
      -pitchLimitRad,
      Math.min(pitchLimitRad, rotationRef.current.x + velocityRef.current.x)
    );
    rotationRef.current.y += velocityRef.current.y;

    // Apply idle auto-rotation if not paused and enabled
    if (autoRotateEnabled && !isPausedRef.current && !reducedMotion) {
      rotationRef.current.y += autoRotateSpeed;
    }

    return rotationRef.current;
  }, [damping, pitchLimitRad, autoRotateEnabled, autoRotateSpeed, reducedMotion]);

  // Reset view to default front
  const resetRotation = useCallback(() => {
    rotationRef.current = { x: 0.1, y: 0 };
    velocityRef.current = { x: 0, y: 0 };
  }, []);

  // Programmatically rotate to face a target Y angle
  const rotateToAngle = useCallback((targetY: number) => {
    rotationRef.current.x = 0.1;
    rotationRef.current.y = targetY;
    velocityRef.current = { x: 0, y: 0 };
    pauseAutoRotateTemporarily();
  }, [pauseAutoRotateTemporarily]);

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  return {
    rotationRef,
    velocityRef,
    isDraggingRef,
    hasMovedRef,
    autoRotateEnabled,
    setAutoRotateEnabled,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    updatePhysics,
    resetRotation,
    rotateToAngle,
    pauseAutoRotateTemporarily,
  };
}
