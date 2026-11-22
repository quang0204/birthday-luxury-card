import React from 'react';
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
import { useBirthdayExperience } from '../hooks/useBirthdayExperience';

export const BirthdayPage: React.FC = () => {
  const {
    currentChapter,
    goToChapter,
    nextChapter,
    resetExperience,
    isQRModalOpen,
    setIsQRModalOpen,
  } = useBirthdayExperience();

  const renderCurrentChapter = () => {
    switch (currentChapter) {
      case 1:
        return <SecretInvitation onProceed={nextChapter} />;
      case 2:
        return <GiftOpening onProceed={nextChapter} />;
      case 3:
        return <BirthdayCelebration onProceed={nextChapter} />;
      case 4:
        return <MakeAWish onProceed={nextChapter} />;
      case 5:
        return <MemoryGallery onProceed={nextChapter} />;
      case 6:
        return <BirthdayChallenge onProceed={nextChapter} />;
      case 7:
        return <SecretLetter onProceed={nextChapter} />;
      case 8:
        return (
          <FinalSurprise
            onReplay={resetExperience}
            onGoToMemories={() => goToChapter(5)}
            onOpenQRModal={() => setIsQRModalOpen(true)}
          />
        );
      default:
        return <SecretInvitation onProceed={nextChapter} />;
    }
  };

  return (
    <BirthdayLayout
      currentChapter={currentChapter}
      onSelectChapter={goToChapter}
      onOpenQR={() => setIsQRModalOpen(true)}
    >
      <SceneTransition currentKey={currentChapter}>
        {renderCurrentChapter()}
      </SceneTransition>

      {/* QR Code and Printable Card Modal */}
      <QRPage
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />
    </BirthdayLayout>
  );
};
