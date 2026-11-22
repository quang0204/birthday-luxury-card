import * as THREE from 'three';
import { Memory } from '../../data/memories';
import { FibonacciSpherePoint } from '../../utils/fibonacciSphere';
import { getOrCreatePhotoTexture } from '../../utils/memoryHelpers';

export interface MemoryPhotoCard {
  group: THREE.Group;
  photoMesh: THREE.Mesh;
  memory: Memory;
  originalScale: THREE.Vector3;
  targetScale: THREE.Vector3;
  update: (time: number, isHovered: boolean, isSelected: boolean) => void;
  dispose: () => void;
}

/**
 * Creates an individual 3D interactive Photo Card positioned and oriented on the sphere.
 */
export function createMemoryPhotoCard(
  memory: Memory,
  point: FibonacciSpherePoint,
  cardWidth = 44,
  cardHeight = 35
): MemoryPhotoCard {
  const group = new THREE.Group();

  // Position at sphere surface
  group.position.copy(point.position);
  // Orient outward matching normal
  group.quaternion.copy(point.quaternion);

  // Subtle tilt for tactile polaroid personality
  if (memory.rotation) {
    group.rotateZ((memory.rotation * Math.PI) / 180);
  }

  // 1. Front photo card geometry
  const geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);

  // Texture from memory helper
  const texture = getOrCreatePhotoTexture(memory);

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.3,
    metalness: 0.15,
    side: THREE.DoubleSide,
    emissive: new THREE.Color('#9333EA'),
    emissiveIntensity: 0.05,
  });

  const photoMesh = new THREE.Mesh(geometry, material);
  photoMesh.castShadow = true;
  photoMesh.receiveShadow = true;

  // Store metadata for Raycaster detection
  photoMesh.userData = {
    id: memory.id,
    memory,
    isPhotoCard: true,
  };

  group.add(photoMesh);

  // 2. Subtle back cover so card looks real from edge/back angles
  const backGeo = new THREE.PlaneGeometry(cardWidth + 0.6, cardHeight + 0.6);
  const backMat = new THREE.MeshBasicMaterial({
    color: '#1E1035',
    side: THREE.BackSide,
  });
  const backMesh = new THREE.Mesh(backGeo, backMat);
  backMesh.position.z = -0.15;
  group.add(backMesh);

  const originalScale = new THREE.Vector3(1, 1, 1);
  const targetScale = new THREE.Vector3(1, 1, 1);

  const update = (_time: number, isHovered: boolean, isSelected: boolean) => {
    if (isSelected) {
      targetScale.set(1.28, 1.28, 1.28);
      material.emissive.set('#F43F5E');
      material.emissiveIntensity = 0.6;
    } else if (isHovered) {
      targetScale.set(1.18, 1.18, 1.18);
      material.emissive.set('#C026D3');
      material.emissiveIntensity = 0.45;
    } else {
      targetScale.set(1, 1, 1);
      material.emissive.set('#9333EA');
      material.emissiveIntensity = 0.05;
    }

    // Smooth lerp scale
    group.scale.lerp(targetScale, 0.15);
  };

  const dispose = () => {
    geometry.dispose();
    material.dispose();
    backGeo.dispose();
    backMat.dispose();
  };

  return {
    group,
    photoMesh,
    memory,
    originalScale,
    targetScale,
    update,
    dispose,
  };
}
