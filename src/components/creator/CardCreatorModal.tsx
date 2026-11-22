import React, { useState } from 'react';
import { 
  X, Sparkles, User, Mail, Image, Music, Plus, Trash2, 
  Upload, Check, QrCode, Eye, RotateCcw, Heart 
} from 'lucide-react';
import { BirthdayConfig, MemoryItem } from '../../config/birthday.config';
import { saveDraftToStorage, encodeConfigToUrl } from '../../utils/configStorage';

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
      <div className="relative max-w-2xl w-full bg-[#110B22] border border-rose-400/30 rounded-3xl p-5 sm:p-7 shadow-2xl text-white my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center shadow-glow-pink">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-warm-white">
                Studio Tự Tạo Thiệp Sinh Nhật
              </h3>
              <p className="text-xs text-lavender-muted">
                Tùy chỉnh tên, ảnh kỷ niệm, thư tay và tạo link QR riêng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 py-3 border-b border-white/10 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'bg-rose-500/25 border border-rose-400 text-rose-soft shadow-glow-pink/30'
                : 'glass-panel text-white/70 hover:text-white'
            }`}
          >
            <User size={14} />
            <span>1. Người Nhận</span>
          </button>

          <button
            onClick={() => setActiveTab('letter')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'letter'
                ? 'bg-rose-500/25 border border-rose-400 text-rose-soft shadow-glow-pink/30'
                : 'glass-panel text-white/70 hover:text-white'
            }`}
          >
            <Mail size={14} />
            <span>2. Thư Bí Mật</span>
          </button>

          <button
            onClick={() => setActiveTab('memories')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'memories'
                ? 'bg-rose-500/25 border border-rose-400 text-rose-soft shadow-glow-pink/30'
                : 'glass-panel text-white/70 hover:text-white'
            }`}
          >
            <Image size={14} />
            <span>3. Ảnh Kỷ Niệm ({formData.memories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'music'
                ? 'bg-rose-500/25 border border-rose-400 text-rose-soft shadow-glow-pink/30'
                : 'glass-panel text-white/70 hover:text-white'
            }`}
          >
            <Music size={14} />
            <span>4. Nhạc Nền</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* TAB 1: THÔNG TIN NGƯỜI NHẬN */}
          {activeTab === 'info' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="text-xs text-rose-soft font-semibold block mb-1">
                  Tên Người Nhận (Hiển thị nổi bật trên toàn bộ thiệp):
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => handleTextChange('recipientName', e.target.value)}
                  placeholder="Ví dụ: Minh Anh, Hà My, Hoàng..."
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-lavender-light font-medium block mb-1">
                    Biệt Danh Thân Mật:
                  </label>
                  <input
                    type="text"
                    value={formData.recipientNickname}
                    onChange={(e) => handleTextChange('recipientNickname', e.target.value)}
                    placeholder="Bé Mèo, Heo Lười, Bạn Thân..."
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-lavender-light font-medium block mb-1">
                    Ngày Sinh Nhật:
                  </label>
                  <input
                    type="text"
                    value={formData.birthdayDate}
                    onChange={(e) => handleTextChange('birthdayDate', e.target.value)}
                    placeholder="Ví dụ: 24.11 hoặc 18/05"
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-lavender-light font-medium block mb-1">
                  Tên Người Gửi (Chữ ký của bạn):
                </label>
                <input
                  type="text"
                  value={formData.senderName}
                  onChange={(e) => handleTextChange('senderName', e.target.value)}
                  placeholder="Người bạn bí mật ✨"
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>
          )}

          {/* TAB 2: BỨC THƯ BÍ MẬT */}
          {activeTab === 'letter' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="text-xs text-rose-soft font-semibold block mb-1">
                  Tiêu Đề Bức Thư:
                </label>
                <input
                  type="text"
                  value={formData.secretLetter.title}
                  onChange={(e) => handleLetterChange('title', e.target.value)}
                  placeholder="Gửi Bạn, Người Vô Cùng Đặc Biệt"
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-lavender-light font-medium">
                    Các Đoạn Văn Trong Thư (Bấm thêm đoạn nếu muốn viết dài hơn):
                  </label>
                  <button
                    onClick={addParagraph}
                    className="text-xs text-champagne hover:text-amber-200 flex items-center gap-1 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-300/30"
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
                      className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-400"
                    />
                    {formData.secretLetter.paragraphs.length > 1 && (
                      <button
                        onClick={() => removeParagraph(idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-all opacity-80 group-hover:opacity-100"
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
                  <label className="text-xs text-lavender-light font-medium block mb-1">
                    Lời Kết:
                  </label>
                  <input
                    type="text"
                    value={formData.secretLetter.closing}
                    onChange={(e) => handleLetterChange('closing', e.target.value)}
                    placeholder="Mãi là người bạn tuyệt vời nhất!"
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-lavender-light font-medium block mb-1">
                    Ký Tên (Sign-off):
                  </label>
                  <input
                    type="text"
                    value={formData.secretLetter.signOff}
                    onChange={(e) => handleLetterChange('signOff', e.target.value)}
                    placeholder="With love & huge hugs ❤️"
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ẢNH KỶ NIỆM (SCRAPBOOK) */}
          {activeTab === 'memories' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <p className="text-xs text-lavender-light">
                  Thêm những bức ảnh kỷ niệm đẹp của hai bạn vào cuốn album:
                </p>
                <button
                  onClick={addMemory}
                  className="text-xs text-champagne hover:text-amber-200 flex items-center gap-1 bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-300/30"
                >
                  <Plus size={14} />
                  <span>Thêm ảnh kỷ niệm</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.memories.map((mem, idx) => (
                  <div
                    key={mem.id || idx}
                    className="p-4 rounded-2xl glass-panel border border-white/15 relative space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-rose-soft flex items-center gap-1.5">
                        <Heart size={13} className="fill-rose-500 text-rose-500" />
                        Ảnh Kỷ Niệm #{idx + 1}
                      </span>
                      {formData.memories.length > 1 && (
                        <button
                          onClick={() => removeMemory(idx)}
                          className="text-xs text-rose-400 hover:text-rose-200 p-1 flex items-center gap-1"
                        >
                          <Trash2 size={13} />
                          <span>Xóa</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Image Preview & Upload */}
                      <div className="flex flex-col items-center">
                        <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-black/50 border border-white/20 relative group">
                          <img
                            src={mem.image}
                            alt={mem.title}
                            className="w-full h-full object-cover"
                          />
                          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-xs text-white">
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
                        <span className="text-[10px] text-white/50 mt-1">
                          Chạm vào ảnh để tải từ máy
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
                            className="w-full bg-black/40 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={mem.date}
                            onChange={(e) => handleMemoryChange(idx, 'date', e.target.value)}
                            placeholder="Thời gian (VD: Hè 2024)..."
                            className="w-full bg-black/40 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>

                        <input
                          type="text"
                          value={mem.caption}
                          onChange={(e) => handleMemoryChange(idx, 'caption', e.target.value)}
                          placeholder="Câu nói / Caption ngắn..."
                          className="w-full bg-black/40 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />

                        <textarea
                          rows={2}
                          value={mem.description}
                          onChange={(e) => handleMemoryChange(idx, 'description', e.target.value)}
                          placeholder="Chi tiết câu chuyện kỷ niệm..."
                          className="w-full bg-black/40 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />

                        {/* Direct Image URL input */}
                        <input
                          type="text"
                          value={mem.image.startsWith('data:') ? '(Ảnh đã tải từ máy)' : mem.image}
                          onChange={(e) => handleMemoryChange(idx, 'image', e.target.value)}
                          placeholder="Hoặc dán đường link ảnh online (https://...)"
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-neutral-400"
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
                <label className="text-xs text-rose-soft font-semibold block mb-2">
                  Chọn Bản Nhạc Mừng Sinh Nhật:
                </label>
                <div className="space-y-2">
                  {PRESET_MUSIC.map((track, i) => (
                    <label
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.audio.backgroundMusicUrl === track.url
                          ? 'border-rose-400 bg-rose-500/20 text-white'
                          : 'glass-panel border-white/10 text-white/70 hover:text-white'
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
                        className="accent-rose-accent"
                      />
                      <span className="text-xs sm:text-sm font-medium">{track.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-lavender-light font-medium block mb-1">
                  Hoặc Tự Nhập Link Nhạc MP3 Của Bạn:
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
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-400"
                />
                <p className="text-[11px] text-neutral-400 mt-1 italic">
                  *Nếu không có mạng, hệ thống sẽ tự động bật bản nhạc sinh nhật Lo-Fi bằng bộ tổng hợp Web Audio Synthesizer!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFormData(currentConfig)}
              className="px-3 py-2 rounded-xl glass-panel text-white/60 hover:text-white text-xs flex items-center gap-1"
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
              className="px-4 py-2.5 rounded-xl glass-card-interactive text-xs sm:text-sm font-semibold text-rose-soft flex items-center gap-1.5 cursor-pointer"
            >
              {savedToast ? <Check size={15} className="text-emerald-400" /> : <Eye size={15} />}
              <span>{savedToast ? 'Đã lưu!' : 'Xem Trước Thiệp'}</span>
            </button>

            {/* Generate & Share QR Button */}
            <button
              onClick={handleGenerateAndShare}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-glow-gold hover:scale-102 transition-all cursor-pointer"
            >
              <QrCode size={15} />
              <span>Tạo Link & Mã QR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
