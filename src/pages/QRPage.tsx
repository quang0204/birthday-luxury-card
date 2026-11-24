import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import { Download, Printer, Copy, Check, X, Sparkles, Heart, AlertCircle, Maximize2, Scan, Globe } from 'lucide-react';
import { BirthdayConfig, BIRTHDAY_CONFIG } from '../config/birthday.config';
import { LucianQRCard } from '../components/ui/lucian-qr-card';

interface QRPageProps {
  isOpen: boolean;
  onClose: () => void;
  config?: BirthdayConfig;
  initialUrl?: string;
}

export const QRPage: React.FC<QRPageProps> = ({
  isOpen,
  onClose,
  config = BIRTHDAY_CONFIG,
  initialUrl,
}) => {
  const [customUrl, setCustomUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (initialUrl) {
      setCustomUrl(initialUrl);
    } else if (typeof window !== 'undefined') {
      setCustomUrl(window.location.href);
    }
  }, [initialUrl, isOpen]);

  useEffect(() => {
    if (!isOpen || !customUrl) return;

    setErrorMsg(null);

    // Optimized high-contrast QR generation:
    // Pure black on pure white, 4-module quiet zone, crisp resolution (700px)
    const errorLevel = customUrl.length < 900 ? 'M' : 'L';
    QRCode.toDataURL(
      customUrl,
      {
        width: 700,
        margin: 4,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: '#000000', // Pure solid black for maximum camera optical contrast
          light: '#FFFFFF', // Pure solid white background
        },
      },
      (err, url) => {
        if (err) {
          console.warn('QR Code generation error:', err);
          setErrorMsg(
            'Nội dung thiệp khá dài so với giới hạn quét của 1 mã QR. Bạn hãy bấm "Sao Chép Link" ở dưới để gửi trực tiếp nhé!'
          );

          // Fallback: generate QR for base site URL so image is never blank
          QRCode.toDataURL(
            'https://birthday-luxury-card.vercel.app',
            {
              width: 700,
              margin: 4,
              color: { dark: '#000000', light: '#FFFFFF' },
            },
            (_, fallbackUrl) => {
              if (fallbackUrl) setQrDataUrl(fallbackUrl);
            }
          );
        } else if (url) {
          setQrDataUrl(url);
          setErrorMsg(null);
        }
      }
    );
  }, [isOpen, customUrl]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!customUrl) return;
    // Generate a dedicated ultra-sharp 800x800 image for downloading/printing
    QRCode.toDataURL(
      customUrl,
      {
        width: 800,
        margin: 4,
        errorCorrectionLevel: customUrl.length < 900 ? 'M' : 'L',
        color: { dark: '#000000', light: '#FFFFFF' },
      },
      (err, highResUrl) => {
        const downloadSrc = highResUrl || qrDataUrl;
        if (!downloadSrc) return;
        const a = document.createElement('a');
        a.href = downloadSrc;
        a.download = `QR-SinhNhat-${config.recipientName || 'Bespoke'}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(customUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isVercelDomain = customUrl.includes('vercel.app');

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[#12060C]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-md w-full bg-[#FCFAF7] text-[#2D1117] border border-[#2D1117]/15 rounded-3xl p-6 sm:p-7 shadow-2xl text-center my-auto"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#2D1117]/5 hover:bg-[#2D1117]/10 text-[#2D1117] flex items-center justify-center transition-all cursor-pointer"
                aria-label="Đóng"
              >
                <X size={16} />
              </button>

              {/* Editorial Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF4F0] text-[#D4627A] border border-[#D4627A]/30 text-[11px] font-sans font-bold uppercase tracking-widest mb-2 select-none">
                <Sparkles size={11} className="text-[#D4627A]" />
                <span>Mã QR & Thiệp In Thực Tế</span>
              </div>

              <h3 className="font-serif text-2xl font-normal text-[#2D1117]">
                Thiệp Quà Kèm Mã QR
              </h3>

              <p className="text-xs text-[#2D1117]/70 mt-1 mb-2 font-sans font-light">
                In thiệp giấy hoặc gửi link này cho{' '}
                <strong className="text-[#D4627A] font-semibold">{config.recipientName}</strong>!
              </p>

              {/* Warning if payload was too big */}
              {errorMsg && (
                <div className="p-3 mb-2 rounded-xl bg-[#FEF3C7] border border-[#D4A373]/30 text-[#2D1117] text-xs text-left flex items-start gap-2 shadow-sm font-sans">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-[#D4627A]" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Printable Card Area with Editorial Styling */}
              <div
                id="printable-card"
                className="bg-[#FCFAF7] text-[#2D1117] rounded-2xl p-4 sm:p-5 border border-[#2D1117]/15 shadow-sm my-2.5 relative overflow-hidden"
              >
                <div className="inline-flex items-center gap-1.5 text-[10px] font-sans font-bold text-[#D4627A] uppercase tracking-wider bg-[#FAF4F0] px-3 py-0.5 rounded-full border border-[#D4627A]/20 mb-2">
                  <Heart size={10} className="fill-[#D4627A]" />
                  <span>Món Quà Sinh Nhật Bí Mật</span>
                  <Heart size={10} className="fill-[#D4627A]" />
                </div>

                <h4 className="font-serif text-xl sm:text-2xl font-normal text-[#2D1117] tracking-tight">
                  Happy Birthday, {config.recipientName}!
                </h4>

                {/* Lucian UX/UI Prompt #478 Interactive QR Card */}
                <div className="my-3 flex justify-center">
                  <LucianQRCard
                    url={customUrl}
                    onZoom={() => setIsZoomed(true)}
                    onCopy={() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  />
                </div>

                {/* Scanning Guidance */}
                <div className="flex items-center justify-center gap-1.5 text-xs font-sans font-medium text-[#2D1117]/85 mt-2">
                  <Scan size={14} className="text-[#D4627A]" />
                  <span>Dùng Camera điện thoại hoặc Zalo để quét mã</span>
                </div>

                {isVercelDomain && (
                  <div className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/25 text-[10px] font-sans font-medium">
                    <Globe size={11} className="text-emerald-600" />
                    <span>Link online Vercel — điện thoại quét là mở được ngay</span>
                  </div>
                )}

                <p className="text-[11px] text-[#2D1117]/60 font-sans mt-1">
                  Dành tặng riêng cho {config.recipientNickname || config.recipientName}
                </p>
              </div>

              {/* Change URL Input & Copy */}
              <div className="my-3 text-left font-sans">
                <label className="text-[11px] font-sans font-semibold text-[#2D1117]/80 block mb-1">
                  Đường link thiệp riêng của bạn:
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-[#FAF4F0] border border-[#2D1117]/15 rounded-xl px-3 py-2 text-xs text-[#2D1117] font-medium focus:outline-none focus:border-[#D4627A] font-mono truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF4F0] hover:bg-white border border-[#2D1117]/15 text-xs font-sans font-semibold text-[#2D1117] flex items-center gap-1 cursor-pointer shrink-0 transition-all shadow-sm active:scale-95"
                  >
                    {copied ? <Check size={14} className="text-[#22C55E]" /> : <Copy size={14} />}
                    <span>{copied ? 'Đã chép!' : 'Sao chép'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={handleDownload}
                  disabled={!qrDataUrl}
                  className="btn-editorial-primary px-4 py-3 text-xs gap-1.5 disabled:opacity-50"
                  title="Tải mã QR ảnh PNG độ phân giải cao 800x800"
                >
                  <Download size={14} />
                  <span>Tải QR PNG (Siêu Nét)</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="btn-editorial-secondary px-4 py-3 text-xs gap-1.5"
                  title="In thiệp sinh nhật kèm mã QR ra giấy"
                >
                  <Printer size={14} />
                  <span>In Thiệp Ngay</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Fullscreen Zoom Lightbox */}
      <AnimatePresence>
        {isZoomed && qrDataUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 sm:p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Đóng phóng to"
              >
                <X size={18} />
              </button>

              <div className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[#D4627A] uppercase tracking-wider mb-1">
                <Scan size={14} />
                <span>Quét Mã Trực Tiếp</span>
              </div>
              <h4 className="font-serif text-xl font-bold text-neutral-900 mb-1">
                Mã QR Sinh Nhật
              </h4>
              <p className="text-xs text-neutral-500 mb-2 font-sans">
                Hướng Camera hoặc Zalo vào mã bên dưới:
              </p>

              <div className="my-2 flex justify-center">
                <LucianQRCard
                  url={customUrl}
                  onCopy={() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
