import React, { useState, useCallback, useEffect } from 'react';
import { 
  Plus, Gift, ExternalLink, Trash2, Edit3, QrCode, Copy, Check, 
  Sparkles, Calendar, User, CopyCheck, Heart, Layers
} from 'lucide-react';
import { getAllCards, saveCard, deleteCard, cloneCard, encodeCardToUrl, SavedCard } from '../utils/cardLibrary';
import { BIRTHDAY_CONFIG } from '../config/birthday.config';

interface DashboardPageProps {
  onOpenCard: (cardId: string) => void;
  onCreateNew: () => void;
  onEditCard: (cardId: string) => void;
  onOpenQR: (card: SavedCard) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  onOpenCard, 
  onCreateNew, 
  onEditCard,
  onOpenQR
}) => {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = useCallback(() => setCards(getAllCards()), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleCopyLink = (card: SavedCard) => {
    const url = encodeCardToUrl(card.config);
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(card.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleClone = (id: string) => {
    cloneCard(id);
    refresh();
  };

  const handleDelete = (id: string) => {
    if (deletingId === id) {
      deleteCard(id);
      setDeletingId(null);
      refresh();
    } else {
      setDeletingId(id);
      setTimeout(() => setDeletingId(null), 3000);
    }
  };

  const fmtDate = (ms: number) =>
    new Date(ms).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#12060C] text-[#FCFAF7] font-sans selection:bg-[#D4627A]/30">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-[#D4627A]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-[#E6C29C]/8 rounded-full blur-[170px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 px-6 py-6 backdrop-blur-md bg-[#12060C]/60 sticky top-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] tracking-[0.25em] text-[#E77C92] uppercase font-bold">
                Bespoke Keepsake Studio
              </span>
              <span className="text-[10px] text-white/30 font-serif">· Quản lý đa thiệp</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#FCFAF7] tracking-tight">
              Bộ Sưu Tập Thiệp Sinh Nhật
            </h1>
          </div>

          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#D4627A] to-[#992244] hover:from-[#E77C92] hover:to-[#B32D52] text-white rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all hover:scale-105 active:scale-95 shadow-lg shadow-rose-950/50 cursor-pointer"
          >
            <Plus size={16} />
            <span>Tạo Thiệp Mới</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Intro banner */}
        <div className="mb-8 p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-lg text-[#FCFAF7] mb-1 flex items-center gap-2">
              <Sparkles size={16} className="text-[#E77C92]" />
              Không giới hạn số lượng thiệp
            </h2>
            <p className="text-xs text-[#FCFAF7]/60 font-light max-w-xl">
              Bạn có thể tạo thiệp riêng cho từng người bạn, người yêu, người thân hoặc đồng nghiệp. Mỗi thiệp có quả cầu ảnh 3D, thư tay bí mật, câu đố và mã QR độc lập.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#FCFAF7]/80">
              {cards.length} thiệp đã lưu
            </span>
          </div>
        </div>

        {cards.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-[#D4627A]/15 border border-[#D4627A]/30 flex items-center justify-center text-rose-400">
              <Gift size={36} />
            </div>
            <div>
              <h2 className="font-serif text-2xl mb-2 text-[#FCFAF7]">Chưa có thiệp nào</h2>
              <p className="text-[#FCFAF7]/50 text-xs sm:text-sm max-w-sm">
                Hãy bắt đầu tạo thiệp sinh nhật đầu tiên — tùy chỉnh ảnh 3D, viết lời chúc và gửi tặng người thân.
              </p>
            </div>
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 px-6 py-3 bg-[#D4627A] hover:bg-[#E77C92] text-white rounded-full text-sm font-semibold transition-all hover:scale-105 shadow-xl shadow-rose-950/50 cursor-pointer"
            >
              <Plus size={16} />
              Tạo Thiệp Đầu Tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => {
              const memoryCount = card.config.memories?.length || 0;
              const hasCustomLetter = Boolean(card.config.secretLetter?.paragraphs?.length);

              return (
                <div
                  key={card.id}
                  className="group relative bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-[#D4627A]/40 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-[#D4627A]/10 hover:-translate-y-1"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4627A] to-[#601A2B] border border-white/15 flex items-center justify-center text-xl shadow-md shrink-0">
                        🎂
                      </div>

                      <div className="flex items-center gap-1.5 opacity-90">
                        <button
                          onClick={() => onOpenQR(card)}
                          title="Xem mã QR & thiệp in"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all border border-white/10 cursor-pointer"
                        >
                          <QrCode size={14} />
                        </button>
                        <button
                          onClick={() => handleClone(card.id)}
                          title="Nhân bản thiệp này"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all border border-white/10 cursor-pointer"
                        >
                          <Layers size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(card.id)}
                          title={deletingId === card.id ? 'Nhấn lần nữa để xác nhận xóa' : 'Xóa thiệp'}
                          className={`p-2 rounded-xl transition-all border cursor-pointer ${
                            deletingId === card.id
                              ? 'bg-red-500/30 border-red-500/50 text-red-400 font-bold'
                              : 'bg-white/5 border-white/10 text-white/40 hover:text-red-400 hover:bg-red-500/10'
                          }`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Recipient info */}
                    <h3 className="font-serif text-xl text-[#FCFAF7] mb-1 font-medium tracking-tight">
                      {card.name}
                    </h3>

                    {card.config.recipientNickname && (
                      <p className="text-xs text-[#E77C92] font-medium mb-3">
                        « {card.config.recipientNickname} »
                      </p>
                    )}

                    {/* Meta tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] text-[#FCFAF7]/60">
                      {card.config.birthdayDate && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                          <Calendar size={11} className="text-[#E77C92]" />
                          {card.config.birthdayDate}
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                        {memoryCount} ảnh 3D
                      </span>
                      {card.config.senderName && (
                        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 truncate max-w-[140px]">
                          Từ: {card.config.senderName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenCard(card.id)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#D4627A] hover:bg-[#E77C92] text-white text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 shadow-md shadow-rose-950/30 cursor-pointer"
                      >
                        <ExternalLink size={13} />
                        <span>Xem Thiệp</span>
                      </button>

                      <button
                        onClick={() => onEditCard(card.id)}
                        className="py-2.5 px-3 rounded-xl bg-white/8 hover:bg-white/15 text-white/90 text-xs font-semibold transition-all border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 size={13} />
                        <span>Sửa</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleCopyLink(card)}
                      className="w-full py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-white/60 hover:text-white text-xs transition-all border border-white/5 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedId === card.id ? (
                        <>
                          <Check size={12} className="text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Đã sao chép link chia sẻ!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Sao chép link chia sẻ (?c=...)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Quick Add Card Card */}
            <button
              onClick={onCreateNew}
              className="border-2 border-dashed border-white/15 hover:border-[#D4627A]/50 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 text-white/40 hover:text-[#E77C92] hover:bg-white/[0.02] transition-all min-h-[260px] group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={22} />
              </div>
              <span className="font-serif text-base font-medium">Tạo thêm thiệp mới</span>
              <span className="text-[11px] text-white/40 max-w-[180px] text-center">
                Thiết kế một thiệp hoàn toàn khác cho người nhận mới
              </span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
