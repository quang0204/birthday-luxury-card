import React, { useState, useEffect, useMemo } from 'react';
import { BirthdayPage } from './pages/BirthdayPage';
import { DashboardPage } from './pages/DashboardPage';
import { CardCreatorModal } from './components/creator/CardCreatorModal';
import { QRPage } from './pages/QRPage';
import { getCard, saveCard, getAllCards, encodeCardToUrl, SavedCard } from './utils/cardLibrary';
import { BIRTHDAY_CONFIG, BirthdayConfig } from './config/birthday.config';

export const App: React.FC = () => {
  // Check if visitor has ?c=... parameter (direct recipient link)
  const isDirectRecipientLink = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).has('c');
  }, []);

  // Check if URL has ?card=...
  const urlCardId = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get('card');
  }, []);

  // View state: 'dashboard' | 'card'
  const [currentView, setCurrentView] = useState<'dashboard' | 'card'>(() => {
    if (isDirectRecipientLink || urlCardId) return 'card';
    return 'dashboard';
  });

  const [activeCardId, setActiveCardId] = useState<string | undefined>(() => {
    if (urlCardId) return urlCardId;
    const cards = getAllCards();
    return cards.length > 0 ? cards[0].id : undefined;
  });

  // Creator modal state
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<BirthdayConfig>(BIRTHDAY_CONFIG);
  const [editingCardId, setEditingCardId] = useState<string | undefined>(undefined);

  // QR Modal state
  const [qrModal, setQrModal] = useState<{ isOpen: boolean; card?: SavedCard }>({ isOpen: false });

  // Quick Create Modal state
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [quickName, setQuickName] = useState('');
  const [quickNickname, setQuickNickname] = useState('');
  const [quickDate, setQuickDate] = useState('');
  const [quickRelation, setQuickRelation] = useState<'friend' | 'lover' | 'family'>('friend');

  // Handle open card
  const handleOpenCard = (cardId: string) => {
    setActiveCardId(cardId);
    setCurrentView('card');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle create new card (open quick create modal)
  const handleStartCreateNew = () => {
    setQuickName('');
    setQuickNickname('');
    setQuickDate('');
    setIsQuickCreateOpen(true);
  };

  // Handle submit quick create
  const handleSubmitQuickCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) return;

    // Clone base config and customize
    const newConfig: BirthdayConfig = JSON.parse(JSON.stringify(BIRTHDAY_CONFIG));
    newConfig.recipientName = quickName.trim();
    if (quickNickname.trim()) newConfig.recipientNickname = quickNickname.trim();
    if (quickDate.trim()) newConfig.birthdayDate = quickDate.trim();

    // Personalize greetings based on relation
    if (quickRelation === 'lover') {
      newConfig.secretLetter.title = `Gửi ${quickName}, Tình Yêu Của Mình`;
      newConfig.secretLetter.paragraphs = [
        `Chúc mừng sinh nhật ${quickName} yêu dấu! Hôm nay là một ngày vô cùng đặc biệt, ngày mà người tuyệt vời nhất trên thế giới này bước sang tuổi mới.`,
        `Cảm ơn em/anh vì đã luôn ở bên, mang lại cho cuộc sống của mình thật nhiều ấm áp, tiếng cười và những khoảnh khắc dịu dàng không gì sánh được.`,
        `Bước sang tuổi mới, chúc tình yêu của mình luôn rực rỡ, hạnh phúc, đạt được mọi ước mơ và nhớ rằng mình sẽ luôn đồng hành cùng em/anh trên mọi chặng đường.`,
      ];
      newConfig.secretLetter.closing = 'Yêu và thương em/anh rất nhiều!';
      newConfig.secretLetter.signOff = 'Mãi bên nhau nhé ❤️';
    } else if (quickRelation === 'family') {
      newConfig.secretLetter.title = `Gửi ${quickName} Kính Yêu`;
      newConfig.secretLetter.paragraphs = [
        `Nhân ngày sinh nhật của ${quickName}, con/em xin gửi tới ${quickName} những lời chúc tốt đẹp và chân thành nhất từ tận đáy lòng.`,
        `Kính chúc ${quickName} luôn dồi dào sức khỏe, an yên, hạnh phúc và luôn tràn ngập niềm vui mỗi ngày bên gia đình.`,
      ];
      newConfig.secretLetter.closing = 'Cả nhà luôn yêu thương và kính trọng!';
      newConfig.secretLetter.signOff = 'Yêu thương vô vàn ❤️';
    }

    const saved = saveCard(newConfig);
    setIsQuickCreateOpen(false);
    setActiveCardId(saved.id);
    setCurrentView('card');
  };

  // Handle edit card
  const handleEditCard = (cardId: string) => {
    const card = getCard(cardId);
    if (card) {
      setEditingConfig(card.config);
      setEditingCardId(card.id);
      setIsCreatorOpen(true);
    }
  };

  // Handle save from Creator Modal
  const handleSaveFromCreator = (updated: BirthdayConfig, savedId?: string) => {
    if (savedId) {
      setActiveCardId(savedId);
    }
    setIsCreatorOpen(false);
  };

  return (
    <>
      {currentView === 'dashboard' && !isDirectRecipientLink ? (
        <DashboardPage
          onOpenCard={handleOpenCard}
          onCreateNew={handleStartCreateNew}
          onEditCard={handleEditCard}
          onOpenQR={(card) => setQrModal({ isOpen: true, card })}
        />
      ) : (
        <BirthdayPage
          cardId={activeCardId}
          onOpenDashboard={() => setCurrentView('dashboard')}
        />
      )}

      {/* Quick Create Modal */}
      {isQuickCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-[#1A0B14] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl text-[#FCFAF7]">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-[10px] tracking-widest text-[#E77C92] uppercase font-bold">Tạo thiệp siêu nhanh</span>
                <h3 className="font-serif text-xl text-[#FCFAF7]">Thiệp Sinh Nhật Mới</h3>
              </div>
              <button
                onClick={() => setIsQuickCreateOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm cursor-pointer transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitQuickCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#FCFAF7]/80 mb-1.5">
                  Tên người nhận <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lan Anh, Tuấn Kiệt, Mẹ..."
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#E77C92] transition-colors"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#FCFAF7]/80 mb-1.5">
                    Biệt danh (tuỳ chọn)
                  </label>
                  <input
                    type="text"
                    placeholder="Bé Heo, Cún..."
                    value={quickNickname}
                    onChange={(e) => setQuickNickname(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#E77C92]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#FCFAF7]/80 mb-1.5">
                    Ngày sinh (tuỳ chọn)
                  </label>
                  <input
                    type="text"
                    placeholder="25.12"
                    value={quickDate}
                    onChange={(e) => setQuickDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#E77C92]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#FCFAF7]/80 mb-1.5">
                  Mối quan hệ (để gợi ý lời chúc phù hợp)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickRelation('friend')}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      quickRelation === 'friend'
                        ? 'bg-[#D4627A] border-[#D4627A] text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    Bạn Thân ✨
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickRelation('lover')}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      quickRelation === 'lover'
                        ? 'bg-[#D4627A] border-[#D4627A] text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    Người Yêu ❤️
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickRelation('family')}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      quickRelation === 'family'
                        ? 'bg-[#D4627A] border-[#D4627A] text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    Gia Đình 🌸
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!quickName.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4627A] to-[#992244] hover:from-[#E77C92] hover:to-[#B32D52] disabled:opacity-40 text-white font-semibold text-sm tracking-wide transition-all shadow-lg shadow-rose-950/40 cursor-pointer"
                >
                  ✨ Tạo Thiệp 3D Ngay
                </button>
              </div>

              <p className="text-[11px] text-center text-white/40">
                Sau khi tạo, bạn có thể xem ngay quả cầu 3D hoặc bấm Sửa để thay ảnh & thư tay bất kỳ lúc nào.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Full Studio Editor Modal */}
      <CardCreatorModal
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        currentConfig={editingConfig}
        cardId={editingCardId}
        onSaveConfig={handleSaveFromCreator}
        onGenerateQR={(updated, savedId) => {
          setIsCreatorOpen(false);
          const card = savedId ? getCard(savedId) : null;
          if (card) {
            setQrModal({ isOpen: true, card });
          }
        }}
      />

      {/* QR & Print Modal for a Card from Dashboard */}
      {qrModal.card && (
        <QRPage
          isOpen={qrModal.isOpen}
          onClose={() => setQrModal({ isOpen: false })}
          config={qrModal.card.config}
          initialUrl={encodeCardToUrl(qrModal.card.config)}
        />
      )}
    </>
  );
};

export default App;
