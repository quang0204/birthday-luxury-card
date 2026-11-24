import React from 'react';

export interface AntigravityProps {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  waveCount?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  colors?: string[];
  colorMode?: 'conic' | 'radial' | 'random';
  colorSpeed?: number;
  autoAnimate?: boolean;
  particleVariance?: number;
  rotationSpeed?: number;
  depthFactor?: number;
  pulseSpeed?: number;
  particleShape?: 'capsule' | 'sphere' | 'box' | 'tetrahedron';
  fieldStrength?: number;
  ambient?: number;
  interactive?: boolean;
  clickBurst?: boolean;
  intro?: boolean;
  lightMode?: boolean;
  opacity?: number;
  maxDevicePixelRatio?: number;
  className?: string;
  style?: React.CSSProperties;
}

declare const Antigravity: React.FC<AntigravityProps>;
export default Antigravity;
