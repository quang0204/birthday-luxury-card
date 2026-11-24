import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Gift, ExternalLink, Trash2, Edit3, QrCode, Copy, Check, 
  Sparkles, Calendar, Layers, Menu as MenuIcon, X, Eye, ArrowUp
} from 'lucide-react';
import { MenuItem, MenuContainer } from '../components/ui/fluid-menu';
import { getAllCards, deleteCard, cloneCard, encodeCardToUrl, SavedCard } from '../utils/cardLibrary';

interface DashboardPageProps {
  onOpenCard: (cardId: string) => void;
  onCreateNew: () => void;
  onEditCard: (cardId: string) => void;
  onOpenQR: (card: SavedCard) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

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
    const handleLibraryUpdate = () => {
      refresh();
    };
    window.addEventListener('birthday_library_updated', handleLibraryUpdate);
    return () => {
      window.removeEventListener('birthday_library_updated', handleLibraryUpdate);
    };
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
      <header className="relative z-10 border-b border-white/10 px-6 py-6 backdrop-blur-md bg-[#12060C]/60 sticky top-0 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs tracking-[0.2em] text-[#E77C92] uppercase font-bold">
                Bespoke Keepsake Studio
              </span>
              <span className="text-xs text-white/70 font-sans">· Quản lý đa thiệp</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#FCFAF7] tracking-tight">
              Bộ Sưu Tập Thiệp Sinh Nhật
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onCreateNew}
              className="btn-luxury px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-950/50"
            >
              <Plus size={16} />
              <span>Tạo Thiệp Mới</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Intro banner */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-sm"
        >
          <div>
            <h2 className="font-serif text-lg text-[#FCFAF7] mb-1 flex items-center gap-2">
              <Sparkles size={16} className="text-[#E77C92]" />
              Không giới hạn số lượng thiệp
            </h2>
            <p className="text-xs text-[#FCFAF7]/60 font-light max-w-xl leading-relaxed">
              Bạn có thể tạo thiệp riêng cho từng người bạn, người yêu, người thân hoặc đồng nghiệp. Mỗi thiệp có quả cầu ảnh 3D, thư tay bí mật, câu đố và mã QR độc lập.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#FCFAF7]/80 font-medium">
              {cards.length} thiệp đã lưu
            </span>
          </div>
        </motion.div>

        {cards.length === 0 ? (
          /* Empty state */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-6 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-[#D4627A]/15 border border-[#D4627A]/30 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-950/20">
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
              className="btn-luxury px-6 py-3 text-sm font-semibold flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              Tạo Thiệp Đầu Tiên
            </button>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {cards.map((card) => {
                const memoryCount = card.config.memories?.length || 0;

                return (
                  <motion.div
                    key={card.id}
                    variants={cardItemVariants}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    layout
                    className="card-luxury group relative bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-[#D4627A]/40 rounded-3xl p-6 flex flex-col justify-between cursor-pointer"
                    onClick={() => onOpenCard(card.id)}
                  >
                    <div>
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4627A] to-[#601A2B] border border-white/15 flex items-center justify-center text-xl shadow-md shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-3deg]">
                          🎂
                        </div>

                        <div className="flex items-center gap-1.5 opacity-90" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onOpenQR(card)}
                            title="Xem mã QR & thiệp in"
                            className="btn-glass-interactive p-2 text-white/70 hover:text-white"
                          >
                            <QrCode size={14} />
                          </button>
                          <button
                            onClick={() => handleClone(card.id)}
                            title="Nhân bản thiệp này"
                            className="btn-glass-interactive p-2 text-white/70 hover:text-white"
                          >
                            <Layers size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(card.id)}
                            title={deletingId === card.id ? 'Nhấn lần nữa để xác nhận xóa' : 'Xóa thiệp'}
                            className={`p-2 rounded-full transition-all border cursor-pointer ${
                              deletingId === card.id
                                ? 'bg-red-500/30 border-red-500/50 text-red-400 font-bold scale-105'
                                : 'btn-glass-interactive text-white/40 hover:text-red-400 hover:bg-red-500/10'
                            }`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Recipient info */}
                      <h3 className="font-serif text-xl text-[#FCFAF7] mb-1 font-medium tracking-tight group-hover:text-[#FEEBEF] transition-colors">
                        {card.name}
                      </h3>

                      {card.config.recipientNickname && (
                        <p className="text-xs text-[#E77C92] font-medium mb-3">
                          « {card.config.recipientNickname} »
                        </p>
                      )}

                      {/* Meta tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-[#FCFAF7]/80">
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
                    <div className="pt-4 border-t border-white/10 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenCard(card.id)}
                          className="btn-luxury flex-1 py-2 px-3 text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5"
                        >
                          <ExternalLink size={13} />
                          <span>Xem Thiệp</span>
                        </button>

                        <button
                          onClick={() => onEditCard(card.id)}
                          className="btn-glass-interactive py-2 px-3.5 text-xs font-semibold flex items-center justify-center gap-1.5"
                        >
                          <Edit3 size={13} />
                          <span>Sửa</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleCopyLink(card)}
                        className="btn-glass-interactive w-full py-1.5 px-3 text-xs text-white/60 hover:text-white flex items-center justify-center gap-1.5"
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
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Quick Add Card Card */}
            <motion.button
              variants={cardItemVariants}
              initial="hidden"
              animate="show"
              onClick={onCreateNew}
              className="card-luxury border-2 border-dashed border-white/20 hover:border-[#D4627A]/50 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 text-white/70 hover:text-[#E77C92] hover:bg-white/[0.02] min-h-[260px] group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 group-hover:rotate-90 transition-all duration-300">
                <Plus size={22} />
              </div>
              <span className="font-serif text-base font-medium text-white/90">Tạo thêm thiệp mới</span>
              <span className="text-xs text-white/60 max-w-[180px] text-center">
                Thiết kế một thiệp hoàn toàn khác cho người nhận mới
              </span>
            </motion.button>
          </motion.div>
        )}
      </main>

      {/* Subtle Minimal Footer */}
      <footer className="mt-12 mb-6 text-center text-xs text-white/30 font-light font-sans tracking-wider uppercase">
        Keepsake Studio • Bespoke Digital Keepsake
      </footer>

      {/* Floating Fluid Menu on Dashboard */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
        <MenuContainer
          direction="up"
          triggerClassName="bg-[#180d15]/95 border border-[#E77C92]/40 text-[#FAF4F0] shadow-2xl backdrop-blur-xl hover:border-[#E77C92]"
          itemClassName="bg-[#1f101a]/95 border border-white/20 text-[#FAF4F0] shadow-2xl backdrop-blur-xl hover:border-[#E77C92]"
          spacing={56}
        >
          <MenuItem
            title="Menu điều hướng"
            icon={
              <div className="relative w-6 h-6 flex items-center justify-center">
                <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-100 scale-100 rotate-0 [div[data-expanded=true]_&]:opacity-0 [div[data-expanded=true]_&]:scale-0 [div[data-expanded=true]_&]:rotate-180 flex items-center justify-center">
                  <MenuIcon size={22} className="text-[#E77C92]" strokeWidth={2} />
                </div>
                <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-0 scale-0 -rotate-180 [div[data-expanded=true]_&]:opacity-100 [div[data-expanded=true]_&]:scale-100 [div[data-expanded=true]_&]:rotate-0 flex items-center justify-center">
                  <X size={22} className="text-[#E77C92]" strokeWidth={2} />
                </div>
              </div>
            }
          />
          {cards.length > 0 && (
            <MenuItem
              title="Xem thiệp"
              onClick={() => onOpenCard(cards[0].id)}
              icon={<Eye size={20} className="text-[#E77C92]" />}
            />
          )}
          <MenuItem
            title="Tạo thiệp mới"
            onClick={onCreateNew}
            icon={<Plus size={20} className="text-[#FAF4F0]" />}
          />
          {cards.length > 0 && (
            <MenuItem
              title="Mã QR & Thiệp in"
              onClick={() => onOpenQR(cards[0])}
              icon={<QrCode size={20} className="text-[#FAF4F0]" />}
            />
          )}
          <MenuItem
            title="Lên đầu trang"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            icon={<ArrowUp size={20} className="text-[#E6C29C]" />}
          />
        </MenuContainer>

        <div className="px-3.5 py-2 rounded-full shadow-2xl text-xs border border-white/20 bg-[#160a12]/90 backdrop-blur-xl text-white/80 font-medium hidden sm:block">
          Studio Menu
        </div>
      </div>
    </div>
  );
};
