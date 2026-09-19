/**
 * ORCA — UI Components
 * Renders all visual elements via DOM manipulation.
 * Premium marine intelligence interface.
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
let intelligencePanelEl = null;
let panelToggleBtn = null;
let headerAskOrcaBtn = null;

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

  // Main map area
  const main = document.createElement('main');
  main.className = 'marine-main';
  main.id = 'marine-main';
  appEl.appendChild(main);

  const mapViewport = document.createElement('section');
  mapViewport.className = 'map-viewport';
  mapViewport.id = 'map-viewport';
  mapViewport.setAttribute('aria-label', 'ORCA Marine Operations Map');
  main.appendChild(mapViewport);

  // Intelligence Panel (right sidebar) — starts collapsed for clean uncluttered view
  intelligencePanelEl = document.createElement('aside');
  intelligencePanelEl.className = 'intelligence-panel collapsed';
  intelligencePanelEl.id = 'intelligence-panel';
  intelligencePanelEl.setAttribute('aria-label', 'Zone Intelligence Panel');
  intelligencePanelEl.innerHTML = `
    <header class="panel-header">
      <div class="panel-title-row">
        <span class="panel-kicker">SELECTED PFZ</span>
        <h2 class="panel-title">Zone Intelligence</h2>
      </div>
      <button type="button" class="panel-close" aria-label="Close intelligence panel" title="Close panel">✕</button>
    </header>
    <div class="panel-content" id="panel-content">
      <div class="zone-empty">
        <span class="zone-empty-icon">🎣</span>
        <strong class="zone-empty-title">Select a PFZ Zone</strong>
        <p class="zone-empty-desc">Tap a coloured marine zone on the map to see fish, safety and ocean telemetry.</p>
      </div>
    </div>
    <div class="data-status-bar" id="data-status-bar" aria-live="polite"></div>
  `;
  appEl.appendChild(intelligencePanelEl);

  // Chat Backdrop
  const chatBackdropEl = document.createElement('div');
  chatBackdropEl.className = 'chat-drawer-backdrop';
  chatBackdropEl.id = 'chat-drawer-backdrop';
  chatBackdropEl.addEventListener('click', closeChatPanel);
  appEl.appendChild(chatBackdropEl);

  // Chat Drawer (Ask ORCA)
  chatDrawerEl = document.createElement('aside');
  chatDrawerEl.className = 'chat-drawer';
  chatDrawerEl.id = 'chat-drawer';
  chatDrawerEl.setAttribute('aria-label', 'Ask ORCA Assistant');
  chatDrawerEl.innerHTML = `
    <header class="chat-drawer-header">
      <div class="chat-drawer-brand">
        <span class="chat-drawer-eyebrow">ORCA AI COPILOT</span>
        <strong class="chat-drawer-title">Ask ORCA</strong>
      </div>
      <div class="chat-drawer-actions">
        <button class="chat-drawer-btn chat-drawer-fullscreen" type="button" aria-label="Enlarge chat to full screen" title="Fullscreen chat">
          <svg class="expand-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
          <svg class="compress-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
            <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/>
          </svg>
        </button>
        <button class="chat-drawer-btn chat-drawer-close" type="button" aria-label="Close Ask ORCA" title="Close chat">✕</button>
      </div>
    </header>
  `;
  chatAreaEl = createChatArea();
  chatDrawerEl.appendChild(chatAreaEl);
  chatDrawerEl.appendChild(createInputBar());
  appEl.appendChild(chatDrawerEl);

  // Panel toggle button (floating pill to toggle zone intelligence anytime)
  panelToggleBtn = document.createElement('button');
  panelToggleBtn.className = 'panel-toggle-btn';
  panelToggleBtn.type = 'button';
  panelToggleBtn.innerHTML = '<span class="toggle-icon">📊</span><span class="toggle-label">Zone Intel</span>';
  panelToggleBtn.setAttribute('aria-label', 'Toggle zone intelligence panel');
  panelToggleBtn.setAttribute('title', 'Toggle Zone Intelligence');
  panelToggleBtn.addEventListener('click', toggleIntelligencePanel);
  appEl.appendChild(panelToggleBtn);

  // Ask ORCA FAB
  const askOrcaFab = document.createElement('button');
  askOrcaFab.className = 'ask-orca-fab';
  askOrcaFab.type = 'button';
  askOrcaFab.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M15 7h.01M9 7h.01M15 11h.01M9 11h.01"/></svg><span>Ask ORCA</span>`;
  askOrcaFab.setAttribute('aria-expanded', 'false');
  askOrcaFab.addEventListener('click', openChatPanel);
  appEl.appendChild(askOrcaFab);

  // Bind events
  intelligencePanelEl.querySelector('.panel-close')?.addEventListener('click', closeIntelligencePanel);
  chatDrawerEl.querySelector('.chat-drawer-fullscreen')?.addEventListener('click', toggleChatFullscreen);
  chatDrawerEl.querySelector('.chat-drawer-close')?.addEventListener('click', closeChatPanel);

  // Keyboard: Escape to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (chatDrawerEl?.classList.contains('is-fullscreen')) {
        toggleChatFullscreen();
      } else if (chatDrawerEl?.classList.contains('is-open')) {
        closeChatPanel();
      } else if (intelligencePanelEl && !intelligencePanelEl.classList.contains('collapsed')) {
        closeIntelligencePanel();
      }
    }
  });

  // Show welcome screen in chat
  showWelcome();

  // Initialize marine map
  createMarineMap(mapViewport, {
    onAskOrca: (zone, userLocation) => {
      openChatPanel();
      setInputValue(`Is ${zone.name} suitable for ${zone.likely_species[0]} today?`);
    },
    onZoneChange: (zone, userLocation) => {
      renderZoneDetail(zone, userLocation);
      onMapZoneChange?.(zone, userLocation);
    },
  });

  // Initialize data status bar
  updateDataStatusBar();
}

/**
 * Create the ORCA Command Header
 */
function createHeader() {
  const header = document.createElement('header');
  header.className = 'orca-header';
  header.id = 'app-header';

  header.innerHTML = `
    <div class="header-brand">
      <div class="header-logo">🌊</div>
      <div class="header-text">
        <div class="header-title">ORCA</div>
        <div class="header-subtitle">Marine Intelligence</div>
      </div>
    </div>
    <nav class="header-center" aria-label="Primary navigation">
      <div class="header-nav">
        <button type="button" class="header-nav-btn active" data-view="map" aria-current="page">Operations Map</button>
        <button type="button" class="header-nav-btn" data-view="chat">Ask ORCA</button>
      </div>
    </nav>
    <div class="header-right">
      <div class="system-status" id="header-agent-status" title="ORCA Marine Telemetry Core · Active">
        <span class="status-pulse-dot"></span>
        <span class="status-text">Marine Core Active</span>
      </div>
      <div class="header-controls">
        ${createLangPicker()}
        ${isTTSSupported() ? createVoiceToggle() : ''}
      </div>
    </div>
  `;

  // Bind events after DOM insertion
  setTimeout(() => {
    // Nav buttons
    header.querySelectorAll('.header-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        header.querySelectorAll('.header-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (view === 'chat') {
          openChatPanel();
        }
      });
    });

    // Language picker
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

    // Voice toggle
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

/**
 * Update the data status bar in the intelligence panel
 */
export function updateDataStatusBar() {
  const bar = document.getElementById('data-status-bar');
  if (!bar) return;

  // These reflect the current data sources from the mock data
  const statuses = [
    { label: 'PFZ', value: 'DEMO', type: 'demo' },
    { label: 'Ocean', value: 'DEMO', type: 'demo' },
    { label: 'Weather', value: 'LIVE', type: 'live' },
    { label: 'GIS', value: 'COMPUTED', type: 'computed' },
    { label: 'Safety', value: 'COMPUTED', type: 'computed' },
    { label: 'Alerts', value: 'DEMO', type: 'demo' },
  ];

  bar.innerHTML = statuses.map(s => `
    <div class="data-status-item">
      <span class="data-status-label">${s.label}</span>
      <span class="data-status-value ${s.type}">${s.value}</span>
    </div>
  `).join('');
}

/**
 * Toggle intelligence panel (mobile)
 */
function toggleIntelligencePanel() {
  if (!intelligencePanelEl) return;
  const isCollapsed = intelligencePanelEl.classList.toggle('collapsed');
  if (panelToggleBtn) {
    panelToggleBtn.setAttribute('aria-expanded', String(!isCollapsed));
    panelToggleBtn.innerHTML = isCollapsed ? '📊' : '✕';
    panelToggleBtn.title = isCollapsed ? 'Open Zone Intelligence' : 'Close Zone Intelligence';
  }
}

/**
 * Close intelligence panel
 */
export function closeIntelligencePanel() {
  if (intelligencePanelEl) {
    intelligencePanelEl.classList.add('collapsed');
    if (panelToggleBtn) {
      panelToggleBtn.setAttribute('aria-expanded', 'false');
      panelToggleBtn.innerHTML = '📊';
      panelToggleBtn.title = 'Open Zone Intelligence';
    }
  }
}

/**
 * Open intelligence panel
 */
export function openIntelligencePanel() {
  if (intelligencePanelEl) {
    intelligencePanelEl.classList.remove('collapsed');
    if (panelToggleBtn) {
      panelToggleBtn.setAttribute('aria-expanded', 'true');
      panelToggleBtn.innerHTML = '✕';
      panelToggleBtn.title = 'Close Zone Intelligence';
    }
  }
}

/**
 * Render the zone detail in the intelligence panel
 */
export function renderZoneDetail(zone, userLocation) {
  const contentEl = document.getElementById('panel-content');
  if (!contentEl) return;

  if (!zone) {
    contentEl.innerHTML = `
      <div class="zone-empty">
        <span class="zone-empty-icon">🎣</span>
        <strong class="zone-empty-title">Select a PFZ Zone</strong>
        <p class="zone-empty-desc">Tap a coloured marine zone on the map to see fish, safety and ocean telemetry.</p>
      </div>
    `;
    closeIntelligencePanel();
    return;
  }

  openIntelligencePanel();

  // Calculate distance
  let distanceStr = 'Enable GPS to calculate distance';
  if (userLocation && zone.coordinates) {
    const dist = getDistanceKm(userLocation, zone.coordinates);
    distanceStr = `${dist.toFixed(1)} km from you`;
  }

  // Wave height
  const wave = zone.ocean?.wave;
  const waveStr = wave ? `${wave.significant_height_m} m` : '—';
  const current = zone.ocean?.current;
  const currentStr = current ? `${current.speed_knots} kt ${current.direction}` : 'not available';
  const salinity = zone.ocean?.salinity_psu ?? '—';

  // Risk class
  const riskClass = zone.risk?.level || 'caution';
  const riskLabel = zone.risk?.label || 'Caution / moderate';
  const riskColor = zone.risk?.color || '#facc15';

  contentEl.innerHTML = `
    <div class="zone-detail">
      <div class="zone-kicker">SELECTED PFZ · ${escapeHtml(zone.state)}</div>
      <div class="zone-heading">
        <div class="zone-name-block">
          <h2>${escapeHtml(zone.name)}</h2>
          <div class="zone-species">
            ${(zone.likely_species || []).map(sp => `<span class="species-tag">🐟 ${escapeHtml(sp)}</span>`).join('')}
          </div>
        </div>
        <span class="zone-risk-badge ${riskClass}" style="border-color: ${riskColor}; background: ${riskColor}1A; color: ${riskColor};">
          ● ${escapeHtml(riskLabel)}
        </span>
      </div>
      <p class="zone-advisory">${escapeHtml(zone.advisory || 'No advisory available.')}</p>

      <div class="zone-metrics">
        <div class="metric-item">
          <span class="metric-label">🎯 Confidence</span>
          <span class="metric-value">${Math.round((zone.confidence || 0) * 100)}%</span>
          <div class="confidence-bar"><div class="confidence-fill" style="width: ${Math.round((zone.confidence || 0) * 100)}%"></div></div>
        </div>
        <div class="metric-item">
          <span class="metric-label">🌡️ SST</span>
          <span class="metric-value">${zone.sst_celsius ?? '—'}°C</span>
          <span class="metric-sub">Optimal Pelagic 26–29°C</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">🌿 Chlorophyll</span>
          <span class="metric-value">${zone.chlorophyll_mg_m3 ?? '—'} mg/m³</span>
          <span class="metric-sub">Phytoplankton Concentration</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">💨 Wind</span>
          <span class="metric-value">${zone.wind_speed_knots ?? '—'} kt</span>
          <span class="metric-sub">${(zone.wind_speed_knots || 0) > 18 ? 'Caution · Gusty Swell' : 'Calm · Favorable Seas'}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">🌊 Wave</span>
          <span class="metric-value">${waveStr}</span>
          <span class="metric-sub">${wave && wave.significant_height_m > 2 ? 'Moderate Swell' : 'Calm Conditions'}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">📍 Distance</span>
          <span class="metric-value" style="font-size: 0.85rem;">${distanceStr}</span>
        </div>
      </div>

      <div class="zone-additional">
        <div class="additional-row">
          <span class="additional-label">Coordinates</span>
          <span class="additional-value">${zone.coordinates?.lat.toFixed(2) ?? '—'}°N, ${zone.coordinates?.lon.toFixed(2) ?? '—'}°E</span>
        </div>
        <div class="additional-row">
          <span class="additional-label">Current</span>
          <span class="additional-value">${currentStr}</span>
        </div>
        <div class="additional-row">
          <span class="additional-label">Depth</span>
          <span class="additional-value">${zone.depth_range_m?.min ?? '—'}–${zone.depth_range_m?.max ?? '—'} m</span>
        </div>
        <div class="additional-row">
          <span class="additional-label">Salinity</span>
          <span class="additional-value">${salinity} PSU</span>
        </div>
        <div class="additional-row">
          <span class="additional-label">Valid Until</span>
          <span class="additional-value">${zone.valid_until ? new Date(zone.valid_until).toLocaleString() : 'not supplied'}</span>
        </div>
      </div>

      <div class="zone-reasoning">
        <div class="reasoning-title">⚡ WHY THIS ZONE?</div>
        <ul class="reasoning-list">
          ${generateReasoningItems(zone).map(r => `<li class="reasoning-item">${escapeHtml(r)}</li>`).join('')}
        </ul>
      </div>

      <div class="zone-actions">
        <button type="button" class="zone-action-btn primary" data-action="ask" data-zone-id="${zone.id}">💬 Ask ORCA</button>
        <a class="zone-action-btn secondary zone-action-btn--link" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${zone.coordinates?.lat ?? 0},${zone.coordinates?.lon ?? 0}" data-action="navigate">🧭 Navigate</a>
        <button type="button" class="zone-action-btn outline" data-action="details" data-zone-id="${zone.id}">⌄ Details</button>
      </div>

      <div class="zone-source">Demo advisory · existing ORCA mock data</div>
    </div>
  `;

  // Bind action buttons
  contentEl.querySelector('[data-action="ask"]')?.addEventListener('click', (e) => {
    const zoneId = e.currentTarget.dataset.zoneId;
    const z = zone; // already have reference
    openChatPanel();
    setInputValue(`Is ${z.name} suitable for ${z.likely_species[0]} today?`);
  });

  contentEl.querySelector('[data-action="details"]')?.addEventListener('click', () => {
    const detailSection = contentEl.querySelector('.zone-additional');
    if (detailSection) {
      detailSection.style.display = detailSection.style.display === 'none' ? 'flex' : 'none';
    }
    const btn = contentEl.querySelector('[data-action="details"]');
    if (btn) btn.textContent = detailSection?.style.display === 'none' ? '⌄ Details' : '⌃ Less';
  });
}

/**
 * Generate reasoning items for a zone based on its data
 */
function generateReasoningItems(zone) {
  const items = [];
  const conf = zone.confidence || 0;

  if (conf >= 0.8) {
    items.push(`Strong PFZ confidence (${Math.round(conf * 100)}%)`);
  } else if (conf >= 0.6) {
    items.push(`Moderate PFZ confidence (${Math.round(conf * 100)}%)`);
  }

  const sst = zone.sst_celsius;
  if (sst != null && sst >= 26 && sst <= 29) {
    items.push('Favorable sea surface temperature for pelagic species');
  }

  const chl = zone.chlorophyll_mg_m3;
  if (chl != null && chl >= 1.5) {
    items.push('Elevated chlorophyll indicates active food chain');
  }

  const wind = zone.wind_speed_knots;
  if (wind != null && wind <= 15) {
    items.push('Acceptable wind conditions for safe operations');
  } else if (wind != null && wind > 18) {
    items.push('Elevated winds — caution advised for small vessels');
  }

  const wave = zone.ocean?.wave?.significant_height_m;
  if (wave != null && wave <= 1.8) {
    items.push('Calm sea state with low wave heights');
  } else if (wave != null && wave > 2.5) {
    items.push('High waves — high risk for small craft');
  }

  if (zone.risk?.level === 'favourable') {
    items.push('Safety assessment: favourable conditions');
  } else if (zone.risk?.level === 'caution') {
    items.push('Safety assessment: caution advised');
  } else if (zone.risk?.level === 'high-risk') {
    items.push('Safety assessment: high risk — not recommended');
  }

  if (items.length === 0) {
    items.push('Safety assessment available');
  }

  return items.slice(0, 4);
}

/**
 * Create chat area
 */
function createChatArea() {
  const area = document.createElement('div');
  area.className = 'chat-area';
  area.id = 'chat-area';
  return area;
}

/**
 * Welcome Screen
 */
function showWelcome() {
  if (!chatAreaEl) return;

  welcomeEl = document.createElement('div');
  welcomeEl.className = 'welcome-screen';
  welcomeEl.id = 'welcome-screen';

  const suggestions = [
    { icon: '🎣', category: 'Potential Fishing Zones', prompt: 'Show PFZ zones in Maharashtra', desc: 'Satellite SST & Chlorophyll-a pelagic hotspots' },
    { icon: '🌊', category: 'Ocean & Sea State', prompt: 'What are ocean conditions near Chennai?', desc: 'Wave swell, sea temperature & tidal currents' },
    { icon: '🧭', category: 'Navigational Safety', prompt: 'Is it safe to go fishing today?', desc: 'Coastal hazard alerts, high wave & squall checks' },
    { icon: '🐟', category: 'Target Species Advice', prompt: 'Where can I fish today near Mumbai?', desc: 'Tuna, Mackerel & Pomfret location forecast' },
    { icon: '⚠️', category: 'Marine Alerts', prompt: 'Are there marine alerts near Mumbai?', desc: 'Cyclone warnings, swell advisories & notices' },
    { icon: '📊', category: 'Multi-Factor Analysis', prompt: 'Compare PFZ zones for best catch', desc: 'Confidence, ocean conditions & safety scoring' },
  ];

  welcomeEl.innerHTML = `
    <div class="welcome-icon">🌊</div>
    <h2 class="welcome-title">ORCA Marine Intelligence</h2>
    <p class="welcome-desc">AI-powered operational console for coastal navigation, Potential Fishing Zones (PFZ), satellite oceanography, and maritime safety.</p>
    <div class="welcome-suggestions">
      ${suggestions.map(s => `
        <button class="suggestion-card" data-prompt="${escapeHtml(s.prompt)}">
          <div class="suggestion-card-top">
            <span class="suggestion-icon">${s.icon}</span>
            <span class="suggestion-badge">${escapeHtml(s.category)}</span>
          </div>
          <div class="suggestion-prompt">${escapeHtml(s.prompt)}</div>
          <div class="suggestion-desc">${escapeHtml(s.desc)}</div>
        </button>
      `).join('')}
    </div>
  `;

  setTimeout(() => {
    welcomeEl.querySelectorAll('.suggestion-card').forEach(card => {
      card.addEventListener('click', () => {
        const prompt = card.getAttribute('data-prompt');
        if (onSuggestionCallback) onSuggestionCallback(prompt);
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

/**
 * Input Bar
 */
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

  inputFieldEl.addEventListener('input', () => {
    inputFieldEl.style.height = 'auto';
    const newHeight = Math.min(inputFieldEl.scrollHeight, 110);
    inputFieldEl.style.height = newHeight + 'px';
    inputFieldEl.style.overflowY = inputFieldEl.scrollHeight > 110 ? 'auto' : 'hidden';
  });

  inputFieldEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  wrapper.appendChild(inputFieldEl);

  if (isSpeechSupported()) {
    micBtnEl = document.createElement('button');
    micBtnEl.className = 'input-btn mic-btn';
    micBtnEl.id = 'mic-btn';
    micBtnEl.innerHTML = '🎤';
    micBtnEl.title = 'Voice input';
    micBtnEl.setAttribute('aria-label', 'Voice input');
    micBtnEl.addEventListener('click', () => startListening());
    wrapper.appendChild(micBtnEl);
  }

  sendBtnEl = document.createElement('button');
  sendBtnEl.className = 'input-btn send-btn';
  sendBtnEl.id = 'send-btn';
  sendBtnEl.innerHTML = '➤';
  sendBtnEl.title = 'Send message';
  sendBtnEl.setAttribute('aria-label', 'Send message');
  sendBtnEl.addEventListener('click', handleSend);
  wrapper.appendChild(sendBtnEl);

  bar.appendChild(wrapper);
  return bar;
}

function handleSend() {
  const text = inputFieldEl?.value?.trim();
  if (!text || !onSendCallback) return;

  inputFieldEl.value = '';
  inputFieldEl.style.height = 'auto';
  inputFieldEl.style.overflowY = 'hidden';
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

  // Per-message action bar for assistant responses
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
        speakText(content, () => speakBtn.classList.remove('speaking'));
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

  const orchestratorData = data.orchestratorData;
  const orchestratorPFZData = orchestratorData?.pfz_result;
  const selectedRecommendation = orchestratorData?.recommendation_result?.selected_pfz;
  const mapPFZData = data.pfzData || orchestratorPFZData;

  // Map controller instance
  let mapController = null;
  const hasMapData = data.coordinates || orchestratorData?.map_data?.user_location || (mapPFZData && mapPFZData.zones && mapPFZData.zones.length > 0);
  if (hasMapData) {
    const mapCoords = orchestratorData?.map_data?.user_location || data.coordinates || selectedRecommendation?.coordinates || (mapPFZData?.zones?.[0]?.coordinates);
    if (mapCoords) {
      mapController = createMapToggle(mapCoords, data.weatherData?.city || data.forecastData?.city || orchestratorData?.weather_result?.city || '', mapPFZData);
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

  if (orchestratorData?.recommendation_result) {
    contentWrapper.appendChild(createRecommendationCard(orchestratorData));
  }

  // Forecast chart
  if (data.forecastData) {
    contentWrapper.appendChild(createForecastChartContainer(data.forecastData));
  }

  // Map toggle container
  if (mapController) {
    contentWrapper.appendChild(mapController.element);
    if (selectedRecommendation?.coordinates) {
      mapController.focusZone(selectedRecommendation.coordinates.lat, selectedRecommendation.coordinates.lon, selectedRecommendation.name);
    }
  }

  // Follow-up suggestion chips
  if (role === 'assistant') {
    const followup = createFollowupSuggestions(data);
    if (followup) contentWrapper.appendChild(followup);
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
    <div class="activity-sonar">
      <div class="sonar-core">🌊</div>
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
      <div class="activity-status-text" id="activity-status-text">${ACTIVITY_STAGES[0]}</div>
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
      void statusTextEl.offsetWidth;
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
      <div class="error-message" style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: var(--radius-md); padding: 10px 14px; font-size: 0.82rem; color: #fca5a5;">⚠️ ${escapeHtml(message)}</div>
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
    inputFieldEl.style.height = Math.min(inputFieldEl.scrollHeight, 110) + 'px';
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

/**
 * Open Ask ORCA chat panel
 */
export function openChatPanel() {
  if (!chatDrawerEl) return;
  chatDrawerEl.classList.add('is-open');
  document.getElementById('chat-drawer-backdrop')?.classList.add('is-active');
  document.querySelector('.ask-orca-fab')?.setAttribute('aria-expanded', 'true');
  setTimeout(() => inputFieldEl?.focus(), 180);
}

/**
 * Close Ask ORCA chat panel
 */
export function closeChatPanel() {
  if (chatDrawerEl?.classList.contains('is-fullscreen')) {
    toggleChatFullscreen();
  }
  chatDrawerEl?.classList.remove('is-open');
  document.getElementById('chat-drawer-backdrop')?.classList.remove('is-active');
  document.querySelector('.ask-orca-fab')?.setAttribute('aria-expanded', 'false');
}

function toggleChatFullscreen() {
  if (!chatDrawerEl) return;
  const isFullscreen = chatDrawerEl.classList.toggle('is-fullscreen');
  const expandIcon = chatDrawerEl.querySelector('.expand-icon');
  const compressIcon = chatDrawerEl.querySelector('.compress-icon');
  const btn = chatDrawerEl.querySelector('.chat-drawer-fullscreen');

  if (isFullscreen) {
    btn?.setAttribute('aria-label', 'Exit full screen');
    if (btn) btn.title = 'Exit full screen';
    if (expandIcon) expandIcon.style.display = 'none';
    if (compressIcon) compressIcon.style.display = 'block';
  } else {
    btn?.setAttribute('aria-label', 'Enlarge chat to full screen');
    if (btn) btn.title = 'Enlarge chat to full screen';
    if (expandIcon) expandIcon.style.display = 'block';
    if (compressIcon) compressIcon.style.display = 'none';
  }
}

// --- Helper Components ---

function escapeHtml(text) {
  if (!text) return '';
  return String(text).replace(/[&<>'"]/g, (char) => ({
    '&': '&', '<': '<', '>': '>', "'": "'", '"': '"',
  }[char]));
}

function formatMessageContent(text) {
  if (!text) return '';
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
    1: 'aqi-good', 2: 'aqi-fair', 3: 'aqi-moderate', 4: 'aqi-poor', 5: 'aqi-very-poor',
  }[data.aqi?.index] || 'aqi-moderate';

  card.innerHTML = `
    <div class="aqi-header">
      <div class="weather-card-city">Air Quality — ${data.city || ''}</div>
      <span class="aqi-badge ${aqiClass}">${data.aqi?.label || 'Unknown'}</span>
    </div>
    <div class="aqi-pollutants">
      ${data.pollutants?.pm2_5 != null ? `<div class="aqi-pollutant"><div class="aqi-pollutant-name">PM2.5</div><div class="aqi-pollutant-value">${data.pollutants.pm2_5}</div></div>` : ''}
      ${data.pollutants?.pm10 != null ? `<div class="aqi-pollutant"><div class="aqi-pollutant-name">PM10</div><div class="aqi-pollutant-value">${data.pollutants.pm10}</div></div>` : ''}
      ${data.pollutants?.no2 != null ? `<div class="aqi-pollutant"><div class="aqi-pollutant-name">NO₂</div><div class="aqi-pollutant-value">${data.pollutants.no2}</div></div>` : ''}
      ${data.pollutants?.o3 != null ? `<div class="aqi-pollutant"><div class="aqi-pollutant-name">O₃</div><div class="aqi-pollutant-value">${data.pollutants.o3}</div></div>` : ''}
      ${data.pollutants?.co != null ? `<div class="aqi-pollutant"><div class="aqi-pollutant-name">CO</div><div class="aqi-pollutant-value">${data.pollutants.co}</div></div>` : ''}
      ${data.pollutants?.so2 != null ? `<div class="aqi-pollutant"><div class="aqi-pollutant-name">SO₂</div><div class="aqi-pollutant-value">${data.pollutants.so2}</div></div>` : ''}
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
        ${speciesList.map(sp => `<button class="pfz-species-pill" type="button" data-species="${sp}">🐟 ${sp}</button>`).join('')}
      </div>
    </div>` : ''}

    <div class="pfz-card-actions">
      ${coords && mapController ? `
      <button class="pfz-action-btn pfz-btn-map" type="button">🗺️ Focus Zone on Map</button>` : ''}
      ${coords ? `
      <button class="pfz-action-btn pfz-btn-gps" type="button" data-gps="${rawCoordStr}">📋 Copy GPS</button>` : ''}
      <button class="pfz-action-btn pfz-btn-weather" type="button">🌤️ Sea Weather</button>
    </div>

    <div class="pfz-source-tag">${source || 'ORCA Mock Data'}</div>
  `;

  // Focus map action
  const triggerFocus = () => {
    if (mapController && coords) {
      if (pfzCardEls) {
        pfzCardEls.forEach(c => c.classList.remove('pfz-card--active'));
      }
      card.classList.add('pfz-card--active');
      mapController.focusZone(coords.lat, coords.lon, zone.name);
    }
  };

  const mapBtn = card.querySelector('.pfz-btn-map');
  if (mapBtn) {
    mapBtn.addEventListener('click', (e) => { e.stopPropagation(); triggerFocus(); });
  }

  card.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    triggerFocus();
  });

  // Species pills
  card.querySelectorAll('.pfz-species-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      const sp = pill.getAttribute('data-species');
      if (onSuggestionCallback) {
        onSuggestionCallback(`What is the recommended gear, depth, and technique for catching ${sp} in ${zone.name || 'this zone'}?`);
      }
    });
  });

  // Copy GPS
  const gpsBtn = card.querySelector('.pfz-btn-gps');
  if (gpsBtn && rawCoordStr) {
    gpsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(rawCoordStr).then(() => {
        const originalText = gpsBtn.innerHTML;
        gpsBtn.innerHTML = '✓ Copied!';
        gpsBtn.classList.add('btn-copied');
        setTimeout(() => { gpsBtn.innerHTML = originalText; gpsBtn.classList.remove('btn-copied'); }, 1800);
      });
    });
  }

  // Sea Weather
  const weatherBtn = card.querySelector('.pfz-btn-weather');
  if (weatherBtn) {
    weatherBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onSuggestionCallback) onSuggestionCallback(`What are the wind and ocean conditions at ${zone.name || 'this location'}?`);
    });
  }

  return card;
}

function factorValue(factor) {
  if (!factor) return 'Not available';
  if (factor.confidence != null) return `${Math.round(factor.confidence * 100)}% confidence`;
  if (factor.mg_m3 != null) return `${factor.mg_m3} mg/m³`;
  if (factor.celsius != null) return `${factor.celsius}°C`;
  if (factor.significant_height_m != null) return `${factor.significant_height_m} m`;
  if (factor.condition != null) return factor.condition;
  return 'Not available';
}

function createRecommendationCard(orchestratorData) {
  const recommendation = orchestratorData.recommendation_result;
  const selected = recommendation.selected_pfz;
  const nearest = orchestratorData.gis_result?.candidates?.find(c => c.id === selected?.id) || orchestratorData.gis_result?.nearest_pfz;
  const factors = recommendation.factors || {};

  const card = document.createElement('section');
  card.className = 'recommendation-card';

  const header = document.createElement('div');
  header.className = 'recommendation-card-header';

  const kicker = document.createElement('span');
  kicker.className = 'recommendation-kicker';
  kicker.textContent = 'ORCA FISHING RECOMMENDATION';

  const zoneName = document.createElement('strong');
  zoneName.className = 'recommendation-zone';
  zoneName.textContent = selected?.name || 'No PFZ recommended';

  const titleWrap = document.createElement('div');
  titleWrap.append(kicker, zoneName);

  const safety = document.createElement('span');
  const safetyStatus = recommendation.safety_status || orchestratorData.safety_result?.status || 'UNKNOWN';
  safety.className = `recommendation-safety recommendation-safety--${safetyStatus.toLowerCase()}`;
  safety.textContent = safetyStatus;

  header.append(titleWrap, safety);
  card.appendChild(header);

  const summary = document.createElement('div');
  summary.className = 'recommendation-summary';
  const score = document.createElement('div');
  score.innerHTML = `<span>Suitability</span><strong>${recommendation.score ?? '—'}<small>/100</small></strong>`;
  const distance = document.createElement('div');
  distance.innerHTML = `<span>Distance</span><strong>${nearest?.distance_km != null ? `${nearest.distance_km} km` : 'Not available'}</strong>`;
  summary.append(score, distance);
  card.appendChild(summary);

  const factorGroups = [
    ['PFZ', [factors.pfz]],
    ['Ocean', [factors.chlorophyll, factors.sst, factors.waves]],
    ['Weather', [factors.weather]],
  ];
  const factorGrid = document.createElement('div');
  factorGrid.className = 'recommendation-factors';
  factorGroups.forEach(([label, groupFactors]) => {
    const group = document.createElement('div');
    group.className = 'recommendation-factor-group';
    const groupLabel = document.createElement('span');
    groupLabel.textContent = label;
    group.appendChild(groupLabel);
    groupFactors.filter(Boolean).forEach(item => {
      const value = document.createElement('div');
      value.textContent = `${factorValue(item)} · ${item.score}/${item.weight_percent} pts`;
      group.appendChild(value);
    });
    factorGrid.appendChild(group);
  });
  card.appendChild(factorGrid);

  if (recommendation.reasons?.length) {
    const reasons = document.createElement('ul');
    reasons.className = 'recommendation-reasons';
    recommendation.reasons.slice(0, 4).forEach(reason => {
      const item = document.createElement('li');
      item.textContent = reason;
      reasons.appendChild(item);
    });
    card.appendChild(reasons);
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

  setTimeout(() => renderForecastChart(chartWrapper, forecastData), 100);
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

    if (window.L) {
      leafletMap = L.map(mapContainer, { zoomControl: true, attributionControl: false }).setView([coordinates.lat, coordinates.lon], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(leafletMap);

      const boundsGroup = L.featureGroup();

      if (cityName) {
        const cityMarker = L.marker([coordinates.lat, coordinates.lon]).bindPopup(`<b>${cityName}</b>`);
        cityMarker.addTo(leafletMap);
        boundsGroup.addLayer(cityMarker);
      }

      if (hasPfz) {
        pfzData.zones.forEach(zone => {
          if (!zone.coordinates) return;
          const { lat, lon } = zone.coordinates;

          const confPct = Math.round((zone.confidence || 0) * 100);
          const confLabel = zone.confidence_label || (zone.confidence >= 0.8 ? 'High' : zone.confidence >= 0.6 ? 'Moderate' : 'Low');
          const confColor = zone.confidence >= 0.8 ? '#4ade80' : zone.confidence >= 0.6 ? '#facc15' : '#f87171';

          const speciesStr = zone.likely_species && zone.likely_species.length ? zone.likely_species.join(', ') : '—';
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
            radius: 11, fillColor: '#14e8a6', fillOpacity: 0.9, color: '#ffffff', weight: 2,
          }).bindPopup(popupHtml, { className: 'pfz-leaflet-popup', maxWidth: 260 });

          pfzMarker.addTo(leafletMap);
          boundsGroup.addLayer(pfzMarker);
          markerRegistry.push({ zoneName: zone.name, lat, lon, marker: pfzMarker });
        });
      }

      if (boundsGroup.getLayers().length > 1) {
        setTimeout(() => leafletMap.fitBounds(boundsGroup.getBounds().pad(0.15)), 250);
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

  btn.addEventListener('click', () => { if (mapVisible) closeMap(); else openMap(); });
  wrapper.appendChild(btn);

  return {
    element: wrapper,
    openMap,
    focusZone: (lat, lon, zoneName) => {
      if (!mapVisible) openMap();
      setTimeout(() => {
        if (leafletMap) {
          leafletMap.flyTo([lat, lon], 11, { duration: 0.8 });
          const target = markerRegistry.find(m => (zoneName && m.zoneName === zoneName) || (Math.abs(m.lat - lat) < 0.005 && Math.abs(m.lon - lon) < 0.005));
          if (target) target.marker.openPopup();
        }
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    },
  };
}

function createFollowupSuggestions(data) {
  let suggestions = [];
  if (data.pfzData && data.pfzData.zones && data.pfzData.zones.length > 0) {
    suggestions = ['🧭 Is navigation safe in these zones today?', '💨 Wind & wave swell forecast for these zones', '🎣 Recommended fishing gear & depth'];
  } else if (data.weatherData) {
    const city = data.weatherData.city || 'this area';
    suggestions = [`🎣 Show PFZ zones near ${city}`, '🌊 Ocean swell and wave height', `📊 5-day marine forecast for ${city}`];
  } else { return null; }

  const container = document.createElement('div');
  container.className = 'followup-suggestions';
  container.innerHTML = `
    <div class="followup-title">⚡ Quick Marine Follow-ups</div>
    <div class="followup-chips">
      ${suggestions.map(text => `<button class="followup-chip" type="button">${escapeHtml(text)}</button>`).join('')}
    </div>
  `;

  container.querySelectorAll('.followup-chip').forEach(chip => {
    chip.addEventListener('click', () => { if (onSuggestionCallback) onSuggestionCallback(chip.textContent); });
  });
  return container;
}

function scrollToBottom() {
  if (chatAreaEl) requestAnimationFrame(() => { chatAreaEl.scrollTop = chatAreaEl.scrollHeight; });
}

function getDistanceKm(from, to) {
  if (!from || !to) return null;
  const rad = Math.PI / 180;
  const dLat = (to.lat - from.lat) * rad;
  const dLon = (to.lon - from.lon) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(from.lat * rad) * Math.cos(to.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function createLangPicker() {
  const options = Object.entries(LANGUAGES).map(([code, name]) => `<option value="${code}">${name}</option>`).join('');
  return `<select id="lang-picker" class="lang-picker" aria-label="Language">${options}</select>`;
}

function createVoiceToggle() {
  const active = getAutoSpeak();
  return `<button id="voice-toggle" class="voice-toggle-btn ${active ? 'active' : ''}" title="${active ? 'Auto-speak: ON' : 'Auto-speak: OFF'}" aria-label="Toggle voice output">🔊</button>`;
}