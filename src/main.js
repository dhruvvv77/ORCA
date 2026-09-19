/**
 * ORCA — App Entry Point
 * Initializes all modules and wires them together.
 */

import { sendMessage, setMapContext } from './chat.js';
import { initLanguage } from './translate.js';
import { initAutoSpeak, initSpeechRecognition, isSpeechSupported } from './voice.js';
import { renderApp, setInputValue, updateMicState } from './ui.js';

async function init() {
  const appEl = document.getElementById('app');
  if (!appEl) return;

  // Initialize language and voice settings
  initLanguage();
  initAutoSpeak();

  // Check server health and API key status
  try {
    const healthRes = await fetch('/api/health');
    const health = await healthRes.json();

    if (!health.keys?.groq || !health.keys?.owm) {
      console.warn('Some API keys are missing; map demo remains available.');
    }
  } catch (err) {
    console.warn('Health check failed — server may not be running:', err.message);
  }

  // Render the main application
  renderApp(appEl, {
    onSend: (text) => sendMessage(text),
    onSuggestion: (text) => sendMessage(text),
    onMapZoneChange: (zone, userLocation) => setMapContext(zone, userLocation),
  });

  // Initialize speech recognition
  if (isSpeechSupported()) {
    initSpeechRecognition(
      (transcript) => {
        setInputValue(transcript);
        sendMessage(transcript);
      },
      (status) => {
        updateMicState(status);
      }
    );
  }

  console.log('🌊 ORCA Marine Intelligence initialized');
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}