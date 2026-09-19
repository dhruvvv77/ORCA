(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();let oe="en";const Me={en:"English",hi:"हिन्दी",bn:"বাংলা",ta:"தமிழ்",te:"తెలుగు",mr:"मराठी",gu:"ગુજરાતી",kn:"ಕನ್ನಡ",ml:"മലയാളം",pa:"ਪੰਜਾਬੀ",ur:"اردو"};function re(){return oe}function Xe(e){Me[e]&&(oe=e,localStorage.setItem("weathergpt-lang",e))}function et(){const e=localStorage.getItem("weathergpt-lang");return e&&Me[e]&&(oe=e),oe}function We(){const e={en:"Ask about fishing zones, ocean conditions, weather...",hi:"कहीं भी मौसम के बारे में पूछें...",bn:"যেকোনো জায়গার আবহাওয়া সম্পর্কে জিজ্ঞাসা করুন...",ta:"எங்கும் வானிலை பற்றி கேளுங்கள்...",te:"ఎక్కడైనా వాతావరణం గురించి అడగండి...",mr:"कुठेही हवामानाबद्दल विचारा...",gu:"ગમે ત્યાં હવામાન વિશે પૂછો...",kn:"ಎಲ್ಲಿಯಾದರೂ ಹವಾಮಾನದ ಬಗ್ಗೆ ಕೇಳಿ...",ml:"എവിടെയും കാലാവസ്ഥയെക്കുറിച്ച് ചോദിക്കൂ...",pa:"ਕਿਤੇ ਵੀ ਮੌਸਮ ਬਾਰੇ ਪੁੱਛੋ...",ur:"...کہیں بھی موسم کے بارے میں پوچھیں"};return e[oe]||e.en}let B=null,ie=!1,Q=!1,ge=null,R=null;const le={en:"en-IN",hi:"hi-IN",bn:"bn-IN",ta:"ta-IN",te:"te-IN",mr:"mr-IN",gu:"gu-IN",kn:"kn-IN",ml:"ml-IN",pa:"pa-IN",ur:"ur-IN"};function Be(){return!!(window.SpeechRecognition||window.webkitSpeechRecognition)}function Ge(){return!!window.speechSynthesis}function tt(e,t){ge=e,R=t;const a=window.SpeechRecognition||window.webkitSpeechRecognition;return a?(B=new a,B.continuous=!1,B.interimResults=!1,B.maxAlternatives=1,B.onresult=s=>{const n=s.results[0][0].transcript;ge&&ge(n)},B.onend=()=>{ie=!1,R&&R("stopped")},B.onerror=s=>{console.warn("Speech recognition error:",s.error),ie=!1,s.error==="not-allowed"?R&&R("denied"):R&&R("error")},!0):(console.warn("SpeechRecognition not supported"),!1)}function at(){if(!B)return;if(ie){st();return}const e=re();B.lang=le[e]||"en-IN";try{B.start(),ie=!0,R&&R("listening")}catch(t){console.warn("Failed to start recognition:",t),R&&R("error")}}function st(){B&&ie&&(B.stop(),ie=!1,R&&R("stopped"))}function nt(e){var d;if(!window.speechSynthesis||!Q)return;window.speechSynthesis.cancel();const t=e.replace(/[\u{1F300}-\u{1FAFF}]/gu,"").replace(/[*_~`#]/g,"").trim();if(!t)return;const a=new SpeechSynthesisUtterance(t),s=re();a.lang=le[s]||"en-IN",a.rate=1,a.pitch=1,a.volume=.9;const n=window.speechSynthesis.getVoices(),o=((d=le[s])==null?void 0:d.split("-")[0])||"en",c=n.find(l=>l.lang.startsWith(o));c&&(a.voice=c),window.speechSynthesis.speak(a)}function it(e,t){var l;if(!window.speechSynthesis){t&&t();return}window.speechSynthesis.cancel();const a=e.replace(/[\u{1F300}-\u{1FAFF}]/gu,"").replace(/[*_~`#]/g,"").trim();if(!a){t&&t();return}const s=new SpeechSynthesisUtterance(a),n=re();s.lang=le[n]||"en-IN",s.rate=1,s.pitch=1,s.volume=.9;const o=window.speechSynthesis.getVoices(),c=((l=le[n])==null?void 0:l.split("-")[0])||"en",d=o.find(m=>m.lang.startsWith(c));d&&(s.voice=d),t&&(s.onend=()=>t(),s.onerror=()=>t()),window.speechSynthesis.speak(s)}function ot(){var e;return Q=!Q,localStorage.setItem("weathergpt-autospeak",Q),Q||(e=window.speechSynthesis)==null||e.cancel(),Q}function lt(){return Q}function rt(){return Q=localStorage.getItem("weathergpt-autospeak")==="true",Q}const ct={"01d":"☀️","01n":"🌙","02d":"⛅","02n":"☁️","03d":"☁️","03n":"☁️","04d":"☁️","04n":"☁️","09d":"🌧️","09n":"🌧️","10d":"🌦️","10n":"🌧️","11d":"⛈️","11n":"⛈️","13d":"❄️","13n":"❄️","50d":"🌫️","50n":"🌫️"};function dt(e){return ct[e]||"🌡️"}function pt(e,t){if(!(t!=null&&t.forecast)||!window.Chart)return null;const a=t.forecast,s=document.createElement("canvas");s.classList.add("forecast-chart-canvas"),e.appendChild(s);const n=a.map(p=>p.day_name),o=a.map(p=>p.temperature.high),c=a.map(p=>p.temperature.low),d=s.getContext("2d"),l=d.createLinearGradient(0,0,0,200);l.addColorStop(0,"rgba(245, 158, 11, 0.3)"),l.addColorStop(1,"rgba(245, 158, 11, 0.02)");const m=d.createLinearGradient(0,0,0,200);return m.addColorStop(0,"rgba(96, 165, 250, 0.2)"),m.addColorStop(1,"rgba(96, 165, 250, 0.02)"),new Chart(d,{type:"line",data:{labels:n,datasets:[{label:"High",data:o,borderColor:"#f59e0b",backgroundColor:l,borderWidth:2.5,fill:!0,tension:.4,pointBackgroundColor:"#f59e0b",pointBorderColor:"#1a2035",pointBorderWidth:2,pointRadius:5,pointHoverRadius:7},{label:"Low",data:c,borderColor:"#60a5fa",backgroundColor:m,borderWidth:2.5,fill:!0,tension:.4,pointBackgroundColor:"#60a5fa",pointBorderColor:"#1a2035",pointBorderWidth:2,pointRadius:5,pointHoverRadius:7}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{intersect:!1,mode:"index"},plugins:{legend:{display:!0,position:"top",align:"end",labels:{color:"#94a3b8",font:{family:"'Inter', sans-serif",size:11},boxWidth:12,boxHeight:2,useBorderRadius:!0,borderRadius:1,padding:12}},tooltip:{backgroundColor:"rgba(17, 24, 39, 0.95)",titleColor:"#f1f5f9",bodyColor:"#94a3b8",borderColor:"rgba(255, 255, 255, 0.06)",borderWidth:1,cornerRadius:8,padding:10,titleFont:{family:"'Inter', sans-serif",weight:"600"},bodyFont:{family:"'Inter', sans-serif"},callbacks:{label:p=>`${p.dataset.label}: ${p.parsed.y}°C`}}},scales:{x:{grid:{display:!1},border:{display:!1},ticks:{color:"#64748b",font:{family:"'Inter', sans-serif",size:11,weight:"500"}}},y:{grid:{color:"rgba(255, 255, 255, 0.04)",drawTicks:!1},border:{display:!1},ticks:{color:"#64748b",font:{family:"'Inter', sans-serif",size:11},padding:8,callback:p=>`${p}°`}}}}})}let te=null,z=null,ue=null;const Ie=[15.5,76.2],T=(e="")=>String(e).replace(/[&<>'"]/g,t=>({"&":"&","<":"<",">":">","'":"'",'"':'"'})[t]);function we(e,t){const a=Math.PI/180,s=(t.lat-e.lat)*a,n=(t.lon-e.lon)*a,o=Math.sin(s/2)**2+Math.cos(e.lat*a)*Math.cos(t.lat*a)*Math.sin(n/2)**2;return 6371*2*Math.atan2(Math.sqrt(o),Math.sqrt(1-o))}function de(e){var s,n;const t=e.risk.level==="favourable"?20:e.risk.level==="caution"?5:-30,a=((n=(s=e.ocean)==null?void 0:s.wave)==null?void 0:n.significant_height_m)||0;return e.confidence*100+t-e.wind_speed_knots*.35-a*2}function Oe(e){return`<div class="marine-popup">
    <strong>🎣 ${T(e.name)}</strong>
    <span class="marine-popup-status" style="color:${e.risk.color}">● ${T(e.risk.label)}</span>
    <small>${Math.round(e.confidence*100)}% confidence · ${T(e.likely_species.join(", "))}</small>
  </div>`}function ut(e){var s,n;const t=((s=e.sst)==null?void 0:s.value)??"—",a=((n=e.chlorophyll)==null?void 0:n.value)??"—";return`<div class="marine-popup ocean-popup">
    <strong>🌊 ${T(e.region)}</strong>
    <span class="marine-popup-status" style="color:${e.condition.color}">● ${T(e.condition.label)}</span>
    <small>SST ${T(t)}°C · Chlorophyll ${T(a)} mg/m³</small>
    <small><strong>MOCK/DEMO</strong> · ${T(e.source)}</small>
  </div>`}const se={INFO:"#38bdf8",CAUTION:"#facc15",WARNING:"#fb923c",DANGER:"#ef4444"};function mt(e){return`<div class="marine-popup marine-alert-popup">
    <strong>⚠️ ${T(e.title)}</strong>
    <span class="marine-popup-status" style="color:${se[e.severity]||se.INFO}">● ${T(e.severity)}</span>
    <small>${T(e.message)}</small>
    <small>Affected zone: ${T(e.affected_zone||"not supplied")}</small>
    <small>Source: ${T(e.source)}</small>
    <small>Timestamp: ${T(e.timestamp||"not supplied")} ${e.is_demo?"· MOCK/DEMO":""}</small>
  </div>`}function vt(e){return`<div class="marine-popup weather-popup">
    <strong>☁️ ${T(e.state)} wind telemetry</strong>
    <span class="marine-popup-status" style="color:#7dd3fc">● DEMO WEATHER LAYER</span>
    <small>Wind: ${T(e.wind_speed_knots)} kt</small>
    <small><strong>MOCK/DEMO</strong> · Existing PFZ advisory telemetry</small>
  </div>`}function Fe(e){var n,o,c;if(!e)return'<div class="zone-empty"><span>🎣</span><strong>Select a PFZ zone</strong><p>Tap a coloured marine zone to see fish, safety and ocean telemetry.</p></div>';const t=z?`${we(z,e.coordinates).toFixed(1)} km from you`:"Enable GPS to calculate distance",a=(n=e.ocean)==null?void 0:n.wave,s=e.risk.level;return`
    <div class="zone-panel-kicker">SELECTED PFZ · ${T(e.state)}</div>
    <div class="zone-panel-heading">
      <div><h2>${T(e.name)}</h2><p>🎣 ${T(e.likely_species.join(" · "))}</p></div>
      <span class="zone-risk ${s}">● ${T(e.risk.label)}</span>
    </div>
    <p class="zone-advisory">${T(e.advisory)}</p>
    <div class="zone-metrics">
      <div><span>Confidence</span><strong>${Math.round(e.confidence*100)}%</strong></div>
      <div><span>🌡️ SST</span><strong>${e.sst_celsius}°C</strong></div>
      <div><span>🌿 Chlorophyll</span><strong>${e.chlorophyll_mg_m3} mg/m³</strong></div>
      <div><span>💨 Wind</span><strong>${e.wind_speed_knots} kt</strong></div>
      <div><span>🌊 Wave</span><strong>${a?`${a.significant_height_m} m`:"—"}</strong></div>
      <div><span>📍 Distance</span><strong>${t}</strong></div>
    </div>
    <div class="zone-current">Current ${T((o=e.ocean)!=null&&o.current?`${e.ocean.current.speed_knots} kt ${e.ocean.current.direction}`:"not available")} · Depth ${e.depth_range_m.min}–${e.depth_range_m.max} m</div>
    <div class="zone-additional">
      <span>Coordinates ${e.coordinates.lat.toFixed(2)}°N, ${e.coordinates.lon.toFixed(2)}°E</span>
      <span>Salinity ${((c=e.ocean)==null?void 0:c.salinity_psu)??"—"} PSU</span>
      <span>Advisory valid until ${e.valid_until?new Date(e.valid_until).toLocaleString():"not supplied"}</span>
    </div>
    <div class="zone-panel-actions">
      <button type="button" class="zone-action zone-ask">💬 Ask ORCA</button>
      <a class="zone-action zone-navigate" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${e.coordinates.lat},${e.coordinates.lon}">🧭 Navigate</a>
      <button type="button" class="zone-action zone-details">⌄ Details</button>
    </div>
    <div class="zone-source">Demo advisory · existing ORCA mock data</div>`}async function ft(e,{onAskOrca:t,onZoneChange:a}={}){ue=a,e.innerHTML='<div class="marine-map-loading"><span>◌</span> Loading PFZ advisory layers…</div>';try{const s=await fetch("/api/marine-map");if(!s.ok)throw new Error("Map data request failed");const n=await s.json();gt(e,n,t)}catch(s){e.innerHTML='<div class="marine-map-loading map-load-error">⚠️ Marine advisory layers are unavailable. The chat remains available.</div>',console.error("Marine map:",s)}}function gt(e,t,a){var _e,Ne,qe,Pe;e.innerHTML=`
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
    <aside class="zone-detail-panel" aria-live="polite" style="display:none;">${Fe(null)}</aside>
  `;const s=e.querySelector("#orca-marine-map"),n=e.querySelector(".zone-detail-panel"),o=(_e=window.L)==null?void 0:_e.map(s,{zoomControl:!1,attributionControl:!0}).setView(Ie,5);if(!o){s.innerHTML='<div class="map-load-error">Map engine unavailable.</div>';return}L.control.zoom({position:"bottomleft"}).addTo(o);const c={standard:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:"© OpenStreetMap"}),satellite:L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{maxZoom:18,attribution:"Tiles © Esri"}),hybrid:L.layerGroup([L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{maxZoom:18,attribution:"Tiles © Esri"}),L.tileLayer("https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",{maxZoom:18,attribution:"Labels © Esri"})]),terrain:L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{maxZoom:17,attribution:"© OpenTopoMap contributors"})};let d="standard";c.standard.addTo(o);const l={favourable:L.layerGroup().addTo(o),caution:L.layerGroup().addTo(o),"high-risk":L.layerGroup().addTo(o),targets:L.layerGroup().addTo(o),ocean:L.layerGroup().addTo(o),alerts:L.layerGroup().addTo(o),weather:L.layerGroup(),location:L.layerGroup().addTo(o)},m=new Map;let g=null;const p=(i,r,k=!0)=>{var Z;te=i,n&&(n.innerHTML=Fe(i)),ue==null||ue(i,z),r&&k&&(o.flyToBounds(r.getBounds?r.getBounds().pad(.7):L.latLngBounds([[i.coordinates.lat,i.coordinates.lon]]),{maxZoom:8,duration:.7}),(Z=r.openPopup)==null||Z.call(r)),C()},C=()=>{var i,r;(i=n==null?void 0:n.querySelector(".zone-ask"))==null||i.addEventListener("click",()=>a==null?void 0:a(te,z)),(r=n==null?void 0:n.querySelector(".zone-details"))==null||r.addEventListener("click",()=>{n.classList.toggle("zone-detail-expanded");const k=n.querySelector(".zone-details");k&&(k.textContent=n.classList.contains("zone-detail-expanded")?"⌃ Less":"⌄ Details")})};t.zones.forEach(i=>{const r=[[i.bounds.south,i.bounds.west],[i.bounds.north,i.bounds.east]],k=L.rectangle(r,{color:i.risk.color,weight:2,fillColor:i.risk.color,fillOpacity:.18,className:"pfz-zone"}).bindPopup(Oe(i),{closeButton:!0,className:"pfz-leaflet-popup"});k.on("click",()=>p(i,k,!0)),k.addTo(l[i.risk.level]);const Z=L.marker([i.coordinates.lat,i.coordinates.lon],{icon:L.divIcon({className:"pfz-target-icon",html:`<span style="--zone-color:${i.risk.color}">🎣</span>`,iconSize:[34,34],iconAnchor:[17,17]}),title:`${i.name} PFZ`}).bindPopup(Oe(i),{closeButton:!0,className:"pfz-leaflet-popup"});Z.on("click",()=>p(i,k,!0)),Z.addTo(l.targets),L.circleMarker([i.coordinates.lat,i.coordinates.lon],{radius:9,color:"#7dd3fc",fillColor:"#38bdf8",fillOpacity:.35,weight:2,className:"weather-marker"}).bindPopup(vt(i),{closeButton:!0,className:"pfz-leaflet-popup"}).addTo(l.weather),m.set(i.id,k)}),(t.ocean_conditions||[]).forEach(i=>{L.circleMarker([i.coordinates.lat,i.coordinates.lon],{radius:10,color:i.condition.color,fillColor:i.condition.color,fillOpacity:.52,weight:2,className:"ocean-marker"}).bindPopup(ut(i),{closeButton:!0,className:"pfz-leaflet-popup"}).addTo(l.ocean)}),(t.marine_alerts||[]).forEach((i,r)=>{L.circleMarker([i.coordinates.lat+r%3*.08,i.coordinates.lon+r%3*.08],{radius:7,color:se[i.severity]||se.INFO,fillColor:se[i.severity]||se.INFO,fillOpacity:.78,weight:2,className:"alert-marker"}).bindPopup(mt(i),{closeButton:!0,className:"pfz-leaflet-popup"}).addTo(l.alerts)});const h=i=>{z={lat:i.coords.latitude,lon:i.coords.longitude},l.location.clearLayers(),L.marker([z.lat,z.lon],{icon:L.divIcon({className:"user-vessel-icon",html:"<span>🚤</span>",iconSize:[38,38],iconAnchor:[19,19]})}).bindPopup("Your GPS location",{closeButton:!0}).addTo(l.location),te&&(g&&l.location.removeLayer(g),g=L.polyline([[z.lat,z.lon],[te.coordinates.lat,te.coordinates.lon]],{color:"#38bdf8",dashArray:"7 8",weight:2}).addTo(l.location),p(te,null,!1)),o.flyTo([z.lat,z.lon],8,{duration:.8});const k=e.querySelector(".map-locate");k&&(k.textContent="📍"),k==null||k.setAttribute("title","GPS Active")},x=()=>{const i=e.querySelector(".map-locate");if(!navigator.geolocation){i&&(i.textContent="❌");return}i&&(i.textContent="🔄"),navigator.geolocation.getCurrentPosition(h,()=>{i&&(i.textContent="❌")},{enableHighAccuracy:!0,timeout:1e4,maximumAge:6e4})},A=e.querySelectorAll(".basemap-btn"),v=e.querySelector("#map-status-bar"),$=e.querySelector("#basemap-dropdown-container"),M=e.querySelector("#basemap-pill-btn"),E=e.querySelector("#close-basemap-btn"),P=e.querySelector("#basemap-pill-icon"),I=e.querySelector("#basemap-pill-text"),_={standard:"🗺️",satellite:"🛰️",hybrid:"🗺️🛰️",terrain:"⛰️"},y=i=>{const r=typeof i=="boolean"?i:!($!=null&&$.classList.contains("is-open"));r&&(f==null||f.classList.remove("is-open"),w==null||w.setAttribute("aria-expanded","false")),$==null||$.classList.toggle("is-open",r),M==null||M.setAttribute("aria-expanded",String(r))};M==null||M.addEventListener("click",i=>{i.stopPropagation(),y()}),E==null||E.addEventListener("click",i=>{i.stopPropagation(),y(!1)});const u=i=>{c[i]&&(o.removeLayer(c[d]),d=i,c[d].addTo(o),A.forEach(r=>{r.classList.toggle("active",r.dataset.basemap===i)}),P&&(P.textContent=_[i]||"🗺️"),I&&(I.textContent=`${i[0].toUpperCase()}${i.slice(1)}`),v&&(v.textContent=`${i[0].toUpperCase()}${i.slice(1)} basemap active`),y(!1))};Object.entries(c).forEach(([i,r])=>{typeof r.on=="function"&&r.options&&"maxZoom"in r.options&&r.on("tileerror",()=>{d===i&&i!=="standard"&&(u("standard"),v&&(v.textContent=`${i[0].toUpperCase()}${i.slice(1)} unavailable · Standard restored`))})}),A.forEach(i=>i.addEventListener("click",()=>u(i.dataset.basemap)));const f=e.querySelector("#layer-dropdown-container"),w=e.querySelector("#layer-pill-btn"),W=e.querySelector("#close-layers-btn"),xe=e.querySelector("#active-layers-badge"),ve=i=>{const r=typeof i=="boolean"?i:!(f!=null&&f.classList.contains("is-open"));r&&($==null||$.classList.remove("is-open"),M==null||M.setAttribute("aria-expanded","false")),f==null||f.classList.toggle("is-open",r),w==null||w.setAttribute("aria-expanded",String(r))};w==null||w.addEventListener("click",i=>{i.stopPropagation(),ve()}),W==null||W.addEventListener("click",i=>{i.stopPropagation(),ve(!1)});const ce={pfz:[l.favourable,l.caution,l["high-risk"],l.targets],ocean:[l.ocean],alerts:[l.alerts],weather:[l.weather],location:[l.location]},Ue=()=>{const i=Object.keys(ce).filter(r=>o.hasLayer(ce[r][0])).length;xe&&(xe.textContent=String(i))},Ke=(i,r)=>{var Z;const k=o.hasLayer(ce[i][0]);ce[i].forEach(V=>k?o.removeLayer(V):V.addTo(o)),r.classList.toggle("is-active",!k),r.setAttribute("aria-pressed",String(!k)),Ue(),v&&(v.textContent=`${((Z=r.querySelector(".layer-icon"))==null?void 0:Z.textContent)||""} ${r.textContent.trim().replace(/^[🎣🌊⚠️☁️🚤]\s*/,"")} layer ${k?"hidden":"shown"}`)};e.querySelectorAll(".map-layer-btn").forEach(i=>{i.addEventListener("click",()=>Ke(i.dataset.layer,i))});const q=e.querySelector(".map-search-input"),K=e.querySelector("#search-clear-btn"),Ye=()=>{var Z;const i=q==null?void 0:q.value.trim().toLowerCase();if(!i)return;const r=t.zones.find(V=>`${V.name} ${V.state}`.toLowerCase().includes(i));if(r){p(r,m.get(r.id),!0),v&&(v.textContent=`${r.name} selected`);return}const k=(Z=t.ocean_conditions)==null?void 0:Z.find(V=>`${V.region} ${V.state}`.toLowerCase().includes(i));if(k){o.flyTo([k.coordinates.lat,k.coordinates.lon],7,{duration:.7}),v&&(v.textContent=`${k.region} centered`);return}v&&(v.textContent="No matching advisory region")};q==null||q.addEventListener("input",()=>{K&&(K.style.display=q.value.trim()?"flex":"none")}),K==null||K.addEventListener("click",()=>{q&&(q.value=""),K&&(K.style.display="none"),q==null||q.focus(),v&&(v.textContent="Search cleared")}),q==null||q.addEventListener("keydown",i=>{i.key==="Enter"&&Ye(),i.key==="Escape"&&(q&&(q.value=""),K&&(K.style.display="none"))}),(Ne=e.querySelector(".map-locate"))==null||Ne.addEventListener("click",x),(qe=e.querySelector(".map-reset"))==null||qe.addEventListener("click",()=>{o.closePopup(),o.flyTo(Ie,5,{duration:.7}),v&&(v.textContent="Map view reset")}),(Pe=e.querySelector(".best-zone"))==null||Pe.addEventListener("click",()=>{const r=[...t.zones].sort((Z,V)=>{const Je=z?we(z,Z.coordinates)-we(z,V.coordinates):0;return de(V)-de(Z)||Je})[0];p(r,m.get(r.id),!0);const k=e.querySelector(".best-zone");k.textContent=`✓ Best: ${r.state}`,setTimeout(()=>{k.textContent="🎯"},2400)});const ee=e.querySelector("#map-zen-btn"),Qe=e.querySelector(".marine-map-card");ee==null||ee.addEventListener("click",()=>{const i=Qe.classList.toggle("map-zen-mode");ee.classList.toggle("active",i),ee.textContent=i?"✕":"👁️",ee.title=i?"Exit Clean Map view":"Toggle Clean Map view (hide all panels)",v&&(v.textContent=i?"Clean view active · Tap ✕ to restore controls":"Controls restored")});const j=e.querySelector("#map-legend-widget"),O=e.querySelector(".legend-toggle-btn"),fe=e.querySelector("#legend-close-btn");O&&j&&O.addEventListener("click",()=>{const i=j.classList.toggle("is-open");O.setAttribute("aria-expanded",String(i));const r=O.querySelector(".toggle-arrow");r&&(r.textContent=i?"▴":"▾")}),fe==null||fe.addEventListener("click",i=>{i.stopPropagation(),j==null||j.classList.remove("is-open"),O==null||O.setAttribute("aria-expanded","false");const r=O==null?void 0:O.querySelector(".toggle-arrow");r&&(r.textContent="▾")}),document.addEventListener("click",i=>{if(f!=null&&f.classList.contains("is-open")&&!f.contains(i.target)&&ve(!1),$!=null&&$.classList.contains("is-open")&&!$.contains(i.target)&&y(!1),j!=null&&j.classList.contains("is-open")&&!j.contains(i.target)){j.classList.remove("is-open"),O==null||O.setAttribute("aria-expanded","false");const r=O==null?void 0:O.querySelector(".toggle-arrow");r&&(r.textContent="▾")}});const Ae=[...t.zones].sort((i,r)=>de(r)-de(i))[0];p(Ae,m.get(Ae.id),!1),setTimeout(()=>o.invalidateSize(),100)}let D=null,b=null,U=null,H=null,Y=null,Ce=null,J=null,X=null,ne=null,S=null,F=null,N=null;const he=["🛰️ Querying Marine Satellite Telemetry...","🌊 Analyzing Ocean SST & Chlorophyll-a Upwelling...","🧭 Synthesizing Advisory & PFZ Coordinates...","⚡ Finalizing Marine Recommendations..."];function ht(e,{onSend:t,onSuggestion:a,onMapZoneChange:s}){var l,m,g;Ce=t,J=a,e.innerHTML="",e.appendChild(bt());const n=document.createElement("main");n.className="marine-main",n.id="marine-main",e.appendChild(n);const o=document.createElement("section");o.className="map-viewport",o.id="map-viewport",o.setAttribute("aria-label","ORCA Marine Operations Map"),n.appendChild(o),F=document.createElement("aside"),F.className="intelligence-panel collapsed",F.id="intelligence-panel",F.setAttribute("aria-label","Zone Intelligence Panel"),F.innerHTML=`
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
  `,e.appendChild(F);const c=document.createElement("div");c.className="chat-drawer-backdrop",c.id="chat-drawer-backdrop",c.addEventListener("click",be),e.appendChild(c),S=document.createElement("aside"),S.className="chat-drawer",S.id="chat-drawer",S.setAttribute("aria-label","Ask ORCA Assistant"),S.innerHTML=`
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
  `,D=St(),S.appendChild(D),S.appendChild(Mt()),e.appendChild(S),N=document.createElement("button"),N.className="panel-toggle-btn",N.type="button",N.innerHTML='<span class="toggle-icon">📊</span><span class="toggle-label">Zone Intel</span>',N.setAttribute("aria-label","Toggle zone intelligence panel"),N.setAttribute("title","Toggle Zone Intelligence"),N.addEventListener("click",wt),e.appendChild(N);const d=document.createElement("button");d.className="ask-orca-fab",d.type="button",d.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M15 7h.01M9 7h.01M15 11h.01M9 11h.01"/></svg><span>Ask ORCA</span>',d.setAttribute("aria-expanded","false"),d.addEventListener("click",me),e.appendChild(d),(l=F.querySelector(".panel-close"))==null||l.addEventListener("click",Le),(m=S.querySelector(".chat-drawer-fullscreen"))==null||m.addEventListener("click",Se),(g=S.querySelector(".chat-drawer-close"))==null||g.addEventListener("click",be),window.addEventListener("keydown",p=>{p.key==="Escape"&&(S!=null&&S.classList.contains("is-fullscreen")?Se():S!=null&&S.classList.contains("is-open")?be():F&&!F.classList.contains("collapsed")&&Le())}),$t(),ft(o,{onAskOrca:(p,C)=>{me(),Ee(`Is ${p.name} suitable for ${p.likely_species[0]} today?`)},onZoneChange:(p,C)=>{Lt(p,C),s==null||s(p,C)}}),yt()}function bt(){const e=document.createElement("header");return e.className="orca-header",e.id="app-header",e.innerHTML=`
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
        ${Zt()}
        ${Ge()?zt():""}
      </div>
    </div>
  `,setTimeout(()=>{e.querySelectorAll(".header-nav-btn").forEach(s=>{s.addEventListener("click",()=>{const n=s.dataset.view;e.querySelectorAll(".header-nav-btn").forEach(o=>o.classList.remove("active")),s.classList.add("active"),n==="chat"&&me()})});const t=e.querySelector("#lang-picker");t&&(t.value=re(),t.addEventListener("change",s=>{Xe(s.target.value),b&&(b.placeholder=We())}));const a=e.querySelector("#voice-toggle");a&&a.addEventListener("click",()=>{const s=ot();a.classList.toggle("active",s),a.title=s?"Auto-speak: ON":"Auto-speak: OFF"})},0),e}function Ve(e,t=!1){const a=document.getElementById("header-agent-status");if(!a)return;const s=a.querySelector(".status-pulse-dot"),n=a.querySelector(".status-text");s&&(s.className=t?"status-pulse-dot scanning":"status-pulse-dot"),n&&(n.textContent=e)}function yt(){const e=document.getElementById("data-status-bar");if(!e)return;const t=[{label:"PFZ",value:"DEMO",type:"demo"},{label:"Ocean",value:"DEMO",type:"demo"},{label:"Weather",value:"LIVE",type:"live"},{label:"GIS",value:"COMPUTED",type:"computed"},{label:"Safety",value:"COMPUTED",type:"computed"},{label:"Alerts",value:"DEMO",type:"demo"}];e.innerHTML=t.map(a=>`
    <div class="data-status-item">
      <span class="data-status-label">${a.label}</span>
      <span class="data-status-value ${a.type}">${a.value}</span>
    </div>
  `).join("")}function wt(){if(!F)return;const e=F.classList.toggle("collapsed");N&&(N.setAttribute("aria-expanded",String(!e)),N.innerHTML=e?"📊":"✕",N.title=e?"Open Zone Intelligence":"Close Zone Intelligence")}function Le(){F&&(F.classList.add("collapsed"),N&&(N.setAttribute("aria-expanded","false"),N.innerHTML="📊",N.title="Open Zone Intelligence"))}function Ct(){F&&(F.classList.remove("collapsed"),N&&(N.setAttribute("aria-expanded","true"),N.innerHTML="✕",N.title="Close Zone Intelligence"))}function Lt(e,t){var C,h,x,A,v,$,M,E,P,I,_,y,u,f;const a=document.getElementById("panel-content");if(!a)return;if(!e){a.innerHTML=`
      <div class="zone-empty">
        <span class="zone-empty-icon">🎣</span>
        <strong class="zone-empty-title">Select a PFZ Zone</strong>
        <p class="zone-empty-desc">Tap a coloured marine zone on the map to see fish, safety and ocean telemetry.</p>
      </div>
    `,Le();return}Ct();let s="Enable GPS to calculate distance";t&&e.coordinates&&(s=`${Ht(t,e.coordinates).toFixed(1)} km from you`);const n=(C=e.ocean)==null?void 0:C.wave,o=n?`${n.significant_height_m} m`:"—",c=(h=e.ocean)==null?void 0:h.current,d=c?`${c.speed_knots} kt ${c.direction}`:"not available",l=((x=e.ocean)==null?void 0:x.salinity_psu)??"—",m=((A=e.risk)==null?void 0:A.level)||"caution",g=((v=e.risk)==null?void 0:v.label)||"Caution / moderate",p=(($=e.risk)==null?void 0:$.color)||"#facc15";a.innerHTML=`
    <div class="zone-detail">
      <div class="zone-kicker">SELECTED PFZ · ${G(e.state)}</div>
      <div class="zone-heading">
        <div class="zone-name-block">
          <h2>${G(e.name)}</h2>
          <div class="zone-species">
            ${(e.likely_species||[]).map(w=>`<span class="species-tag">🐟 ${G(w)}</span>`).join("")}
          </div>
        </div>
        <span class="zone-risk-badge ${m}" style="border-color: ${p}; background: ${p}1A; color: ${p};">
          ● ${G(g)}
        </span>
      </div>
      <p class="zone-advisory">${G(e.advisory||"No advisory available.")}</p>

      <div class="zone-metrics">
        <div class="metric-item">
          <span class="metric-label">🎯 Confidence</span>
          <span class="metric-value">${Math.round((e.confidence||0)*100)}%</span>
          <div class="confidence-bar"><div class="confidence-fill" style="width: ${Math.round((e.confidence||0)*100)}%"></div></div>
        </div>
        <div class="metric-item">
          <span class="metric-label">🌡️ SST</span>
          <span class="metric-value">${e.sst_celsius??"—"}°C</span>
          <span class="metric-sub">Optimal Pelagic 26–29°C</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">🌿 Chlorophyll</span>
          <span class="metric-value">${e.chlorophyll_mg_m3??"—"} mg/m³</span>
          <span class="metric-sub">Phytoplankton Concentration</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">💨 Wind</span>
          <span class="metric-value">${e.wind_speed_knots??"—"} kt</span>
          <span class="metric-sub">${(e.wind_speed_knots||0)>18?"Caution · Gusty Swell":"Calm · Favorable Seas"}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">🌊 Wave</span>
          <span class="metric-value">${o}</span>
          <span class="metric-sub">${n&&n.significant_height_m>2?"Moderate Swell":"Calm Conditions"}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">📍 Distance</span>
          <span class="metric-value" style="font-size: 0.85rem;">${s}</span>
        </div>
      </div>

      <div class="zone-additional">
        <div class="additional-row">
          <span class="additional-label">Coordinates</span>
          <span class="additional-value">${((M=e.coordinates)==null?void 0:M.lat.toFixed(2))??"—"}°N, ${((E=e.coordinates)==null?void 0:E.lon.toFixed(2))??"—"}°E</span>
        </div>
        <div class="additional-row">
          <span class="additional-label">Current</span>
          <span class="additional-value">${d}</span>
        </div>
        <div class="additional-row">
          <span class="additional-label">Depth</span>
          <span class="additional-value">${((P=e.depth_range_m)==null?void 0:P.min)??"—"}–${((I=e.depth_range_m)==null?void 0:I.max)??"—"} m</span>
        </div>
        <div class="additional-row">
          <span class="additional-label">Salinity</span>
          <span class="additional-value">${l} PSU</span>
        </div>
        <div class="additional-row">
          <span class="additional-label">Valid Until</span>
          <span class="additional-value">${e.valid_until?new Date(e.valid_until).toLocaleString():"not supplied"}</span>
        </div>
      </div>

      <div class="zone-reasoning">
        <div class="reasoning-title">⚡ WHY THIS ZONE?</div>
        <ul class="reasoning-list">
          ${kt(e).map(w=>`<li class="reasoning-item">${G(w)}</li>`).join("")}
        </ul>
      </div>

      <div class="zone-actions">
        <button type="button" class="zone-action-btn primary" data-action="ask" data-zone-id="${e.id}">💬 Ask ORCA</button>
        <a class="zone-action-btn secondary zone-action-btn--link" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${((_=e.coordinates)==null?void 0:_.lat)??0},${((y=e.coordinates)==null?void 0:y.lon)??0}" data-action="navigate">🧭 Navigate</a>
        <button type="button" class="zone-action-btn outline" data-action="details" data-zone-id="${e.id}">⌄ Details</button>
      </div>

      <div class="zone-source">Demo advisory · existing ORCA mock data</div>
    </div>
  `,(u=a.querySelector('[data-action="ask"]'))==null||u.addEventListener("click",w=>{w.currentTarget.dataset.zoneId;const W=e;me(),Ee(`Is ${W.name} suitable for ${W.likely_species[0]} today?`)}),(f=a.querySelector('[data-action="details"]'))==null||f.addEventListener("click",()=>{const w=a.querySelector(".zone-additional");w&&(w.style.display=w.style.display==="none"?"flex":"none");const W=a.querySelector('[data-action="details"]');W&&(W.textContent=(w==null?void 0:w.style.display)==="none"?"⌄ Details":"⌃ Less")})}function kt(e){var d,l,m,g,p;const t=[],a=e.confidence||0;a>=.8?t.push(`Strong PFZ confidence (${Math.round(a*100)}%)`):a>=.6&&t.push(`Moderate PFZ confidence (${Math.round(a*100)}%)`);const s=e.sst_celsius;s!=null&&s>=26&&s<=29&&t.push("Favorable sea surface temperature for pelagic species");const n=e.chlorophyll_mg_m3;n!=null&&n>=1.5&&t.push("Elevated chlorophyll indicates active food chain");const o=e.wind_speed_knots;o!=null&&o<=15?t.push("Acceptable wind conditions for safe operations"):o!=null&&o>18&&t.push("Elevated winds — caution advised for small vessels");const c=(l=(d=e.ocean)==null?void 0:d.wave)==null?void 0:l.significant_height_m;return c!=null&&c<=1.8?t.push("Calm sea state with low wave heights"):c!=null&&c>2.5&&t.push("High waves — high risk for small craft"),((m=e.risk)==null?void 0:m.level)==="favourable"?t.push("Safety assessment: favourable conditions"):((g=e.risk)==null?void 0:g.level)==="caution"?t.push("Safety assessment: caution advised"):((p=e.risk)==null?void 0:p.level)==="high-risk"&&t.push("Safety assessment: high risk — not recommended"),t.length===0&&t.push("Safety assessment available"),t.slice(0,4)}function St(){const e=document.createElement("div");return e.className="chat-area",e.id="chat-area",e}function $t(){if(!D)return;Y=document.createElement("div"),Y.className="welcome-screen",Y.id="welcome-screen";const e=[{icon:"🎣",category:"Potential Fishing Zones",prompt:"Show PFZ zones in Maharashtra",desc:"Satellite SST & Chlorophyll-a pelagic hotspots"},{icon:"🌊",category:"Ocean & Sea State",prompt:"What are ocean conditions near Chennai?",desc:"Wave swell, sea temperature & tidal currents"},{icon:"🧭",category:"Navigational Safety",prompt:"Is it safe to go fishing today?",desc:"Coastal hazard alerts, high wave & squall checks"},{icon:"🐟",category:"Target Species Advice",prompt:"Where can I fish today near Mumbai?",desc:"Tuna, Mackerel & Pomfret location forecast"},{icon:"⚠️",category:"Marine Alerts",prompt:"Are there marine alerts near Mumbai?",desc:"Cyclone warnings, swell advisories & notices"},{icon:"📊",category:"Multi-Factor Analysis",prompt:"Compare PFZ zones for best catch",desc:"Confidence, ocean conditions & safety scoring"}];Y.innerHTML=`
    <div class="welcome-icon">🌊</div>
    <h2 class="welcome-title">ORCA Marine Intelligence</h2>
    <p class="welcome-desc">AI-powered operational console for coastal navigation, Potential Fishing Zones (PFZ), satellite oceanography, and maritime safety.</p>
    <div class="welcome-suggestions">
      ${e.map(t=>`
        <button class="suggestion-card" data-prompt="${G(t.prompt)}">
          <div class="suggestion-card-top">
            <span class="suggestion-icon">${t.icon}</span>
            <span class="suggestion-badge">${G(t.category)}</span>
          </div>
          <div class="suggestion-prompt">${G(t.prompt)}</div>
          <div class="suggestion-desc">${G(t.desc)}</div>
        </button>
      `).join("")}
    </div>
  `,setTimeout(()=>{Y.querySelectorAll(".suggestion-card").forEach(t=>{t.addEventListener("click",()=>{const a=t.getAttribute("data-prompt");J&&J(a)})})},0),D.appendChild(Y)}function je(){Y&&(Y.remove(),Y=null)}function Mt(){const e=document.createElement("div");e.className="input-bar",e.id="input-bar";const t=document.createElement("div");return t.className="input-wrapper",b=document.createElement("textarea"),b.className="input-field",b.id="message-input",b.placeholder=We(),b.rows=1,b.setAttribute("aria-label","Message input"),b.addEventListener("input",()=>{b.style.height="auto";const a=Math.min(b.scrollHeight,110);b.style.height=a+"px",b.style.overflowY=b.scrollHeight>110?"auto":"hidden"}),b.addEventListener("keydown",a=>{a.key==="Enter"&&!a.shiftKey&&(a.preventDefault(),He())}),t.appendChild(b),Be()&&(H=document.createElement("button"),H.className="input-btn mic-btn",H.id="mic-btn",H.innerHTML="🎤",H.title="Voice input",H.setAttribute("aria-label","Voice input"),H.addEventListener("click",()=>at()),t.appendChild(H)),U=document.createElement("button"),U.className="input-btn send-btn",U.id="send-btn",U.innerHTML="➤",U.title="Send message",U.setAttribute("aria-label","Send message"),U.addEventListener("click",He),t.appendChild(U),e.appendChild(t),e}function He(){var t;const e=(t=b==null?void 0:b.value)==null?void 0:t.trim();!e||!Ce||(b.value="",b.style.height="auto",b.style.overflowY="hidden",Ce(e))}function Ze(e,t,a={}){var A,v,$,M,E,P,I,_;if(je(),!D)return;const s=document.createElement("div");s.className=`message ${e}`;const n=document.createElement("div");n.className="message-avatar",n.textContent=e==="user"?"👤":"🌊";const o=document.createElement("div");o.className="message-content";const c=document.createElement("div");if(c.className="message-bubble",c.innerHTML=xt(t),e==="assistant"&&t){const y=document.createElement("div");if(y.className="msg-actions-bar",Ge()){const f=document.createElement("button");f.className="msg-action-btn msg-speak-btn",f.innerHTML="🔊",f.title="Listen to this response",f.setAttribute("aria-label","Listen to this response"),f.addEventListener("click",w=>{w.stopPropagation(),f.classList.add("speaking"),it(t,()=>f.classList.remove("speaking"))}),y.appendChild(f)}const u=document.createElement("button");u.className="msg-action-btn msg-copy-btn",u.innerHTML="📋",u.title="Copy response text",u.setAttribute("aria-label","Copy response text"),u.addEventListener("click",f=>{f.stopPropagation(),navigator.clipboard.writeText(t).then(()=>{u.innerHTML="✓",u.classList.add("btn-copied"),setTimeout(()=>{u.innerHTML="📋",u.classList.remove("btn-copied")},1500)})}),y.appendChild(u),c.appendChild(y)}const d=document.createElement("div");d.className="message-time",d.textContent=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),o.appendChild(c),a.weatherData&&o.appendChild(At(a.weatherData)),a.airQualityData&&o.appendChild(_t(a.airQualityData));const l=a.orchestratorData,m=l==null?void 0:l.pfz_result,g=(A=l==null?void 0:l.recommendation_result)==null?void 0:A.selected_pfz,p=a.pfzData||m;let C=null;if(a.coordinates||((v=l==null?void 0:l.map_data)==null?void 0:v.user_location)||p&&p.zones&&p.zones.length>0){const y=(($=l==null?void 0:l.map_data)==null?void 0:$.user_location)||a.coordinates||(g==null?void 0:g.coordinates)||((E=(M=p==null?void 0:p.zones)==null?void 0:M[0])==null?void 0:E.coordinates);y&&(C=Ot(y,((P=a.weatherData)==null?void 0:P.city)||((I=a.forecastData)==null?void 0:I.city)||((_=l==null?void 0:l.weather_result)==null?void 0:_.city)||"",p))}const x=[];if(a.pfzData&&a.pfzData.zones&&a.pfzData.zones.forEach(y=>{const u=Nt(y,a.pfzData.source,C,x);x.push(u),o.appendChild(u)}),l!=null&&l.recommendation_result&&o.appendChild(Pt(l)),a.forecastData&&o.appendChild(It(a.forecastData)),C&&(o.appendChild(C.element),g!=null&&g.coordinates&&C.focusZone(g.coordinates.lat,g.coordinates.lon,g.name)),e==="assistant"){const y=Ft(a);y&&o.appendChild(y)}o.appendChild(d),s.appendChild(n),s.appendChild(o),D.appendChild(s),Te()}function Et(){if(je(),X||!D)return;Ve("Scanning Ocean Telemetry...",!0),X=document.createElement("div"),X.className="typing-indicator agent-activity-card";let e=0;X.innerHTML=`
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
      <div class="activity-status-text" id="activity-status-text">${he[0]}</div>
    </div>
  `,D.appendChild(X),Te(),ne&&clearInterval(ne),ne=setInterval(()=>{e=(e+1)%he.length;const t=document.getElementById("activity-status-text");t&&(t.classList.remove("status-fade-in"),t.offsetWidth,t.textContent=he[e],t.classList.add("status-fade-in"))},1300)}function ke(){ne&&(clearInterval(ne),ne=null),Ve("Marine Core Active",!1),X&&(X.remove(),X=null)}function pe(e){if(ke(),!D)return;const t=document.createElement("div");t.className="message assistant",t.innerHTML=`
    <div class="message-avatar" style="background: var(--accent-gradient);">🌊</div>
    <div class="message-content">
      <div class="error-message" style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: var(--radius-md); padding: 10px 14px; font-size: 0.82rem; color: #fca5a5;">⚠️ ${G(e)}</div>
      <div class="message-time">${new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
    </div>
  `,D.appendChild(t),Te()}function ze(e){b&&(b.disabled=e),U&&(U.disabled=e),H&&(H.disabled=e)}function Ee(e){b&&(b.value=e,b.style.height="auto",b.style.height=Math.min(b.scrollHeight,110)+"px",b.focus())}function Tt(e){if(H)switch(e){case"listening":H.classList.add("recording"),H.innerHTML="⏹️";break;case"stopped":case"error":case"denied":H.classList.remove("recording"),H.innerHTML="🎤";break}}function me(){var e,t;S&&(S.classList.add("is-open"),(e=document.getElementById("chat-drawer-backdrop"))==null||e.classList.add("is-active"),(t=document.querySelector(".ask-orca-fab"))==null||t.setAttribute("aria-expanded","true"),setTimeout(()=>b==null?void 0:b.focus(),180))}function be(){var e,t;S!=null&&S.classList.contains("is-fullscreen")&&Se(),S==null||S.classList.remove("is-open"),(e=document.getElementById("chat-drawer-backdrop"))==null||e.classList.remove("is-active"),(t=document.querySelector(".ask-orca-fab"))==null||t.setAttribute("aria-expanded","false")}function Se(){if(!S)return;const e=S.classList.toggle("is-fullscreen"),t=S.querySelector(".expand-icon"),a=S.querySelector(".compress-icon"),s=S.querySelector(".chat-drawer-fullscreen");e?(s==null||s.setAttribute("aria-label","Exit full screen"),s&&(s.title="Exit full screen"),t&&(t.style.display="none"),a&&(a.style.display="block")):(s==null||s.setAttribute("aria-label","Enlarge chat to full screen"),s&&(s.title="Enlarge chat to full screen"),t&&(t.style.display="block"),a&&(a.style.display="none"))}function G(e){return e?String(e).replace(/[&<>'"]/g,t=>({"&":"&","<":"<",">":">","'":"'",'"':'"'})[t]):""}function xt(e){return e?e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\n/g,"<br>"):""}function At(e){var n,o,c,d,l;const t=document.createElement("div");t.className="weather-card";const a=((n=e.weather)==null?void 0:n.icon)||"03d",s=dt(a);return t.innerHTML=`
    <div class="weather-card-header">
      <div>
        <div class="weather-card-city">${e.city||""}${e.country?", "+e.country:""}</div>
        <div class="weather-card-condition">${((o=e.weather)==null?void 0:o.description)||""}</div>
      </div>
    </div>
    <div class="weather-card-main">
      <div class="weather-card-temp">${((c=e.temperature)==null?void 0:c.current)??"--"}°C</div>
      <div class="weather-card-icon">${s}</div>
    </div>
    <div class="weather-card-details">
      <div class="weather-detail">
        <div class="weather-detail-label">Feels Like</div>
        <div class="weather-detail-value">${((d=e.temperature)==null?void 0:d.feels_like)??"--"}°C</div>
      </div>
      <div class="weather-detail">
        <div class="weather-detail-label">Humidity</div>
        <div class="weather-detail-value">${e.humidity??"--"}%</div>
      </div>
      <div class="weather-detail">
        <div class="weather-detail-label">Wind</div>
        <div class="weather-detail-value">${((l=e.wind)==null?void 0:l.speed)??"--"} m/s</div>
      </div>
      ${e.visibility!=null?`
      <div class="weather-detail">
        <div class="weather-detail-label">Visibility</div>
        <div class="weather-detail-value">${e.visibility} km</div>
      </div>`:""}
      ${e.sunrise?`
      <div class="weather-detail">
        <div class="weather-detail-label">Sunrise</div>
        <div class="weather-detail-value">${e.sunrise}</div>
      </div>`:""}
      ${e.sunset?`
      <div class="weather-detail">
        <div class="weather-detail-label">Sunset</div>
        <div class="weather-detail-value">${e.sunset}</div>
      </div>`:""}
    </div>
  `,t}function _t(e){var s,n,o,c,d,l,m,g;const t=document.createElement("div");t.className="aqi-card";const a={1:"aqi-good",2:"aqi-fair",3:"aqi-moderate",4:"aqi-poor",5:"aqi-very-poor"}[(s=e.aqi)==null?void 0:s.index]||"aqi-moderate";return t.innerHTML=`
    <div class="aqi-header">
      <div class="weather-card-city">Air Quality — ${e.city||""}</div>
      <span class="aqi-badge ${a}">${((n=e.aqi)==null?void 0:n.label)||"Unknown"}</span>
    </div>
    <div class="aqi-pollutants">
      ${((o=e.pollutants)==null?void 0:o.pm2_5)!=null?`<div class="aqi-pollutant"><div class="aqi-pollutant-name">PM2.5</div><div class="aqi-pollutant-value">${e.pollutants.pm2_5}</div></div>`:""}
      ${((c=e.pollutants)==null?void 0:c.pm10)!=null?`<div class="aqi-pollutant"><div class="aqi-pollutant-name">PM10</div><div class="aqi-pollutant-value">${e.pollutants.pm10}</div></div>`:""}
      ${((d=e.pollutants)==null?void 0:d.no2)!=null?`<div class="aqi-pollutant"><div class="aqi-pollutant-name">NO₂</div><div class="aqi-pollutant-value">${e.pollutants.no2}</div></div>`:""}
      ${((l=e.pollutants)==null?void 0:l.o3)!=null?`<div class="aqi-pollutant"><div class="aqi-pollutant-name">O₃</div><div class="aqi-pollutant-value">${e.pollutants.o3}</div></div>`:""}
      ${((m=e.pollutants)==null?void 0:m.co)!=null?`<div class="aqi-pollutant"><div class="aqi-pollutant-name">CO</div><div class="aqi-pollutant-value">${e.pollutants.co}</div></div>`:""}
      ${((g=e.pollutants)==null?void 0:g.so2)!=null?`<div class="aqi-pollutant"><div class="aqi-pollutant-name">SO₂</div><div class="aqi-pollutant-value">${e.pollutants.so2}</div></div>`:""}
    </div>
  `,t}function Nt(e,t,a,s){var I,_,y;const n=document.createElement("div");n.className="pfz-card";const o=e.confidence??.7,c=o>=.8?"pfz-conf-high":o>=.6?"pfz-conf-moderate":"pfz-conf-low",d=e.confidence_label||(o>=.8?"High":o>=.6?"Moderate":"Low"),l=Math.round(o*100),m=e.coordinates,g=m?`${m.lat.toFixed(2)}°N, ${m.lon.toFixed(2)}°E`:"",p=m?`${m.lat.toFixed(4)}, ${m.lon.toFixed(4)}`:"",C=(I=e.conditions)==null?void 0:I.sst_celsius,h=(_=e.conditions)==null?void 0:_.chlorophyll_mg_m3,x=(y=e.conditions)==null?void 0:y.wind_speed_knots,A=e.depth_range_m,v=e.likely_species||[];n.innerHTML=`
    <div class="pfz-card-header">
      <div class="pfz-header-left">
        <div class="pfz-card-title">🎣 ${e.name||"PFZ Zone"}</div>
        <div class="pfz-card-location">📍 ${e.state||"Indian Ocean Coast"}${g?" · "+g:""}</div>
      </div>
      <div class="pfz-conf-badge-wrapper">
        <span class="pfz-conf-badge ${c}">● ${d} (${l}%)</span>
      </div>
    </div>

    ${e.advisory?`
    <div class="pfz-advisory">
      <span class="advisory-icon">🧭</span>
      <div class="advisory-text">${e.advisory}</div>
    </div>`:""}

    <div class="pfz-telemetry-grid">
      ${C!=null?`
      <div class="pfz-telemetry-item sst-item">
        <div class="tel-header">
          <span class="tel-label">🌡️ SST</span>
          <span class="tel-value">${C}°C</span>
        </div>
        <div class="tel-bar"><div class="tel-bar-fill sst-fill" style="width: ${Math.min(100,Math.max(15,(C-20)/14*100))}%;"></div></div>
        <div class="tel-sub">Optimal Pelagic (26–29°C)</div>
      </div>`:""}

      ${h!=null?`
      <div class="pfz-telemetry-item chl-item">
        <div class="tel-header">
          <span class="tel-label">🌿 Chlorophyll</span>
          <span class="tel-value">${h} mg/m³</span>
        </div>
        <div class="tel-bar"><div class="tel-bar-fill chl-fill" style="width: ${Math.min(100,Math.max(15,h/.8*100))}%;"></div></div>
        <div class="tel-sub">Phytoplankton Bloom</div>
      </div>`:""}

      ${x!=null?`
      <div class="pfz-telemetry-item wind-item">
        <div class="tel-header">
          <span class="tel-label">💨 Sea Wind</span>
          <span class="tel-value">${x} kt</span>
        </div>
        <div class="tel-bar"><div class="tel-bar-fill wind-fill" style="width: ${Math.min(100,Math.max(15,x/28*100))}%;"></div></div>
        <div class="tel-sub">${x>18?"Caution · Gusty Swell":"Calm · Favorable Seas"}</div>
      </div>`:""}

      ${A?`
      <div class="pfz-telemetry-item depth-item">
        <div class="tel-header">
          <span class="tel-label">📏 Bathymetry</span>
          <span class="tel-value">${A.min}–${A.max} m</span>
        </div>
        <div class="tel-bar"><div class="tel-bar-fill depth-fill" style="width: ${Math.min(100,A.max/90*100)}%;"></div></div>
        <div class="tel-sub">Continental Shelf Zone</div>
      </div>`:""}
    </div>

    ${v.length>0?`
    <div class="pfz-species-section">
      <div class="pfz-section-title">🐟 Target Species (Click to query advice):</div>
      <div class="pfz-species-pills">
        ${v.map(u=>`<button class="pfz-species-pill" type="button" data-species="${u}">🐟 ${u}</button>`).join("")}
      </div>
    </div>`:""}

    <div class="pfz-card-actions">
      ${m&&a?`
      <button class="pfz-action-btn pfz-btn-map" type="button">🗺️ Focus Zone on Map</button>`:""}
      ${m?`
      <button class="pfz-action-btn pfz-btn-gps" type="button" data-gps="${p}">📋 Copy GPS</button>`:""}
      <button class="pfz-action-btn pfz-btn-weather" type="button">🌤️ Sea Weather</button>
    </div>

    <div class="pfz-source-tag">${t||"ORCA Mock Data"}</div>
  `;const $=()=>{a&&m&&(s&&s.forEach(u=>u.classList.remove("pfz-card--active")),n.classList.add("pfz-card--active"),a.focusZone(m.lat,m.lon,e.name))},M=n.querySelector(".pfz-btn-map");M&&M.addEventListener("click",u=>{u.stopPropagation(),$()}),n.addEventListener("click",u=>{u.target.closest("button")||$()}),n.querySelectorAll(".pfz-species-pill").forEach(u=>{u.addEventListener("click",f=>{f.stopPropagation();const w=u.getAttribute("data-species");J&&J(`What is the recommended gear, depth, and technique for catching ${w} in ${e.name||"this zone"}?`)})});const E=n.querySelector(".pfz-btn-gps");E&&p&&E.addEventListener("click",u=>{u.stopPropagation(),navigator.clipboard.writeText(p).then(()=>{const f=E.innerHTML;E.innerHTML="✓ Copied!",E.classList.add("btn-copied"),setTimeout(()=>{E.innerHTML=f,E.classList.remove("btn-copied")},1800)})});const P=n.querySelector(".pfz-btn-weather");return P&&P.addEventListener("click",u=>{u.stopPropagation(),J&&J(`What are the wind and ocean conditions at ${e.name||"this location"}?`)}),n}function qt(e){return e?e.confidence!=null?`${Math.round(e.confidence*100)}% confidence`:e.mg_m3!=null?`${e.mg_m3} mg/m³`:e.celsius!=null?`${e.celsius}°C`:e.significant_height_m!=null?`${e.significant_height_m} m`:e.condition!=null?e.condition:"Not available":"Not available"}function Pt(e){var $,M,E,P,I;const t=e.recommendation_result,a=t.selected_pfz,s=((M=($=e.gis_result)==null?void 0:$.candidates)==null?void 0:M.find(_=>_.id===(a==null?void 0:a.id)))||((E=e.gis_result)==null?void 0:E.nearest_pfz),n=t.factors||{},o=document.createElement("section");o.className="recommendation-card";const c=document.createElement("div");c.className="recommendation-card-header";const d=document.createElement("span");d.className="recommendation-kicker",d.textContent="ORCA FISHING RECOMMENDATION";const l=document.createElement("strong");l.className="recommendation-zone",l.textContent=(a==null?void 0:a.name)||"No PFZ recommended";const m=document.createElement("div");m.append(d,l);const g=document.createElement("span"),p=t.safety_status||((P=e.safety_result)==null?void 0:P.status)||"UNKNOWN";g.className=`recommendation-safety recommendation-safety--${p.toLowerCase()}`,g.textContent=p,c.append(m,g),o.appendChild(c);const C=document.createElement("div");C.className="recommendation-summary";const h=document.createElement("div");h.innerHTML=`<span>Suitability</span><strong>${t.score??"—"}<small>/100</small></strong>`;const x=document.createElement("div");x.innerHTML=`<span>Distance</span><strong>${(s==null?void 0:s.distance_km)!=null?`${s.distance_km} km`:"Not available"}</strong>`,C.append(h,x),o.appendChild(C);const A=[["PFZ",[n.pfz]],["Ocean",[n.chlorophyll,n.sst,n.waves]],["Weather",[n.weather]]],v=document.createElement("div");if(v.className="recommendation-factors",A.forEach(([_,y])=>{const u=document.createElement("div");u.className="recommendation-factor-group";const f=document.createElement("span");f.textContent=_,u.appendChild(f),y.filter(Boolean).forEach(w=>{const W=document.createElement("div");W.textContent=`${qt(w)} · ${w.score}/${w.weight_percent} pts`,u.appendChild(W)}),v.appendChild(u)}),o.appendChild(v),(I=t.reasons)!=null&&I.length){const _=document.createElement("ul");_.className="recommendation-reasons",t.reasons.slice(0,4).forEach(y=>{const u=document.createElement("li");u.textContent=y,_.appendChild(u)}),o.appendChild(_)}return o}function It(e){var n;const t=document.createElement("div");t.className="forecast-chart-container";const a=document.createElement("div");a.className="forecast-chart-title",a.textContent=`📊 ${((n=e.forecast)==null?void 0:n.length)||5}-Day Forecast — ${e.city||""}`,t.appendChild(a);const s=document.createElement("div");return s.style.height="180px",s.style.position="relative",t.appendChild(s),setTimeout(()=>pt(s,e),100),t}function Ot(e,t,a){const s=document.createElement("div");s.className="map-wrapper";const n=a&&a.zones&&a.zones.length>0,o=document.createElement("button");o.className="map-toggle-btn",o.innerHTML=n?"🗺️ Show PFZ zones on map":"📍 Show on map",o.setAttribute("aria-label","Show location on map");let c=!1,d=null,l=null;const m=[];function g(){if(!c){if(d=document.createElement("div"),d.className="map-container",n&&d.classList.add("map-container--pfz"),s.appendChild(d),window.L){l=L.map(d,{zoomControl:!0,attributionControl:!1}).setView([e.lat,e.lon],10),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18}).addTo(l);const C=L.featureGroup();if(t){const h=L.marker([e.lat,e.lon]).bindPopup(`<b>${t}</b>`);h.addTo(l),C.addLayer(h)}n&&a.zones.forEach(h=>{var u,f;if(!h.coordinates)return;const{lat:x,lon:A}=h.coordinates,v=Math.round((h.confidence||0)*100),$=h.confidence_label||(h.confidence>=.8?"High":h.confidence>=.6?"Moderate":"Low"),M=h.confidence>=.8?"#4ade80":h.confidence>=.6?"#facc15":"#f87171",E=h.likely_species&&h.likely_species.length?h.likely_species.join(", "):"—",P=((u=h.conditions)==null?void 0:u.sst_celsius)!=null?h.conditions.sst_celsius+"°C":"—",I=((f=h.conditions)==null?void 0:f.chlorophyll_mg_m3)!=null?h.conditions.chlorophyll_mg_m3+" mg/m³":"—",_=`
            <div class="pfz-popup">
              <div class="pfz-popup-title">🎣 ${h.name||"PFZ Zone"}</div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">Confidence</span><span style="color:${M};font-weight:600">${$} (${v}%)</span></div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">Species</span><span>🐟 ${E}</span></div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">SST</span><span>🌡️ ${P}</span></div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">Chlorophyll</span><span>🌿 ${I}</span></div>
              <div class="pfz-popup-source">ORCA Mock Data</div>
            </div>`,y=L.circleMarker([x,A],{radius:11,fillColor:"#14e8a6",fillOpacity:.9,color:"#ffffff",weight:2}).bindPopup(_,{className:"pfz-leaflet-popup",maxWidth:260});y.addTo(l),C.addLayer(y),m.push({zoneName:h.name,lat:x,lon:A,marker:y})}),C.getLayers().length>1?setTimeout(()=>l.fitBounds(C.getBounds().pad(.15)),250):!t&&n&&l.setView([e.lat,e.lon],9),setTimeout(()=>l.invalidateSize(),200)}o.innerHTML=n?"🗺️ Hide map":"📍 Hide map",c=!0}}function p(){c&&(d&&d.remove(),d=null,l=null,m.length=0,o.innerHTML=n?"🗺️ Show PFZ zones on map":"📍 Show on map",c=!1)}return o.addEventListener("click",()=>{c?p():g()}),s.appendChild(o),{element:s,openMap:g,focusZone:(C,h,x)=>{c||g(),setTimeout(()=>{if(l){l.flyTo([C,h],11,{duration:.8});const A=m.find(v=>x&&v.zoneName===x||Math.abs(v.lat-C)<.005&&Math.abs(v.lon-h)<.005);A&&A.marker.openPopup()}s.scrollIntoView({behavior:"smooth",block:"nearest"})},150)}}}function Ft(e){let t=[];if(e.pfzData&&e.pfzData.zones&&e.pfzData.zones.length>0)t=["🧭 Is navigation safe in these zones today?","💨 Wind & wave swell forecast for these zones","🎣 Recommended fishing gear & depth"];else if(e.weatherData){const s=e.weatherData.city||"this area";t=[`🎣 Show PFZ zones near ${s}`,"🌊 Ocean swell and wave height",`📊 5-day marine forecast for ${s}`]}else return null;const a=document.createElement("div");return a.className="followup-suggestions",a.innerHTML=`
    <div class="followup-title">⚡ Quick Marine Follow-ups</div>
    <div class="followup-chips">
      ${t.map(s=>`<button class="followup-chip" type="button">${G(s)}</button>`).join("")}
    </div>
  `,a.querySelectorAll(".followup-chip").forEach(s=>{s.addEventListener("click",()=>{J&&J(s.textContent)})}),a}function Te(){D&&requestAnimationFrame(()=>{D.scrollTop=D.scrollHeight})}function Ht(e,t){if(!e||!t)return null;const a=Math.PI/180,s=(t.lat-e.lat)*a,n=(t.lon-e.lon)*a,o=Math.sin(s/2)**2+Math.cos(e.lat*a)*Math.cos(t.lat*a)*Math.sin(n/2)**2;return 6371*2*Math.atan2(Math.sqrt(o),Math.sqrt(1-o))}function Zt(){return`<select id="lang-picker" class="lang-picker" aria-label="Language">${Object.entries(Me).map(([t,a])=>`<option value="${t}">${a}</option>`).join("")}</select>`}function zt(){const e=lt();return`<button id="voice-toggle" class="voice-toggle-btn ${e?"active":""}" title="${e?"Auto-speak: ON":"Auto-speak: OFF"}" aria-label="Toggle voice output">🔊</button>`}const ae=[],Re=20;let $e=null;function Rt(e,t){if(!e||!t)return null;const a=Math.PI/180,s=(t.lat-e.lat)*a,n=(t.lon-e.lon)*a,o=Math.sin(s/2)**2+Math.cos(e.lat*a)*Math.cos(t.lat*a)*Math.sin(n/2)**2;return 6371*2*Math.atan2(Math.sqrt(o),Math.sqrt(1-o))}function Dt(e,t){var a,s,n;if(!e){$e=null;return}$e={zoneName:e.name,state:e.state,coordinates:e.coordinates,confidence:e.confidence,targetSpecies:e.likely_species,sstCelsius:e.sst_celsius,chlorophyllMgM3:e.chlorophyll_mg_m3,windKnots:e.wind_speed_knots,waveHeightM:((s=(a=e.ocean)==null?void 0:a.wave)==null?void 0:s.significant_height_m)??null,riskStatus:(n=e.risk)==null?void 0:n.label,userLocation:t||null,distanceKm:Rt(t,e.coordinates),source:"ORCA existing mock PFZ/ocean advisory"}}async function ye(e){if(!e.trim())return;const t=re();Ze("user",e),ae.push({role:"user",content:e}),ae.length>Re&&ae.splice(0,ae.length-Re),ze(!0),Et();try{const a=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e,language:t,mapContext:$e,history:ae.slice(0,-1)})});if(ke(),!a.ok){const n=await a.json().catch(()=>({}));a.status===401?pe(n.error||"API keys not configured. Check your .env file."):pe(n.error||"Something went wrong. Please try again.");return}const s=await a.json();Ze("assistant",s.reply,{weatherData:s.weatherData,forecastData:s.forecastData,airQualityData:s.airQualityData,pfzData:s.pfzData,orchestratorData:s.orchestratorData,coordinates:s.coordinates}),ae.push({role:"assistant",content:s.reply}),nt(s.originalReply||s.reply)}catch(a){ke(),a.name==="TypeError"&&a.message.includes("Failed to fetch")?pe("Cannot connect to the server. Make sure the backend is running (npm run dev)."):pe("An unexpected error occurred. Please try again."),console.error("Chat error:",a)}finally{ze(!1)}}async function De(){var t,a;const e=document.getElementById("app");if(e){et(),rt();try{const n=await(await fetch("/api/health")).json();(!((t=n.keys)!=null&&t.groq)||!((a=n.keys)!=null&&a.owm))&&console.warn("Some API keys are missing; map demo remains available.")}catch(s){console.warn("Health check failed — server may not be running:",s.message)}ht(e,{onSend:s=>ye(s),onSuggestion:s=>ye(s),onMapZoneChange:(s,n)=>Dt(s,n)}),Be()&&tt(s=>{Ee(s),ye(s)},s=>{Tt(s)}),console.log("🌊 ORCA Marine Intelligence initialized")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",De):De();
