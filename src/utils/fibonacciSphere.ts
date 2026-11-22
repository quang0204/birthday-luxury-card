import * as THREE from 'three';

export interface FibonacciSpherePoint {
  index: number;
  position: THREE.Vector3;
  normal: THREE.Vector3;
  rotation: THREE.Euler;
  quaternion: THREE.Quaternion;
}

/**
 * Calculates uniform distribution of points on a sphere using the Fibonacci Spiral algorithm.
 * Guarantees no clumping and even spacing across the entire 3D sphere.
 */
export function calculateFibonacciSpherePoints(
  count: number,
  radius: number
): FibonacciSpherePoint[] {
  if (count <= 0) return [];
  if (count === 1) {
    const pos = new THREE.Vector3(0, 0, radius);
    const normal = new THREE.Vector3(0, 0, 1);
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    const euler = new THREE.Euler().setFromQuaternion(quat);
    return [{ index: 0, position: pos, normal, rotation: euler, quaternion: quat }];
  }

  const points: FibonacciSpherePoint[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~2.399963 rad (~137.5 deg)
  const zUp = new THREE.Vector3(0, 0, 1);

  for (let i = 0; i < count; i++) {
    // y ranges smoothly from +1 down to -1
    const y = 1 - (i / (count - 1)) * 2;
    // radius of circle at height y
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    const normal = new THREE.Vector3(x, y, z).normalize();
    const position = new THREE.Vector3(x * radius, y * radius, z * radius);

    // Orient mesh so its front (+Z face) points directly outward along the sphere normal
    const quaternion = new THREE.Quaternion().setFromUnitVectors(zUp, normal);
    const rotation = new THREE.Euler().setFromQuaternion(quaternion);

    points.push({
      index: i,
      position,
      normal,
      rotation,
      quaternion,
    });
  }

  return points;
}
