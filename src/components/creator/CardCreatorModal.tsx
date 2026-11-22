import React, { useState } from 'react';
import { 
  X, Sparkles, User, Mail, Image, Music, Plus, Trash2, 
  Upload, Check, QrCode, Eye, RotateCcw, Heart 
} from 'lucide-react';
import { BirthdayConfig, MemoryItem } from '../../config/birthday.config';
import { saveDraftToStorage } from '../../utils/configStorage';

interface CardCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: BirthdayConfig;
  onSaveConfig: (updatedConfig: BirthdayConfig) => void;
  onGenerateQR: (updatedConfig: BirthdayConfig) => void;
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
  onSaveConfig,
  onGenerateQR,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'letter' | 'memories' | 'music'>('info');
  const [formData, setFormData] = useState<BirthdayConfig>(currentConfig);
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

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

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleMemoryChange(index, 'image', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAndPreview = () => {
    saveDraftToStorage(formData);
    onSaveConfig(formData);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 600);
  };

  const handleGenerateAndShare = () => {
    saveDraftToStorage(formData);
    onSaveConfig(formData);
    onGenerateQR(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="relative max-w-2xl w-full bg-[#FDFBF9] text-[#2B1A07] border-3 border-[#2B1A07] rounded-3xl p-5 sm:p-7 shadow-sticker-lg my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#2B1A07]/15 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6F1E] border-2 border-[#2B1A07] shadow-sticker-sm flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-black text-[#2B1A07]">
                Superr Studio Tự Tạo Thiệp
              </h3>
              <p className="text-xs text-[#2B1A07]/70 font-sans">
                Tùy chỉnh tên, ảnh kỷ niệm, thư tay và tạo link QR riêng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F7EFE9] border-2 border-[#2B1A07] text-[#2B1A07] shadow-sticker-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation (Sticker Pill Style) */}
        <div className="flex items-center gap-2 py-3 border-b-2 border-[#2B1A07]/10 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-3.5 py-2 rounded-full text-xs font-display font-black flex items-center gap-1.5 whitespace-nowrap transition-all border-2 border-[#2B1A07] cursor-pointer ${
              activeTab === 'info'
                ? 'bg-[#FF6F1E] text-white shadow-sticker-sm translate-y-[-1px]'
                : 'bg-[#F7EFE9] text-[#2B1A07] hover:bg-white'
            }`}
          >
            <User size={14} />
            <span>1. Người Nhận</span>
          </button>

          <button
            onClick={() => setActiveTab('letter')}
            className={`px-3.5 py-2 rounded-full text-xs font-display font-black flex items-center gap-1.5 whitespace-nowrap transition-all border-2 border-[#2B1A07] cursor-pointer ${
              activeTab === 'letter'
                ? 'bg-[#FF66CF] text-[#2B1A07] shadow-sticker-sm translate-y-[-1px]'
                : 'bg-[#F7EFE9] text-[#2B1A07] hover:bg-white'
            }`}
          >
            <Mail size={14} />
            <span>2. Thư Bí Mật</span>
          </button>

          <button
            onClick={() => setActiveTab('memories')}
            className={`px-3.5 py-2 rounded-full text-xs font-display font-black flex items-center gap-1.5 whitespace-nowrap transition-all border-2 border-[#2B1A07] cursor-pointer ${
              activeTab === 'memories'
                ? 'bg-[#3B82F6] text-white shadow-sticker-sm translate-y-[-1px]'
                : 'bg-[#F7EFE9] text-[#2B1A07] hover:bg-white'
            }`}
          >
            <Image size={14} />
            <span>3. Ảnh Kỷ Niệm ({formData.memories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`px-3.5 py-2 rounded-full text-xs font-display font-black flex items-center gap-1.5 whitespace-nowrap transition-all border-2 border-[#2B1A07] cursor-pointer ${
              activeTab === 'music'
                ? 'bg-[#FBBF24] text-[#2B1A07] shadow-sticker-sm translate-y-[-1px]'
                : 'bg-[#F7EFE9] text-[#2B1A07] hover:bg-white'
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
                <label className="text-xs font-display font-black text-[#2B1A07] block mb-1">
                  Tên Người Nhận (Hiển thị nổi bật trên toàn bộ thiệp):
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => handleTextChange('recipientName', e.target.value)}
                  placeholder="Ví dụ: Minh Anh, Hà My, Hoàng..."
                  className="w-full bg-[#F7EFE9] border-2 border-[#2B1A07] rounded-xl px-3.5 py-2.5 text-sm text-[#2B1A07] font-semibold focus:outline-none focus:border-[#FF6F1E] shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-display font-bold text-[#2B1A07] block mb-1">
                    Biệt Danh Thân Mật:
                  </label>
                  <input
                    type="text"
                    value={formData.recipientNickname}
                    onChange={(e) => handleTextChange('recipientNickname', e.target.value)}
                    placeholder="Bé Mèo, Heo Lười, Bạn Thân..."
                    className="w-full bg-[#F7EFE9] border-2 border-[#2B1A07] rounded-xl px-3.5 py-2 text-sm text-[#2B1A07] font-semibold focus:outline-none focus:border-[#FF6F1E] shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-display font-bold text-[#2B1A07] block mb-1">
                    Ngày Sinh Nhật:
                  </label>
                  <input
                    type="text"
                    value={formData.birthdayDate}
                    onChange={(e) => handleTextChange('birthdayDate', e.target.value)}
                    placeholder="Ví dụ: 24.11 hoặc 18/05"
                    className="w-full bg-[#F7EFE9] border-2 border-[#2B1A07] rounded-xl px-3.5 py-2 text-sm text-[#2B1A07] font-semibold focus:outline-none focus:border-[#FF6F1E] shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-display font-bold text-[#2B1A07] block mb-1">
                  Tên Người Gửi (Chữ ký của bạn):
                </label>
                <input
                  type="text"
                  value={formData.senderName}
                  onChange={(e) => handleTextChange('senderName', e.target.value)}
                  placeholder="Người bạn bí mật ✨"
                  className="w-full bg-[#F7EFE9] border-2 border-[#2B1A07] rounded-xl px-3.5 py-2 text-sm text-[#2B1A07] font-semibold focus:outline-none focus:border-[#FF6F1E] shadow-sm"
                />
              </div>
            </div>
          )}

          {/* TAB 2: BỨC THƯ BÍ MẬT */}
          {activeTab === 'letter' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="text-xs font-display font-black text-[#2B1A07] block mb-1">
                  Tiêu Đề Bức Thư:
                </label>
                <input
                  type="text"
                  value={formData.secretLetter.title}
                  onChange={(e) => handleLetterChange('title', e.target.value)}
                  placeholder="Gửi Bạn, Người Vô Cùng Đặc Biệt"
                  className="w-full bg-[#F7EFE9] border-2 border-[#2B1A07] rounded-xl px-3.5 py-2 text-sm text-[#2B1A07] font-semibold focus:outline-none focus:border-[#FF6F1E]"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-display font-bold text-[#2B1A07]">
                    Các Đoạn Văn Trong Thư:
                  </label>
                  <button
                    onClick={addParagraph}
                    className="text-xs font-display font-black text-[#2B1A07] flex items-center gap-1 bg-[#FBBF24] px-3 py-1 rounded-full border-2 border-[#2B1A07] shadow-sticker-sm hover:translate-x-[-1px] hover:translate-y-[-1px] cursor-pointer"
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
                      className="w-full bg-[#F7EFE9] border-2 border-[#2B1A07] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#2B1A07] font-medium focus:outline-none focus:border-[#FF6F1E]"
                    />
                    {formData.secretLetter.paragraphs.length > 1 && (
                      <button
                        onClick={() => removeParagraph(idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#FF66CF] border border-[#2B1A07] text-[#2B1A07] hover:scale-110 transition-all cursor-pointer"
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
                  <label className="text-xs font-display font-bold text-[#2B1A07] block mb-1">
                    Lời Kết:
                  </label>
                  <input
                    type="text"
                    value={formData.secretLetter.closing}
                    onChange={(e) => handleLetterChange('closing', e.target.value)}
                    placeholder="Mãi là người bạn tuyệt vời nhất!"
                    className="w-full bg-[#F7EFE9] border-2 border-[#2B1A07] rounded-xl px-3.5 py-2 text-sm text-[#2B1A07] font-semibold focus:outline-none focus:border-[#FF6F1E]"
                  />
                </div>

                <div>
                  <label className="text-xs font-display font-bold text-[#2B1A07] block mb-1">
                    Ký Tên (Sign-off):
                  </label>
                  <input
                    type="text"
                    value={formData.secretLetter.signOff}
                    onChange={(e) => handleLetterChange('signOff', e.target.value)}
                    placeholder="With love & huge hugs ❤️"
                    className="w-full bg-[#F7EFE9] border-2 border-[#2B1A07] rounded-xl px-3.5 py-2 text-sm text-[#2B1A07] font-semibold focus:outline-none focus:border-[#FF6F1E]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ẢNH KỶ NIỆM */}
          {activeTab === 'memories' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#2B1A07]/80">
                  Thêm những bức ảnh kỷ niệm đẹp vào cuốn album:
                </p>
                <button
                  onClick={addMemory}
                  className="text-xs font-display font-black text-[#2B1A07] flex items-center gap-1 bg-[#FBBF24] px-3 py-1.5 rounded-full border-2 border-[#2B1A07] shadow-sticker-sm hover:translate-x-[-1px] hover:translate-y-[-1px] cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Thêm ảnh mới</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.memories.map((mem, idx) => (
                  <div
                    key={mem.id || idx}
                    className="p-4 rounded-2xl bg-[#F7EFE9] border-2 border-[#2B1A07] shadow-sm relative space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-display font-black text-[#2B1A07] flex items-center gap-1.5 bg-[#FF66CF] px-2.5 py-0.5 rounded-full border border-[#2B1A07]">
                        <Heart size={13} className="fill-[#2B1A07]" />
                        Ảnh Kỷ Niệm #{idx + 1}
                      </span>
                      {formData.memories.length > 1 && (
                        <button
                          onClick={() => removeMemory(idx)}
                          className="text-xs font-display font-bold text-[#CE500A] p-1 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={13} />
                          <span>Xóa</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Image Preview & Upload */}
                      <div className="flex flex-col items-center">
                        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/10 border-2 border-[#2B1A07] relative group">
                          <img
                            src={mem.image}
                            alt={mem.title}
                            className="w-full h-full object-cover"
                          />
                          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-xs text-white font-display font-bold">
                            <Upload size={18} className="mb-1" />
                            <span>Tải ảnh lên</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(idx, e)}
                            />
                          </label>
                        </div>
                        <span className="text-[10px] text-[#2B1A07]/60 mt-1">
                          Chạm ảnh để chọn từ máy
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
                            className="w-full bg-[#FDFBF9] border border-[#2B1A07] rounded-lg px-2.5 py-1.5 text-xs text-[#2B1A07] font-semibold"
                          />
                          <input
                            type="text"
                            value={mem.date}
                            onChange={(e) => handleMemoryChange(idx, 'date', e.target.value)}
                            placeholder="Thời gian..."
                            className="w-full bg-[#FDFBF9] border border-[#2B1A07] rounded-lg px-2.5 py-1.5 text-xs text-[#2B1A07] font-semibold"
                          />
                        </div>

                        <input
                          type="text"
                          value={mem.caption}
                          onChange={(e) => handleMemoryChange(idx, 'caption', e.target.value)}
                          placeholder="Câu caption ngắn..."
                          className="w-full bg-[#FDFBF9] border border-[#2B1A07] rounded-lg px-2.5 py-1.5 text-xs text-[#2B1A07]"
                        />

                        <textarea
                          rows={2}
                          value={mem.description}
                          onChange={(e) => handleMemoryChange(idx, 'description', e.target.value)}
                          placeholder="Chi tiết câu chuyện kỷ niệm..."
                          className="w-full bg-[#FDFBF9] border border-[#2B1A07] rounded-lg px-2.5 py-1.5 text-xs text-[#2B1A07]"
                        />

                        <input
                          type="text"
                          value={mem.image.startsWith('data:') ? '(Ảnh đã tải từ máy)' : mem.image}
                          onChange={(e) => handleMemoryChange(idx, 'image', e.target.value)}
                          placeholder="Hoặc dán link ảnh online (https://...)"
                          className="w-full bg-[#FDFBF9] border border-[#2B1A07]/40 rounded-lg px-2.5 py-1 text-[11px] text-[#2B1A07]/70"
                        />
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
                <label className="text-xs font-display font-black text-[#2B1A07] block mb-2">
                  Chọn Bản Nhạc Mừng Sinh Nhật:
                </label>
                <div className="space-y-2">
                  {PRESET_MUSIC.map((track, i) => (
                    <label
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-2xl border-2 border-[#2B1A07] cursor-pointer transition-all ${
                        formData.audio.backgroundMusicUrl === track.url
                          ? 'bg-[#FBBF24] shadow-sticker-sm'
                          : 'bg-[#F7EFE9] hover:bg-white'
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
                        className="accent-[#FF6F1E] w-4 h-4"
                      />
                      <span className="text-xs sm:text-sm font-display font-bold text-[#2B1A07]">
                        {track.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-display font-bold text-[#2B1A07] block mb-1">
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
                  className="w-full bg-[#F7EFE9] border-2 border-[#2B1A07] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#2B1A07] font-semibold focus:outline-none focus:border-[#FF6F1E]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t-2 border-[#2B1A07]/15 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFormData(currentConfig)}
              className="px-3 py-2 rounded-full bg-[#F7EFE9] border-2 border-[#2B1A07] text-[#2B1A07] text-xs font-display font-bold flex items-center gap-1 hover:bg-white cursor-pointer"
              title="Khôi phục lại dữ liệu gốc"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Khôi phục</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Preview Button */}
            <button
              onClick={handleSaveAndPreview}
              className="superr-btn-secondary px-4 py-2.5 text-xs sm:text-sm gap-1.5"
            >
              {savedToast ? <Check size={15} className="text-[#22C55E]" /> : <Eye size={15} />}
              <span>{savedToast ? 'Đã lưu!' : 'Xem Trước Thiệp'}</span>
            </button>

            {/* Generate & Share QR Button */}
            <button
              onClick={handleGenerateAndShare}
              className="superr-btn-primary px-5 py-2.5 text-xs sm:text-sm gap-1.5"
            >
              <QrCode size={16} />
              <span>Tạo Link & Mã QR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
