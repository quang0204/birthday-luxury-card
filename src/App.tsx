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

  // Handle open card
  const handleOpenCard = (cardId: string) => {
    setActiveCardId(cardId);
    setCurrentView('card');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle create new card: open full studio with recipient info, letter, memories & music tabs
  const handleStartCreateNew = () => {
    const newDraft: BirthdayConfig = JSON.parse(JSON.stringify(BIRTHDAY_CONFIG));
    newDraft.recipientName = '';
    newDraft.recipientNickname = '';
    newDraft.birthdayDate = '';
    newDraft.birthYear = '';
    newDraft.secretLetter.title = 'Gửi Bạn Yêu Quý ✨';
    newDraft.secretLetter.paragraphs = [
      'Chúc mừng sinh nhật bạn! Chúc bạn tuổi mới luôn rực rỡ, bình an và tràn ngập niềm vui bên những người thân thương.',
      'Cảm ơn bạn vì đã luôn mang lại những khoảnh khắc tuyệt vời và ý nghĩa trong cuộc sống này.',
    ];
    newDraft.secretLetter.closing = 'Chúc bạn một ngày sinh nhật thật hạnh phúc!';
    newDraft.secretLetter.signOff = 'Người bạn của bạn ❤️';
    newDraft.memories = []; // Xóa toàn bộ ảnh mẫu để người dùng tự thêm ảnh riêng
    setEditingConfig(newDraft);
    setEditingCardId(undefined); // undefined indicates creating a brand new card!
    setIsCreatorOpen(true);
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
      setEditingConfig(updated);
    }
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

      {/* Full Studio Creator & Editor Modal */}
      <CardCreatorModal
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        currentConfig={editingConfig}
        cardId={editingCardId}
        onSaveConfig={handleSaveFromCreator}
        onSaveAndPreview={(updated, savedId) => {
          if (savedId) {
            setActiveCardId(savedId);
            setEditingConfig(updated);
          }
          setIsCreatorOpen(false);
          setCurrentView('card');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
