/**
 * ORCA home map. The data is served by /api/marine-map, which composes the
 * existing PFZ, ocean and GIS mock advisories on the server.
 * Premium marine operations map with basemap switcher, layer controls, and legends.
 */

let activeZone = null;
let userLocation = null;
let mapContextCallback = null;

const indianWestCoast = [15.5, 76.2];
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({
  '&': '&', '<': '<', '>': '>', "'": "'", '"': '"',
}[char]));

function distanceKm(from, to) {
  const rad = Math.PI / 180;
  const dLat = (to.lat - from.lat) * rad;
  const dLon = (to.lon - from.lon) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(from.lat * rad) * Math.cos(to.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function scoreZone(zone) {
  const safety = zone.risk.level === 'favourable' ? 20 : zone.risk.level === 'caution' ? 5 : -30;
  const wave = zone.ocean?.wave?.significant_height_m || 0;
  return (zone.confidence * 100) + safety - (zone.wind_speed_knots * 0.35) - (wave * 2);
}

function zonePopup(zone) {
  return `<div class="marine-popup">
    <strong>🎣 ${escapeHtml(zone.name)}</strong>
    <span class="marine-popup-status" style="color:${zone.risk.color}">● ${escapeHtml(zone.risk.label)}</span>
    <small>${Math.round(zone.confidence * 100)}% confidence · ${escapeHtml(zone.likely_species.join(', '))}</small>
  </div>`;
}

function oceanPopup(observation) {
  const sst = observation.sst?.value ?? '—';
  const chlorophyll = observation.chlorophyll?.value ?? '—';
  return `<div class="marine-popup ocean-popup">
    <strong>🌊 ${escapeHtml(observation.region)}</strong>
    <span class="marine-popup-status" style="color:${observation.condition.color}">● ${escapeHtml(observation.condition.label)}</span>
    <small>SST ${escapeHtml(sst)}°C · Chlorophyll ${escapeHtml(chlorophyll)} mg/m³</small>
    <small><strong>MOCK/DEMO</strong> · ${escapeHtml(observation.source)}</small>
  </div>`;
}

const alertColors = { INFO: '#38bdf8', CAUTION: '#facc15', WARNING: '#fb923c', DANGER: '#ef4444' };

function alertPopup(alert) {
  return `<div class="marine-popup marine-alert-popup">
    <strong>⚠️ ${escapeHtml(alert.title)}</strong>
    <span class="marine-popup-status" style="color:${alertColors[alert.severity] || alertColors.INFO}">● ${escapeHtml(alert.severity)}</span>
    <small>${escapeHtml(alert.message)}</small>
    <small>Affected zone: ${escapeHtml(alert.affected_zone || 'not supplied')}</small>
    <small>Source: ${escapeHtml(alert.source)}</small>
    <small>Timestamp: ${escapeHtml(alert.timestamp || 'not supplied')} ${alert.is_demo ? '· MOCK/DEMO' : ''}</small>
  </div>`;
}

function weatherPopup(zone) {
  return `<div class="marine-popup weather-popup">
    <strong>☁️ ${escapeHtml(zone.state)} wind telemetry</strong>
    <span class="marine-popup-status" style="color:#7dd3fc">● DEMO WEATHER LAYER</span>
    <small>Wind: ${escapeHtml(zone.wind_speed_knots)} kt</small>
    <small><strong>MOCK/DEMO</strong> · Existing PFZ advisory telemetry</small>
  </div>`;
}

function detailHtml(zone) {
  if (!zone) {
    return `<div class="zone-empty"><span>🎣</span><strong>Select a PFZ zone</strong><p>Tap a coloured marine zone to see fish, safety and ocean telemetry.</p></div>`;
  }
  const distance = userLocation ? `${distanceKm(userLocation, zone.coordinates).toFixed(1)} km from you` : 'Enable GPS to calculate distance';
  const wave = zone.ocean?.wave;
  const riskClass = zone.risk.level;
  return `
    <div class="zone-panel-kicker">SELECTED PFZ · ${escapeHtml(zone.state)}</div>
    <div class="zone-panel-heading">
      <div><h2>${escapeHtml(zone.name)}</h2><p>🎣 ${escapeHtml(zone.likely_species.join(' · '))}</p></div>
      <span class="zone-risk ${riskClass}">● ${escapeHtml(zone.risk.label)}</span>
    </div>
    <p class="zone-advisory">${escapeHtml(zone.advisory)}</p>
    <div class="zone-metrics">
      <div><span>Confidence</span><strong>${Math.round(zone.confidence * 100)}%</strong></div>
      <div><span>🌡️ SST</span><strong>${zone.sst_celsius}°C</strong></div>
      <div><span>🌿 Chlorophyll</span><strong>${zone.chlorophyll_mg_m3} mg/m³</strong></div>
      <div><span>💨 Wind</span><strong>${zone.wind_speed_knots} kt</strong></div>
      <div><span>🌊 Wave</span><strong>${wave ? `${wave.significant_height_m} m` : '—'}</strong></div>
      <div><span>📍 Distance</span><strong>${distance}</strong></div>
    </div>
    <div class="zone-current">Current ${escapeHtml(zone.ocean?.current ? `${zone.ocean.current.speed_knots} kt ${zone.ocean.current.direction}` : 'not available')} · Depth ${zone.depth_range_m.min}–${zone.depth_range_m.max} m</div>
    <div class="zone-additional">
      <span>Coordinates ${zone.coordinates.lat.toFixed(2)}°N, ${zone.coordinates.lon.toFixed(2)}°E</span>
      <span>Salinity ${zone.ocean?.salinity_psu ?? '—'} PSU</span>
      <span>Advisory valid until ${zone.valid_until ? new Date(zone.valid_until).toLocaleString() : 'not supplied'}</span>
    </div>
    <div class="zone-panel-actions">
      <button type="button" class="zone-action zone-ask">💬 Ask ORCA</button>
      <a class="zone-action zone-navigate" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${zone.coordinates.lat},${zone.coordinates.lon}">🧭 Navigate</a>
      <button type="button" class="zone-action zone-details">⌄ Details</button>
    </div>
    <div class="zone-source">Demo advisory · existing ORCA mock data</div>`;
}

export async function createMarineMap(container, { onAskOrca, onZoneChange } = {}) {
  mapContextCallback = onZoneChange;
  container.innerHTML = `<div class="marine-map-loading"><span>◌</span> Loading PFZ advisory layers…</div>`;

  try {
    const response = await fetch('/api/marine-map');
    if (!response.ok) throw new Error('Map data request failed');
    const data = await response.json();
    renderMarineMap(container, data, onAskOrca);
  } catch (error) {
    container.innerHTML = `<div class="marine-map-loading map-load-error">⚠️ Marine advisory layers are unavailable. The chat remains available.</div>`;
    console.error('Marine map:', error);
  }
}

function renderMarineMap(container, data, onAskOrca) {
  container.innerHTML = `
    <section class="marine-map-card" aria-label="ORCA marine operations map">
      <div class="marine-map-canvas" id="orca-marine-map"></div>
      
      <!-- Top Floating Control Bar (Clean & Compact) -->
      <div class="map-top-bar" role="toolbar" aria-label="Map navigation tools">
        <!-- Layer Dropdown Pill -->
        <div class="map-control-dropdown" id="layer-dropdown-container">
          <button type="button" class="map-pill-btn" id="layer-pill-btn" aria-expanded="false" aria-label="Toggle layer visibility" title="Manage Map Layers">
            <span class="pill-icon">🥞</span>
            <span class="pill-text">Layers</span>
            <span class="pill-badge" id="active-layers-badge">4</span>
            <span class="pill-chevron">▾</span>
          </button>
          
          <div class="map-dropdown-menu map-layer-menu" id="layer-dropdown-menu" role="dialog" aria-label="Layer toggles">
            <div class="dropdown-header">
              <span class="dropdown-title">MAP LAYERS</span>
              <button type="button" class="dropdown-close-btn" id="close-layers-btn" aria-label="Close layers menu" title="Close layers">✕</button>
            </div>
            <div class="dropdown-body">
              <button type="button" class="map-layer-btn is-active" data-layer="pfz" aria-pressed="true">
                <span class="layer-icon">🎣</span> PFZ Zones
                <span class="layer-status"></span>
              </button>
              <button type="button" class="map-layer-btn is-active" data-layer="ocean" aria-pressed="true">
                <span class="layer-icon">🌊</span> Ocean Conditions
                <span class="layer-status"></span>
              </button>
              <button type="button" class="map-layer-btn is-active" data-layer="alerts" aria-pressed="true">
                <span class="layer-icon">⚠️</span> Marine Alerts
                <span class="layer-status"></span>
              </button>
              <button type="button" class="map-layer-btn" data-layer="weather" aria-pressed="false">
                <span class="layer-icon">☁️</span> Wind Layer
                <span class="layer-status"></span>
              </button>
              <button type="button" class="map-layer-btn is-active" data-layer="location" aria-pressed="true">
                <span class="layer-icon">🚤</span> My Location
                <span class="layer-status"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Basemap Dropdown Pill -->
        <div class="map-control-dropdown" id="basemap-dropdown-container">
          <button type="button" class="map-pill-btn" id="basemap-pill-btn" aria-expanded="false" aria-label="Switch map style" title="Change Basemap Style">
            <span class="pill-icon" id="basemap-pill-icon">🗺️</span>
            <span class="pill-text" id="basemap-pill-text">Standard</span>
            <span class="pill-chevron">▾</span>
          </button>
          
          <div class="map-dropdown-menu map-basemap-menu" id="basemap-dropdown-menu" role="dialog" aria-label="Basemap switcher">
            <div class="dropdown-header">
              <span class="dropdown-title">BASEMAP</span>
              <button type="button" class="dropdown-close-btn" id="close-basemap-btn" aria-label="Close basemap menu" title="Close menu">✕</button>
            </div>
            <div class="dropdown-body">
              <button type="button" class="basemap-btn active" data-basemap="standard">
                <span class="basemap-icon">🗺️</span> Standard
              </button>
              <button type="button" class="basemap-btn" data-basemap="satellite">
                <span class="basemap-icon">🛰️</span> Satellite
              </button>
              <button type="button" class="basemap-btn" data-basemap="hybrid">
                <span class="basemap-icon">🗺️🛰️</span> Hybrid
              </button>
              <button type="button" class="basemap-btn" data-basemap="terrain">
                <span class="basemap-icon">⛰️</span> Terrain
              </button>
            </div>
          </div>
        </div>

        <!-- Search Bar with Clear Button -->
        <div class="map-search-control" role="search">
          <span class="map-search-icon">🔍</span>
          <input class="map-search-input" type="search" placeholder="Search zone, state, region..." aria-label="Search map regions">
          <button type="button" class="map-search-clear" id="search-clear-btn" aria-label="Clear search text" title="Clear" style="display:none;">✕</button>
        </div>
      </div>

      <!-- Map Action Floating Controls -->
      <div class="map-actions-control" role="group" aria-label="Map actions">
        <button type="button" class="map-action-btn map-locate" title="Find my GPS location" aria-label="Find my location">📍</button>
        <button type="button" class="map-action-btn map-reset" title="Reset map view" aria-label="Reset view">↺</button>
        <button type="button" class="map-action-btn primary best-zone" title="Highlight best fishing zone" aria-label="Find best zone">🎯</button>
        <button type="button" class="map-action-btn map-zen-btn" id="map-zen-btn" title="Toggle Clean Map view (hide/show panels)" aria-label="Toggle clean view">👁️</button>
      </div>

      <!-- Legend Widget (Collapsible with close button) -->
      <div class="map-legend-widget" id="map-legend-widget">
        <button type="button" class="legend-toggle-btn" aria-expanded="false" aria-label="Toggle map legend">
          <span class="legend-quick-indicators">
            <i class="legend-dot good"></i> Favourable
            <i class="legend-dot caution"></i> Caution
            <i class="legend-dot danger"></i> High Risk
          </span>
          <span class="legend-toggle-label">Legend <span class="toggle-arrow">▾</span></span>
        </button>
        <div class="legend-expanded-popover">
          <div class="legend-popover-header">
            <div class="legend-section-title">ADVISORY STATUS</div>
            <button type="button" class="dropdown-close-btn legend-close-btn" id="legend-close-btn" aria-label="Close legend" title="Close legend">✕</button>
          </div>
          <div class="legend-grid">
            <span><i class="legend-dot good"></i> Favourable PFZ / Calm</span>
            <span><i class="legend-dot caution"></i> Caution / Moderate Swell</span>
            <span><i class="legend-dot danger"></i> High Risk / Rough Waves</span>
            <span><i class="legend-dot warning"></i> Marine Warning</span>
            <span><i class="legend-dot info"></i> Advisory Info</span>
            <span>🎣 PFZ Target</span>
            <span>🌊 Ocean Station</span>
            <span>⚠️ Marine Alert</span>
            <span>🚤 GPS Location</span>
          </div>
        </div>
      </div>

      <!-- Map Status Bar -->
      <div class="map-status-bar" aria-live="polite" id="map-status-bar">Standard basemap active</div>
    </section>
    <aside class="zone-detail-panel" aria-live="polite" style="display:none;">${detailHtml(null)}</aside>
  `;

  const mapEl = container.querySelector('#orca-marine-map');
  const panel = container.querySelector('.zone-detail-panel');
  const map = window.L?.map(mapEl, { zoomControl: false, attributionControl: true }).setView(indianWestCoast, 5);
  if (!map) {
    mapEl.innerHTML = '<div class="map-load-error">Map engine unavailable.</div>';
    return;
  }
  L.control.zoom({ position: 'bottomleft' }).addTo(map);

  // Basemaps
  const basemaps = {
    standard: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap' }),
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Tiles © Esri' }),
    hybrid: L.layerGroup([
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Tiles © Esri' }),
      L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Labels © Esri' }),
    ]),
    terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17, attribution: '© OpenTopoMap contributors' }),
  };
  let activeBasemap = 'standard';
  basemaps.standard.addTo(map);

  // Layer groups
  const groups = {
    favourable: L.layerGroup().addTo(map),
    caution: L.layerGroup().addTo(map),
    'high-risk': L.layerGroup().addTo(map),
    targets: L.layerGroup().addTo(map),
    ocean: L.layerGroup().addTo(map),
    alerts: L.layerGroup().addTo(map),
    weather: L.layerGroup(),
    location: L.layerGroup().addTo(map),
  };
  const zoneLayers = new Map();
  let routeLine = null;

  const selectZone = (zone, layer, openPopup = true) => {
    activeZone = zone;
    if (panel) panel.innerHTML = detailHtml(zone);
    mapContextCallback?.(zone, userLocation);
    if (layer && openPopup) {
      map.flyToBounds(layer.getBounds ? layer.getBounds().pad(0.7) : L.latLngBounds([[zone.coordinates.lat, zone.coordinates.lon]]), { maxZoom: 8, duration: 0.7 });
      layer.openPopup?.();
    }
    bindPanelActions();
  };

  const bindPanelActions = () => {
    panel?.querySelector('.zone-ask')?.addEventListener('click', () => onAskOrca?.(activeZone, userLocation));
    panel?.querySelector('.zone-details')?.addEventListener('click', () => {
      panel.classList.toggle('zone-detail-expanded');
      const button = panel.querySelector('.zone-details');
      if (button) button.textContent = panel.classList.contains('zone-detail-expanded') ? '⌃ Less' : '⌄ Details';
    });
  };

  // PFZ Zones
  data.zones.forEach((zone) => {
    const bounds = [[zone.bounds.south, zone.bounds.west], [zone.bounds.north, zone.bounds.east]];
    const rectangle = L.rectangle(bounds, {
      color: zone.risk.color,
      weight: 2,
      fillColor: zone.risk.color,
      fillOpacity: 0.18,
      className: 'pfz-zone',
    }).bindPopup(zonePopup(zone), { closeButton: true, className: 'pfz-leaflet-popup' });

    rectangle.on('click', () => selectZone(zone, rectangle, true));
    rectangle.addTo(groups[zone.risk.level]);

    // Target marker
    const target = L.marker([zone.coordinates.lat, zone.coordinates.lon], {
      icon: L.divIcon({
        className: 'pfz-target-icon',
        html: `<span style="--zone-color:${zone.risk.color}">🎣</span>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      }),
      title: `${zone.name} PFZ`,
    }).bindPopup(zonePopup(zone), { closeButton: true, className: 'pfz-leaflet-popup' });
    target.on('click', () => selectZone(zone, rectangle, true));
    target.addTo(groups.targets);

    // Weather marker (wind)
    L.circleMarker([zone.coordinates.lat, zone.coordinates.lon], {
      radius: 9,
      color: '#7dd3fc',
      fillColor: '#38bdf8',
      fillOpacity: 0.35,
      weight: 2,
      className: 'weather-marker',
    }).bindPopup(weatherPopup(zone), { closeButton: true, className: 'pfz-leaflet-popup' }).addTo(groups.weather);

    zoneLayers.set(zone.id, rectangle);
  });

  // Ocean Conditions
  (data.ocean_conditions || []).forEach((observation) => {
    const marker = L.circleMarker([observation.coordinates.lat, observation.coordinates.lon], {
      radius: 10,
      color: observation.condition.color,
      fillColor: observation.condition.color,
      fillOpacity: 0.52,
      weight: 2,
      className: 'ocean-marker',
    }).bindPopup(oceanPopup(observation), { closeButton: true, className: 'pfz-leaflet-popup' });
    marker.addTo(groups.ocean);
  });

  // Marine Alerts
  (data.marine_alerts || []).forEach((alert, index) => {
    const marker = L.circleMarker([alert.coordinates.lat + (index % 3) * 0.08, alert.coordinates.lon + (index % 3) * 0.08], {
      radius: 7,
      color: alertColors[alert.severity] || alertColors.INFO,
      fillColor: alertColors[alert.severity] || alertColors.INFO,
      fillOpacity: 0.78,
      weight: 2,
      className: 'alert-marker',
    }).bindPopup(alertPopup(alert), { closeButton: true, className: 'pfz-leaflet-popup' });
    marker.addTo(groups.alerts);
  });

  // User Location
  const setUserLocation = (position) => {
    userLocation = { lat: position.coords.latitude, lon: position.coords.longitude };
    groups.location.clearLayers();
    const marker = L.marker([userLocation.lat, userLocation.lon], {
      icon: L.divIcon({ className: 'user-vessel-icon', html: '<span>🚤</span>', iconSize: [38, 38], iconAnchor: [19, 19] }),
    }).bindPopup('Your GPS location', { closeButton: true });
    marker.addTo(groups.location);
    if (activeZone) {
      if (routeLine) groups.location.removeLayer(routeLine);
      routeLine = L.polyline([[userLocation.lat, userLocation.lon], [activeZone.coordinates.lat, activeZone.coordinates.lon]], {
        color: '#38bdf8', dashArray: '7 8', weight: 2,
      }).addTo(groups.location);
      selectZone(activeZone, null, false);
    }
    map.flyTo([userLocation.lat, userLocation.lon], 8, { duration: 0.8 });
    const locate = container.querySelector('.map-locate');
    if (locate) locate.textContent = '📍';
    locate?.setAttribute('title', 'GPS Active');
  };

  const requestLocation = () => {
    const locate = container.querySelector('.map-locate');
    if (!navigator.geolocation) {
      if (locate) locate.textContent = '❌';
      return;
    }
    if (locate) locate.textContent = '🔄';
    navigator.geolocation.getCurrentPosition(setUserLocation, () => {
      if (locate) locate.textContent = '❌';
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
  };

  // Basemap switching & Dropdown
  const basemapButtons = container.querySelectorAll('.basemap-btn');
  const statusBar = container.querySelector('#map-status-bar');
  const basemapContainer = container.querySelector('#basemap-dropdown-container');
  const basemapPillBtn = container.querySelector('#basemap-pill-btn');
  const closeBasemapBtn = container.querySelector('#close-basemap-btn');
  const basemapPillIcon = container.querySelector('#basemap-pill-icon');
  const basemapPillText = container.querySelector('#basemap-pill-text');
  const basemapIcons = { standard: '🗺️', satellite: '🛰️', hybrid: '🗺️🛰️', terrain: '⛰️' };

  const toggleBasemapDropdown = (open) => {
    const shouldOpen = typeof open === 'boolean' ? open : !basemapContainer?.classList.contains('is-open');
    if (shouldOpen) {
      layerContainer?.classList.remove('is-open');
      layerPillBtn?.setAttribute('aria-expanded', 'false');
    }
    basemapContainer?.classList.toggle('is-open', shouldOpen);
    basemapPillBtn?.setAttribute('aria-expanded', String(shouldOpen));
  };
  basemapPillBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleBasemapDropdown();
  });
  closeBasemapBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleBasemapDropdown(false);
  });

  const setBasemap = (name) => {
    if (!basemaps[name]) return;
    map.removeLayer(basemaps[activeBasemap]);
    activeBasemap = name;
    basemaps[activeBasemap].addTo(map);
    basemapButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.basemap === name);
    });
    if (basemapPillIcon) basemapPillIcon.textContent = basemapIcons[name] || '🗺️';
    if (basemapPillText) basemapPillText.textContent = `${name[0].toUpperCase()}${name.slice(1)}`;
    if (statusBar) statusBar.textContent = `${name[0].toUpperCase()}${name.slice(1)} basemap active`;
    toggleBasemapDropdown(false);
  };
  Object.entries(basemaps).forEach(([name, layer]) => {
    // L.layerGroup does not emit tile events — only bind to actual tile layers
    if (typeof layer.on === 'function' && layer.options && 'maxZoom' in layer.options) {
      layer.on('tileerror', () => {
        if (activeBasemap === name && name !== 'standard') {
          setBasemap('standard');
          if (statusBar) statusBar.textContent = `${name[0].toUpperCase()}${name.slice(1)} unavailable · Standard restored`;
        }
      });
    }
  });
  basemapButtons.forEach(btn => btn.addEventListener('click', () => setBasemap(btn.dataset.basemap)));

  // Layer Dropdown & Toggles
  const layerContainer = container.querySelector('#layer-dropdown-container');
  const layerPillBtn = container.querySelector('#layer-pill-btn');
  const closeLayersBtn = container.querySelector('#close-layers-btn');
  const activeLayersBadge = container.querySelector('#active-layers-badge');

  const toggleLayerDropdown = (open) => {
    const shouldOpen = typeof open === 'boolean' ? open : !layerContainer?.classList.contains('is-open');
    if (shouldOpen) {
      basemapContainer?.classList.remove('is-open');
      basemapPillBtn?.setAttribute('aria-expanded', 'false');
    }
    layerContainer?.classList.toggle('is-open', shouldOpen);
    layerPillBtn?.setAttribute('aria-expanded', String(shouldOpen));
  };
  layerPillBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleLayerDropdown();
  });
  closeLayersBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleLayerDropdown(false);
  });

  const layerSets = {
    pfz: [groups.favourable, groups.caution, groups['high-risk'], groups.targets],
    ocean: [groups.ocean],
    alerts: [groups.alerts],
    weather: [groups.weather],
    location: [groups.location],
  };

  const updateActiveBadge = () => {
    const activeCount = Object.keys(layerSets).filter(k => map.hasLayer(layerSets[k][0])).length;
    if (activeLayersBadge) activeLayersBadge.textContent = String(activeCount);
  };

  const toggleLayer = (name, button) => {
    const visible = map.hasLayer(layerSets[name][0]);
    layerSets[name].forEach(layer => (visible ? map.removeLayer(layer) : layer.addTo(map)));
    button.classList.toggle('is-active', !visible);
    button.setAttribute('aria-pressed', String(!visible));
    updateActiveBadge();
    if (statusBar) statusBar.textContent = `${button.querySelector('.layer-icon')?.textContent || ''} ${button.textContent.trim().replace(/^[🎣🌊⚠️☁️🚤]\s*/, '')} layer ${visible ? 'hidden' : 'shown'}`;
  };
  container.querySelectorAll('.map-layer-btn').forEach(button => {
    button.addEventListener('click', () => toggleLayer(button.dataset.layer, button));
  });

  // Search & Clear
  const searchInput = container.querySelector('.map-search-input');
  const searchClearBtn = container.querySelector('#search-clear-btn');

  const searchMap = () => {
    const query = searchInput?.value.trim().toLowerCase();
    if (!query) return;
    const zone = data.zones.find(item => `${item.name} ${item.state}`.toLowerCase().includes(query));
    if (zone) {
      selectZone(zone, zoneLayers.get(zone.id), true);
      if (statusBar) statusBar.textContent = `${zone.name} selected`;
      return;
    }
    const ocean = data.ocean_conditions?.find(item => `${item.region} ${item.state}`.toLowerCase().includes(query));
    if (ocean) {
      map.flyTo([ocean.coordinates.lat, ocean.coordinates.lon], 7, { duration: 0.7 });
      if (statusBar) statusBar.textContent = `${ocean.region} centered`;
      return;
    }
    if (statusBar) statusBar.textContent = 'No matching advisory region';
  };

  searchInput?.addEventListener('input', () => {
    if (searchClearBtn) searchClearBtn.style.display = searchInput.value.trim() ? 'flex' : 'none';
  });
  searchClearBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.style.display = 'none';
    searchInput?.focus();
    if (statusBar) statusBar.textContent = 'Search cleared';
  });
  searchInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') searchMap();
    if (event.key === 'Escape') {
      if (searchInput) searchInput.value = '';
      if (searchClearBtn) searchClearBtn.style.display = 'none';
    }
  });

  // Map actions
  container.querySelector('.map-locate')?.addEventListener('click', requestLocation);
  container.querySelector('.map-reset')?.addEventListener('click', () => {
    map.closePopup();
    map.flyTo(indianWestCoast, 5, { duration: 0.7 });
    if (statusBar) statusBar.textContent = 'Map view reset';
  });

  // Best zone
  container.querySelector('.best-zone')?.addEventListener('click', () => {
    const ordered = [...data.zones].sort((a, b) => {
      const distanceWeight = userLocation ? distanceKm(userLocation, a.coordinates) - distanceKm(userLocation, b.coordinates) : 0;
      return (scoreZone(b) - scoreZone(a)) || distanceWeight;
    });
    const best = ordered[0];
    selectZone(best, zoneLayers.get(best.id), true);
    const button = container.querySelector('.best-zone');
    button.textContent = `✓ Best: ${best.state}`;
    setTimeout(() => { button.textContent = '🎯'; }, 2400);
  });

  // Zen Mode (Clean Map View)
  const zenBtn = container.querySelector('#map-zen-btn');
  const mapCard = container.querySelector('.marine-map-card');
  zenBtn?.addEventListener('click', () => {
    const isZen = mapCard.classList.toggle('map-zen-mode');
    zenBtn.classList.toggle('active', isZen);
    zenBtn.textContent = isZen ? '✕' : '👁️';
    zenBtn.title = isZen ? 'Exit Clean Map view' : 'Toggle Clean Map view (hide all panels)';
    if (statusBar) statusBar.textContent = isZen ? 'Clean view active · Tap ✕ to restore controls' : 'Controls restored';
  });

  // Legend toggle & close
  const legendWidget = container.querySelector('#map-legend-widget');
  const legendBtn = container.querySelector('.legend-toggle-btn');
  const legendCloseBtn = container.querySelector('#legend-close-btn');

  if (legendBtn && legendWidget) {
    legendBtn.addEventListener('click', () => {
      const isOpen = legendWidget.classList.toggle('is-open');
      legendBtn.setAttribute('aria-expanded', String(isOpen));
      const arrow = legendBtn.querySelector('.toggle-arrow');
      if (arrow) arrow.textContent = isOpen ? '▴' : '▾';
    });
  }
  legendCloseBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    legendWidget?.classList.remove('is-open');
    legendBtn?.setAttribute('aria-expanded', 'false');
    const arrow = legendBtn?.querySelector('.toggle-arrow');
    if (arrow) arrow.textContent = '▾';
  });

  // Click outside to close open dropdowns
  document.addEventListener('click', (e) => {
    if (layerContainer?.classList.contains('is-open') && !layerContainer.contains(e.target)) {
      toggleLayerDropdown(false);
    }
    if (basemapContainer?.classList.contains('is-open') && !basemapContainer.contains(e.target)) {
      toggleBasemapDropdown(false);
    }
    if (legendWidget?.classList.contains('is-open') && !legendWidget.contains(e.target)) {
      legendWidget.classList.remove('is-open');
      legendBtn?.setAttribute('aria-expanded', 'false');
      const arrow = legendBtn?.querySelector('.toggle-arrow');
      if (arrow) arrow.textContent = '▾';
    }
  });

  // Auto-select best zone on load silently without popping up intrusive dialog
  const best = [...data.zones].sort((a, b) => scoreZone(b) - scoreZone(a))[0];
  selectZone(best, zoneLayers.get(best.id), false);
  setTimeout(() => map.invalidateSize(), 100);
}