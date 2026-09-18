/**
 * WeatherGPT — Frontend Translation Helper
 * Handles language detection, translation caching, and UI language state.
 */

let currentLanguage = 'en';
const translationCache = new Map();
const MAX_CACHE_SIZE = 100;

/**
 * Supported languages (mirrors server/translate.js).
 */
export const LANGUAGES = {
  en: 'English',
  hi: 'हिन्दी',
  bn: 'বাংলা',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  mr: 'मराठी',
  gu: 'ગુજરાતી',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  pa: 'ਪੰਜਾਬੀ',
  ur: 'اردو',
};

/**
 * Get/set the current language.
 */
export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(lang) {
  if (LANGUAGES[lang]) {
    currentLanguage = lang;
    localStorage.setItem('weathergpt-lang', lang);
  }
}

/**
 * Initialize language from localStorage or browser.
 */
export function initLanguage() {
  const saved = localStorage.getItem('weathergpt-lang');
  if (saved && LANGUAGES[saved]) {
    currentLanguage = saved;
  }
  return currentLanguage;
}

/**
 * Translate text via the backend proxy.
 * Uses a cache to avoid redundant calls.
 */
export async function translate(text, sourceLang, targetLang) {
  if (sourceLang === targetLang) return text;
  if (!text?.trim()) return text;

  const cacheKey = `${sourceLang}:${targetLang}:${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, source: sourceLang, target: targetLang }),
    });

    if (!res.ok) throw new Error(`Translation failed: ${res.status}`);

    const data = await res.json();
    const translated = data.translated || text;

    // Cache management
    if (translationCache.size >= MAX_CACHE_SIZE) {
      const firstKey = translationCache.keys().next().value;
      translationCache.delete(firstKey);
    }
    translationCache.set(cacheKey, translated);

    return translated;
  } catch (err) {
    console.warn('Translation error:', err);
    return text;
  }
}

/**
 * Get placeholder text for the input field in the current language.
 */
export function getPlaceholder() {
  const placeholders = {
    en: 'Ask about fishing zones, ocean conditions, weather...',
    hi: 'कहीं भी मौसम के बारे में पूछें...',
    bn: 'যেকোনো জায়গার আবহাওয়া সম্পর্কে জিজ্ঞাসা করুন...',
    ta: 'எங்கும் வானிலை பற்றி கேளுங்கள்...',
    te: 'ఎక్కడైనా వాతావరణం గురించి అడగండి...',
    mr: 'कुठेही हवामानाबद्दल विचारा...',
    gu: 'ગમે ત્યાં હવામાન વિશે પૂછો...',
    kn: 'ಎಲ್ಲಿಯಾದರೂ ಹವಾಮಾನದ ಬಗ್ಗೆ ಕೇಳಿ...',
    ml: 'എവിടെയും കാലാവസ്ഥയെക്കുറിച്ച് ചോദിക്കൂ...',
    pa: 'ਕਿਤੇ ਵੀ ਮੌਸਮ ਬਾਰੇ ਪੁੱਛੋ...',
    ur: '...کہیں بھی موسم کے بارے میں پوچھیں',
  };
  return placeholders[currentLanguage] || placeholders.en;
}
