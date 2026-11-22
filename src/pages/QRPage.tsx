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
          dark: '#2B1A07', // Cocoa Ink QR dots
          light: '#FDFBF9', // Cream Paper QR background
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
      <div className="relative max-w-md w-full bg-[#FDFBF9] text-[#2B1A07] border-3 border-[#2B1A07] rounded-3xl p-6 sm:p-7 shadow-sticker-lg text-center my-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F7EFE9] border-2 border-[#2B1A07] text-[#2B1A07] shadow-sticker-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Đóng"
        >
          <X size={18} />
        </button>

        {/* Superr Laminated Sticker Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FBBF24] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker-sm text-xs font-display font-black uppercase tracking-wider mb-2 select-none">
          <Sparkles size={13} className="text-[#FF6F1E]" />
          <span>Mã QR & Thiệp In Thực Tế</span>
        </div>

        <h3 className="font-display text-2xl font-black text-[#2B1A07]">
          Thiệp Quà Kèm Mã QR
        </h3>

        <p className="text-xs text-[#2B1A07]/80 mt-1 mb-3 font-sans">
          In thiệp giấy hoặc gửi link này cho{' '}
          <strong className="text-[#FF6F1E] font-extrabold">{config.recipientName}</strong>!
        </p>

        {/* Warning if payload was too big */}
        {errorMsg && (
          <div className="p-3 mb-2 rounded-2xl bg-[#FEF3C7] border-2 border-[#2B1A07] text-[#2B1A07] text-xs text-left flex items-start gap-2 shadow-sm font-sans">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#FF6F1E]" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Printable Card Area with Superr Styling */}
        <div
          id="printable-card"
          className="bg-[#FDFBF9] text-[#2B1A07] rounded-3xl p-5 border-2.5 border-[#2B1A07] shadow-sticker my-3 relative overflow-hidden"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-display font-black text-[#2B1A07] uppercase tracking-wide bg-[#FF66CF] px-3 py-0.5 rounded-full border border-[#2B1A07] shadow-sm mb-1.5">
            <Heart size={13} className="fill-[#2B1A07]" />
            <span>Món Quà Sinh Nhật Bí Mật</span>
            <Heart size={13} className="fill-[#2B1A07]" />
          </div>

          <h4 className="font-display text-2xl font-black text-[#FF6F1E]">
            Happy Birthday, {config.recipientName}!
          </h4>

          {/* QR Code Graphic Frame */}
          <div className="p-3 bg-white rounded-2xl border-2 border-[#2B1A07] shadow-sticker-sm my-3 inline-block">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`Mã QR Sinh Nhật ${config.recipientName}`}
                className="w-44 h-44 object-contain"
              />
            ) : (
              <div className="w-44 h-44 flex flex-col items-center justify-center text-xs text-[#2B1A07] gap-1.5 font-display font-bold">
                <div className="w-6 h-6 border-2 border-[#FF6F1E] border-t-transparent rounded-full animate-spin" />
                <span>Đang tạo mã QR...</span>
              </div>
            )}
          </div>

          <p className="text-xs font-display font-black text-[#2B1A07] tracking-wide">
            Quét mã để bước vào thế giới sinh nhật riêng của bạn ✨
          </p>
          <p className="text-[11px] text-[#2B1A07]/60 font-sans mt-0.5">
            Dành tặng riêng cho {config.recipientNickname || config.recipientName}
          </p>
        </div>

        {/* Change URL Input */}
        <div className="my-3 text-left font-sans">
          <label className="text-[11px] font-display font-bold text-[#2B1A07] block mb-1">
            Đường link thiệp riêng của bạn:
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1 bg-[#F7EFE9] border-2 border-[#2B1A07] rounded-xl px-3 py-2 text-xs text-[#2B1A07] font-semibold focus:outline-none focus:border-[#FF6F1E] font-mono truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-[#FBBF24] border-2 border-[#2B1A07] shadow-sticker-sm text-xs font-display font-black text-[#2B1A07] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copied ? <Check size={14} className="text-[#22C55E]" /> : <Copy size={14} />}
              <span>{copied ? 'Đã chép!' : 'Sao chép'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <button
            onClick={handleDownload}
            disabled={!qrDataUrl}
            className="superr-btn-primary px-4 py-3 text-xs gap-1.5 disabled:opacity-50"
          >
            <Download size={15} />
            <span>Tải QR PNG</span>
          </button>

          <button
            onClick={handlePrint}
            className="superr-btn-secondary px-4 py-3 text-xs gap-1.5"
          >
            <Printer size={15} />
            <span>In Thiệp Ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
