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
    // Fill card background (Warm Ivory Cream #FCFAF7)
    ctx.fillStyle = '#FCFAF7';
    ctx.fillRect(0, 0, cardWidth, cardHeight);

    // Fine delicate border
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#2D1117';
    ctx.strokeRect(2, 2, cardWidth - 4, cardHeight - 4);

    // Inner photo area placeholder with rich wine gradient
    const grad = ctx.createLinearGradient(0, 16, 0, cardHeight - 85);
    grad.addColorStop(0, '#3A1422');
    grad.addColorStop(1, '#1E0A12');
    ctx.fillStyle = grad;
    ctx.fillRect(16, 16, cardWidth - 32, cardHeight - 100);

    // Center icon / sticker
    ctx.font = '54px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(memory.sticker || '✦', cardWidth / 2, (cardHeight - 85) / 2);

    // Caption strip at bottom in editorial serif
    ctx.fillStyle = '#2D1117';
    ctx.font = 'bold 22px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const cleanTitle = memory.title.length > 26 ? memory.title.substring(0, 26) + '...' : memory.title;
    ctx.fillText(cleanTitle, cardWidth / 2, cardHeight - 48);

    // Date watermark
    if (memory.date) {
      ctx.fillStyle = '#D4627A';
      ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(memory.date, cardWidth / 2, cardHeight - 22);
    }
  };

  const drawLoadedImage = (img: HTMLImageElement) => {
    // Fill card frame
    ctx.fillStyle = '#FCFAF7';
    ctx.fillRect(0, 0, cardWidth, cardHeight);

    // Fine hairline border
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#2D1117';
    ctx.strokeRect(2, 2, cardWidth - 4, cardHeight - 4);

    // Draw clipped photo inside the top frame
    const photoX = 14;
    const photoY = 14;
    const photoW = cardWidth - 28;
    const photoH = cardHeight - 96;

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

    // Inner fine border
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(45, 17, 23, 0.2)';
    ctx.strokeRect(photoX, photoY, photoW, photoH);

    // Title label at bottom in editorial serif
    ctx.fillStyle = '#2D1117';
    ctx.font = 'bold 22px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const displayTitle = memory.title.length > 25 ? memory.title.substring(0, 25) + '...' : memory.title;
    ctx.fillText(displayTitle, cardWidth / 2, cardHeight - 52);

    // Date & Monogram at bottom
    ctx.fillStyle = '#D4627A';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    const dateStr = memory.date ? `${memory.date}` : 'MEMORIES';
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
