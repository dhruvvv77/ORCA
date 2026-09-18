/**
 * WeatherGPT — Chat Engine
 * Manages conversation state and API communication.
 */

import { getLanguage } from './translate.js';
import { speak } from './voice.js';
import {
  addMessage,
  showTyping,
  hideTyping,
  showError,
  setInputDisabled,
} from './ui.js';

// Conversation history (sent to backend for context)
const history = [];
const MAX_HISTORY = 20;
let mapContext = null;

function getDistanceKm(from, to) {
  if (!from || !to) return null;
  const radians = Math.PI / 180;
  const lat = (to.lat - from.lat) * radians;
  const lon = (to.lon - from.lon) * radians;
  const a = Math.sin(lat / 2) ** 2 + Math.cos(from.lat * radians) * Math.cos(to.lat * radians) * Math.sin(lon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Keep the active home-map zone available to the existing chat request flow. */
export function setMapContext(zone, userLocation) {
  if (!zone) {
    mapContext = null;
    return;
  }
  mapContext = {
    zoneName: zone.name,
    state: zone.state,
    coordinates: zone.coordinates,
    confidence: zone.confidence,
    targetSpecies: zone.likely_species,
    sstCelsius: zone.sst_celsius,
    chlorophyllMgM3: zone.chlorophyll_mg_m3,
    windKnots: zone.wind_speed_knots,
    waveHeightM: zone.ocean?.wave?.significant_height_m ?? null,
    riskStatus: zone.risk?.label,
    userLocation: userLocation || null,
    distanceKm: getDistanceKm(userLocation, zone.coordinates),
    source: 'ORCA existing mock PFZ/ocean advisory',
  };
}

/**
 * Send a user message and get an assistant response.
 * @param {string} text - The user's message text
 */
export async function sendMessage(text) {
  if (!text.trim()) return;

  const language = getLanguage();

  // Show user message immediately
  addMessage('user', text);

  // Add to history (keep it lean — only role + content)
  history.push({ role: 'user', content: text });
  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }

  // Disable input and show typing
  setInputDisabled(true);
  showTyping();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        language,
        mapContext,
        history: history.slice(0, -1), // Don't double-send current message
      }),
    });

    hideTyping();

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));

      if (response.status === 401) {
        showError(errData.error || 'API keys not configured. Check your .env file.');
      } else {
        showError(errData.error || 'Something went wrong. Please try again.');
      }
      return;
    }

    const data = await response.json();

    // Show assistant response with any attached data
    addMessage('assistant', data.reply, {
      weatherData: data.weatherData,
      forecastData: data.forecastData,
      airQualityData: data.airQualityData,
      pfzData: data.pfzData,
      coordinates: data.coordinates,
    });

    // Add assistant reply to history
    history.push({ role: 'assistant', content: data.reply });

    // Speak the response if auto-speak is enabled
    speak(data.originalReply || data.reply);
  } catch (err) {
    hideTyping();

    if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
      showError('Cannot connect to the server. Make sure the backend is running (npm run dev).');
    } else {
      showError('An unexpected error occurred. Please try again.');
    }

    console.error('Chat error:', err);
  } finally {
    setInputDisabled(false);
  }
}

/**
 * Clear conversation history.
 */
export function clearHistory() {
  history.length = 0;
}
