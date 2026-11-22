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

/** Encode a config to shareable URL (?c=...) */
export function encodeCardToUrl(config: BirthdayConfig, base = typeof window !== 'undefined' ? window.location.origin : ''): string {
  try {
    const compact = {
      n: config.recipientName,
      k: config.recipientNickname,
      d: config.birthdayDate,
      by: config.birthYear,
      s: config.senderName,
      lt: config.secretLetter?.title,
      lp: config.secretLetter?.paragraphs,
      lc: config.secretLetter?.closing,
      ls: config.secretLetter?.signOff,
      m: config.memories
        ?.filter((item) => item && !item.image.startsWith('data:'))
        .map((item) => ({
          u: item.image,
          t: item.title,
          c: item.caption,
          d: item.date,
          s: item.sticker,
        })),
      mu:
        config.audio?.backgroundMusicUrl !== BIRTHDAY_CONFIG.audio.backgroundMusicUrl
          ? config.audio?.backgroundMusicUrl
          : undefined,
    };
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(compact));
    return `${base}/?c=${compressed}`;
  } catch {
    return base;
  }
}
