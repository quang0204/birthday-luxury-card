import * as THREE from 'three';
import { CakeMaterials } from './cakeMaterials';

export interface CandleItem {
  group: THREE.Group;
  wick: THREE.Mesh;
  flame: THREE.Sprite;
  light: THREE.PointLight;
  baseY: number;
}

export interface Cake3DHierarchy {
  rootGroup: THREE.Group;
  cakeGroup: THREE.Group;
  candles: CandleItem[];
  smokeGroup: THREE.Group;
  spawnSmokeBurst: () => void;
  updateFlames: (time: number, isBlowing: boolean, candlesLit: boolean, blowProgress?: number) => void;
  updateSmoke: (delta: number) => void;
  dispose: () => void;
}

interface SmokeParticle {
  sprite: THREE.Sprite;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  initialScale: number;
}

export function build3DCake(materials: CakeMaterials, recipientName: string = 'You'): Cake3DHierarchy {
  const rootGroup = new THREE.Group();
  const cakeGroup = new THREE.Group();
  rootGroup.add(cakeGroup);

  const disposablesGeom: THREE.BufferGeometry[] = [];

  // ==========================================
  // 1. GOLDEN PLATTER & PEDESTAL STAND
  // ==========================================
  const platterBaseGeom = new THREE.CylinderGeometry(5.4, 5.1, 0.3, 64);
  const platterBase = new THREE.Mesh(platterBaseGeom, materials.goldPlatter);
  platterBase.position.y = 0.15;
  cakeGroup.add(platterBase);
  disposablesGeom.push(platterBaseGeom);

  const platterRimGeom = new THREE.TorusGeometry(5.3, 0.15, 16, 64);
  const platterRim = new THREE.Mesh(platterRimGeom, materials.goldPlatter);
  platterRim.rotation.x = Math.PI / 2;
  platterRim.position.y = 0.28;
  cakeGroup.add(platterRim);
  disposablesGeom.push(platterRimGeom);

  const pedestalGeom = new THREE.CylinderGeometry(4.0, 4.4, 0.25, 48);
  const pedestal = new THREE.Mesh(pedestalGeom, materials.goldPlatter);
  pedestal.position.y = -0.12;
  cakeGroup.add(pedestal);
  disposablesGeom.push(pedestalGeom);

  // ==========================================
  // 2. BOTTOM CAKE TIER (Large Tier)
  // ==========================================
  const tier1Radius = 4.3;
  const tier1Height = 2.4;
  const tier1Y = 0.3 + tier1Height / 2; // ~1.5

  const tier1Geom = new THREE.CylinderGeometry(tier1Radius, tier1Radius, tier1Height, 64);
  const tier1Mesh = new THREE.Mesh(tier1Geom, materials.cakeBaseTier1);
  tier1Mesh.position.y = tier1Y;
  cakeGroup.add(tier1Mesh);
  disposablesGeom.push(tier1Geom);

  // Bottom tier cream pearl border around base
  const pearlCount = 28;
  const pearlGeom = new THREE.SphereGeometry(0.2, 16, 16);
  disposablesGeom.push(pearlGeom);
  for (let i = 0; i < pearlCount; i++) {
    const angle = (i / pearlCount) * Math.PI * 2;
    const pearl = new THREE.Mesh(pearlGeom, materials.whippedCream);
    pearl.position.set(
      Math.cos(angle) * (tier1Radius + 0.05),
      0.35,
      Math.sin(angle) * (tier1Radius + 0.05)
    );
    cakeGroup.add(pearl);
  }

  // Tier 1 Dripping Glaze on Top Rim
  const tier1TopY = tier1Y + tier1Height / 2; // ~2.7
  const tier1GlazeDiscGeom = new THREE.CylinderGeometry(tier1Radius + 0.08, tier1Radius + 0.08, 0.08, 64);
  const tier1GlazeDisc = new THREE.Mesh(tier1GlazeDiscGeom, materials.berryGlaze);
  tier1GlazeDisc.position.y = tier1TopY;
  cakeGroup.add(tier1GlazeDisc);
  disposablesGeom.push(tier1GlazeDiscGeom);

  // Organic Ganache Drips on Tier 1
  const tier1DripCount = 20;
  for (let i = 0; i < tier1DripCount; i++) {
    const angle = (i / tier1DripCount) * Math.PI * 2 + (i % 2 === 0 ? 0.05 : -0.05);
    // Varied drip lengths with natural wave
    const dripLen = 0.4 + Math.sin(i * 1.7) * 0.35 + (i % 3 === 0 ? 0.45 : 0);
    const dripGeom = new THREE.CylinderGeometry(0.12, 0.08, dripLen, 12);
    const dripTipGeom = new THREE.SphereGeometry(0.11, 12, 12);
    disposablesGeom.push(dripGeom, dripTipGeom);

    const dripMesh = new THREE.Mesh(dripGeom, materials.berryGlaze);
    dripMesh.position.set(
      Math.cos(angle) * (tier1Radius + 0.07),
      tier1TopY - dripLen / 2,
      Math.sin(angle) * (tier1Radius + 0.07)
    );
    cakeGroup.add(dripMesh);

    const tipMesh = new THREE.Mesh(dripTipGeom, materials.berryGlaze);
    tipMesh.position.set(
      Math.cos(angle) * (tier1Radius + 0.07),
      tier1TopY - dripLen,
      Math.sin(angle) * (tier1Radius + 0.07)
    );
    cakeGroup.add(tipMesh);
  }

  // Front Bespoke Name Plaque mounted on Tier 1
  const plaqueGeom = new THREE.PlaneGeometry(3.6, 1.8);
  disposablesGeom.push(plaqueGeom);
  const plaqueMesh = new THREE.Mesh(plaqueGeom, materials.namePlaque);
  plaqueMesh.position.set(0, tier1Y, tier1Radius + 0.15);
  // Slight outward tilt
  plaqueMesh.rotation.x = -0.08;
  cakeGroup.add(plaqueMesh);

  // Plaque backing gold trim plate
  const plaqueBackGeom = new THREE.BoxGeometry(3.7, 1.9, 0.08);
  disposablesGeom.push(plaqueBackGeom);
  const plaqueBack = new THREE.Mesh(plaqueBackGeom, materials.goldPlatter);
  plaqueBack.position.set(0, tier1Y, tier1Radius + 0.1);
  plaqueBack.rotation.x = -0.08;
  cakeGroup.add(plaqueBack);

  // ==========================================
  // 3. TOP CAKE TIER (Small Tier)
  // ==========================================
  const tier2Radius = 2.8;
  const tier2Height = 2.1;
  const tier2Y = tier1TopY + tier2Height / 2; // ~3.75

  const tier2Geom = new THREE.CylinderGeometry(tier2Radius, tier2Radius, tier2Height, 64);
  const tier2Mesh = new THREE.Mesh(tier2Geom, materials.cakeBaseTier2);
  tier2Mesh.position.y = tier2Y;
  cakeGroup.add(tier2Mesh);
  disposablesGeom.push(tier2Geom);

  // Bottom rim of Tier 2: subtle whipped cream bead border
  const tier2BaseBeadCount = 20;
  const bead2Geom = new THREE.SphereGeometry(0.14, 14, 14);
  disposablesGeom.push(bead2Geom);
  for (let i = 0; i < tier2BaseBeadCount; i++) {
    const angle = (i / tier2BaseBeadCount) * Math.PI * 2;
    const bead = new THREE.Mesh(bead2Geom, materials.whippedCream);
    bead.position.set(
      Math.cos(angle) * (tier2Radius + 0.04),
      tier1TopY + 0.1,
      Math.sin(angle) * (tier2Radius + 0.04)
    );
    cakeGroup.add(bead);
  }

  // Tier 2 Dripping Ganache Glaze on Top Rim
  const tier2TopY = tier2Y + tier2Height / 2; // ~4.8
  const tier2GlazeDiscGeom = new THREE.CylinderGeometry(tier2Radius + 0.06, tier2Radius + 0.06, 0.07, 64);
  const tier2GlazeDisc = new THREE.Mesh(tier2GlazeDiscGeom, materials.berryGlaze);
  tier2GlazeDisc.position.y = tier2TopY;
  cakeGroup.add(tier2GlazeDisc);
  disposablesGeom.push(tier2GlazeDiscGeom);

  // Organic Ganache Drips on Tier 2
  const tier2DripCount = 14;
  for (let i = 0; i < tier2DripCount; i++) {
    const angle = (i / tier2DripCount) * Math.PI * 2;
    const dripLen = 0.35 + Math.cos(i * 2.1) * 0.28 + (i % 2 === 0 ? 0.3 : 0);
    const dripGeom = new THREE.CylinderGeometry(0.1, 0.06, dripLen, 12);
    const dripTipGeom = new THREE.SphereGeometry(0.09, 12, 12);
    disposablesGeom.push(dripGeom, dripTipGeom);

    const dripMesh = new THREE.Mesh(dripGeom, materials.berryGlaze);
    dripMesh.position.set(
      Math.cos(angle) * (tier2Radius + 0.05),
      tier2TopY - dripLen / 2,
      Math.sin(angle) * (tier2Radius + 0.05)
    );
    cakeGroup.add(dripMesh);

    const tipMesh = new THREE.Mesh(dripTipGeom, materials.berryGlaze);
    tipMesh.position.set(
      Math.cos(angle) * (tier2Radius + 0.05),
      tier2TopY - dripLen,
      Math.sin(angle) * (tier2Radius + 0.05)
    );
    cakeGroup.add(tipMesh);
  }

  // ==========================================
  // 4. TOP DECORATIONS & FRUIT TOPPINGS
  // ==========================================
  // Whipped Cream Rosettes around perimeter
  const rosetteCount = 10;
  const rosetteGeom = new THREE.ConeGeometry(0.3, 0.45, 12);
  disposablesGeom.push(rosetteGeom);
  for (let i = 0; i < rosetteCount; i++) {
    const angle = (i / rosetteCount) * Math.PI * 2;
    const rosette = new THREE.Mesh(rosetteGeom, materials.whippedCream);
    rosette.position.set(
      Math.cos(angle) * (tier2Radius - 0.35),
      tier2TopY + 0.22,
      Math.sin(angle) * (tier2Radius - 0.35)
    );
    cakeGroup.add(rosette);
  }

  // Fresh 3D Glossy Strawberries (5 strawberries around top tier)
  const strawberryGeom = new THREE.ConeGeometry(0.32, 0.65, 16);
  const strawberryTipGeom = new THREE.SphereGeometry(0.28, 14, 14);
  const calyxLeafGeom = new THREE.ConeGeometry(0.1, 0.3, 5);
  disposablesGeom.push(strawberryGeom, strawberryTipGeom, calyxLeafGeom);

  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 + 0.32;
    const sGroup = new THREE.Group();
    sGroup.position.set(
      Math.cos(angle) * (tier2Radius - 0.8),
      tier2TopY + 0.28,
      Math.sin(angle) * (tier2Radius - 0.8)
    );
    // Slight organic tilt towards center
    sGroup.rotation.z = Math.cos(angle) * 0.25;
    sGroup.rotation.x = Math.sin(angle) * 0.25;

    const sBody = new THREE.Mesh(strawberryGeom, materials.strawberryBody);
    sBody.rotation.x = Math.PI; // Point tip upward
    sGroup.add(sBody);

    const sRound = new THREE.Mesh(strawberryTipGeom, materials.strawberryBody);
    sRound.position.y = -0.12;
    sGroup.add(sRound);

    // Green Calyx leaves radiating
    for (let l = 0; l < 5; l++) {
      const leafAngle = (l / 5) * Math.PI * 2;
      const leaf = new THREE.Mesh(calyxLeafGeom, materials.strawberryLeaf);
      leaf.position.set(Math.cos(leafAngle) * 0.16, -0.22, Math.sin(leafAngle) * 0.16);
      leaf.rotation.x = Math.PI / 2 + 0.3;
      leaf.rotation.y = leafAngle;
      sGroup.add(leaf);
    }

    cakeGroup.add(sGroup);
  }

  // Chocolate Wafer Pirouette Rolls (2 diagonal sticks)
  const waferGeom = new THREE.CylinderGeometry(0.12, 0.12, 2.2, 16);
  disposablesGeom.push(waferGeom);

  const wafer1 = new THREE.Mesh(waferGeom, materials.chocolateWafer);
  wafer1.position.set(-0.8, tier2TopY + 0.8, 0.4);
  wafer1.rotation.set(0.4, 0.2, 0.55);
  cakeGroup.add(wafer1);

  const wafer2 = new THREE.Mesh(waferGeom, materials.chocolateWafer);
  wafer2.position.set(-0.55, tier2TopY + 0.75, 0.65);
  wafer2.rotation.set(0.35, -0.3, 0.62);
  cakeGroup.add(wafer2);

  // Golden Pearls scattered on top
  const goldPearlGeom = new THREE.SphereGeometry(0.1, 12, 12);
  disposablesGeom.push(goldPearlGeom);
  for (let i = 0; i < 14; i++) {
    const pearlAngle = i * 2.399; // Golden angle distribution
    const pearlRadius = 0.5 + Math.sqrt(i / 14) * (tier2Radius - 1.0);
    const pearl = new THREE.Mesh(goldPearlGeom, materials.goldPearl);
    pearl.position.set(
      Math.cos(pearlAngle) * pearlRadius,
      tier2TopY + 0.08,
      Math.sin(pearlAngle) * pearlRadius
    );
    cakeGroup.add(pearl);
  }

  // ==========================================
  // 5. CANDLES, FLAMES & LIGHTING
  // ==========================================
  const candles: CandleItem[] = [];
  const candlePositions = [
    { x: 0, z: -0.2, h: 1.7 },      // Center main candle
    { x: -1.0, z: -0.5, h: 1.45 },  // Left candle
    { x: 1.0, z: -0.5, h: 1.45 },   // Right candle
  ];

  const wickGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.2, 8);
  disposablesGeom.push(wickGeom);

  candlePositions.forEach((pos) => {
    const candleGroup = new THREE.Group();
    candleGroup.position.set(pos.x, tier2TopY, pos.z);

    // Candle Wax Body
    const waxGeom = new THREE.CylinderGeometry(0.14, 0.14, pos.h, 24);
    disposablesGeom.push(waxGeom);
    const waxMesh = new THREE.Mesh(waxGeom, materials.candleWax);
    waxMesh.position.y = pos.h / 2;
    candleGroup.add(waxMesh);

    // Wick
    const wickMesh = new THREE.Mesh(wickGeom, materials.candleWick);
    wickMesh.position.y = pos.h + 0.1;
    candleGroup.add(wickMesh);

    // Animated Flame Sprite
    const flameSprite = new THREE.Sprite(materials.flameSprite);
    flameSprite.scale.set(0.75, 1.35, 1);
    flameSprite.position.set(0, pos.h + 0.65, 0);
    candleGroup.add(flameSprite);

    // Warm Flickering Point Light
    const pointLight = new THREE.PointLight(0xFFA500, 1.8, 7, 2);
    pointLight.position.set(0, pos.h + 0.65, 0);
    candleGroup.add(pointLight);

    cakeGroup.add(candleGroup);

    candles.push({
      group: candleGroup,
      wick: wickMesh,
      flame: flameSprite,
      light: pointLight,
      baseY: pos.h + 0.65,
    });
  });

  // ==========================================
  // 6. SMOKE PARTICLE SYSTEM
  // ==========================================
  const smokeGroup = new THREE.Group();
  cakeGroup.add(smokeGroup);
  const smokeParticles: SmokeParticle[] = [];

  const spawnSmokeBurst = () => {
    candles.forEach((c) => {
      const worldWickPos = new THREE.Vector3();
      c.wick.getWorldPosition(worldWickPos);

      // Spawn 14 smoke particles drifting up per candle
      for (let i = 0; i < 14; i++) {
        const sprite = new THREE.Sprite(materials.smokeSprite.clone());
        const initScale = 0.35 + Math.random() * 0.3;
        sprite.scale.set(initScale, initScale, 1);

        // Position slightly above wick with small jitter
        sprite.position.set(
          c.group.position.x + (Math.random() - 0.5) * 0.12,
          c.baseY - 0.4 + (Math.random() - 0.5) * 0.1,
          c.group.position.z + (Math.random() - 0.5) * 0.12
        );

        const velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.25,
          0.8 + Math.random() * 0.9,
          (Math.random() - 0.5) * 0.25
        );

        smokeGroup.add(sprite);
        smokeParticles.push({
          sprite,
          velocity,
          life: 0,
          maxLife: 1.6 + Math.random() * 0.8,
          initialScale: initScale,
        });
      }
    });
  };

  const updateSmoke = (delta: number) => {
    for (let i = smokeParticles.length - 1; i >= 0; i--) {
      const p = smokeParticles[i];
      p.life += delta;

      if (p.life >= p.maxLife) {
        smokeGroup.remove(p.sprite);
        p.sprite.material.dispose();
        smokeParticles.splice(i, 1);
        continue;
      }

      const progress = p.life / p.maxLife; // 0 -> 1

      // Move with upward drift and gentle drag
      p.sprite.position.x += p.velocity.x * delta;
      p.sprite.position.y += p.velocity.y * delta;
      p.sprite.position.z += p.velocity.z * delta;

      // Slight upward air deceleration
      p.velocity.y = Math.max(0.3, p.velocity.y - delta * 0.25);

      // Expand puff as it rises
      const currentScale = p.initialScale * (1 + progress * 2.8);
      p.sprite.scale.set(currentScale, currentScale, 1);

      // Fade out opacity
      p.sprite.material.opacity = Math.max(0, 0.7 * (1 - progress * progress));
    }
  };

  // ==========================================
  // 7. FLAME DYNAMICS (Flicker, Sway & Blow)
  // ==========================================
  const updateFlames = (
    time: number,
    isBlowing: boolean,
    candlesLit: boolean,
    blowProgress: number = 0
  ) => {
    candles.forEach((c, idx) => {
      if (!candlesLit) {
        c.flame.visible = false;
        c.light.intensity = 0;
        return;
      }

      c.flame.visible = true;

      if (isBlowing || blowProgress > 0) {
        const p = Math.min(1, Math.max(0, blowProgress / 100));
        // Strong violent flicker & sideways deflection under breath wind
        const blowNoise = Math.sin(time * 36 + idx * 3);
        const deflection = (0.2 + p * 0.35) * (1 + blowNoise * 0.25);
        c.flame.position.x = deflection;

        // As blow progress increases, flame compresses and shrinks
        const shrinkFactor = Math.max(0.35, 1.0 - p * 0.6);
        c.flame.scale.set(
          (0.68 + blowNoise * 0.2) * shrinkFactor,
          (1.25 + blowNoise * 0.3) * shrinkFactor,
          1
        );
        c.light.intensity = Math.max(0.3, (1.8 - p * 1.3) + blowNoise * 0.4);
        c.light.color.setHex(0xF59E0B);
      } else {
        // Gentle warm natural flicker
        const wave = Math.sin(time * 7 + idx * 1.8) * 0.05 + Math.cos(time * 11 + idx) * 0.03;
        const pulse = Math.sin(time * 9 + idx * 1.5) * 0.08;

        c.flame.position.x = wave * 0.4;
        c.flame.position.y = c.baseY + wave * 0.2;
        c.flame.scale.set(0.72 + pulse, 1.3 + pulse * 1.2, 1);

        // Dynamic warm lighting flicker
        c.light.intensity = 1.6 + pulse * 2.5 + (Math.random() - 0.5) * 0.2;
        c.light.color.setHex(0xFFA500);
      }
    });
  };

  // Cleanup helper
  const dispose = () => {
    disposablesGeom.forEach((g) => g.dispose());
    materials.disposables.forEach((d) => d.dispose());
    smokeParticles.forEach((p) => {
      smokeGroup.remove(p.sprite);
      p.sprite.material.dispose();
    });
    smokeParticles.length = 0;
  };

  return {
    rootGroup,
    cakeGroup,
    candles,
    smokeGroup,
    spawnSmokeBurst,
    updateFlames,
    updateSmoke,
    dispose,
  };
}
