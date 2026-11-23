import LZString from 'lz-string';
import { BirthdayConfig, BIRTHDAY_CONFIG, MemoryItem } from '../config/birthday.config';

const STORAGE_KEY = 'custom_birthday_card_v1';

/**
 * Compact representation to guarantee URL fits comfortably within QR Code capacity (< 1800 chars)
 */
interface CompactCardData {
  n: string; // name
  k?: string; // nick
  d?: string; // date
  s?: string; // sender
  lt?: string; // letter title
  lp?: string[]; // letter paragraphs
  lc?: string; // letter closing
  ls?: string; // letter signOff
  m?: {
    u: string; // image url
    t: string; // title
    c: string; // caption
    d?: string; // date
    s?: string; // sticker
  }[];
  mu?: string; // music
}

/**
 * Encode config to an ultra-compact LZ-compressed URL
 */
export function encodeConfigToUrl(config: BirthdayConfig): string {
  try {
    const compact: CompactCardData = {
      n: config.recipientName,
      k: config.recipientNickname,
      d: config.birthdayDate,
      s: config.senderName,
      lt: config.secretLetter?.title,
      lp: config.secretLetter?.paragraphs,
      lc: config.secretLetter?.closing,
      ls: config.secretLetter?.signOff,
      // Filter out raw local data: base64 URLs that would exceed QR capacity
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

    const json = JSON.stringify(compact);
    const compressed = LZString.compressToEncodedURIComponent(json);

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    return `${origin}${pathname}?c=${compressed}`;
  } catch (err) {
    console.error('Failed to encode config to URL', err);
    return typeof window !== 'undefined' ? window.location.href : '';
  }
}

/**
 * Decode compact config from URL parameter
 */
export function decodeConfigFromUrl(): Partial<BirthdayConfig> | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const c = params.get('c');
  if (!c) return null;

  try {
    // 1. Try LZString decompression
    let json = LZString.decompressFromEncodedURIComponent(c);

    // 2. Fallback to legacy base64 if not LZString
    if (!json) {
      try {
        const binary = atob(c);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        json = new TextDecoder().decode(bytes);
      } catch (e) {
        // Not legacy base64
      }
    }

    if (!json) return null;
    const data = JSON.parse(json);

    // Handle compact keys or legacy keys
    const name = data.n || data.name || BIRTHDAY_CONFIG.recipientName;
    const nick = data.k || data.nick || BIRTHDAY_CONFIG.recipientNickname;
    const date = data.d || data.date || BIRTHDAY_CONFIG.birthdayDate;
    const sender = data.s || data.sender || BIRTHDAY_CONFIG.senderName;

    const letterTitle = data.lt || data.letter?.title || BIRTHDAY_CONFIG.secretLetter.title;
    const letterParagraphs =
      data.lp || data.letter?.paragraphs || BIRTHDAY_CONFIG.secretLetter.paragraphs;
    const letterClosing =
      data.lc || data.letter?.closing || BIRTHDAY_CONFIG.secretLetter.closing;
    const letterSignOff =
      data.ls || data.letter?.signOff || BIRTHDAY_CONFIG.secretLetter.signOff;

    let memories: MemoryItem[] = BIRTHDAY_CONFIG.memories;
    if (Array.isArray(data.m)) {
      if (data.m.length === 0) {
        memories = [];
      } else {
        memories = data.m.map((item: any, idx: number) => ({
          id: `mem-${idx}`,
          image: item.u || item.image || '',
          title: item.t || item.title || 'Khoảnh khắc đáng nhớ',
          caption: item.c || item.caption || '',
          description: item.description || item.c || '',
          date: item.d || item.date || '',
          sticker: item.s || item.sticker || '✨',
        }));
      }
    } else if (Array.isArray(data.memories)) {
      memories = data.memories;
    }

    let cake = BIRTHDAY_CONFIG.cake;
    if (data.ck || data.cake) {
      const ck = data.ck || data.cake || {};
      cake = {
        ...BIRTHDAY_CONFIG.cake,
        flavor: ck.f || ck.flavor || 'strawberry',
        candleCount: typeof ck.cc === 'number' ? ck.cc : (ck.candleCount || 3),
        candleColor: ck.cl || ck.candleColor || 'rose',
        showStrawberries: ck.sb !== 0 && ck.showStrawberries !== false,
        showWafers: ck.wf !== 0 && ck.showWafers !== false,
        showPearls: ck.pl !== 0 && ck.showPearls !== false,
        plaqueTitle: ck.pt || ck.plaqueTitle || 'HAPPY BIRTHDAY',
        plaqueName: ck.pn || ck.plaqueName || name,
        plaqueSubtitle: ck.ps || ck.plaqueSubtitle || 'MAKE A WISH & BLOW 🎂',
      };
    }

    return {
      recipientName: name,
      recipientNickname: nick,
      birthdayDate: date,
      senderName: sender,
      secretLetter: {
        ...BIRTHDAY_CONFIG.secretLetter,
        title: letterTitle,
        paragraphs: letterParagraphs,
        closing: letterClosing,
        signOff: letterSignOff,
      },
      memories,
      cake,
      audio: {
        ...BIRTHDAY_CONFIG.audio,
        backgroundMusicUrl: data.mu || data.music || BIRTHDAY_CONFIG.audio.backgroundMusicUrl,
      },
    };
  } catch (err) {
    console.warn('Failed to parse URL config parameter', err);
    return null;
  }
}

/**
 * Save user custom draft to LocalStorage
 */
export function saveDraftToStorage(config: BirthdayConfig) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('Could not save draft to localStorage', e);
  }
}

/**
 * Load draft from LocalStorage
 */
export function loadDraftFromStorage(): BirthdayConfig | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Could not read draft from localStorage', e);
  }
  return null;
}

/**
 * Resolve the initial config:
 * 1. Check URL (?c=...)
 * 2. Check LocalStorage
 * 3. Default config
 */
export function getInitialBirthdayConfig(): BirthdayConfig {
  const fromUrl = decodeConfigFromUrl();
  if (fromUrl) {
    return {
      ...BIRTHDAY_CONFIG,
      ...fromUrl,
      secretLetter: {
        ...BIRTHDAY_CONFIG.secretLetter,
        ...(fromUrl.secretLetter || {}),
      },
      audio: {
        ...BIRTHDAY_CONFIG.audio,
        ...(fromUrl.audio || {}),
      },
    };
  }

  const fromStorage = loadDraftFromStorage();
  if (fromStorage) {
    return fromStorage;
  }

  return BIRTHDAY_CONFIG;
}
