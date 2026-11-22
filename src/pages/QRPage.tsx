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
          dark: '#2D1117', // Wine Ink QR dots
          light: '#FCFAF7', // Cream Paper QR background
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
    <div className="fixed inset-0 z-50 bg-[#12060C]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-md w-full bg-[#FCFAF7] text-[#2D1117] border border-[#2D1117]/15 rounded-2xl p-6 sm:p-7 shadow-2xl text-center my-auto">
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

        <p className="text-xs text-[#2D1117]/70 mt-1 mb-3 font-sans font-light">
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
          className="bg-[#FCFAF7] text-[#2D1117] rounded-2xl p-5 border border-[#2D1117]/15 shadow-sm my-3 relative overflow-hidden"
        >
          <div className="inline-flex items-center gap-1.5 text-[10px] font-sans font-bold text-[#D4627A] uppercase tracking-wider bg-[#FAF4F0] px-3 py-0.5 rounded-full border border-[#D4627A]/20 mb-2">
            <Heart size={10} className="fill-[#D4627A]" />
            <span>Món Quà Sinh Nhật Bí Mật</span>
            <Heart size={10} className="fill-[#D4627A]" />
          </div>

          <h4 className="font-serif text-2xl font-normal text-[#2D1117] tracking-tight">
            Happy Birthday, {config.recipientName}!
          </h4>

          {/* QR Code Graphic Frame */}
          <div className="p-3 bg-white rounded-xl border border-[#2D1117]/15 my-3 inline-block shadow-sm">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`Mã QR Sinh Nhật ${config.recipientName}`}
                className="w-44 h-44 object-contain"
              />
            ) : (
              <div className="w-44 h-44 flex flex-col items-center justify-center text-xs text-[#2D1117] gap-1.5 font-sans font-semibold">
                <div className="w-6 h-6 border-2 border-[#D4627A] border-t-transparent rounded-full animate-spin" />
                <span>Đang tạo mã QR...</span>
              </div>
            )}
          </div>

          <p className="text-xs font-serif font-semibold text-[#2D1117] tracking-wide">
            Quét mã để bước vào thế giới sinh nhật riêng của bạn
          </p>
          <p className="text-[11px] text-[#2D1117]/60 font-sans mt-0.5">
            Dành tặng riêng cho {config.recipientNickname || config.recipientName}
          </p>
        </div>

        {/* Change URL Input */}
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
              className="px-3.5 py-2 rounded-xl bg-[#FAF4F0] hover:bg-white border border-[#2D1117]/15 text-xs font-sans font-semibold text-[#2D1117] flex items-center gap-1 cursor-pointer shrink-0 transition-all shadow-sm"
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
          >
            <Download size={14} />
            <span>Tải QR PNG</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn-editorial-secondary px-4 py-3 text-xs gap-1.5"
          >
            <Printer size={14} />
            <span>In Thiệp Ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
