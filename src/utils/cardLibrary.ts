/**
 * Multi-card library: store/load/delete/duplicate multiple birthday cards in localStorage.
 * Each card has a unique id and a full BirthdayConfig snapshot.
 */
import { BirthdayConfig, BIRTHDAY_CONFIG } from '../config/birthday.config';
import LZString from 'lz-string';

const LIBRARY_KEY = 'birthday_card_library_v1';

export interface SavedCard {
  id: string;
  name: string;         // recipient name — shown in dashboard
  nickname?: string;
  date?: string;
  createdAt: number;    // timestamp ms
  updatedAt: number;
  config: BirthdayConfig;
}

function loadLibrary(): SavedCard[] {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    if (!raw) {
      // Initialize with default card if empty
      const initial: SavedCard = {
        id: 'card-default',
        name: BIRTHDAY_CONFIG.recipientName,
        nickname: BIRTHDAY_CONFIG.recipientNickname,
        date: BIRTHDAY_CONFIG.birthdayDate,
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 86400000,
        config: BIRTHDAY_CONFIG,
      };
      saveLibrary([initial]);
      return [initial];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLibrary(cards: SavedCard[]) {
  try {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(cards));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('birthday_library_updated', { detail: cards }));
    }
  } catch (err) {
    console.error('Failed to save cards to localStorage:', err);
  }
}

export function getAllCards(): SavedCard[] {
  return loadLibrary();
}

export function getCard(id: string): SavedCard | null {
  return loadLibrary().find((c) => c.id === id) ?? null;
}

export function saveCard(config: BirthdayConfig, existingId?: string): SavedCard {
  const cards = loadLibrary();
  const now = Date.now();
  const id = existingId ?? `card-${now}`;
  const idx = cards.findIndex((c) => c.id === id);
  const card: SavedCard = {
    id,
    name: config.recipientName || 'Không tên',
    nickname: config.recipientNickname,
    date: config.birthdayDate,
    createdAt: idx >= 0 ? cards[idx].createdAt : now,
    updatedAt: now,
    config,
  };
  if (idx >= 0) {
    cards[idx] = card;
  } else {
    cards.unshift(card);
  }
  saveLibrary(cards);
  return card;
}

export function cloneCard(id: string): SavedCard | null {
  const source = getCard(id);
  if (!source) return null;
  const now = Date.now();
  const newConfig: BirthdayConfig = JSON.parse(JSON.stringify(source.config));
  newConfig.recipientName = `${source.config.recipientName} (Bản sao)`;
  return saveCard(newConfig, `card-${now}`);
}

export function deleteCard(id: string) {
  saveLibrary(loadLibrary().filter((c) => c.id !== id));
}

/**
 * Resolves the appropriate base URL for QR code and public sharing.
 * If running on localhost or loopback, defaults to public production Vercel URL
 * so phone cameras can scan and open the card immediately.
 */
export function getShareBaseUrl(): string {
  if (typeof window === 'undefined') return 'https://birthday-luxury-card.vercel.app';
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'https://birthday-luxury-card.vercel.app';
  }
  return window.location.origin;
}

/** Encode a config to shareable URL (?c=...) */
export function encodeCardToUrl(config: BirthdayConfig, base = getShareBaseUrl()): string {
  try {
    // Check if memories are identical to default template memories
    const isDefaultMemories =
      config.memories &&
      config.memories.length === BIRTHDAY_CONFIG.memories.length &&
      config.memories.every((m, idx) => m.image === BIRTHDAY_CONFIG.memories[idx]?.image);

    const compact: Record<string, any> = {
      n: config.recipientName,
    };

    if (config.recipientNickname) compact.k = config.recipientNickname;
    if (config.birthdayDate) compact.d = config.birthdayDate;
    if (config.birthYear) compact.by = config.birthYear;
    if (config.senderName && config.senderName !== BIRTHDAY_CONFIG.senderName) compact.s = config.senderName;

    // Secret Letter: only include if customized
    if (config.secretLetter) {
      if (config.secretLetter.title && config.secretLetter.title !== BIRTHDAY_CONFIG.secretLetter.title) {
        compact.lt = config.secretLetter.title;
      }
      if (Array.isArray(config.secretLetter.paragraphs) && config.secretLetter.paragraphs.length > 0) {
        compact.lp = config.secretLetter.paragraphs;
      }
      if (config.secretLetter.closing && config.secretLetter.closing !== BIRTHDAY_CONFIG.secretLetter.closing) {
        compact.lc = config.secretLetter.closing;
      }
      if (config.secretLetter.signOff && config.secretLetter.signOff !== BIRTHDAY_CONFIG.secretLetter.signOff) {
        compact.ls = config.secretLetter.signOff;
      }
    }

    // Memories
    if (Array.isArray(config.memories)) {
      if (config.memories.length === 0) {
        compact.m = [];
      } else if (!isDefaultMemories) {
        compact.m = config.memories
          .filter((item) => item && !item.image.startsWith('data:'))
          .map((item) => ({
            u: item.image,
            t: item.title,
            c: item.caption,
            d: item.date,
            s: item.sticker,
          }));
      }
    }

    // 3D Cake Customization (only encode if customized)
    if (config.cake) {
      const ck: Record<string, any> = {};
      if (config.cake.flavor && config.cake.flavor !== 'strawberry') ck.f = config.cake.flavor;
      if (config.cake.candleCount && config.cake.candleCount !== 3) ck.cc = config.cake.candleCount;
      if (config.cake.candleColor && config.cake.candleColor !== 'rose') ck.cl = config.cake.candleColor;
      if (config.cake.showStrawberries === false) ck.sb = 0;
      if (config.cake.showWafers === false) ck.wf = 0;
      if (config.cake.showPearls === false) ck.pl = 0;
      if (config.cake.plaqueTitle && config.cake.plaqueTitle !== 'HAPPY BIRTHDAY') ck.pt = config.cake.plaqueTitle;
      if (config.cake.plaqueName && config.cake.plaqueName !== config.recipientName) ck.pn = config.cake.plaqueName;
      if (config.cake.plaqueSubtitle && config.cake.plaqueSubtitle !== 'MAKE A WISH & BLOW 🎂') ck.ps = config.cake.plaqueSubtitle;

      if (Object.keys(ck).length > 0) {
        compact.ck = ck;
      }
    }

    // Background Music
    if (
      config.audio?.backgroundMusicUrl &&
      config.audio.backgroundMusicUrl !== BIRTHDAY_CONFIG.audio.backgroundMusicUrl
    ) {
      compact.mu = config.audio.backgroundMusicUrl;
    }

    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(compact));
    return `${base}/?c=${compressed}`;
  } catch {
    return base;
  }
}
