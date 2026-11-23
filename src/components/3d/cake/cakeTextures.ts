import * as THREE from 'three';

/** Procedural striped candle texture */
export function createCandleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Base pastel background
  ctx.fillStyle = '#FFF5F7';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Diagonal spiral stripes
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#F472B6'; // Rose pink stripe
  for (let y = -canvas.height; y < canvas.height * 2; y += 32) {
    ctx.beginPath();
    ctx.moveTo(-20, y);
    ctx.lineTo(canvas.width + 20, y + canvas.width * 0.9);
    ctx.stroke();
  }

  // Thin gold accent line alongside stripe
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#F59E0B'; // Gold accent
  for (let y = -canvas.height; y < canvas.height * 2; y += 32) {
    ctx.beginPath();
    ctx.moveTo(-20, y + 10);
    ctx.lineTo(canvas.width + 20, y + canvas.width * 0.9 + 10);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/** Procedural chocolate wafer / pirouette roll texture */
export function createWaferTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#E3C19C'; // Crispy wafer biscuit tan
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 16;
  ctx.strokeStyle = '#4A1C14'; // Dark chocolate spiral
  for (let y = -canvas.height; y < canvas.height * 2; y += 36) {
    ctx.beginPath();
    ctx.moveTo(-10, y);
    ctx.lineTo(canvas.width + 10, y + canvas.width);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/** Soft flame sprite texture with inner core & blue root */
export function createFlameTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const bottomY = canvas.height * 0.85;

  // Outer orange glow
  const outerGrad = ctx.createRadialGradient(cx, bottomY - 60, 10, cx, bottomY - 60, 95);
  outerGrad.addColorStop(0, 'rgba(255, 140, 20, 0.95)');
  outerGrad.addColorStop(0.5, 'rgba(245, 80, 10, 0.6)');
  outerGrad.addColorStop(0.85, 'rgba(230, 40, 40, 0.25)');
  outerGrad.addColorStop(1, 'rgba(200, 20, 20, 0)');

  ctx.fillStyle = outerGrad;
  ctx.beginPath();
  ctx.moveTo(cx, bottomY - 180);
  ctx.bezierCurveTo(cx + 65, bottomY - 110, cx + 55, bottomY - 20, cx, bottomY);
  ctx.bezierCurveTo(cx - 55, bottomY - 20, cx - 65, bottomY - 110, cx, bottomY - 180);
  ctx.fill();

  // Middle bright yellow flame
  const midGrad = ctx.createRadialGradient(cx, bottomY - 50, 5, cx, bottomY - 50, 55);
  midGrad.addColorStop(0, 'rgba(255, 240, 140, 0.98)');
  midGrad.addColorStop(0.6, 'rgba(255, 185, 30, 0.85)');
  midGrad.addColorStop(1, 'rgba(255, 120, 0, 0)');

  ctx.fillStyle = midGrad;
  ctx.beginPath();
  ctx.moveTo(cx, bottomY - 140);
  ctx.bezierCurveTo(cx + 38, bottomY - 90, cx + 32, bottomY - 15, cx, bottomY);
  ctx.bezierCurveTo(cx - 32, bottomY - 15, cx - 38, bottomY - 90, cx, bottomY - 140);
  ctx.fill();

  // Inner white-hot core
  const coreGrad = ctx.createRadialGradient(cx, bottomY - 35, 2, cx, bottomY - 35, 25);
  coreGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  coreGrad.addColorStop(0.7, 'rgba(255, 250, 210, 0.9)');
  coreGrad.addColorStop(1, 'rgba(255, 220, 80, 0)');

  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.moveTo(cx, bottomY - 95);
  ctx.bezierCurveTo(cx + 18, bottomY - 60, cx + 15, bottomY - 10, cx, bottomY - 2);
  ctx.bezierCurveTo(cx - 15, bottomY - 10, cx - 18, bottomY - 60, cx, bottomY - 95);
  ctx.fill();

  // Blue base spark
  const blueGrad = ctx.createRadialGradient(cx, bottomY - 6, 1, cx, bottomY - 6, 16);
  blueGrad.addColorStop(0, 'rgba(60, 140, 255, 0.85)');
  blueGrad.addColorStop(1, 'rgba(30, 70, 200, 0)');
  ctx.fillStyle = blueGrad;
  ctx.beginPath();
  ctx.ellipse(cx, bottomY - 6, 14, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/** Soft circular puff texture for rising smoke particles */
export function createSmokeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const cx = 32;
  const cy = 32;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
  grad.addColorStop(0, 'rgba(240, 240, 245, 0.8)');
  grad.addColorStop(0.35, 'rgba(220, 220, 225, 0.45)');
  grad.addColorStop(0.7, 'rgba(190, 190, 200, 0.15)');
  grad.addColorStop(1, 'rgba(180, 180, 190, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 30, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

/** High-res bespoke name plaque texture for front of cake */
export function createPlaqueTexture(recipientName: string = 'Happy Birthday'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Smooth dark chocolate / gold-bordered greeting banner
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Rounded plaque background
  const x = 16;
  const y = 20;
  const w = canvas.width - 32;
  const h = canvas.height - 40;
  const r = 28;

  // Background gradient: Rich chocolate noir
  const bgGrad = ctx.createLinearGradient(0, y, 0, y + h);
  bgGrad.addColorStop(0, '#260B12');
  bgGrad.addColorStop(0.5, '#1B060C');
  bgGrad.addColorStop(1, '#2F0F18');

  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();

  // Double metallic gold border
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#E6C29C';
  ctx.beginPath();
  ctx.roundRect(x + 4, y + 4, w - 8, h - 8, r - 4);
  ctx.stroke();

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#F59E0B';
  ctx.beginPath();
  ctx.roundRect(x + 12, y + 12, w - 24, h - 24, r - 8);
  ctx.stroke();

  // Corner decorative flourishes
  ctx.fillStyle = '#E6C29C';
  ctx.font = '22px serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦', x + 30, y + 36);
  ctx.fillText('✦', x + w - 30, y + 36);
  ctx.fillText('✦', x + 30, y + h - 24);
  ctx.fillText('✦', x + w - 30, y + h - 24);

  // "Happy Birthday" header text
  ctx.fillStyle = '#F472B6';
  ctx.font = '600 24px "Playfair Display", Georgia, serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('HAPPY BIRTHDAY', canvas.width / 2, y + 68);

  // Recipient Name in glowing gold script
  ctx.fillStyle = '#FFFDF0';
  ctx.shadowColor = '#F59E0B';
  ctx.shadowBlur = 12;

  // Adapt font size if name is long
  const cleanName = recipientName.trim() || 'You';
  const nameFontSize = cleanName.length > 16 ? 38 : cleanName.length > 10 ? 46 : 56;
  ctx.font = `italic 700 ${nameFontSize}px "Cinzel Decorative", "Playfair Display", Georgia, serif`;
  ctx.fillText(cleanName, canvas.width / 2, y + 140);

  ctx.shadowBlur = 0;

  // Bottom sweet wish line
  ctx.fillStyle = '#E6C29C';
  ctx.font = '500 18px "Inter", sans-serif';
  ctx.fillText('MAKE A WISH & BLOW 🎂', canvas.width / 2, y + 185);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
