/**
 * WeatherGPT / ORCA — UI Components
 * Renders all visual elements via DOM manipulation.
 */

import { getWeatherIcon, getWeatherEmoji } from './weather-icons.js';
import { renderForecastChart } from './chart.js';
import { createMarineMap } from './marine-map.js';
import { LANGUAGES, getLanguage, setLanguage, getPlaceholder } from './translate.js';
import {
  isSpeechSupported,
  isTTSSupported,
  startListening,
  getListeningState,
  toggleAutoSpeak,
  getAutoSpeak,
  speakText,
} from './voice.js';

let chatAreaEl = null;
let inputFieldEl = null;
let sendBtnEl = null;
let micBtnEl = null;
let welcomeEl = null;
let onSendCallback = null;
let onSuggestionCallback = null;

let typingEl = null;
let activityInterval = null;
let chatDrawerEl = null;
let chatToggleEl = null;

const ACTIVITY_STAGES = [
  '🛰️ Querying Marine Satellite Telemetry...',
  '🌊 Analyzing Ocean SST & Chlorophyll-a Upwelling...',
  '🧭 Synthesizing Advisory & PFZ Coordinates...',
  '⚡ Finalizing Marine Recommendations...',
];

/**
 * Render the full application UI.
 */
export function renderApp(appEl, { onSend, onSuggestion, onMapZoneChange }) {
  onSendCallback = onSend;
  onSuggestionCallback = onSuggestion;

  appEl.innerHTML = '';
  appEl.appendChild(createHeader());

  const home = document.createElement('main');
  home.className = 'marine-home';
  home.id = 'marine-home';
  appEl.appendChild(home);

  chatDrawerEl = document.createElement('aside');
  chatDrawerEl.className = 'chat-drawer';
  chatDrawerEl.id = 'chat-drawer';
  chatDrawerEl.setAttribute('aria-label', 'Ask ORCA assistant');
  chatDrawerEl.innerHTML = `
    <div class="chat-drawer-header">
      <div><span class="chat-drawer-eyebrow">ORCA AI COPILOT</span><strong>Ask ORCA</strong></div>
      <button class="chat-drawer-close" type="button" aria-label="Close Ask ORCA">×</button>
    </div>`;
  chatAreaEl = createChatArea();
  chatDrawerEl.appendChild(chatAreaEl);
  chatDrawerEl.appendChild(createInputBar());
  appEl.appendChild(chatDrawerEl);

  chatToggleEl = document.createElement('button');
  chatToggleEl.className = 'ask-orca-fab';
  chatToggleEl.type = 'button';
  chatToggleEl.innerHTML = '<span>💬</span> Ask ORCA';
  chatToggleEl.setAttribute('aria-expanded', 'false');
  chatToggleEl.addEventListener('click', openChatPanel);
  appEl.appendChild(chatToggleEl);
  chatDrawerEl.querySelector('.chat-drawer-close').addEventListener('click', closeChatPanel);

  showWelcome();
  createMarineMap(home, {
    onAskOrca: (zone) => {
      openChatPanel();
      setInputValue(`Is ${zone.name} suitable for ${zone.likely_species[0]} today?`);
    },
    onZoneChange: onMapZoneChange,
  });
}

export function openChatPanel() {
  if (!chatDrawerEl) return;
  chatDrawerEl.classList.add('is-open');
  chatToggleEl?.setAttribute('aria-expanded', 'true');
  setTimeout(() => inputFieldEl?.focus(), 180);
}

function closeChatPanel() {
  chatDrawerEl?.classList.remove('is-open');
  chatToggleEl?.setAttribute('aria-expanded', 'false');
}

/**
 * Render the setup/configuration screen (missing API keys).
 */
export function renderSetupScreen(appEl, keyStatus) {
  appEl.innerHTML = '';
  appEl.appendChild(createHeader());

  const setup = document.createElement('div');
  setup.className = 'setup-screen';
  setup.innerHTML = `
    <div class="welcome-icon">🌊</div>
    <h2>Setup Required</h2>
    <p>ORCA needs API keys to work. Follow these steps to get started — both are free!</p>
    <div class="setup-steps">
      <div class="setup-step">
        <span class="setup-step-number">1</span>
        <span class="setup-step-title">Copy the env template</span>
        <div class="setup-step-desc">
          Run <code>copy .env.example .env</code> in the project root.
        </div>
      </div>
      <div class="setup-step" ${keyStatus?.groq ? 'style="opacity:0.5"' : ''}>
        <span class="setup-step-number">2</span>
        <span class="setup-step-title">Add your Groq API key ${keyStatus?.groq ? '✅' : ''}</span>
        <div class="setup-step-desc">
          Sign up at <a href="https://console.groq.com" target="_blank">console.groq.com</a> (free, no credit card).
          Copy your API key into <code>.env</code> as <code>GROQ_API_KEY</code>.
        </div>
      </div>
      <div class="setup-step" ${keyStatus?.owm ? 'style="opacity:0.5"' : ''}>
        <span class="setup-step-number">3</span>
        <span class="setup-step-title">Add your OpenWeatherMap API key ${keyStatus?.owm ? '✅' : ''}</span>
        <div class="setup-step-desc">
          Sign up at <a href="https://home.openweathermap.org/api_keys" target="_blank">openweathermap.org</a> (free tier).
          Copy your API key into <code>.env</code> as <code>OWM_API_KEY</code>.
        </div>
      </div>
      <div class="setup-step">
        <span class="setup-step-number">4</span>
        <span class="setup-step-title">Restart the server</span>
        <div class="setup-step-desc">
          Run <code>npm run dev</code> again and refresh this page.
        </div>
      </div>
    </div>
  `;

  appEl.appendChild(setup);
}

// --- Header ---
function createHeader() {
  const header = document.createElement('header');
  header.className = 'header';
  header.id = 'app-header';

  header.innerHTML = `
    <div class="header-brand">
      <div class="header-logo">🌊</div>
      <div>
        <div class="header-title">ORCA</div>
        <div class="header-subtitle">Marine Intelligence</div>
      </div>
    </div>
    <div class="header-agent-status" id="header-agent-status" title="ORCA Marine Telemetry Core · Active">
      <span class="status-pulse-dot"></span>
      <span class="status-text">Marine Core Active</span>
    </div>
    <div class="header-controls">
      ${createLangPicker()}
      ${isTTSSupported() ? createVoiceToggle() : ''}
    </div>
  `;

  // Bind language picker
  setTimeout(() => {
    const picker = header.querySelector('#lang-picker');
    if (picker) {
      picker.value = getLanguage();
      picker.addEventListener('change', (e) => {
        setLanguage(e.target.value);
        if (inputFieldEl) {
          inputFieldEl.placeholder = getPlaceholder();
        }
      });
    }

    const voiceToggle = header.querySelector('#voice-toggle');
    if (voiceToggle) {
      voiceToggle.addEventListener('click', () => {
        const active = toggleAutoSpeak();
        voiceToggle.classList.toggle('active', active);
        voiceToggle.title = active ? 'Auto-speak: ON' : 'Auto-speak: OFF';
      });
    }
  }, 0);

  return header;
}

/**
 * Set header telemetry status indicator
 */
export function setAgentStatus(statusText, isWorking = false) {
  const statusEl = document.getElementById('header-agent-status');
  if (!statusEl) return;
  const dot = statusEl.querySelector('.status-pulse-dot');
  const text = statusEl.querySelector('.status-text');
  if (dot) {
    dot.className = isWorking ? 'status-pulse-dot scanning' : 'status-pulse-dot';
  }
  if (text) {
    text.textContent = statusText;
  }
}

function createLangPicker() {
  const options = Object.entries(LANGUAGES)
    .map(([code, name]) => `<option value="${code}">${name}</option>`)
    .join('');
  return `<select id="lang-picker" class="lang-picker" aria-label="Language">${options}</select>`;
}

function createVoiceToggle() {
  const active = getAutoSpeak();
  return `<button id="voice-toggle" class="voice-toggle-btn ${active ? 'active' : ''}" 
    title="${active ? 'Auto-speak: ON' : 'Auto-speak: OFF'}" aria-label="Toggle voice output">
    🔊
  </button>`;
}

// --- Chat Area ---
function createChatArea() {
  const area = document.createElement('div');
  area.className = 'chat-area';
  area.id = 'chat-area';
  return area;
}

// --- Welcome Screen ---
function showWelcome() {
  if (!chatAreaEl) return;

  welcomeEl = document.createElement('div');
  welcomeEl.className = 'welcome';
  welcomeEl.id = 'welcome-screen';

  const suggestions = [
    {
      icon: '🎣',
      category: 'Potential Fishing Zones',
      prompt: 'Show PFZ zones in Maharashtra',
      desc: 'Satellite SST & Chlorophyll-a pelagic hotspots',
    },
    {
      icon: '🌊',
      category: 'Ocean & Sea State',
      prompt: 'What are ocean conditions near Chennai?',
      desc: 'Wave swell, sea temperature & tidal currents',
    },
    {
      icon: '🧭',
      category: 'Navigational Safety',
      prompt: 'Is it safe to go fishing today?',
      desc: 'Coastal hazard alerts, high wave & squall checks',
    },
    {
      icon: '🐟',
      category: 'Target Species Advice',
      prompt: 'Where can I fish today near Mumbai?',
      desc: 'Tuna, Mackerel & Pomfret location forecast',
    },
  ];

  welcomeEl.innerHTML = `
    <div class="welcome-icon">🌊</div>
    <h2>ORCA Marine Intelligence</h2>
    <p>AI-powered operational console for coastal navigation, Potential Fishing Zones (PFZ), satellite oceanography, and maritime safety.</p>
    <div class="welcome-suggestions-grid">
      ${suggestions.map((s) => `
        <button class="suggestion-chip-card" data-prompt="${s.prompt}">
          <div class="chip-card-top">
            <span class="chip-card-icon">${s.icon}</span>
            <span class="chip-card-badge">${s.category}</span>
          </div>
          <div class="chip-card-prompt">${s.prompt}</div>
          <div class="chip-card-desc">${s.desc}</div>
        </button>
      `).join('')}
    </div>
  `;

  // Bind suggestion clicks
  setTimeout(() => {
    welcomeEl.querySelectorAll('.suggestion-chip-card').forEach((chip) => {
      chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt') || chip.textContent;
        if (onSuggestionCallback) {
          onSuggestionCallback(prompt);
        }
      });
    });
  }, 0);

  chatAreaEl.appendChild(welcomeEl);
}

function hideWelcome() {
  if (welcomeEl) {
    welcomeEl.remove();
    welcomeEl = null;
  }
}

// --- Input Bar ---
function createInputBar() {
  const bar = document.createElement('div');
  bar.className = 'input-bar';
  bar.id = 'input-bar';

  const wrapper = document.createElement('div');
  wrapper.className = 'input-wrapper';

  inputFieldEl = document.createElement('textarea');
  inputFieldEl.className = 'input-field';
  inputFieldEl.id = 'message-input';
  inputFieldEl.placeholder = getPlaceholder();
  inputFieldEl.rows = 1;
  inputFieldEl.setAttribute('aria-label', 'Message input');

  // Auto-resize
  inputFieldEl.addEventListener('input', () => {
    inputFieldEl.style.height = 'auto';
    inputFieldEl.style.height = Math.min(inputFieldEl.scrollHeight, 120) + 'px';
  });

  // Send on Enter (Shift+Enter for new line)
  inputFieldEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  wrapper.appendChild(inputFieldEl);

  // Mic button
  if (isSpeechSupported()) {
    micBtnEl = document.createElement('button');
    micBtnEl.className = 'input-btn mic-btn';
    micBtnEl.id = 'mic-btn';
    micBtnEl.innerHTML = '🎤';
    micBtnEl.title = 'Voice input';
    micBtnEl.setAttribute('aria-label', 'Voice input');
    micBtnEl.addEventListener('click', () => {
      startListening();
    });
  }

  // Send button
  sendBtnEl = document.createElement('button');
  sendBtnEl.className = 'input-btn send-btn';
  sendBtnEl.id = 'send-btn';
  sendBtnEl.innerHTML = '➤';
  sendBtnEl.title = 'Send message';
  sendBtnEl.setAttribute('aria-label', 'Send message');
  sendBtnEl.addEventListener('click', handleSend);

  bar.appendChild(wrapper);
  if (micBtnEl) bar.appendChild(micBtnEl);
  bar.appendChild(sendBtnEl);

  return bar;
}

function handleSend() {
  const text = inputFieldEl?.value?.trim();
  if (!text || !onSendCallback) return;

  inputFieldEl.value = '';
  inputFieldEl.style.height = 'auto';
  onSendCallback(text);
}

// --- Public API ---

/**
 * Add a message bubble to the chat.
 */
export function addMessage(role, content, data = {}) {
  hideWelcome();
  if (!chatAreaEl) return;

  const msg = document.createElement('div');
  msg.className = `message ${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = role === 'user' ? '👤' : '🌊';

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'message-content';

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.innerHTML = formatMessageContent(content);

  // Per-message action bar for assistant responses (Copy + Speak)
  if (role === 'assistant' && content) {
    const actionsBar = document.createElement('div');
    actionsBar.className = 'msg-actions-bar';

    if (isTTSSupported()) {
      const speakBtn = document.createElement('button');
      speakBtn.className = 'msg-action-btn msg-speak-btn';
      speakBtn.innerHTML = '🔊';
      speakBtn.title = 'Listen to this response';
      speakBtn.setAttribute('aria-label', 'Listen to this response');
      speakBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        speakBtn.classList.add('speaking');
        speakText(content, () => {
          speakBtn.classList.remove('speaking');
        });
      });
      actionsBar.appendChild(speakBtn);
    }

    const copyBtn = document.createElement('button');
    copyBtn.className = 'msg-action-btn msg-copy-btn';
    copyBtn.innerHTML = '📋';
    copyBtn.title = 'Copy response text';
    copyBtn.setAttribute('aria-label', 'Copy response text');
    copyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(content).then(() => {
        copyBtn.innerHTML = '✓';
        copyBtn.classList.add('btn-copied');
        setTimeout(() => {
          copyBtn.innerHTML = '📋';
          copyBtn.classList.remove('btn-copied');
        }, 1500);
      });
    });
    actionsBar.appendChild(copyBtn);

    bubble.appendChild(actionsBar);
  }

  const time = document.createElement('div');
  time.className = 'message-time';
  time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  contentWrapper.appendChild(bubble);

  // Weather card
  if (data.weatherData) {
    contentWrapper.appendChild(createWeatherCard(data.weatherData));
  }

  // AQI card
  if (data.airQualityData) {
    contentWrapper.appendChild(createAQICard(data.airQualityData));
  }

  // Map controller instance (for linking PFZ cards to map)
  let mapController = null;
  const hasMapData = data.coordinates || (data.pfzData && data.pfzData.zones && data.pfzData.zones.length > 0);
  if (hasMapData) {
    const mapCoords = data.coordinates || (data.pfzData?.zones?.[0]?.coordinates);
    if (mapCoords) {
      mapController = createMapToggle(mapCoords, data.weatherData?.city || data.forecastData?.city || '', data.pfzData);
    }
  }

  // PFZ cards
  const pfzCardEls = [];
  if (data.pfzData && data.pfzData.zones) {
    data.pfzData.zones.forEach((zone) => {
      const card = createPFZCard(zone, data.pfzData.source, mapController, pfzCardEls);
      pfzCardEls.push(card);
      contentWrapper.appendChild(card);
    });
  }

  // Forecast chart
  if (data.forecastData) {
    contentWrapper.appendChild(createForecastChartContainer(data.forecastData));
  }

  // Map toggle container
  if (mapController) {
    contentWrapper.appendChild(mapController.element);
  }

  // Follow-up suggestion chips
  if (role === 'assistant') {
    const followup = createFollowupSuggestions(data);
    if (followup) {
      contentWrapper.appendChild(followup);
    }
  }

  contentWrapper.appendChild(time);

  msg.appendChild(avatar);
  msg.appendChild(contentWrapper);
  chatAreaEl.appendChild(msg);
  scrollToBottom();
}

/**
 * Show/hide the typing and agent telemetry activity indicator.
 */
export function showTyping() {
  hideWelcome();
  if (typingEl || !chatAreaEl) return;

  setAgentStatus('Scanning Ocean Telemetry...', true);

  typingEl = document.createElement('div');
  typingEl.className = 'typing-indicator agent-activity-card';

  let stageIndex = 0;
  typingEl.innerHTML = `
    <div class="activity-sonar-wrapper">
      <div class="message-avatar sonar-avatar">🌊</div>
      <div class="sonar-ring sonar-ring-1"></div>
      <div class="sonar-ring sonar-ring-2"></div>
    </div>
    <div class="activity-body">
      <div class="activity-top-row">
        <span class="activity-badge">ORCA AGENT TELEMETRY</span>
        <div class="activity-wave-bars">
          <span class="wave-bar"></span>
          <span class="wave-bar"></span>
          <span class="wave-bar"></span>
          <span class="wave-bar"></span>
          <span class="wave-bar"></span>
        </div>
      </div>
      <div class="activity-status-text" id="activity-status-text">
        ${ACTIVITY_STAGES[0]}
      </div>
    </div>
  `;

  chatAreaEl.appendChild(typingEl);
  scrollToBottom();

  if (activityInterval) clearInterval(activityInterval);
  activityInterval = setInterval(() => {
    stageIndex = (stageIndex + 1) % ACTIVITY_STAGES.length;
    const statusTextEl = document.getElementById('activity-status-text');
    if (statusTextEl) {
      statusTextEl.classList.remove('status-fade-in');
      void statusTextEl.offsetWidth; // trigger reflow
      statusTextEl.textContent = ACTIVITY_STAGES[stageIndex];
      statusTextEl.classList.add('status-fade-in');
    }
  }, 1300);
}

export function hideTyping() {
  if (activityInterval) {
    clearInterval(activityInterval);
    activityInterval = null;
  }
  setAgentStatus('Marine Core Active', false);

  if (typingEl) {
    typingEl.remove();
    typingEl = null;
  }
}

/**
 * Show an error message.
 */
export function showError(message) {
  hideTyping();
  if (!chatAreaEl) return;

  const err = document.createElement('div');
  err.className = 'message assistant';
  err.innerHTML = `
    <div class="message-avatar" style="background: var(--accent-gradient);">🌊</div>
    <div class="message-content">
      <div class="error-message">⚠️ ${message}</div>
      <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  `;

  chatAreaEl.appendChild(err);
  scrollToBottom();
}

/**
 * Set input disabled state (during API calls).
 */
export function setInputDisabled(disabled) {
  if (inputFieldEl) inputFieldEl.disabled = disabled;
  if (sendBtnEl) sendBtnEl.disabled = disabled;
  if (micBtnEl) micBtnEl.disabled = disabled;
}

/**
 * Set the input field value (e.g., from voice transcript).
 */
export function setInputValue(text) {
  if (inputFieldEl) {
    inputFieldEl.value = text;
    inputFieldEl.style.height = 'auto';
    inputFieldEl.style.height = Math.min(inputFieldEl.scrollHeight, 120) + 'px';
    inputFieldEl.focus();
  }
}

/**
 * Update mic button state.
 */
export function updateMicState(state) {
  if (!micBtnEl) return;

  switch (state) {
    case 'listening':
      micBtnEl.classList.add('recording');
      micBtnEl.innerHTML = '⏹️';
      break;
    case 'stopped':
    case 'error':
    case 'denied':
      micBtnEl.classList.remove('recording');
      micBtnEl.innerHTML = '🎤';
      break;
  }
}

// --- Helper Components ---

function formatMessageContent(text) {
  if (!text) return '';
  // Basic markdown: bold, italic, newlines
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

function createWeatherCard(data) {
  const card = document.createElement('div');
  card.className = 'weather-card';

  const icon = data.weather?.icon || '03d';
  const emoji = getWeatherEmoji(icon);

  card.innerHTML = `
    <div class="weather-card-header">
      <div>
        <div class="weather-card-city">${data.city || ''}${data.country ? ', ' + data.country : ''}</div>
        <div class="weather-card-condition">${data.weather?.description || ''}</div>
      </div>
    </div>
    <div class="weather-card-main">
      <div class="weather-card-temp">${data.temperature?.current ?? '--'}°C</div>
      <div class="weather-card-icon">${emoji}</div>
    </div>
    <div class="weather-card-details">
      <div class="weather-detail">
        <div class="weather-detail-label">Feels Like</div>
        <div class="weather-detail-value">${data.temperature?.feels_like ?? '--'}°C</div>
      </div>
      <div class="weather-detail">
        <div class="weather-detail-label">Humidity</div>
        <div class="weather-detail-value">${data.humidity ?? '--'}%</div>
      </div>
      <div class="weather-detail">
        <div class="weather-detail-label">Wind</div>
        <div class="weather-detail-value">${data.wind?.speed ?? '--'} m/s</div>
      </div>
      ${data.visibility != null ? `
      <div class="weather-detail">
        <div class="weather-detail-label">Visibility</div>
        <div class="weather-detail-value">${data.visibility} km</div>
      </div>` : ''}
      ${data.sunrise ? `
      <div class="weather-detail">
        <div class="weather-detail-label">Sunrise</div>
        <div class="weather-detail-value">${data.sunrise}</div>
      </div>` : ''}
      ${data.sunset ? `
      <div class="weather-detail">
        <div class="weather-detail-label">Sunset</div>
        <div class="weather-detail-value">${data.sunset}</div>
      </div>` : ''}
    </div>
  `;

  return card;
}

function createAQICard(data) {
  const card = document.createElement('div');
  card.className = 'aqi-card';

  const aqiClass = {
    1: 'aqi-good',
    2: 'aqi-fair',
    3: 'aqi-moderate',
    4: 'aqi-poor',
    5: 'aqi-very-poor',
  }[data.aqi?.index] || 'aqi-moderate';

  card.innerHTML = `
    <div class="aqi-header">
      <div class="weather-card-city">Air Quality — ${data.city || ''}</div>
      <span class="aqi-badge ${aqiClass}">${data.aqi?.label || 'Unknown'}</span>
    </div>
    <div class="aqi-pollutants">
      ${data.pollutants?.pm2_5 != null ? `
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">PM2.5</div>
        <div class="aqi-pollutant-value">${data.pollutants.pm2_5}</div>
      </div>` : ''}
      ${data.pollutants?.pm10 != null ? `
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">PM10</div>
        <div class="aqi-pollutant-value">${data.pollutants.pm10}</div>
      </div>` : ''}
      ${data.pollutants?.no2 != null ? `
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">NO₂</div>
        <div class="aqi-pollutant-value">${data.pollutants.no2}</div>
      </div>` : ''}
      ${data.pollutants?.o3 != null ? `
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">O₃</div>
        <div class="aqi-pollutant-value">${data.pollutants.o3}</div>
      </div>` : ''}
      ${data.pollutants?.co != null ? `
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">CO</div>
        <div class="aqi-pollutant-value">${data.pollutants.co}</div>
      </div>` : ''}
      ${data.pollutants?.so2 != null ? `
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">SO₂</div>
        <div class="aqi-pollutant-value">${data.pollutants.so2}</div>
      </div>` : ''}
    </div>
  `;

  return card;
}

/**
 * Rich Interactive PFZ Marine Card
 */
function createPFZCard(zone, source, mapController, pfzCardEls) {
  const card = document.createElement('div');
  card.className = 'pfz-card';

  // Confidence badge
  const conf = zone.confidence ?? 0.7;
  const confClass = conf >= 0.8 ? 'pfz-conf-high' : conf >= 0.6 ? 'pfz-conf-moderate' : 'pfz-conf-low';
  const confLabel = zone.confidence_label || (conf >= 0.8 ? 'High' : conf >= 0.6 ? 'Moderate' : 'Low');
  const confPct = Math.round(conf * 100);

  const coords = zone.coordinates;
  const coordDisplay = coords ? `${coords.lat.toFixed(2)}°N, ${coords.lon.toFixed(2)}°E` : '';
  const rawCoordStr = coords ? `${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}` : '';

  const sstVal = zone.conditions?.sst_celsius;
  const chlVal = zone.conditions?.chlorophyll_mg_m3;
  const windVal = zone.conditions?.wind_speed_knots;
  const depth = zone.depth_range_m;
  const speciesList = zone.likely_species || [];

  card.innerHTML = `
    <div class="pfz-card-header">
      <div class="pfz-header-left">
        <div class="pfz-card-title">🎣 ${zone.name || 'PFZ Zone'}</div>
        <div class="pfz-card-location">📍 ${zone.state || 'Indian Ocean Coast'}${coordDisplay ? ' · ' + coordDisplay : ''}</div>
      </div>
      <div class="pfz-conf-badge-wrapper">
        <span class="pfz-conf-badge ${confClass}">● ${confLabel} (${confPct}%)</span>
      </div>
    </div>

    ${zone.advisory ? `
    <div class="pfz-advisory">
      <span class="advisory-icon">🧭</span>
      <div class="advisory-text">${zone.advisory}</div>
    </div>` : ''}

    <div class="pfz-telemetry-grid">
      ${sstVal != null ? `
      <div class="pfz-telemetry-item sst-item">
        <div class="tel-header">
          <span class="tel-label">🌡️ SST</span>
          <span class="tel-value">${sstVal}°C</span>
        </div>
        <div class="tel-bar"><div class="tel-bar-fill sst-fill" style="width: ${Math.min(100, Math.max(15, ((sstVal - 20) / 14) * 100))}%;"></div></div>
        <div class="tel-sub">Optimal Pelagic (26–29°C)</div>
      </div>` : ''}

      ${chlVal != null ? `
      <div class="pfz-telemetry-item chl-item">
        <div class="tel-header">
          <span class="tel-label">🌿 Chlorophyll</span>
          <span class="tel-value">${chlVal} mg/m³</span>
        </div>
        <div class="tel-bar"><div class="tel-bar-fill chl-fill" style="width: ${Math.min(100, Math.max(15, (chlVal / 0.8) * 100))}%;"></div></div>
        <div class="tel-sub">Phytoplankton Bloom</div>
      </div>` : ''}

      ${windVal != null ? `
      <div class="pfz-telemetry-item wind-item">
        <div class="tel-header">
          <span class="tel-label">💨 Sea Wind</span>
          <span class="tel-value">${windVal} kt</span>
        </div>
        <div class="tel-bar"><div class="tel-bar-fill wind-fill" style="width: ${Math.min(100, Math.max(15, (windVal / 28) * 100))}%;"></div></div>
        <div class="tel-sub">${windVal > 18 ? 'Caution · Gusty Swell' : 'Calm · Favorable Seas'}</div>
      </div>` : ''}

      ${depth ? `
      <div class="pfz-telemetry-item depth-item">
        <div class="tel-header">
          <span class="tel-label">📏 Bathymetry</span>
          <span class="tel-value">${depth.min}–${depth.max} m</span>
        </div>
        <div class="tel-bar"><div class="tel-bar-fill depth-fill" style="width: ${Math.min(100, (depth.max / 90) * 100)}%;"></div></div>
        <div class="tel-sub">Continental Shelf Zone</div>
      </div>` : ''}
    </div>

    ${speciesList.length > 0 ? `
    <div class="pfz-species-section">
      <div class="pfz-section-title">🐟 Target Species (Click to query advice):</div>
      <div class="pfz-species-pills">
        ${speciesList.map((sp) => `<button class="pfz-species-pill" type="button" data-species="${sp}">🐟 ${sp}</button>`).join('')}
      </div>
    </div>` : ''}

    <div class="pfz-card-actions">
      ${coords && mapController ? `
      <button class="pfz-action-btn pfz-btn-map" type="button">
        🗺️ Focus Zone on Map
      </button>` : ''}
      ${coords ? `
      <button class="pfz-action-btn pfz-btn-gps" type="button" data-gps="${rawCoordStr}">
        📋 Copy GPS
      </button>` : ''}
      <button class="pfz-action-btn pfz-btn-weather" type="button">
        🌤️ Sea Weather
      </button>
    </div>

    <div class="pfz-source-tag">${source || 'ORCA Mock Data'}</div>
  `;

  // Focus map action
  const triggerFocus = () => {
    if (mapController && coords) {
      if (pfzCardEls) {
        pfzCardEls.forEach((c) => c.classList.remove('pfz-card--active'));
      }
      card.classList.add('pfz-card--active');
      mapController.focusZone(coords.lat, coords.lon, zone.name);
    }
  };

  const mapBtn = card.querySelector('.pfz-btn-map');
  if (mapBtn) {
    mapBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerFocus();
    });
  }

  // Entire card click activates map focus
  card.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    triggerFocus();
  });

  // Species pills click
  card.querySelectorAll('.pfz-species-pill').forEach((pill) => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      const sp = pill.getAttribute('data-species');
      if (onSuggestionCallback) {
        onSuggestionCallback(`What is the recommended gear, depth, and technique for catching ${sp} in ${zone.name || 'this zone'}?`);
      }
    });
  });

  // Copy GPS button
  const gpsBtn = card.querySelector('.pfz-btn-gps');
  if (gpsBtn && rawCoordStr) {
    gpsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(rawCoordStr).then(() => {
        const originalText = gpsBtn.innerHTML;
        gpsBtn.innerHTML = '✓ Copied!';
        gpsBtn.classList.add('btn-copied');
        setTimeout(() => {
          gpsBtn.innerHTML = originalText;
          gpsBtn.classList.remove('btn-copied');
        }, 1800);
      });
    });
  }

  // Sea Weather button
  const weatherBtn = card.querySelector('.pfz-btn-weather');
  if (weatherBtn) {
    weatherBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onSuggestionCallback) {
        onSuggestionCallback(`What are the wind and ocean conditions at ${zone.name || 'this location'}?`);
      }
    });
  }

  return card;
}

function createForecastChartContainer(forecastData) {
  const container = document.createElement('div');
  container.className = 'forecast-chart-container';

  const title = document.createElement('div');
  title.className = 'forecast-chart-title';
  title.textContent = `📊 ${forecastData.forecast?.length || 5}-Day Forecast — ${forecastData.city || ''}`;
  container.appendChild(title);

  const chartWrapper = document.createElement('div');
  chartWrapper.style.height = '180px';
  chartWrapper.style.position = 'relative';
  container.appendChild(chartWrapper);

  // Render chart after DOM insertion
  setTimeout(() => {
    renderForecastChart(chartWrapper, forecastData);
  }, 100);

  return container;
}

/**
 * Create Map Toggle with Leaflet and Controller API
 */
function createMapToggle(coordinates, cityName, pfzData) {
  const wrapper = document.createElement('div');
  wrapper.className = 'map-wrapper';

  const hasPfz = pfzData && pfzData.zones && pfzData.zones.length > 0;
  const btn = document.createElement('button');
  btn.className = 'map-toggle-btn';
  btn.innerHTML = hasPfz ? '🗺️ Show PFZ zones on map' : '📍 Show on map';
  btn.setAttribute('aria-label', 'Show location on map');

  let mapVisible = false;
  let mapContainer = null;
  let leafletMap = null;
  const markerRegistry = [];

  function openMap() {
    if (mapVisible) return;

    mapContainer = document.createElement('div');
    mapContainer.className = 'map-container';
    if (hasPfz) mapContainer.classList.add('map-container--pfz');
    wrapper.appendChild(mapContainer);

    // Initialize Leaflet map
    if (window.L) {
      leafletMap = L.map(mapContainer, {
        zoomControl: true,
        attributionControl: false,
      }).setView([coordinates.lat, coordinates.lon], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(leafletMap);

      const boundsGroup = L.featureGroup();

      // City / weather marker
      if (cityName) {
        const cityMarker = L.marker([coordinates.lat, coordinates.lon])
          .bindPopup(`<b>${cityName}</b>`);
        cityMarker.addTo(leafletMap);
        boundsGroup.addLayer(cityMarker);
      }

      // PFZ zone markers
      if (hasPfz) {
        pfzData.zones.forEach((zone) => {
          if (!zone.coordinates) return;
          const { lat, lon } = zone.coordinates;

          const confPct = Math.round((zone.confidence || 0) * 100);
          const confLabel = zone.confidence_label || (zone.confidence >= 0.8 ? 'High' : zone.confidence >= 0.6 ? 'Moderate' : 'Low');
          const confColor = zone.confidence >= 0.8 ? '#4ade80' : zone.confidence >= 0.6 ? '#facc15' : '#f87171';

          const speciesStr = zone.likely_species && zone.likely_species.length
            ? zone.likely_species.join(', ')
            : '—';
          const sst = zone.conditions?.sst_celsius != null ? zone.conditions.sst_celsius + '°C' : '—';
          const chl = zone.conditions?.chlorophyll_mg_m3 != null ? zone.conditions.chlorophyll_mg_m3 + ' mg/m³' : '—';

          const popupHtml = `
            <div class="pfz-popup">
              <div class="pfz-popup-title">🎣 ${zone.name || 'PFZ Zone'}</div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">Confidence</span><span style="color:${confColor};font-weight:600">${confLabel} (${confPct}%)</span></div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">Species</span><span>🐟 ${speciesStr}</span></div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">SST</span><span>🌡️ ${sst}</span></div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">Chlorophyll</span><span>🌿 ${chl}</span></div>
              <div class="pfz-popup-source">ORCA Mock Data</div>
            </div>`;

          const pfzMarker = L.circleMarker([lat, lon], {
            radius: 11,
            fillColor: '#14b8a6',
            fillOpacity: 0.9,
            color: '#ffffff',
            weight: 2,
          }).bindPopup(popupHtml, { className: 'pfz-leaflet-popup', maxWidth: 260 });

          pfzMarker.addTo(leafletMap);
          boundsGroup.addLayer(pfzMarker);

          markerRegistry.push({
            zoneName: zone.name,
            lat,
            lon,
            marker: pfzMarker,
          });
        });
      }

      // Fit bounds to show all markers
      if (boundsGroup.getLayers().length > 1) {
        setTimeout(() => {
          leafletMap.fitBounds(boundsGroup.getBounds().pad(0.15));
        }, 250);
      } else if (!cityName && hasPfz) {
        leafletMap.setView([coordinates.lat, coordinates.lon], 9);
      }

      setTimeout(() => leafletMap.invalidateSize(), 200);
    }

    btn.innerHTML = hasPfz ? '🗺️ Hide map' : '📍 Hide map';
    mapVisible = true;
  }

  function closeMap() {
    if (!mapVisible) return;
    if (mapContainer) mapContainer.remove();
    mapContainer = null;
    leafletMap = null;
    markerRegistry.length = 0;
    btn.innerHTML = hasPfz ? '🗺️ Show PFZ zones on map' : '📍 Show on map';
    mapVisible = false;
  }

  btn.addEventListener('click', () => {
    if (mapVisible) {
      closeMap();
    } else {
      openMap();
    }
  });

  wrapper.appendChild(btn);

  return {
    element: wrapper,
    openMap,
    focusZone: (lat, lon, zoneName) => {
      if (!mapVisible) {
        openMap();
      }
      setTimeout(() => {
        if (leafletMap) {
          leafletMap.flyTo([lat, lon], 11, { duration: 0.8 });
          const target = markerRegistry.find((m) =>
            (zoneName && m.zoneName === zoneName) ||
            (Math.abs(m.lat - lat) < 0.005 && Math.abs(m.lon - lon) < 0.005)
          );
          if (target) {
            target.marker.openPopup();
          }
        }
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    },
  };
}

/**
 * Dynamic Follow-Up Suggestion Chips for Assistant Messages
 */
function createFollowupSuggestions(data) {
  let suggestions = [];
  if (data.pfzData && data.pfzData.zones && data.pfzData.zones.length > 0) {
    suggestions = [
      '🧭 Is navigation safe in these zones today?',
      '💨 Wind & wave swell forecast for these zones',
      '🎣 Recommended fishing gear & depth',
    ];
  } else if (data.weatherData) {
    const city = data.weatherData.city || 'this area';
    suggestions = [
      `🎣 Show PFZ zones near ${city}`,
      '🌊 Ocean swell and wave height',
      `📊 5-day marine forecast for ${city}`,
    ];
  } else {
    return null;
  }

  const container = document.createElement('div');
  container.className = 'followup-suggestions';
  container.innerHTML = `
    <div class="followup-title">⚡ Quick Marine Follow-ups</div>
    <div class="followup-chips">
      ${suggestions.map((text) => `<button class="followup-chip" type="button">${text}</button>`).join('')}
    </div>
  `;

  container.querySelectorAll('.followup-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      if (onSuggestionCallback) {
        onSuggestionCallback(chip.textContent);
      }
    });
  });

  return container;
}

function scrollToBottom() {
  if (chatAreaEl) {
    requestAnimationFrame(() => {
      chatAreaEl.scrollTop = chatAreaEl.scrollHeight;
    });
  }
}
