/**
 * Translation wrapper using MyMemory API.
 * Free tier: 5000 chars/day, no API key required for basic usage.
 * Supports major Indic languages.
 */

const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';

/**
 * Language code mappings.
 * MyMemory uses standard ISO 639-1 codes.
 */
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  hi: 'हिन्दी (Hindi)',
  bn: 'বাংলা (Bengali)',
  ta: 'தமிழ் (Tamil)',
  te: 'తెలుగు (Telugu)',
  mr: 'मराठी (Marathi)',
  gu: 'ગુજરાતી (Gujarati)',
  kn: 'ಕನ್ನಡ (Kannada)',
  ml: 'മലയാളം (Malayalam)',
  pa: 'ਪੰਜਾਬੀ (Punjabi)',
  ur: 'اردو (Urdu)',
};

/**
 * Translate text using MyMemory free API.
 *
 * @param {string} text - Text to translate
 * @param {string} sourceLang - Source language code (e.g., 'hi')
 * @param {string} targetLang - Target language code (e.g., 'en')
 * @returns {string} Translated text
 */
export async function translateText(text, sourceLang, targetLang) {
  if (sourceLang === targetLang) return text;
  if (!text || text.trim().length === 0) return text;

  const langPair = `${sourceLang}|${targetLang}`;
  const url = `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langPair)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Translation API error: ${res.status}`);
      return text; // Fall back to original text
    }

    const data = await res.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }

    console.warn('Translation response unexpected:', data.responseStatus);
    return text;
  } catch (error) {
    console.warn('Translation failed:', error.message);
    return text; // Graceful fallback
  }
}
