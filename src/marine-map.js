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
      <div class="marine-map-topbar">
        <div><div class="eyebrow">LIVE DEMO COMMAND MAP</div><h1>Marine intelligence, mapped.</h1></div>
        <div class="map-top-actions"><button type="button" class="map-locate">📍 My location</button><button type="button" class="best-zone">🎯 Find Best Zone</button></div>
      </div>
      <div class="marine-map-canvas" id="orca-marine-map"></div>
      <div class="marine-map-legend" aria-label="Map legend"><strong>ADVISORY STATUS</strong><span><i class="legend-dot good"></i> Favourable PFZ</span><span><i class="legend-dot caution"></i> Caution</span><span><i class="legend-dot danger"></i> High risk</span><span>🎣 PFZ target</span><span>🚤 Your position</span></div>
      <div class="marine-map-note">${escapeHtml(data.source)} · updated ${new Date(data.last_updated).toLocaleDateString()}</div>
    </section>
    <aside class="zone-detail-panel" aria-live="polite">${detailHtml(null)}</aside>`;

  const mapEl = container.querySelector('#orca-marine-map');
  const panel = container.querySelector('.zone-detail-panel');
  const map = window.L?.map(mapEl, { zoomControl: false, attributionControl: true }).setView(indianWestCoast, 5);
  if (!map) {
    mapEl.innerHTML = '<div class="map-load-error">Map engine unavailable.</div>';
    return;
  }
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap' }).addTo(map);

  const groups = {
    favourable: L.layerGroup().addTo(map),
    caution: L.layerGroup().addTo(map),
    'high-risk': L.layerGroup().addTo(map),
    targets: L.layerGroup().addTo(map),
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
    zoneLayers.set(zone.id, rectangle);
  });

  L.control.layers(null, {
    '🟢 Favourable PFZ': groups.favourable,
    '🟡 Caution zones': groups.caution,
    '🔴 High-risk zones': groups['high-risk'],
    '🎣 PFZ targets': groups.targets,
    '🚤 My location': groups.location,
  }, { position: 'topright', collapsed: false }).addTo(map);

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

  container.querySelector('.map-locate').addEventListener('click', requestLocation);
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
