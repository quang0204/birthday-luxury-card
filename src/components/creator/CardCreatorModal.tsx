import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, User, Mail, Image, Music, Plus, Trash2, 
  Upload, Check, QrCode, Eye, RotateCcw, Heart, Save, Link2, AlertCircle
} from 'lucide-react';
import { BirthdayConfig, MemoryItem } from '../../config/birthday.config';
import { saveDraftToStorage } from '../../utils/configStorage';
import { saveCard } from '../../utils/cardLibrary';

interface CardCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: BirthdayConfig;
  cardId?: string;
  onSaveConfig: (updatedConfig: BirthdayConfig, savedCardId?: string) => void;
  onSaveAndPreview?: (updatedConfig: BirthdayConfig, savedCardId?: string) => void;
  onGenerateQR: (updatedConfig: BirthdayConfig, savedCardId?: string) => void;
}

/** Downscale and compress photos in memory to fit safely within localStorage quota */
async function compressImage(file: File, maxWidth = 900, maxHeight = 900, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Read file failed'));
    reader.readAsDataURL(file);
  });
}

const PRESET_MUSIC = [
  {
    name: 'Happy Birthday Guitar Chords & Bells (Ấm áp)',
    url: 'https://assets.mixkit.co/music/preview/mixkit-happy-birthday-to-you-guitar-chords-and-bells-474.mp3',
  },
  {
    name: 'Lo-Fi Acoustic Birthday Melody (Chill nhẹ nhàng)',
    url: 'https://assets.mixkit.co/music/preview/mixkit-acoustic-guitar-light-loop-608.mp3',
  },
  {
    name: 'Sweet Piano Ballad (Cảm động sâu lắng)',
    url: 'https://assets.mixkit.co/music/preview/mixkit-piano-reflections-22.mp3',
  },
];

export const CardCreatorModal: React.FC<CardCreatorModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  cardId,
  onSaveConfig,
  onSaveAndPreview,
  onGenerateQR,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'letter' | 'memories' | 'music'>('info');
  const [formData, setFormData] = useState<BirthdayConfig>(currentConfig);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(currentConfig);
    }
  }, [isOpen, currentConfig]);

  const handleTextChange = (field: keyof BirthdayConfig, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLetterChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      secretLetter: { ...prev.secretLetter, [field]: value },
    }));
  };

  const handleParagraphChange = (index: number, text: string) => {
    const newParagraphs = [...formData.secretLetter.paragraphs];
    newParagraphs[index] = text;
    setFormData((prev) => ({
      ...prev,
      secretLetter: { ...prev.secretLetter, paragraphs: newParagraphs },
    }));
  };

  const addParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      secretLetter: {
        ...prev.secretLetter,
        paragraphs: [...prev.secretLetter.paragraphs, 'Thêm một lời chúc tốt đẹp mới tại đây...'],
      },
    }));
  };

  const removeParagraph = (index: number) => {
    if (formData.secretLetter.paragraphs.length <= 1) return;
    const newParagraphs = formData.secretLetter.paragraphs.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      secretLetter: { ...prev.secretLetter, paragraphs: newParagraphs },
    }));
  };

  // Memories handlers
  const handleMemoryChange = (index: number, field: keyof MemoryItem, value: string | number) => {
    const newMemories = [...formData.memories];
    newMemories[index] = { ...newMemories[index], [field]: value };
    setFormData((prev) => ({ ...prev, memories: newMemories }));
  };

  const addMemory = () => {
    const newItem: MemoryItem = {
      id: `mem-${Date.now()}`,
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
      date: 'Kỷ niệm mới',
      title: 'Khoảnh khắc đáng nhớ',
      caption: 'Một ngày thật tuyệt vời cùng nhau',
      description: 'Chia sẻ kỷ niệm của bạn ở đây...',
      sticker: '✨',
      rotation: Math.floor(Math.random() * 6) - 3,
    };
    setFormData((prev) => ({ ...prev, memories: [...prev.memories, newItem] }));
  };

  const removeMemory = (index: number) => {
    if (formData.memories.length <= 1) return;
    const newMemories = formData.memories.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, memories: newMemories }));
  };

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      handleMemoryChange(index, 'image', compressed);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleMemoryChange(index, 'image', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save changes directly with immediate notification
  const handleSaveOnly = () => {
    try {
      const saved = saveCard(formData, cardId);
      saveDraftToStorage(formData);
      onSaveConfig(formData, saved.id);
      setSaveMessage('Đã lưu thay đổi vào kho thiệp!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveMessage('Lỗi khi lưu, vui lòng thử lại');
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // Save changes and navigate to card view
  const handleSaveAndPreview = () => {
    const saved = saveCard(formData, cardId);
    saveDraftToStorage(formData);
    onSaveConfig(formData, saved.id);
    if (onSaveAndPreview) {
      onSaveAndPreview(formData, saved.id);
    } else {
      onClose();
    }
  };

  // Save changes and open QR share modal
  const handleGenerateAndShare = () => {
    const saved = saveCard(formData, cardId);
    saveDraftToStorage(formData);
    onSaveConfig(formData, saved.id);
    onGenerateQR(formData, saved.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto film-grain"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-2xl w-full bg-[#180812] text-[#FAF4F0] border border-white/15 rounded-3xl p-5 sm:p-7 shadow-[0_25px_65px_-15px_rgba(0,0,0,0.85)] my-auto flex flex-col max-h-[92vh]"
          >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4627A] to-[#881337] border border-rose-300/30 shadow-[0_4px_16px_rgba(212,98,122,0.35)] flex items-center justify-center text-white">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-normal text-[#FAF4F0] tracking-tight">
                Xưởng Thiết Kế Thiệp Riêng
              </h3>
              <p className="text-xs text-white/60 font-sans font-light">
                Tùy chỉnh tên, ảnh kỷ niệm, thư tay và xuất bản mã QR riêng
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {saveMessage && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-semibold shadow-sm animate-fadeIn">
                <Check size={14} className="text-emerald-400" />
                <span>{saveMessage}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Luxury Velvet Pill Style) */}
        <div className="flex items-center gap-2 py-3 border-b border-white/10 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-full text-xs font-sans font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'bg-gradient-to-r from-[#D4627A] to-[#BE4D66] text-white shadow-[0_4px_14px_rgba(212,98,122,0.35)] border border-rose-300/30'
                : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/10'
            }`}
          >
            <User size={14} />
            <span>1. Người Nhận</span>
          </button>

          <button
            onClick={() => setActiveTab('letter')}
            className={`px-4 py-2 rounded-full text-xs font-sans font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'letter'
                ? 'bg-gradient-to-r from-[#D4627A] to-[#BE4D66] text-white shadow-[0_4px_14px_rgba(212,98,122,0.35)] border border-rose-300/30'
                : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/10'
            }`}
          >
            <Mail size={14} />
            <span>2. Thư Bí Mật</span>
          </button>

          <button
            onClick={() => setActiveTab('memories')}
            className={`px-4 py-2 rounded-full text-xs font-sans font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'memories'
                ? 'bg-gradient-to-r from-[#D4627A] to-[#BE4D66] text-white shadow-[0_4px_14px_rgba(212,98,122,0.35)] border border-rose-300/30'
                : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/10'
            }`}
          >
            <Image size={14} />
            <span>3. Ảnh Kỷ Niệm ({formData.memories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`px-4 py-2 rounded-full text-xs font-sans font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'music'
                ? 'bg-gradient-to-r from-[#D4627A] to-[#BE4D66] text-white shadow-[0_4px_14px_rgba(212,98,122,0.35)] border border-rose-300/30'
                : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/10'
            }`}
          >
            <Music size={14} />
            <span>4. Nhạc Nền</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 font-sans">
          {/* TAB 1: THÔNG TIN NGƯỜI NHẬN */}
          {activeTab === 'info' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="text-xs font-serif font-medium text-white/80 block mb-1.5 tracking-wide">
                  Tên Người Nhận (Hiển thị trang trọng trên thiệp):
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => handleTextChange('recipientName', e.target.value)}
                  placeholder="Ví dụ: Minh Anh, Hà My, Hoàng..."
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-[#FAF4F0] placeholder-white/25 focus:outline-none focus:border-[#D4627A] focus:ring-1 focus:ring-[#D4627A]/30 transition-all font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-serif font-medium text-white/80 block mb-1.5 tracking-wide">
                    Biệt Danh Thân Mật:
                  </label>
                  <input
                    type="text"
                    value={formData.recipientNickname}
                    onChange={(e) => handleTextChange('recipientNickname', e.target.value)}
                    placeholder="Bé Mèo, Heo Lười, Bạn Thân..."
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-[#FAF4F0] placeholder-white/25 focus:outline-none focus:border-[#D4627A] focus:ring-1 focus:ring-[#D4627A]/30 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-serif font-medium text-white/80 block mb-1.5 tracking-wide">
                    Ngày Sinh Nhật:
                  </label>
                  <input
                    type="text"
                    value={formData.birthdayDate}
                    onChange={(e) => handleTextChange('birthdayDate', e.target.value)}
                    placeholder="Ví dụ: 24.11 hoặc 18/05"
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-[#FAF4F0] placeholder-white/25 focus:outline-none focus:border-[#D4627A] focus:ring-1 focus:ring-[#D4627A]/30 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-serif font-medium text-white/80 block mb-1.5 tracking-wide">
                  Tên Người Gửi (Chữ ký của bạn):
                </label>
                <input
                  type="text"
                  value={formData.senderName}
                  onChange={(e) => handleTextChange('senderName', e.target.value)}
                  placeholder="Người bạn bí mật ✨"
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-[#FAF4F0] placeholder-white/25 focus:outline-none focus:border-[#D4627A] focus:ring-1 focus:ring-[#D4627A]/30 transition-all font-sans"
                />
              </div>
            </div>
          )}

          {/* TAB 2: BỨC THƯ BÍ MẬT */}
          {activeTab === 'letter' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="text-xs font-serif font-medium text-white/80 block mb-1.5 tracking-wide">
                  Tiêu Đề Bức Thư:
                </label>
                <input
                  type="text"
                  value={formData.secretLetter.title}
                  onChange={(e) => handleLetterChange('title', e.target.value)}
                  placeholder="Gửi Bạn, Người Vô Cùng Đặc Biệt"
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-[#FAF4F0] placeholder-white/25 focus:outline-none focus:border-[#D4627A] focus:ring-1 focus:ring-[#D4627A]/30 transition-all font-sans"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-serif font-medium text-white/80 tracking-wide">
                    Các Đoạn Văn Trong Thư:
                  </label>
                  <button
                    onClick={addParagraph}
                    className="text-xs font-sans font-semibold text-white/90 flex items-center gap-1 bg-white/[0.06] hover:bg-white/[0.12] px-3 py-1.5 rounded-full border border-white/15 cursor-pointer transition-all"
                  >
                    <Plus size={13} />
                    <span>Thêm đoạn văn</span>
                  </button>
                </div>

                {formData.secretLetter.paragraphs.map((p, idx) => (
                  <div key={idx} className="relative group">
                    <textarea
                      rows={3}
                      value={p}
                      onChange={(e) => handleParagraphChange(idx, e.target.value)}
                      placeholder={`Đoạn ${idx + 1}...`}
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#FAF4F0] placeholder-white/25 focus:outline-none focus:border-[#D4627A] focus:ring-1 focus:ring-[#D4627A]/30 transition-all font-sans leading-relaxed"
                    />
                    {formData.secretLetter.paragraphs.length > 1 && (
                      <button
                        onClick={() => removeParagraph(idx)}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-rose-500/20 border border-rose-400/30 text-rose-300 hover:bg-rose-500/35 transition-all cursor-pointer"
                        title="Xóa đoạn này"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-serif font-medium text-white/80 block mb-1.5 tracking-wide">
                    Lời Kết:
                  </label>
                  <input
                    type="text"
                    value={formData.secretLetter.closing}
                    onChange={(e) => handleLetterChange('closing', e.target.value)}
                    placeholder="Mãi là người bạn tuyệt vời nhất!"
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-[#FAF4F0] placeholder-white/25 focus:outline-none focus:border-[#D4627A] focus:ring-1 focus:ring-[#D4627A]/30 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-serif font-medium text-white/80 block mb-1.5 tracking-wide">
                    Ký Tên (Sign-off):
                  </label>
                  <input
                    type="text"
                    value={formData.secretLetter.signOff}
                    onChange={(e) => handleLetterChange('signOff', e.target.value)}
                    placeholder="With love & huge hugs ❤️"
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-[#FAF4F0] placeholder-white/25 focus:outline-none focus:border-[#D4627A] focus:ring-1 focus:ring-[#D4627A]/30 transition-all font-sans"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ẢNH KỶ NIỆM */}
          {activeTab === 'memories' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Sharing Advice Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs flex items-start gap-2.5 shadow-sm">
                <Sparkles size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-300 mb-0.5">Mẹo gửi thiệp online & giữ nguyên ảnh:</p>
                  <p className="text-amber-200/80 leading-relaxed text-[11px]">
                    Ảnh tải từ máy được lưu an toàn tại trình duyệt này. Khi gửi link chia sẻ (<code className="text-amber-300 font-mono">?c=...</code>), để người nhận mở xem được ảnh cá nhân trên máy họ, bạn có thể <strong>dán link ảnh online (URL)</strong> vào ô bên dưới mỗi ảnh!
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-white/70">
                  Thêm những bức ảnh kỷ niệm vào quả cầu 3D:
                </p>
                <button
                  onClick={addMemory}
                  className="text-xs font-sans font-semibold text-white/90 flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.12] px-3.5 py-1.5 rounded-full border border-white/15 cursor-pointer transition-all shadow-sm"
                >
                  <Plus size={14} />
                  <span>Thêm ảnh mới</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.memories.map((mem, idx) => (
                  <div
                    key={mem.id || idx}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 shadow-sm relative space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans font-semibold text-[#FEEBEF] flex items-center gap-1.5 bg-[#D4627A]/20 px-2.5 py-0.5 rounded-full border border-[#D4627A]/40">
                        <Heart size={12} className="fill-[#D4627A]" />
                        Ảnh Kỷ Niệm #{idx + 1}
                      </span>
                      {formData.memories.length > 1 && (
                        <button
                          onClick={() => removeMemory(idx)}
                          className="text-xs font-sans font-medium text-rose-300 hover:text-rose-200 p-1 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Trash2 size={13} />
                          <span>Xóa</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Image Preview & Upload */}
                      <div className="flex flex-col items-center">
                        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/40 border border-white/15 relative group">
                          <img
                            src={mem.image}
                            alt={mem.title}
                            className="w-full h-full object-cover"
                          />
                          <label className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-xs text-white font-sans font-semibold">
                            <Upload size={18} className="mb-1" />
                            <span>Tải ảnh từ máy</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(idx, e)}
                            />
                          </label>
                        </div>
                        <span className="text-[11px] text-white/50 mt-1">
                          {mem.image.startsWith('data:') ? '📁 Đã lưu từ máy' : '🌐 Ảnh qua link URL'}
                        </span>
                      </div>

                      {/* Fields */}
                      <div className="sm:col-span-2 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={mem.title}
                            onChange={(e) => handleMemoryChange(idx, 'title', e.target.value)}
                            placeholder="Tiêu đề ảnh..."
                            className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-[#FAF4F0] placeholder-white/30 focus:border-[#D4627A] focus:outline-none"
                          />
                          <input
                            type="text"
                            value={mem.date}
                            onChange={(e) => handleMemoryChange(idx, 'date', e.target.value)}
                            placeholder="Thời gian..."
                            className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-[#FAF4F0] placeholder-white/30 focus:border-[#D4627A] focus:outline-none"
                          />
                        </div>

                        <input
                          type="text"
                          value={mem.caption}
                          onChange={(e) => handleMemoryChange(idx, 'caption', e.target.value)}
                          placeholder="Câu caption ngắn..."
                          className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-[#FAF4F0] placeholder-white/30 focus:border-[#D4627A] focus:outline-none"
                        />

                        <textarea
                          rows={2}
                          value={mem.description}
                          onChange={(e) => handleMemoryChange(idx, 'description', e.target.value)}
                          placeholder="Chi tiết câu chuyện kỷ niệm..."
                          className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-[#FAF4F0] placeholder-white/30 focus:border-[#D4627A] focus:outline-none"
                        />

                        <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/15 rounded-lg px-2.5 py-1">
                          <Link2 size={13} className="text-white/40 shrink-0" />
                          <input
                            type="text"
                            value={mem.image.startsWith('data:') ? '' : mem.image}
                            onChange={(e) => handleMemoryChange(idx, 'image', e.target.value)}
                            placeholder="Dán link ảnh online (https://...) để chia sẻ qua web"
                            className="w-full bg-transparent text-xs text-[#FAF4F0] placeholder-white/30 focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: NHẠC NỀN */}
          {activeTab === 'music' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="text-xs font-serif font-medium text-white/80 block mb-2 tracking-wide">
                  Chọn Bản Nhạc Mừng Sinh Nhật:
                </label>
                <div className="space-y-2">
                  {PRESET_MUSIC.map((track, i) => (
                    <label
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                        formData.audio.backgroundMusicUrl === track.url
                          ? 'bg-gradient-to-r from-[#D4627A]/25 to-[#BE4D66]/20 border-[#D4627A]/60 shadow-sm'
                          : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10'
                      }`}
                    >
                      <input
                        type="radio"
                        name="musicPreset"
                        checked={formData.audio.backgroundMusicUrl === track.url}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            audio: { ...prev.audio, backgroundMusicUrl: track.url },
                          }))
                        }
                        className="accent-[#D4627A] w-4 h-4"
                      />
                      <span className="text-xs sm:text-sm font-sans font-medium text-[#FAF4F0]">
                        {track.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-serif font-medium text-white/80 block mb-1.5 tracking-wide">
                  Hoặc Tự Nhập Link Nhạc MP3 Riêng:
                </label>
                <input
                  type="text"
                  value={formData.audio.backgroundMusicUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      audio: { ...prev.audio, backgroundMusicUrl: e.target.value },
                    }))
                  }
                  placeholder="https://.../music.mp3"
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#FAF4F0] placeholder-white/25 focus:outline-none focus:border-[#D4627A] focus:ring-1 focus:ring-[#D4627A]/30 transition-all font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('Khôi phục lại nội dung ban đầu của thiệp này?')) {
                  setFormData(currentConfig);
                }
              }}
              className="px-3.5 py-2 rounded-full bg-white/[0.05] border border-white/10 text-white/70 text-xs font-sans font-medium flex items-center gap-1.5 hover:bg-white/10 hover:text-white cursor-pointer transition-all"
              title="Khôi phục lại dữ liệu gốc"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Khôi phục</span>
            </button>
            {saveMessage && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 sm:hidden">
                <Check size={13} /> Đã lưu!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Primary Save Button */}
            <button
              onClick={handleSaveOnly}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] border border-emerald-400/40 text-white font-sans font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
              title="Lưu tất cả thay đổi vào kho thiệp"
            >
              {saveMessage ? (
                <>
                  <Check size={16} className="text-white" />
                  <span>Đã Lưu Xong!</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Lưu Thay Đổi</span>
                </>
              )}
            </button>

            {/* Save & Open Preview Button */}
            <button
              onClick={handleSaveAndPreview}
              className="btn-glass-interactive px-3.5 sm:px-4 py-2 text-xs sm:text-sm gap-1.5"
              title="Lưu lại và mở xem trực tiếp thiệp"
            >
              <Eye size={15} />
              <span>Lưu & Mở Thiệp</span>
            </button>

            {/* Generate & Share QR Button */}
            <button
              onClick={handleGenerateAndShare}
              className="btn-luxury px-4 sm:px-5 py-2.5 text-xs sm:text-sm gap-1.5"
              title="Lưu lại và mở mã QR để quét hoặc chia sẻ"
            >
              <QrCode size={16} />
              <span className="hidden sm:inline">Lưu & Tạo Mã QR</span>
              <span className="sm:hidden">Mã QR</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
};
