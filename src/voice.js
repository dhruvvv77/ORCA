/**
 * WeatherGPT — Voice I/O Module
 * Speech-to-Text (STT) via SpeechRecognition API.
 * Text-to-Speech (TTS) via SpeechSynthesis API.
 */

import { getLanguage } from './translate.js';

let recognition = null;
let isListening = false;
let autoSpeak = false;
let onTranscriptCallback = null;
let onStatusCallback = null;

// Language code mapping for SpeechRecognition (BCP-47 format)
const speechLangMap = {
  en: 'en-IN',
  hi: 'hi-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  pa: 'pa-IN',
  ur: 'ur-IN',
};

/**
 * Check if speech recognition is supported.
 */
export function isSpeechSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/**
 * Check if speech synthesis is supported.
 */
export function isTTSSupported() {
  return !!window.speechSynthesis;
}

/**
 * Initialize speech recognition.
 * @param {function} onTranscript - Called with transcript text when speech is recognized
 * @param {function} onStatus - Called with status updates ('listening', 'stopped', 'error')
 */
export function initSpeechRecognition(onTranscript, onStatus) {
  onTranscriptCallback = onTranscript;
  onStatusCallback = onStatus;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('SpeechRecognition not supported');
    return false;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (onTranscriptCallback) {
      onTranscriptCallback(transcript);
    }
  };

  recognition.onend = () => {
    isListening = false;
    if (onStatusCallback) onStatusCallback('stopped');
  };

  recognition.onerror = (event) => {
    console.warn('Speech recognition error:', event.error);
    isListening = false;

    if (event.error === 'not-allowed') {
      if (onStatusCallback) onStatusCallback('denied');
    } else {
      if (onStatusCallback) onStatusCallback('error');
    }
  };

  return true;
}

/**
 * Start listening for speech input.
 */
export function startListening() {
  if (!recognition) return;
  if (isListening) {
    stopListening();
    return;
  }

  const lang = getLanguage();
  recognition.lang = speechLangMap[lang] || 'en-IN';

  try {
    recognition.start();
    isListening = true;
    if (onStatusCallback) onStatusCallback('listening');
  } catch (err) {
    console.warn('Failed to start recognition:', err);
    if (onStatusCallback) onStatusCallback('error');
  }
}

/**
 * Stop listening.
 */
export function stopListening() {
  if (recognition && isListening) {
    recognition.stop();
    isListening = false;
    if (onStatusCallback) onStatusCallback('stopped');
  }
}

/**
 * Get current listening state.
 */
export function getListeningState() {
  return isListening;
}

/**
 * Speak text aloud using SpeechSynthesis.
 * @param {string} text - Text to speak
 */
export function speak(text) {
  if (!window.speechSynthesis || !autoSpeak) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean text: remove emojis and markdown artifacts
  const cleanText = text
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
    .replace(/[*_~`#]/g, '')
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  const lang = getLanguage();
  utterance.lang = speechLangMap[lang] || 'en-IN';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 0.9;

  // Try to find a voice for the language
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = speechLangMap[lang]?.split('-')[0] || 'en';
  const matchVoice = voices.find((v) => v.lang.startsWith(langPrefix));
  if (matchVoice) {
    utterance.voice = matchVoice;
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Speak text aloud on demand (ignores autoSpeak setting).
 * @param {string} text - Text to speak
 * @param {function} onEnd - Optional callback when speech finishes
 */
export function speakText(text, onEnd) {
  if (!window.speechSynthesis) {
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean text: remove emojis and markdown artifacts
  const cleanText = text
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
    .replace(/[*_~`#]/g, '')
    .trim();

  if (!cleanText) {
    if (onEnd) onEnd();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);
  const lang = getLanguage();
  utterance.lang = speechLangMap[lang] || 'en-IN';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 0.9;

  // Try to find a voice for the language
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = speechLangMap[lang]?.split('-')[0] || 'en';
  const matchVoice = voices.find((v) => v.lang.startsWith(langPrefix));
  if (matchVoice) {
    utterance.voice = matchVoice;
  }

  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Toggle auto-speak mode.
 */
export function toggleAutoSpeak() {
  autoSpeak = !autoSpeak;
  localStorage.setItem('weathergpt-autospeak', autoSpeak);

  if (!autoSpeak) {
    window.speechSynthesis?.cancel();
  }

  return autoSpeak;
}

/**
 * Get auto-speak state.
 */
export function getAutoSpeak() {
  return autoSpeak;
}

/**
 * Initialize auto-speak from localStorage.
 */
export function initAutoSpeak() {
  autoSpeak = localStorage.getItem('weathergpt-autospeak') === 'true';
  return autoSpeak;
}
