import { BirthdayConfig, BIRTHDAY_CONFIG } from '../config/birthday.config';

const STORAGE_KEY = 'custom_birthday_card_v1';

/**
 * Encode config to Base64 UTF-8 string for URL sharing
 */
export function encodeConfigToUrl(config: BirthdayConfig): string {
  try {
    // Only encode necessary customizable fields to keep URL compact
    const compactData = {
      name: config.recipientName,
      nick: config.recipientNickname,
      date: config.birthdayDate,
      sender: config.senderName,
      letter: {
        title: config.secretLetter.title,
        date: config.secretLetter.date,
        paragraphs: config.secretLetter.paragraphs,
        closing: config.secretLetter.closing,
        signOff: config.secretLetter.signOff,
      },
      memories: config.memories.map((m) => ({
        id: m.id,
        image: m.image,
        date: m.date,
        title: m.title,
        caption: m.caption,
        description: m.description,
        sticker: m.sticker,
      })),
      music: config.audio.backgroundMusicUrl,
    };

    const json = JSON.stringify(compactData);
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);

    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('c', base64);
    return url.toString();
  } catch (err) {
    console.error('Failed to encode config to URL', err);
    return window.location.href;
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
    const binary = atob(c);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const data = JSON.parse(json);

    return {
      recipientName: data.name || BIRTHDAY_CONFIG.recipientName,
      recipientNickname: data.nick || BIRTHDAY_CONFIG.recipientNickname,
      birthdayDate: data.date || BIRTHDAY_CONFIG.birthdayDate,
      senderName: data.sender || BIRTHDAY_CONFIG.senderName,
      secretLetter: {
        ...BIRTHDAY_CONFIG.secretLetter,
        ...(data.letter || {}),
      },
      memories: data.memories && data.memories.length > 0 ? data.memories : BIRTHDAY_CONFIG.memories,
      audio: {
        ...BIRTHDAY_CONFIG.audio,
        backgroundMusicUrl: data.music || BIRTHDAY_CONFIG.audio.backgroundMusicUrl,
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
