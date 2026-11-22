import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Printer, Copy, Check, X, Sparkles, Heart, AlertCircle } from 'lucide-react';
import { BirthdayConfig, BIRTHDAY_CONFIG } from '../config/birthday.config';

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

    // Generate QR with Level L (Lowest error correction = Maximum data capacity up to 2953 bytes)
    QRCode.toDataURL(
      customUrl,
      {
        width: 340,
        margin: 2,
        errorCorrectionLevel: 'L',
        color: {
          dark: '#1C1032',
          light: '#FFFFFF',
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
            window.location.origin + window.location.pathname,
            { width: 340, margin: 2 },
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
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR-SinhNhat-${config.recipientName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(customUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-md w-full bg-[#130B24] border border-rose-400/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-center text-white my-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
          aria-label="Đóng"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-soft text-xs font-semibold uppercase tracking-wider mb-2 border border-rose-400/30">
          <Sparkles size={13} className="text-champagne" />
          <span>Mã QR & Thiệp In Thực Tế</span>
        </div>

        <h3 className="font-display text-xl sm:text-2xl font-bold text-warm-white">
          Thiệp Quà Kèm Mã QR
        </h3>

        <p className="text-xs text-lavender-muted mt-1 mb-3">
          Gửi link này hoặc in thiệp giấy tặng cho{' '}
          <span className="text-rose-soft font-semibold">{config.recipientName}</span>!
        </p>

        {/* Warning if payload was too big */}
        {errorMsg && (
          <div className="p-3 mb-2 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs text-left flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Printable Card Area */}
        <div
          id="printable-card"
          className="bg-[#FFFDF9] text-neutral-900 rounded-2xl p-5 border-2 border-amber-300 shadow-xl flex flex-col items-center justify-center text-center my-3 relative overflow-hidden"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-widest font-sans mb-1">
            <Heart size={13} className="fill-rose-600" />
            <span>Món Quà Sinh Nhật Bí Mật</span>
            <Heart size={13} className="fill-rose-600" />
          </div>

          <h4 className="font-display text-xl font-extrabold text-neutral-900">
            Happy Birthday, {config.recipientName}!
          </h4>

          {/* QR Code Graphic */}
          <div className="p-2.5 bg-white rounded-xl shadow-md border border-neutral-200 my-3">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`Mã QR Sinh Nhật ${config.recipientName}`}
                className="w-44 h-44 object-contain"
              />
            ) : (
              <div className="w-44 h-44 flex flex-col items-center justify-center text-xs text-neutral-400 gap-1.5">
                <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                <span>Đang tạo mã QR...</span>
              </div>
            )}
          </div>

          <p className="text-xs font-semibold text-neutral-700 font-sans tracking-wide">
            Quét mã để bước vào thế giới sinh nhật riêng của bạn ✨
          </p>
          <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
            Dành tặng riêng cho {config.recipientNickname || config.recipientName}
          </p>
        </div>

        {/* Change URL Input */}
        <div className="my-3 text-left">
          <label className="text-[11px] text-lavender-light font-medium block mb-1">
            Đường link thiệp riêng của bạn:
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1 bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400 font-mono truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-rose-500/20 border border-rose-400/40 text-xs font-medium text-white hover:text-champagne flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Đã chép!' : 'Sao chép'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={handleDownload}
            disabled={!qrDataUrl}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-lavender text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-102 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download size={15} />
            <span>Tải QR PNG</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl glass-panel border border-white/20 text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-white/10 transition-all cursor-pointer"
          >
            <Printer size={15} />
            <span>In Thiệp Ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
