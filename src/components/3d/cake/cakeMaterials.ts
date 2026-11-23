import * as THREE from 'three';
import { CakeConfig } from '../../../config/birthday.config';
import {
  createCandleTexture,
  createWaferTexture,
  createFlameTexture,
  createSmokeTexture,
  createPlaqueTexture,
} from './cakeTextures';

export interface CakeMaterials {
  goldPlatter: THREE.MeshStandardMaterial;
  cakeBaseTier1: THREE.MeshStandardMaterial;
  cakeBaseTier2: THREE.MeshStandardMaterial;
  berryGlaze: THREE.MeshStandardMaterial;
  whippedCream: THREE.MeshStandardMaterial;
  strawberryBody: THREE.MeshStandardMaterial;
  strawberryLeaf: THREE.MeshStandardMaterial;
  goldPearl: THREE.MeshStandardMaterial;
  chocolateWafer: THREE.MeshStandardMaterial;
  candleWax: THREE.MeshStandardMaterial;
  candleWick: THREE.MeshStandardMaterial;
  flameSprite: THREE.SpriteMaterial;
  smokeSprite: THREE.SpriteMaterial;
  namePlaque: THREE.MeshStandardMaterial;
  disposables: Array<THREE.Material | THREE.Texture>;
}

const FLAVOR_PALETTES = {
  strawberry: {
    tier1: 0xFFF0F5,
    tier2: 0xFFFDF8,
    glaze: 0x881337,
  },
  chocolate: {
    tier1: 0x3E1E16,
    tier2: 0x5C3327,
    glaze: 0x220F0A,
  },
  champagne: {
    tier1: 0xFAF0E6,
    tier2: 0xFFFDF8,
    glaze: 0xD49B4B,
  },
  matcha: {
    tier1: 0xDCEBD6,
    tier2: 0xF7FAF6,
    glaze: 0x476A42,
  },
};

export function createCakeMaterials(
  recipientName: string = 'You',
  cakeConfig?: CakeConfig
): CakeMaterials {
  const disposables: Array<THREE.Material | THREE.Texture> = [];

  const flavor = cakeConfig?.flavor || 'strawberry';
  const palette = FLAVOR_PALETTES[flavor] || FLAVOR_PALETTES.strawberry;

  // Textures
  const candleTex = createCandleTexture(cakeConfig?.candleColor || 'rose');
  const waferTex = createWaferTexture();
  const flameTex = createFlameTexture();
  const smokeTex = createSmokeTexture();

  const plaqueName = cakeConfig?.plaqueName || recipientName || 'You';
  const plaqueTitle = cakeConfig?.plaqueTitle || 'HAPPY BIRTHDAY';
  const plaqueSubtitle = cakeConfig?.plaqueSubtitle || 'MAKE A WISH & BLOW 🎂';
  const plaqueTex = createPlaqueTexture(plaqueName, plaqueTitle, plaqueSubtitle);

  disposables.push(candleTex, waferTex, flameTex, smokeTex, plaqueTex);

  // Materials
  const goldPlatter = new THREE.MeshStandardMaterial({
    color: 0xD4AF37,
    metalness: 0.85,
    roughness: 0.22,
  });

  // Tier 1 (bottom)
  const cakeBaseTier1 = new THREE.MeshStandardMaterial({
    color: palette.tier1,
    roughness: 0.42,
    metalness: 0.02,
  });

  // Tier 2 (top)
  const cakeBaseTier2 = new THREE.MeshStandardMaterial({
    color: palette.tier2,
    roughness: 0.38,
    metalness: 0.02,
  });

  // Flowing ganache glaze
  const berryGlaze = new THREE.MeshStandardMaterial({
    color: palette.glaze,
    roughness: 0.12,
    metalness: 0.05,
  });

  // Whipped cream swirls
  const whippedCream = new THREE.MeshStandardMaterial({
    color: 0xFFFFFB,
    roughness: 0.25,
    metalness: 0.0,
  });

  // Fresh glossy strawberries
  const strawberryBody = new THREE.MeshStandardMaterial({
    color: 0xE11D48,
    roughness: 0.14,
    metalness: 0.05,
  });

  // Strawberry calyx leaves
  const strawberryLeaf = new THREE.MeshStandardMaterial({
    color: 0x166534,
    roughness: 0.4,
    metalness: 0.0,
  });

  // Golden edible sugar pearls
  const goldPearl = new THREE.MeshStandardMaterial({
    color: 0xF59E0B,
    metalness: 0.9,
    roughness: 0.18,
  });

  // Striped chocolate wafer rolls
  const chocolateWafer = new THREE.MeshStandardMaterial({
    map: waferTex,
    roughness: 0.35,
    metalness: 0.05,
  });

  // Striped candle sticks
  const candleWax = new THREE.MeshStandardMaterial({
    map: candleTex,
    roughness: 0.3,
    metalness: 0.05,
  });

  // Candle wick
  const candleWick = new THREE.MeshStandardMaterial({
    color: 0x262626,
    roughness: 0.9,
    metalness: 0.0,
  });

  // Animated glowing flame sprite
  const flameSprite = new THREE.SpriteMaterial({
    map: flameTex,
    color: 0xFFFFFF,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  // Rising smoke particle
  const smokeSprite = new THREE.SpriteMaterial({
    map: smokeTex,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
  });

  // Front bespoke name plaque
  const namePlaque = new THREE.MeshStandardMaterial({
    map: plaqueTex,
    transparent: true,
    roughness: 0.25,
    metalness: 0.15,
  });

  disposables.push(
    goldPlatter,
    cakeBaseTier1,
    cakeBaseTier2,
    berryGlaze,
    whippedCream,
    strawberryBody,
    strawberryLeaf,
    goldPearl,
    chocolateWafer,
    candleWax,
    candleWick,
    flameSprite,
    smokeSprite,
    namePlaque
  );

  return {
    goldPlatter,
    cakeBaseTier1,
    cakeBaseTier2,
    berryGlaze,
    whippedCream,
    strawberryBody,
    strawberryLeaf,
    goldPearl,
    chocolateWafer,
    candleWax,
    candleWick,
    flameSprite,
    smokeSprite,
    namePlaque,
    disposables,
  };
}
