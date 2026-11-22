import * as THREE from 'three';

/**
 * Creates atmospheric cinematic lighting for the 3D Memory Sphere.
 */
export function createMemoryLighting(): {
  lights: THREE.Light[];
  update: (time: number) => void;
} {
  // 1. Ambient lighting for base fill
  const ambientLight = new THREE.AmbientLight('#2E1065', 1.2);

  // 2. Front key light to illuminate photo face
  const frontKeyLight = new THREE.DirectionalLight('#FFFFFF', 1.8);
  frontKeyLight.position.set(0, 80, 260);

  // 3. Glowing core light emanating from center of Mist Orb
  const innerCoreLight = new THREE.PointLight('#F43F5E', 2.5, 300);
  innerCoreLight.position.set(0, 0, 0);

  // 4. Subtle purple rim light
  const rimLight = new THREE.DirectionalLight('#C084FC', 1.4);
  rimLight.position.set(-150, 100, -100);

  const lights = [ambientLight, frontKeyLight, innerCoreLight, rimLight];

  const update = (time: number) => {
    // Subtle pulsating glow from the center of the sphere
    innerCoreLight.intensity = 2.2 + 0.6 * Math.sin(time * 2.0);
  };

  return { lights, update };
}
