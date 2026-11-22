import * as THREE from 'three';

/**
 * Creates the iconic Mist Orb mesh with dynamic GLSL shader.
 * Inspired by getdesign.md/backgrounds?fx=mist-orb:
 * - Deep dark violet core
 * - Luminous swirling horizontal magenta mist wisps
 * - Distinct vertical polar pinch funnels at top and bottom poles
 * - Ethereal Fresnel rim glow aura
 */
export function createMistOrbMesh(radius: number): {
  mesh: THREE.Mesh;
  update: (time: number) => void;
  dispose: () => void;
} {
  const geometry = new THREE.SphereGeometry(radius * 0.95, 64, 64);

  const uniforms = {
    uTime: { value: 0 },
    uColorCore: { value: new THREE.Color('#14060C') }, // deep velvet wine core
    uColorMist: { value: new THREE.Color('#D4627A') }, // refined romantic rose mist
    uColorAura: { value: new THREE.Color('#E77C92') }, // soft blush aura
    uColorPinch: { value: new THREE.Color('#E6C29C') }, // warm champagne starlight polar pinch
  };

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColorCore;
    uniform vec3 uColorMist;
    uniform vec3 uColorAura;
    uniform vec3 uColorPinch;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;

    void main() {
      vec3 norm = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Normalized object position
      vec3 objPos = normalize(vPosition);
      float y = objPos.y; // -1 (south pole) to +1 (north pole)
      float absY = abs(y);

      // Polar angle around Y axis
      float angle = atan(objPos.z, objPos.x);

      // 1. Polar pinch effect (funnel of light at top and bottom poles)
      float polarFalloff = smoothstep(0.45, 0.95, absY);
      float polarRibbons = pow(abs(cos(angle * 2.5 + uTime * 0.5)), 4.0);
      float polarPinch = polarFalloff * (0.65 + 0.65 * polarRibbons);

      // 2. Horizontal equatorial swirling mist bands
      float bandWave = sin(y * 14.0 + sin(angle * 3.0 + uTime * 0.7) * 2.0 + uTime * 0.6);
      float mistBands = smoothstep(-0.15, 0.85, bandWave);

      // Secondary fine mist wisps
      float fineWisps = sin(y * 26.0 - angle * 4.0 + uTime * 1.1);
      fineWisps = smoothstep(0.1, 0.9, fineWisps) * 0.45;

      float mistIntensity = clamp(mistBands * 0.7 + fineWisps + polarPinch * 1.1, 0.0, 1.0);

      // 3. Ethereal Fresnel Rim Glow (soft halo)
      float fresnel = 1.0 - max(0.0, dot(norm, viewDir));
      float rimGlow = pow(fresnel, 2.6);

      // 4. Color Synthesis
      vec3 finalColor = mix(uColorCore, uColorMist, mistIntensity);
      finalColor = mix(finalColor, uColorPinch, polarPinch * 0.75);
      finalColor += uColorAura * (rimGlow * 0.8);

      // Transparency: translucent inside, luminous on wisps and rim
      float alpha = clamp(0.25 + mistIntensity * 0.5 + rimGlow * 0.65, 0.0, 0.88);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = 1; // Render inside/behind photo cards

  const update = (time: number) => {
    uniforms.uTime.value = time;
  };

  const dispose = () => {
    geometry.dispose();
    material.dispose();
  };

  return { mesh, update, dispose };
}

/**
 * Creates outer atmospheric halo sphere to give a soft ambient glow around the orb
 */
export function createAtmosphereHalo(radius: number): {
  mesh: THREE.Mesh;
  update: (time: number) => void;
  dispose: () => void;
} {
  const geometry = new THREE.SphereGeometry(radius * 1.08, 32, 32);

  const uniforms = {
    uTime: { value: 0 },
    uGlowColor: { value: new THREE.Color('#D4627A') },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uGlowColor;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        float fresnel = 1.0 - max(0.0, dot(normalize(vNormal), normalize(vViewPosition)));
        float intensity = pow(fresnel, 4.0) * (0.35 + 0.08 * sin(uTime * 1.5));
        gl_FragColor = vec4(uGlowColor, intensity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.BackSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = 0;

  const update = (time: number) => {
    uniforms.uTime.value = time;
  };

  const dispose = () => {
    geometry.dispose();
    material.dispose();
  };

  return { mesh, update, dispose };
}
