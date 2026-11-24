import React, { useState, useEffect, useMemo, useRef } from 'react';
import QRCode from 'qrcode';
import './lucian-qr-card.css';

export interface LucianQRCardProps {
  url: string;
  onZoom?: () => void;
  onCopy?: () => void;
  className?: string;
}

export const LucianQRCard: React.FC<LucianQRCardProps> = ({
  url,
  onZoom,
  onCopy,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [isIn, setIsIn] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger entrance bracket scaling & laser animation
  useEffect(() => {
    const timer = setTimeout(() => setIsIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Display URL without protocol for clean look
  const displayUrl = useMemo(() => {
    if (!url) return '';
    return url.replace(/^https?:\/\//, '');
  }, [url]);

  // Generate crisp styled SVG with Lucian #478 finder eyes and body modules
  const qrSvg = useMemo(() => {
    if (!url) return null;
    try {
      const errorLevel = url.length < 900 ? 'M' : 'L';
      const qr = QRCode.create(url, { errorCorrectionLevel: errorLevel });
      const n = qr.modules.size;
      const pad = 3;
      const W = n + pad * 2;

      function inFinder(x: number, y: number) {
        return (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
      }

      let d = '';
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          if (qr.modules.get(y, x) && !inFinder(x, y)) {
            d += `M${(x + pad + 0.06).toFixed(2)} ${(y + pad + 0.06).toFixed(2)}h.88v.88h-.88z `;
          }
        }
      }

      const eyeCoords = [
        [0, 0],
        [n - 7, 0],
        [0, n - 7],
      ];

      return (
        <svg
          viewBox={`0 0 ${W} ${W}`}
          role="img"
          aria-label={`QR code: ${url}`}
          shapeRendering="geometricPrecision"
          className="select-none"
        >
          {/* QR Body Modules */}
          <path className="m" d={d} />

          {/* Lucian #478 Styled Finder Eyes with soft rounded corners */}
          {eyeCoords.map(([cx, cy], i) => {
            const X = cx + pad;
            const Y = cy + pad;
            return (
              <g key={i}>
                <rect
                  className="f"
                  x={X + 0.5}
                  y={Y + 0.5}
                  width="6"
                  height="6"
                  rx="1.7"
                  strokeWidth="1"
                />
                <rect
                  className="e"
                  x={X + 2}
                  y={Y + 2}
                  width="3"
                  height="3"
                  rx="0.9"
                />
              </g>
            );
          })}
        </svg>
      );
    } catch (e) {
      console.warn('Lucian QR SVG generation fallback:', e);
      return null;
    }
  }, [url]);

  const handleCopy = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).catch(() => {});
    } else {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }

    setCopied(true);
    onCopy?.();

    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => {
      setCopied(false);
    }, 2200);
  };

  return (
    <div
      ref={rootRef}
      className={`u478-root ux u478 ${isIn ? 'is-in' : ''} ${className}`}
      data-url={url}
    >
      <section className="u478-c">
        {/* QR Frame with Viewfinder Target Brackets and Scanning Laser */}
        <div
          className="u478-q group"
          onClick={onZoom}
          title={onZoom ? 'Bấm để phóng to mã QR toàn màn hình' : 'Mã QR'}
          role={onZoom ? 'button' : undefined}
          tabIndex={onZoom ? 0 : undefined}
          onKeyDown={(e) => {
            if (onZoom && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onZoom();
            }
          }}
        >
          {/* Corner target brackets */}
          <span className="u478-br" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>

          {/* Vertical Laser Scan Beam */}
          <span className="u478-sc" aria-hidden="true">
            <i />
          </span>

          {/* Vector SVG QR */}
          {qrSvg}
        </div>

        {/* Clean URL String */}
        <p className="u478-u" title={url}>
          {displayUrl}
        </p>

        {/* Morphing Spring Copy Button */}
        <button
          type="button"
          className={`u478-cp ${copied ? 'is-ok' : ''}`}
          onClick={handleCopy}
          aria-label={copied ? 'Đã sao chép link' : 'Sao chép link thiệp'}
        >
          <span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 14a4.2 4.2 0 0 0 6 0l3-3a4.2 4.2 0 0 0-6-6l-1 1" />
              <path d="M14 10a4.2 4.2 0 0 0-6 0l-3 3a4.2 4.2 0 0 0 6 6l1-1" />
            </svg>
            Sao chép link
          </span>
          <span aria-hidden="true">
            <svg className="ck" viewBox="0 0 24 24">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
            Đã chép link!
          </span>
        </button>
      </section>

      {/* Screen Reader Live Region */}
      <p className="u478-live" role="status">
        {copied ? 'Link copied' : ''}
      </p>
    </div>
  );
};

export default LucianQRCard;
