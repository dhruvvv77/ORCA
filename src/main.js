/**
 * WeatherGPT — App Entry Point
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
      // The command map is powered by the existing local mock advisories and
      // remains demo-ready without keys. Chat will retain its existing setup
      // error if an API-backed question is sent before keys are configured.
      console.warn('Some API keys are missing; map demo remains available.');
    }
  } catch (err) {
    // Server not running — still render the app, errors will show in chat
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
      // On transcript received
      (transcript) => {
        setInputValue(transcript);
        // Auto-send after voice input
        sendMessage(transcript);
      },
      // On status change
      (status) => {
        updateMicState(status);
      }
    );
  }

  console.log('🌊 ORCA initialized');
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
