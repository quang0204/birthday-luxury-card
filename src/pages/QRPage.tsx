import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Printer, Copy, Check, X, Sparkles, Heart } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../config/birthday.config';

interface QRPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRPage: React.FC<QRPageProps> = ({ isOpen, onClose }) => {
  const [qrUrl, setQrUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const current = window.location.href;
      setQrUrl(current);
      setCustomUrl(current);
    }
  }, []);

  useEffect(() => {
    if (!isOpen || !customUrl) return;

    QRCode.toDataURL(
      customUrl,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#1E1235',
          light: '#FFFFFF',
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [isOpen, customUrl]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR-SinhNhat-${BIRTHDAY_CONFIG.recipientName}.png`;
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
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all"
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
          In Thiệp Quét Mã QR
        </h3>

        <p className="text-xs text-lavender-muted mt-1 mb-4">
          In ra thiệp giấy hoặc gửi mã QR này cho {BIRTHDAY_CONFIG.recipientName} để mở món quà bí mật!
        </p>

        {/* Printable Card Area */}
        <div
          id="printable-card"
          className="bg-[#FFFDF9] text-neutral-900 rounded-2xl p-5 border-2 border-amber-300 shadow-xl flex flex-col items-center justify-center text-center my-3 relative overflow-hidden"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-widest font-sans mb-1">
            <Heart size={13} className="fill-rose-600" />
            <span>Món Quà Bí Mật</span>
            <Heart size={13} className="fill-rose-600" />
          </div>

          <h4 className="font-display text-xl font-extrabold text-neutral-900">
            Happy Birthday, {BIRTHDAY_CONFIG.recipientName}!
          </h4>

          {/* QR Code Graphic */}
          <div className="p-2.5 bg-white rounded-xl shadow-md border border-neutral-200 my-3">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`Mã QR Sinh Nhật ${BIRTHDAY_CONFIG.recipientName}`}
                className="w-44 h-44 object-contain"
              />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center text-xs text-neutral-400">
                Đang tạo mã QR...
              </div>
            )}
          </div>

          <p className="text-xs font-semibold text-neutral-700 font-sans tracking-wide">
            Quét mã để bước vào thế giới sinh nhật riêng của bạn ✨
          </p>
          <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
            Dành tặng riêng cho {BIRTHDAY_CONFIG.recipientNickname || BIRTHDAY_CONFIG.recipientName}
          </p>
        </div>

        {/* Change URL Input */}
        <div className="my-3 text-left">
          <label className="text-[11px] text-lavender-light font-medium block mb-1">
            Đường link website của bạn:
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://your-domain.vercel.app"
              className="flex-1 bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-xl glass-panel text-xs font-medium text-white hover:text-champagne flex items-center gap-1"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={handleDownload}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-lavender text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-102 transition-all cursor-pointer"
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
