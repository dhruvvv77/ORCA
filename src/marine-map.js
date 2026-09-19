/**
 * ORCA home map.  The data is served by /api/marine-map, which composes the
 * existing PFZ, ocean and GIS mock advisories on the server.
 */

let activeZone = null;
let userLocation = null;
let mapContextCallback = null;

const indianWestCoast = [15.5, 76.2];
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
}[char]));

function distanceKm(from, to) {
  const rad = Math.PI / 180;
  const dLat = (to.lat - from.lat) * rad;
  const dLon = (to.lon - from.lon) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(from.lat * rad) * Math.cos(to.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function scoreZone(zone) {
  // This deliberately uses only fields already supplied by the PFZ/ocean mock data.
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
      <header class="marine-map-header">
        <div class="map-header-branding">
          <div class="eyebrow">ORCA OPERATIONS · MARITIME INTELLIGENCE</div>
          <div class="map-title-row">
            <h1>Marine Operations Map</h1>
            <div class="map-status-strip">
              <span class="status-chip"><b class="dot pfz">●</b> ${data.zones.length} PFZ Zones</span>
              <span class="status-chip"><b class="dot ocean">◌</b> ${data.ocean_conditions?.length || 0} Ocean Sectors</span>
              <span class="status-chip"><b class="dot alert">⚠</b> ${data.marine_alerts?.length || 0} Alerts</span>
            </div>
          </div>
        </div>
        <div class="map-header-controls">
          <div class="map-search-bar">
            <input class="map-search-input" type="search" placeholder="Search zone or state..." aria-label="Search map regions">
            <button type="button" class="map-search-button">Search</button>
          </div>
          <div class="map-quick-actions">
            <label class="map-basemap-picker" title="Switch basemap">
              <span class="basemap-icon">🗺️</span>
              <select class="map-basemap" aria-label="Map basemap">
                <option value="standard">Standard</option>
                <option value="satellite">Satellite</option>
                <option value="hybrid">Hybrid</option>
                <option value="terrain">Terrain</option>
              </select>
            </label>
            <button type="button" class="map-action-btn map-locate" title="Find my location">📍 Locate me</button>
            <button type="button" class="map-action-btn map-reset" title="Reset map view">↺ Reset</button>
            <button type="button" class="map-action-btn best-zone" title="Find highest-scoring fishing zone">🎯 Best Zone</button>
          </div>
        </div>
      </header>
      <div class="marine-map-viewport">
        <div class="marine-map-canvas" id="orca-marine-map"></div>
        <div class="map-layer-toolbar" role="group" aria-label="Toggle map layers">
          <span class="toolbar-label">Layers:</span>
          <button type="button" class="map-layer-button is-active" data-layer="pfz" aria-pressed="true">🎣 PFZ</button>
          <button type="button" class="map-layer-button is-active" data-layer="ocean" aria-pressed="true">🌊 Ocean</button>
          <button type="button" class="map-layer-button is-active" data-layer="alerts" aria-pressed="true">⚠️ Alerts</button>
          <button type="button" class="map-layer-button" data-layer="weather" aria-pressed="false">☁️ Weather</button>
        </div>
        <div class="marine-map-legend-widget">
          <button type="button" class="legend-toggle-btn" aria-expanded="false" aria-label="Toggle map legend">
            <span class="legend-quick-indicators">
              <i class="legend-dot good"></i> Favourable
              <i class="legend-dot caution"></i> Caution
              <i class="legend-dot danger"></i> High Risk
            </span>
            <span class="legend-toggle-label">Legend <span class="toggle-arrow">▾</span></span>
          </button>
          <div class="legend-expanded-popover">
            <div class="legend-section-title">ADVISORY STATUS</div>
            <div class="legend-grid">
              <span><i class="legend-dot good"></i> Favourable PFZ / calm</span>
              <span><i class="legend-dot caution"></i> Caution / moderate swell</span>
              <span><i class="legend-dot danger"></i> High risk / rough waves</span>
              <span><i class="legend-dot warning"></i> Marine Warning</span>
              <span><i class="legend-dot info"></i> Advisory Info</span>
              <span>🎣 PFZ Target</span>
              <span>🌊 Ocean Station</span>
              <span>⚠️ Marine Alert</span>
              <span>🚤 GPS Location</span>
            </div>
          </div>
        </div>
        <div class="map-control-status" aria-live="polite">Standard basemap active</div>
      </div>
      <footer class="marine-map-footer">
        <span class="map-note">Simulated INCOIS/ISRO telemetry · Updated ${data.last_updated ? new Date(data.last_updated).toISOString().slice(0, 10) : 'recent'}</span>
      </footer>
    </section>
    <aside class="zone-detail-panel" aria-live="polite">${detailHtml(null)}</aside>`;

  const mapEl = container.querySelector('#orca-marine-map');
  const panel = container.querySelector('.zone-detail-panel');
  const map = window.L?.map(mapEl, { zoomControl: false, attributionControl: true }).setView(indianWestCoast, 5);
  if (!map) {
    mapEl.innerHTML = '<div class="map-load-error">Map engine unavailable.</div>';
    return;
  }
  L.control.zoom({ position: 'topleft' }).addTo(map);
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

  const selectZone = (zone, layer) => {
    activeZone = zone;
    panel.innerHTML = detailHtml(zone);
    mapContextCallback?.(zone, userLocation);
    if (layer) {
      map.flyToBounds(layer.getBounds ? layer.getBounds().pad(0.7) : L.latLngBounds([[zone.coordinates.lat, zone.coordinates.lon]]), { maxZoom: 8, duration: 0.7 });
      layer.openPopup?.();
    }
    bindPanelActions();
  };

  const bindPanelActions = () => {
    panel.querySelector('.zone-ask')?.addEventListener('click', () => onAskOrca?.(activeZone, userLocation));
    panel.querySelector('.zone-details')?.addEventListener('click', () => {
      panel.classList.toggle('zone-detail-expanded');
      const button = panel.querySelector('.zone-details');
      if (button) button.textContent = panel.classList.contains('zone-detail-expanded') ? '⌃ Less' : '⌄ Details';
    });
  };

  data.zones.forEach((zone) => {
    const bounds = [[zone.bounds.south, zone.bounds.west], [zone.bounds.north, zone.bounds.east]];
    const rectangle = L.rectangle(bounds, { color: zone.risk.color, weight: 2, fillColor: zone.risk.color, fillOpacity: 0.18 }).bindPopup(zonePopup(zone), { closeButton: false });
    rectangle.on('click', () => selectZone(zone, rectangle));
    rectangle.addTo(groups[zone.risk.level]);
    const target = L.marker([zone.coordinates.lat, zone.coordinates.lon], {
      icon: L.divIcon({ className: 'pfz-target-icon', html: `<span style="--zone-color:${zone.risk.color}">🎣</span>`, iconSize: [34, 34], iconAnchor: [17, 17] }),
      title: `${zone.name} PFZ`,
    }).bindPopup(zonePopup(zone), { closeButton: false });
    target.on('click', () => selectZone(zone, rectangle));
    target.addTo(groups.targets);
    L.circleMarker([zone.coordinates.lat, zone.coordinates.lon], {
      radius: 9,
      color: '#7dd3fc',
      fillColor: '#38bdf8',
      fillOpacity: 0.35,
      weight: 2,
    }).bindPopup(weatherPopup(zone), { closeButton: false }).addTo(groups.weather);
    zoneLayers.set(zone.id, rectangle);
  });

  (data.ocean_conditions || []).forEach((observation) => {
    const marker = L.circleMarker([observation.coordinates.lat, observation.coordinates.lon], {
      radius: 10,
      color: observation.condition.color,
      fillColor: observation.condition.color,
      fillOpacity: 0.52,
      weight: 2,
    }).bindPopup(oceanPopup(observation), { closeButton: false });
    marker.addTo(groups.ocean);
  });

  (data.marine_alerts || []).forEach((alert, index) => {
    const marker = L.circleMarker([alert.coordinates.lat + (index % 3) * 0.08, alert.coordinates.lon + (index % 3) * 0.08], {
      radius: 7,
      color: alertColors[alert.severity] || alertColors.INFO,
      fillColor: alertColors[alert.severity] || alertColors.INFO,
      fillOpacity: 0.78,
      weight: 2,
    }).bindPopup(alertPopup(alert), { closeButton: false });
    marker.addTo(groups.alerts);
  });

  const setUserLocation = (position) => {
    userLocation = { lat: position.coords.latitude, lon: position.coords.longitude };
    groups.location.clearLayers();
    const marker = L.marker([userLocation.lat, userLocation.lon], { icon: L.divIcon({ className: 'user-vessel-icon', html: '<span>🚤</span>', iconSize: [38, 38], iconAnchor: [19, 19] }) }).bindPopup('Your GPS location');
    marker.addTo(groups.location);
    if (activeZone) {
      if (routeLine) groups.location.removeLayer(routeLine);
      routeLine = L.polyline([[userLocation.lat, userLocation.lon], [activeZone.coordinates.lat, activeZone.coordinates.lon]], { color: '#38bdf8', dashArray: '7 8', weight: 2 }).addTo(groups.location);
      selectZone(activeZone);
    }
    map.flyTo([userLocation.lat, userLocation.lon], 8, { duration: 0.8 });
    const locate = container.querySelector('.map-locate');
    if (locate) locate.textContent = '📍 GPS active';
  };

  const requestLocation = () => {
    const locate = container.querySelector('.map-locate');
    if (!navigator.geolocation) {
      if (locate) locate.textContent = 'GPS unavailable';
      return;
    }
    if (locate) locate.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(setUserLocation, () => {
      if (locate) locate.textContent = 'GPS permission needed';
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
  };

  const basemapPicker = container.querySelector('.map-basemap');
  const controlStatus = container.querySelector('.map-control-status');
  const setBasemap = (name) => {
    if (!basemaps[name]) return;
    map.removeLayer(basemaps[activeBasemap]);
    activeBasemap = name;
    basemaps[activeBasemap].addTo(map);
    if (basemapPicker) basemapPicker.value = activeBasemap;
    if (controlStatus) controlStatus.textContent = `${name[0].toUpperCase()}${name.slice(1)} basemap active`;
  };
  Object.entries(basemaps).forEach(([name, layer]) => layer.on('tileerror', () => {
    if (activeBasemap === name && name !== 'standard') {
      setBasemap('standard');
      if (controlStatus) controlStatus.textContent = `${name[0].toUpperCase()}${name.slice(1)} is unavailable · Standard restored`;
    }
  }));
  basemapPicker?.addEventListener('change', (event) => setBasemap(event.target.value));

  const searchMap = () => {
    const query = container.querySelector('.map-search-input')?.value.trim().toLowerCase();
    if (!query) return;
    const zone = data.zones.find((item) => `${item.name} ${item.state}`.toLowerCase().includes(query));
    if (zone) {
      selectZone(zone, zoneLayers.get(zone.id));
      if (controlStatus) controlStatus.textContent = `${zone.name} selected`;
      return;
    }
    const ocean = data.ocean_conditions?.find((item) => `${item.region} ${item.state}`.toLowerCase().includes(query));
    if (ocean) {
      map.flyTo([ocean.coordinates.lat, ocean.coordinates.lon], 7, { duration: 0.7 });
      if (controlStatus) controlStatus.textContent = `${ocean.region} centered`;
      return;
    }
    if (controlStatus) controlStatus.textContent = 'No matching advisory region';
  };

  const layerSets = {
    pfz: [groups.favourable, groups.caution, groups['high-risk'], groups.targets],
    ocean: [groups.ocean],
    alerts: [groups.alerts],
    weather: [groups.weather],
  };
  const toggleLayer = (name, button) => {
    const visible = map.hasLayer(layerSets[name][0]);
    layerSets[name].forEach((layer) => (visible ? map.removeLayer(layer) : layer.addTo(map)));
    button.classList.toggle('is-active', !visible);
    button.setAttribute('aria-pressed', String(!visible));
    if (controlStatus) controlStatus.textContent = `${button.textContent.trim()} layer ${visible ? 'hidden' : 'shown'}`;
  };

  container.querySelector('.map-locate').addEventListener('click', requestLocation);
  container.querySelector('.map-reset').addEventListener('click', () => {
    map.closePopup();
    map.flyTo(indianWestCoast, 5, { duration: 0.7 });
    if (controlStatus) controlStatus.textContent = 'Map view reset';
  });
  container.querySelector('.map-search-button').addEventListener('click', searchMap);
  container.querySelector('.map-search-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') searchMap();
  });
    const legendWidget = container.querySelector('.marine-map-legend-widget');
  const legendBtn = container.querySelector('.legend-toggle-btn');
  if (legendBtn && legendWidget) {
    legendBtn.addEventListener('click', () => {
      const isOpen = legendWidget.classList.toggle('is-open');
      legendBtn.setAttribute('aria-expanded', String(isOpen));
      const arrow = legendBtn.querySelector('.toggle-arrow');
      if (arrow) arrow.textContent = isOpen ? '▴' : '▾';
    });
  }

  container.querySelectorAll('.map-layer-button').forEach((button) => {
    button.addEventListener('click', () => toggleLayer(button.dataset.layer, button));
  });
  container.querySelector('.best-zone').addEventListener('click', () => {
    const ordered = [...data.zones].sort((a, b) => {
      const distanceWeight = userLocation ? distanceKm(userLocation, a.coordinates) - distanceKm(userLocation, b.coordinates) : 0;
      return (scoreZone(b) - scoreZone(a)) || distanceWeight;
    });
    const best = ordered[0];
    selectZone(best, zoneLayers.get(best.id));
    const button = container.querySelector('.best-zone');
    button.textContent = `✓ Best: ${best.state}`;
    setTimeout(() => { button.textContent = '🎯 Find Best Zone'; }, 2400);
  });

  const best = [...data.zones].sort((a, b) => scoreZone(b) - scoreZone(a))[0];
  selectZone(best, zoneLayers.get(best.id));
  setTimeout(() => map.invalidateSize(), 100);
}
