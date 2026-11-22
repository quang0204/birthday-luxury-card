import * as THREE from 'three';

/**
 * Creates ambient floating glowing particles around the sphere.
 * Adds cinematic depth and magical dust sparkles.
 */
export function createMemoryParticles(radius: number, count = 180): {
  points: THREE.Points;
  update: (time: number) => void;
  dispose: () => void;
} {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const originalPositions = new Float32Array(count * 3);

  const palette = [
    new THREE.Color('#F472B6'), // rose pink
    new THREE.Color('#D8B4FE'), // lavender
    new THREE.Color('#FDE047'), // champagne gold
    new THREE.Color('#FFFFFF'), // pure starlight
  ];

  for (let i = 0; i < count; i++) {
    // Generate particles in a spherical shell around radius
    const r = radius * (1.1 + Math.random() * 0.85);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    originalPositions[i * 3] = x;
    originalPositions[i * 3 + 1] = y;
    originalPositions[i * 3 + 2] = z;

    const col = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;

    scales[i] = Math.random() * 2.5 + 1.0;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Circular fuzzy particle texture
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.35, 'rgba(244,114,182,0.8)');
    grad.addColorStop(0.7, 'rgba(168,85,247,0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);

  const material = new THREE.PointsMaterial({
    size: 6,
    vertexColors: true,
    map: texture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);

  const update = (time: number) => {
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const ox = originalPositions[idx];
      const oy = originalPositions[idx + 1];
      const oz = originalPositions[idx + 2];

      // Gentle floating harmonic motion
      posArray[idx] = ox + Math.sin(time * 0.8 + i) * 3;
      posArray[idx + 1] = oy + Math.cos(time * 0.6 + i * 0.5) * 4;
      posArray[idx + 2] = oz + Math.sin(time * 0.7 + i * 0.7) * 3;
    }
    posAttr.needsUpdate = true;
  };

  const dispose = () => {
    geometry.dispose();
    material.dispose();
    texture.dispose();
  };

  return { points, update, dispose };
}
