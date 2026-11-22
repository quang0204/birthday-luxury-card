import React, { useState, useMemo, useEffect } from 'react';
import { BirthdayLayout } from '../layouts/BirthdayLayout';
import { SceneTransition } from '../components/common/SceneTransition';
import { SecretInvitation } from '../components/chapters/SecretInvitation';
import { GiftOpening } from '../components/chapters/GiftOpening';
import { BirthdayCelebration } from '../components/chapters/BirthdayCelebration';
import { MakeAWish } from '../components/chapters/MakeAWish';
import { MemoryGallery } from '../components/chapters/MemoryGallery';
import { BirthdayChallenge } from '../components/chapters/BirthdayChallenge';
import { SecretLetter } from '../components/chapters/SecretLetter';
import { FinalSurprise } from '../components/chapters/FinalSurprise';
import { QRPage } from './QRPage';
import { CardCreatorModal } from '../components/creator/CardCreatorModal';
import { useBirthdayExperience } from '../hooks/useBirthdayExperience';
import { BirthdayConfig } from '../config/birthday.config';
import { getInitialBirthdayConfig } from '../utils/configStorage';
import { getCard, encodeCardToUrl, saveCard } from '../utils/cardLibrary';

interface BirthdayPageProps {
  cardId?: string;
  initialConfig?: BirthdayConfig;
  onOpenDashboard?: () => void;
}

export const BirthdayPage: React.FC<BirthdayPageProps> = ({
  cardId,
  initialConfig,
  onOpenDashboard,
}) => {
  const [activeCardId, setActiveCardId] = useState<string | undefined>(cardId);
  const [config, setConfig] = useState<BirthdayConfig>(() => {
    if (initialConfig) return initialConfig;
    if (cardId) {
      const saved = getCard(cardId);
      if (saved) return saved.config;
    }
    return getInitialBirthdayConfig();
  });

  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string>('');

  // Sync if cardId or initialConfig changes
  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    } else if (cardId) {
      const saved = getCard(cardId);
      if (saved) {
        setConfig(saved.config);
        setActiveCardId(cardId);
      }
    }
  }, [cardId, initialConfig]);

  // Detect whether visitor is in pure Recipient Mode (scanned custom QR or clicked ?c= link)
  const isRecipientMode = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).has('c');
  }, []);

  const {
    currentChapter,
    goToChapter,
    nextChapter,
    resetExperience,
    isQRModalOpen,
    setIsQRModalOpen,
  } = useBirthdayExperience();

  const handleOpenCreator = () => {
    setIsCreatorOpen(true);
  };

  const handleSaveConfig = (updated: BirthdayConfig, savedCardId?: string) => {
    setConfig(updated);
    if (savedCardId) {
      setActiveCardId(savedCardId);
    }
  };

  const handleGenerateQR = (updated: BirthdayConfig, savedCardId?: string) => {
    if (savedCardId) {
      setActiveCardId(savedCardId);
    }
    const url = encodeCardToUrl(updated);
    setGeneratedUrl(url);
    setIsCreatorOpen(false);
    setIsQRModalOpen(true);
  };

  const renderCurrentChapter = () => {
    switch (currentChapter) {
      case 1:
        return <SecretInvitation config={config} onProceed={nextChapter} />;
      case 2:
        return <GiftOpening config={config} onProceed={nextChapter} />;
      case 3:
        return <BirthdayCelebration config={config} onProceed={nextChapter} />;
      case 4:
        return <MakeAWish config={config} onProceed={nextChapter} />;
      case 5:
        return <MemoryGallery config={config} onProceed={nextChapter} />;
      case 6:
        return <BirthdayChallenge config={config} onProceed={nextChapter} />;
      case 7:
        return <SecretLetter config={config} onProceed={nextChapter} />;
      case 8:
        return (
          <FinalSurprise
            config={config}
            isRecipientMode={isRecipientMode}
            onReplay={resetExperience}
            onGoToMemories={() => goToChapter(5)}
            onOpenQRModal={() => {
              setGeneratedUrl(encodeCardToUrl(config));
              setIsQRModalOpen(true);
            }}
            onOpenCreator={handleOpenCreator}
          />
        );
      default:
        return <SecretInvitation config={config} onProceed={nextChapter} />;
    }
  };

  return (
    <BirthdayLayout
      currentChapter={currentChapter}
      config={config}
      isRecipientMode={isRecipientMode}
      onSelectChapter={goToChapter}
      onOpenQR={() => {
        setGeneratedUrl(encodeCardToUrl(config));
        setIsQRModalOpen(true);
      }}
      onOpenCreator={handleOpenCreator}
      onOpenDashboard={onOpenDashboard}
    >
      <SceneTransition currentKey={currentChapter}>
        {renderCurrentChapter()}
      </SceneTransition>

      {/* Card Creator Studio Modal */}
      <CardCreatorModal
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        currentConfig={config}
        cardId={activeCardId}
        onSaveConfig={handleSaveConfig}
        onGenerateQR={handleGenerateQR}
      />

      {/* QR Code and Printable Card Modal */}
      <QRPage
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        config={config}
        initialUrl={generatedUrl || encodeCardToUrl(config)}
      />
    </BirthdayLayout>
  );
};
