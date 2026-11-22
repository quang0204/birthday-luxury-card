import * as THREE from 'three';
import { Memory } from '../data/memories';
import { MemoryItem } from '../config/birthday.config';

/**
 * Normalizes either Memory or MemoryItem to a standard Memory object
 */
export function normalizeMemory(item: Memory | MemoryItem, index: number): Memory {
  return {
    id: item.id || `memory-${index + 1}`,
    image: item.image,
    title: item.title,
    date: item.date,
    location: (item as any).location || 'Khoảnh khắc kỷ niệm',
    caption: item.caption,
    description: item.description,
    order: (item as any).order || index + 1,
    sticker: item.sticker || '✨',
    rotation: item.rotation || 0,
  };
}

// In-memory texture cache to prevent duplicate texture allocations
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Creates a high-fidelity 2D Canvas texture for each photo card on the 3D sphere.
 * Renders an elegant framed photo with rounded corners, polaroid aesthetic, and sticker badge.
 * Provides instant fallback while image downloads.
 */
export function getOrCreatePhotoTexture(
  memory: Memory,
  cardWidth = 512,
  cardHeight = 400
): THREE.CanvasTexture {
  const cacheKey = `${memory.id}-${memory.image}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = cardWidth;
  canvas.height = cardHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallbackTex = new THREE.CanvasTexture(canvas);
    return fallbackTex;
  }

  const drawPlaceholder = () => {
    // Fill card background (Superr Cream Paper #FDFBF9)
    ctx.fillStyle = '#FDFBF9';
    ctx.fillRect(0, 0, cardWidth, cardHeight);

    // Dark border
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#2B1A07';
    ctx.strokeRect(7, 7, cardWidth - 14, cardHeight - 14);

    // Inner photo area placeholder with rich gradient
    const grad = ctx.createLinearGradient(0, 20, 0, cardHeight - 90);
    grad.addColorStop(0, '#381A5E');
    grad.addColorStop(1, '#1A0B2E');
    ctx.fillStyle = grad;
    ctx.fillRect(20, 20, cardWidth - 40, cardHeight - 110);

    // Center icon / sticker
    ctx.font = '64px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(memory.sticker || '✨', cardWidth / 2, (cardHeight - 90) / 2);

    // Caption strip at bottom
    ctx.fillStyle = '#2B1A07';
    ctx.font = 'bold 22px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const cleanTitle = memory.title.length > 24 ? memory.title.substring(0, 24) + '...' : memory.title;
    ctx.fillText(cleanTitle, cardWidth / 2, cardHeight - 48);

    // Date watermark
    if (memory.date) {
      ctx.fillStyle = '#8C7A6B';
      ctx.font = '16px sans-serif';
      ctx.fillText(memory.date, cardWidth / 2, cardHeight - 22);
    }
  };

  const drawLoadedImage = (img: HTMLImageElement) => {
    // Fill card frame
    ctx.fillStyle = '#FDFBF9';
    ctx.fillRect(0, 0, cardWidth, cardHeight);

    // Outer tactile border
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#2B1A07';
    ctx.strokeRect(6, 6, cardWidth - 12, cardHeight - 12);

    // Draw clipped photo inside the top frame
    const photoX = 18;
    const photoY = 18;
    const photoW = cardWidth - 36;
    const photoH = cardHeight - 105;

    ctx.save();
    ctx.beginPath();
    ctx.rect(photoX, photoY, photoW, photoH);
    ctx.clip();

    // Cover crop calculation
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const targetAspect = photoW / photoH;
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

    if (imgAspect > targetAspect) {
      sw = img.naturalHeight * targetAspect;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      sh = img.naturalWidth / targetAspect;
      sy = (img.naturalHeight - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
    ctx.restore();

    // Inner photo border
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(43, 26, 7, 0.4)';
    ctx.strokeRect(photoX, photoY, photoW, photoH);

    // Title label at bottom
    ctx.fillStyle = '#2B1A07';
    ctx.font = 'bold 24px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const displayTitle = memory.title.length > 22 ? memory.title.substring(0, 22) + '...' : memory.title;
    ctx.fillText(displayTitle, cardWidth / 2, cardHeight - 56);

    // Sticker and Date at bottom
    ctx.fillStyle = '#FF6F1E';
    ctx.font = 'bold 16px sans-serif';
    const dateStr = memory.date ? `${memory.sticker || '✨'} ${memory.date}` : (memory.sticker || '★ MEMORY');
    ctx.fillText(dateStr, cardWidth / 2, cardHeight - 24);
  };

  // 1. Initial draw placeholder
  drawPlaceholder();

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;

  // 2. Load actual image asynchronously
  if (memory.image) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      drawLoadedImage(img);
      texture.needsUpdate = true;
    };
    img.onerror = () => {
      // Keep placeholder on error, ensure texture updates
      texture.needsUpdate = true;
    };
    img.src = memory.image;
  }

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Disposes of cached textures when exiting Chapter 5
 */
export function clearMemoryTextureCache(): void {
  textureCache.forEach((tex) => tex.dispose());
  textureCache.clear();
}
