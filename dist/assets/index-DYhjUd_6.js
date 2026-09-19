(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}})();let X="en";const ve={en:"English",hi:"हिन्दी",bn:"বাংলা",ta:"தமிழ்",te:"తెలుగు",mr:"मराठी",gu:"ગુજરાતી",kn:"ಕನ್ನಡ",ml:"മലയാളം",pa:"ਪੰਜਾਬੀ",ur:"اردو"};function te(){return X}function _e(e){ve[e]&&(X=e,localStorage.setItem("weathergpt-lang",e))}function Ne(){const e=localStorage.getItem("weathergpt-lang");return e&&ve[e]&&(X=e),X}function $e(){const e={en:"Ask about fishing zones, ocean conditions, weather...",hi:"कहीं भी मौसम के बारे में पूछें...",bn:"যেকোনো জায়গার আবহাওয়া সম্পর্কে জিজ্ঞাসা করুন...",ta:"எங்கும் வானிலை பற்றி கேளுங்கள்...",te:"ఎక్కడైనా వాతావరణం గురించి అడగండి...",mr:"कुठेही हवामानाबद्दल विचारा...",gu:"ગમે ત્યાં હવામાન વિશે પૂછો...",kn:"ಎಲ್ಲಿಯಾದರೂ ಹವಾಮಾನದ ಬಗ್ಗೆ ಕೇಳಿ...",ml:"എവിടെയും കാലാവസ്ഥയെക്കുറിച്ച് ചോദിക്കൂ...",pa:"ਕਿਤੇ ਵੀ ਮੌਸਮ ਬਾਰੇ ਪੁੱਛੋ...",ur:"...کہیں بھی موسم کے بارے میں پوچھیں"};return e[X]||e.en}let H=null,Y=!1,W=!1,ie=null,I=null;const ee={en:"en-IN",hi:"hi-IN",bn:"bn-IN",ta:"ta-IN",te:"te-IN",mr:"mr-IN",gu:"gu-IN",kn:"kn-IN",ml:"ml-IN",pa:"pa-IN",ur:"ur-IN"};function Me(){return!!(window.SpeechRecognition||window.webkitSpeechRecognition)}function Ee(){return!!window.speechSynthesis}function qe(e,t){ie=e,I=t;const n=window.SpeechRecognition||window.webkitSpeechRecognition;return n?(H=new n,H.continuous=!1,H.interimResults=!1,H.maxAlternatives=1,H.onresult=a=>{const s=a.results[0][0].transcript;ie&&ie(s)},H.onend=()=>{Y=!1,I&&I("stopped")},H.onerror=a=>{console.warn("Speech recognition error:",a.error),Y=!1,a.error==="not-allowed"?I&&I("denied"):I&&I("error")},!0):(console.warn("SpeechRecognition not supported"),!1)}function Ie(){if(!H)return;if(Y){Pe();return}const e=te();H.lang=ee[e]||"en-IN";try{H.start(),Y=!0,I&&I("listening")}catch(t){console.warn("Failed to start recognition:",t),I&&I("error")}}function Pe(){H&&Y&&(H.stop(),Y=!1,I&&I("stopped"))}function Oe(e){var c;if(!window.speechSynthesis||!W)return;window.speechSynthesis.cancel();const t=e.replace(/[\u{1F300}-\u{1FAFF}]/gu,"").replace(/[*_~`#]/g,"").trim();if(!t)return;const n=new SpeechSynthesisUtterance(t),a=te();n.lang=ee[a]||"en-IN",n.rate=1,n.pitch=1,n.volume=.9;const s=window.speechSynthesis.getVoices(),i=((c=ee[a])==null?void 0:c.split("-")[0])||"en",r=s.find(l=>l.lang.startsWith(i));r&&(n.voice=r),window.speechSynthesis.speak(n)}function Fe(e,t){var l;if(!window.speechSynthesis){t&&t();return}window.speechSynthesis.cancel();const n=e.replace(/[\u{1F300}-\u{1FAFF}]/gu,"").replace(/[*_~`#]/g,"").trim();if(!n){t&&t();return}const a=new SpeechSynthesisUtterance(n),s=te();a.lang=ee[s]||"en-IN",a.rate=1,a.pitch=1,a.volume=.9;const i=window.speechSynthesis.getVoices(),r=((l=ee[s])==null?void 0:l.split("-")[0])||"en",c=i.find(u=>u.lang.startsWith(r));c&&(a.voice=c),t&&(a.onend=()=>t(),a.onerror=()=>t()),window.speechSynthesis.speak(a)}function He(){var e;return W=!W,localStorage.setItem("weathergpt-autospeak",W),W||(e=window.speechSynthesis)==null||e.cancel(),W}function Re(){return W}function ze(){return W=localStorage.getItem("weathergpt-autospeak")==="true",W}const Ze={"01d":"☀️","01n":"🌙","02d":"⛅","02n":"☁️","03d":"☁️","03n":"☁️","04d":"☁️","04n":"☁️","09d":"🌧️","09n":"🌧️","10d":"🌦️","10n":"🌧️","11d":"⛈️","11n":"⛈️","13d":"❄️","13n":"❄️","50d":"🌫️","50n":"🌫️"};function Be(e){return Ze[e]||"🌡️"}function We(e,t){if(!(t!=null&&t.forecast)||!window.Chart)return null;const n=t.forecast,a=document.createElement("canvas");a.classList.add("forecast-chart-canvas"),e.appendChild(a);const s=n.map(m=>m.day_name),i=n.map(m=>m.temperature.high),r=n.map(m=>m.temperature.low),c=a.getContext("2d"),l=c.createLinearGradient(0,0,0,200);l.addColorStop(0,"rgba(245, 158, 11, 0.3)"),l.addColorStop(1,"rgba(245, 158, 11, 0.02)");const u=c.createLinearGradient(0,0,0,200);return u.addColorStop(0,"rgba(96, 165, 250, 0.2)"),u.addColorStop(1,"rgba(96, 165, 250, 0.02)"),new Chart(c,{type:"line",data:{labels:s,datasets:[{label:"High",data:i,borderColor:"#f59e0b",backgroundColor:l,borderWidth:2.5,fill:!0,tension:.4,pointBackgroundColor:"#f59e0b",pointBorderColor:"#1a2035",pointBorderWidth:2,pointRadius:5,pointHoverRadius:7},{label:"Low",data:r,borderColor:"#60a5fa",backgroundColor:u,borderWidth:2.5,fill:!0,tension:.4,pointBackgroundColor:"#60a5fa",pointBorderColor:"#1a2035",pointBorderWidth:2,pointRadius:5,pointHoverRadius:7}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{intersect:!1,mode:"index"},plugins:{legend:{display:!0,position:"top",align:"end",labels:{color:"#94a3b8",font:{family:"'Inter', sans-serif",size:11},boxWidth:12,boxHeight:2,useBorderRadius:!0,borderRadius:1,padding:12}},tooltip:{backgroundColor:"rgba(17, 24, 39, 0.95)",titleColor:"#f1f5f9",bodyColor:"#94a3b8",borderColor:"rgba(255, 255, 255, 0.06)",borderWidth:1,cornerRadius:8,padding:10,titleFont:{family:"'Inter', sans-serif",weight:"600"},bodyFont:{family:"'Inter', sans-serif"},callbacks:{label:m=>`${m.dataset.label}: ${m.parsed.y}°C`}}},scales:{x:{grid:{display:!1},border:{display:!1},ticks:{color:"#64748b",font:{family:"'Inter', sans-serif",size:11,weight:"500"}}},y:{grid:{color:"rgba(255, 255, 255, 0.04)",drawTicks:!1},border:{display:!1},ticks:{color:"#64748b",font:{family:"'Inter', sans-serif",size:11},padding:8,callback:m=>`${m}°`}}}}})}let j=null,x=null,se=null;const fe=[15.5,76.2],k=(e="")=>String(e).replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]);function re(e,t){const n=Math.PI/180,a=(t.lat-e.lat)*n,s=(t.lon-e.lon)*n,i=Math.sin(a/2)**2+Math.cos(e.lat*n)*Math.cos(t.lat*n)*Math.sin(s/2)**2;return 6371*2*Math.atan2(Math.sqrt(i),Math.sqrt(1-i))}function ae(e){var a,s;const t=e.risk.level==="favourable"?20:e.risk.level==="caution"?5:-30,n=((s=(a=e.ocean)==null?void 0:a.wave)==null?void 0:s.significant_height_m)||0;return e.confidence*100+t-e.wind_speed_knots*.35-n*2}function ge(e){return`<div class="marine-popup">
    <strong>🎣 ${k(e.name)}</strong>
    <span class="marine-popup-status" style="color:${e.risk.color}">● ${k(e.risk.label)}</span>
    <small>${Math.round(e.confidence*100)}% confidence · ${k(e.likely_species.join(", "))}</small>
  </div>`}function Ge(e){var a,s;const t=((a=e.sst)==null?void 0:a.value)??"—",n=((s=e.chlorophyll)==null?void 0:s.value)??"—";return`<div class="marine-popup ocean-popup">
    <strong>🌊 ${k(e.region)}</strong>
    <span class="marine-popup-status" style="color:${e.condition.color}">● ${k(e.condition.label)}</span>
    <small>SST ${k(t)}°C · Chlorophyll ${k(n)} mg/m³</small>
    <small><strong>MOCK/DEMO</strong> · ${k(e.source)}</small>
  </div>`}const K={INFO:"#38bdf8",CAUTION:"#facc15",WARNING:"#fb923c",DANGER:"#ef4444"};function De(e){return`<div class="marine-popup marine-alert-popup">
    <strong>⚠️ ${k(e.title)}</strong>
    <span class="marine-popup-status" style="color:${K[e.severity]||K.INFO}">● ${k(e.severity)}</span>
    <small>${k(e.message)}</small>
    <small>Affected zone: ${k(e.affected_zone||"not supplied")}</small>
    <small>Source: ${k(e.source)}</small>
    <small>Timestamp: ${k(e.timestamp||"not supplied")} ${e.is_demo?"· MOCK/DEMO":""}</small>
  </div>`}function Ve(e){return`<div class="marine-popup weather-popup">
    <strong>☁️ ${k(e.state)} wind telemetry</strong>
    <span class="marine-popup-status" style="color:#7dd3fc">● DEMO WEATHER LAYER</span>
    <small>Wind: ${k(e.wind_speed_knots)} kt</small>
    <small><strong>MOCK/DEMO</strong> · Existing PFZ advisory telemetry</small>
  </div>`}function ye(e){var s,i,r;if(!e)return'<div class="zone-empty"><span>🎣</span><strong>Select a PFZ zone</strong><p>Tap a coloured marine zone to see fish, safety and ocean telemetry.</p></div>';const t=x?`${re(x,e.coordinates).toFixed(1)} km from you`:"Enable GPS to calculate distance",n=(s=e.ocean)==null?void 0:s.wave,a=e.risk.level;return`
    <div class="zone-panel-kicker">SELECTED PFZ · ${k(e.state)}</div>
    <div class="zone-panel-heading">
      <div><h2>${k(e.name)}</h2><p>🎣 ${k(e.likely_species.join(" · "))}</p></div>
      <span class="zone-risk ${a}">● ${k(e.risk.label)}</span>
    </div>
    <p class="zone-advisory">${k(e.advisory)}</p>
    <div class="zone-metrics">
      <div><span>Confidence</span><strong>${Math.round(e.confidence*100)}%</strong></div>
      <div><span>🌡️ SST</span><strong>${e.sst_celsius}°C</strong></div>
      <div><span>🌿 Chlorophyll</span><strong>${e.chlorophyll_mg_m3} mg/m³</strong></div>
      <div><span>💨 Wind</span><strong>${e.wind_speed_knots} kt</strong></div>
      <div><span>🌊 Wave</span><strong>${n?`${n.significant_height_m} m`:"—"}</strong></div>
      <div><span>📍 Distance</span><strong>${t}</strong></div>
    </div>
    <div class="zone-current">Current ${k((i=e.ocean)!=null&&i.current?`${e.ocean.current.speed_knots} kt ${e.ocean.current.direction}`:"not available")} · Depth ${e.depth_range_m.min}–${e.depth_range_m.max} m</div>
    <div class="zone-additional">
      <span>Coordinates ${e.coordinates.lat.toFixed(2)}°N, ${e.coordinates.lon.toFixed(2)}°E</span>
      <span>Salinity ${((r=e.ocean)==null?void 0:r.salinity_psu)??"—"} PSU</span>
      <span>Advisory valid until ${e.valid_until?new Date(e.valid_until).toLocaleString():"not supplied"}</span>
    </div>
    <div class="zone-panel-actions">
      <button type="button" class="zone-action zone-ask">💬 Ask ORCA</button>
      <a class="zone-action zone-navigate" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${e.coordinates.lat},${e.coordinates.lon}">🧭 Navigate</a>
      <button type="button" class="zone-action zone-details">⌄ Details</button>
    </div>
    <div class="zone-source">Demo advisory · existing ORCA mock data</div>`}async function je(e,{onAskOrca:t,onZoneChange:n}={}){se=n,e.innerHTML='<div class="marine-map-loading"><span>◌</span> Loading PFZ advisory layers…</div>';try{const a=await fetch("/api/marine-map");if(!a.ok)throw new Error("Map data request failed");const s=await a.json();Ue(e,s,t)}catch(a){e.innerHTML='<div class="marine-map-loading map-load-error">⚠️ Marine advisory layers are unavailable. The chat remains available.</div>',console.error("Marine map:",a)}}function Ue(e,t,n){var d,S,z;e.innerHTML=`
    <section class="marine-map-card" aria-label="ORCA marine operations map">
      <header class="marine-map-header">
        <div class="map-header-branding">
          <div class="eyebrow">ORCA OPERATIONS · MARITIME INTELLIGENCE</div>
          <div class="map-title-row">
            <h1>Marine Operations Map</h1>
            <div class="map-status-strip">
              <span class="status-chip"><b class="dot pfz">●</b> ${t.zones.length} PFZ Zones</span>
              <span class="status-chip"><b class="dot ocean">◌</b> ${((d=t.ocean_conditions)==null?void 0:d.length)||0} Ocean Sectors</span>
              <span class="status-chip"><b class="dot alert">⚠</b> ${((S=t.marine_alerts)==null?void 0:S.length)||0} Alerts</span>
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
        <span class="map-note">Simulated INCOIS/ISRO telemetry · Updated ${t.last_updated?new Date(t.last_updated).toISOString().slice(0,10):"recent"}</span>
      </footer>
    </section>
    <aside class="zone-detail-panel" aria-live="polite">${ye(null)}</aside>`;const a=e.querySelector("#orca-marine-map"),s=e.querySelector(".zone-detail-panel"),i=(z=window.L)==null?void 0:z.map(a,{zoomControl:!1,attributionControl:!0}).setView(fe,5);if(!i){a.innerHTML='<div class="map-load-error">Map engine unavailable.</div>';return}L.control.zoom({position:"topleft"}).addTo(i);const r={standard:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:"© OpenStreetMap"}),satellite:L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{maxZoom:18,attribution:"Tiles © Esri"}),hybrid:L.layerGroup([L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{maxZoom:18,attribution:"Tiles © Esri"}),L.tileLayer("https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",{maxZoom:18,attribution:"Labels © Esri"})]),terrain:L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{maxZoom:17,attribution:"© OpenTopoMap contributors"})};let c="standard";r.standard.addTo(i);const l={favourable:L.layerGroup().addTo(i),caution:L.layerGroup().addTo(i),"high-risk":L.layerGroup().addTo(i),targets:L.layerGroup().addTo(i),ocean:L.layerGroup().addTo(i),alerts:L.layerGroup().addTo(i),weather:L.layerGroup(),location:L.layerGroup().addTo(i)},u=new Map;let g=null;const m=(o,p)=>{var y;j=o,s.innerHTML=ye(o),se==null||se(o,x),p&&(i.flyToBounds(p.getBounds?p.getBounds().pad(.7):L.latLngBounds([[o.coordinates.lat,o.coordinates.lon]]),{maxZoom:8,duration:.7}),(y=p.openPopup)==null||y.call(p)),C()},C=()=>{var o,p;(o=s.querySelector(".zone-ask"))==null||o.addEventListener("click",()=>n==null?void 0:n(j,x)),(p=s.querySelector(".zone-details"))==null||p.addEventListener("click",()=>{s.classList.toggle("zone-detail-expanded");const y=s.querySelector(".zone-details");y&&(y.textContent=s.classList.contains("zone-detail-expanded")?"⌃ Less":"⌄ Details")})};t.zones.forEach(o=>{const p=[[o.bounds.south,o.bounds.west],[o.bounds.north,o.bounds.east]],y=L.rectangle(p,{color:o.risk.color,weight:2,fillColor:o.risk.color,fillOpacity:.18}).bindPopup(ge(o),{closeButton:!1});y.on("click",()=>m(o,y)),y.addTo(l[o.risk.level]);const R=L.marker([o.coordinates.lat,o.coordinates.lon],{icon:L.divIcon({className:"pfz-target-icon",html:`<span style="--zone-color:${o.risk.color}">🎣</span>`,iconSize:[34,34],iconAnchor:[17,17]}),title:`${o.name} PFZ`}).bindPopup(ge(o),{closeButton:!1});R.on("click",()=>m(o,y)),R.addTo(l.targets),L.circleMarker([o.coordinates.lat,o.coordinates.lon],{radius:9,color:"#7dd3fc",fillColor:"#38bdf8",fillOpacity:.35,weight:2}).bindPopup(Ve(o),{closeButton:!1}).addTo(l.weather),u.set(o.id,y)}),(t.ocean_conditions||[]).forEach(o=>{L.circleMarker([o.coordinates.lat,o.coordinates.lon],{radius:10,color:o.condition.color,fillColor:o.condition.color,fillOpacity:.52,weight:2}).bindPopup(Ge(o),{closeButton:!1}).addTo(l.ocean)}),(t.marine_alerts||[]).forEach((o,p)=>{L.circleMarker([o.coordinates.lat+p%3*.08,o.coordinates.lon+p%3*.08],{radius:7,color:K[o.severity]||K.INFO,fillColor:K[o.severity]||K.INFO,fillOpacity:.78,weight:2}).bindPopup(De(o),{closeButton:!1}).addTo(l.alerts)});const v=o=>{x={lat:o.coords.latitude,lon:o.coords.longitude},l.location.clearLayers(),L.marker([x.lat,x.lon],{icon:L.divIcon({className:"user-vessel-icon",html:"<span>🚤</span>",iconSize:[38,38],iconAnchor:[19,19]})}).bindPopup("Your GPS location").addTo(l.location),j&&(g&&l.location.removeLayer(g),g=L.polyline([[x.lat,x.lon],[j.coordinates.lat,j.coordinates.lon]],{color:"#38bdf8",dashArray:"7 8",weight:2}).addTo(l.location),m(j)),i.flyTo([x.lat,x.lon],8,{duration:.8});const y=e.querySelector(".map-locate");y&&(y.textContent="📍 GPS active")},E=()=>{const o=e.querySelector(".map-locate");if(!navigator.geolocation){o&&(o.textContent="GPS unavailable");return}o&&(o.textContent="Locating…"),navigator.geolocation.getCurrentPosition(v,()=>{o&&(o.textContent="GPS permission needed")},{enableHighAccuracy:!0,timeout:1e4,maximumAge:6e4})},$=e.querySelector(".map-basemap"),f=e.querySelector(".map-control-status"),_=o=>{r[o]&&(i.removeLayer(r[c]),c=o,r[c].addTo(i),$&&($.value=c),f&&(f.textContent=`${o[0].toUpperCase()}${o.slice(1)} basemap active`))};Object.entries(r).forEach(([o,p])=>p.on("tileerror",()=>{c===o&&o!=="standard"&&(_("standard"),f&&(f.textContent=`${o[0].toUpperCase()}${o.slice(1)} is unavailable · Standard restored`))})),$==null||$.addEventListener("change",o=>_(o.target.value));const N=()=>{var R,J;const o=(R=e.querySelector(".map-search-input"))==null?void 0:R.value.trim().toLowerCase();if(!o)return;const p=t.zones.find(V=>`${V.name} ${V.state}`.toLowerCase().includes(o));if(p){m(p,u.get(p.id)),f&&(f.textContent=`${p.name} selected`);return}const y=(J=t.ocean_conditions)==null?void 0:J.find(V=>`${V.region} ${V.state}`.toLowerCase().includes(o));if(y){i.flyTo([y.coordinates.lat,y.coordinates.lon],7,{duration:.7}),f&&(f.textContent=`${y.region} centered`);return}f&&(f.textContent="No matching advisory region")},T={pfz:[l.favourable,l.caution,l["high-risk"],l.targets],ocean:[l.ocean],alerts:[l.alerts],weather:[l.weather]},F=(o,p)=>{const y=i.hasLayer(T[o][0]);T[o].forEach(R=>y?i.removeLayer(R):R.addTo(i)),p.classList.toggle("is-active",!y),p.setAttribute("aria-pressed",String(!y)),f&&(f.textContent=`${p.textContent.trim()} layer ${y?"hidden":"shown"}`)};e.querySelector(".map-locate").addEventListener("click",E),e.querySelector(".map-reset").addEventListener("click",()=>{i.closePopup(),i.flyTo(fe,5,{duration:.7}),f&&(f.textContent="Map view reset")}),e.querySelector(".map-search-button").addEventListener("click",N),e.querySelector(".map-search-input").addEventListener("keydown",o=>{o.key==="Enter"&&N()});const q=e.querySelector(".marine-map-legend-widget"),M=e.querySelector(".legend-toggle-btn");M&&q&&M.addEventListener("click",()=>{const o=q.classList.toggle("is-open");M.setAttribute("aria-expanded",String(o));const p=M.querySelector(".toggle-arrow");p&&(p.textContent=o?"▴":"▾")}),e.querySelectorAll(".map-layer-button").forEach(o=>{o.addEventListener("click",()=>F(o.dataset.layer,o))}),e.querySelector(".best-zone").addEventListener("click",()=>{const p=[...t.zones].sort((R,J)=>{const V=x?re(x,R.coordinates)-re(x,J.coordinates):0;return ae(J)-ae(R)||V})[0];m(p,u.get(p.id));const y=e.querySelector(".best-zone");y.textContent=`✓ Best: ${p.state}`,setTimeout(()=>{y.textContent="🎯 Find Best Zone"},2400)});const w=[...t.zones].sort((o,p)=>ae(p)-ae(o))[0];m(w,u.get(w.id)),setTimeout(()=>i.invalidateSize(),100)}let O=null,h=null,Z=null,A=null,B=null,ce=null,G=null,D=null,Q=null,b=null,P=null;const oe=["🛰️ Querying Marine Satellite Telemetry...","🌊 Analyzing Ocean SST & Chlorophyll-a Upwelling...","🧭 Synthesizing Advisory & PFZ Coordinates...","⚡ Finalizing Marine Recommendations..."];function Ke(e,{onSend:t,onSuggestion:n,onMapZoneChange:a}){var i,r;ce=t,G=n,e.innerHTML="",e.appendChild(Qe());const s=document.createElement("main");s.className="marine-home",s.id="marine-home",e.appendChild(s),b=document.createElement("aside"),b.className="chat-drawer",b.id="chat-drawer",b.setAttribute("aria-label","Ask ORCA assistant"),b.innerHTML=`
    <div class="chat-drawer-header">
      <div><span class="chat-drawer-eyebrow">ORCA AI COPILOT</span><strong>Ask ORCA</strong></div>
      <div class="chat-drawer-header-actions">
        <button class="chat-drawer-action-btn chat-drawer-fullscreen" type="button" aria-label="Enlarge chat to full screen" title="Enlarge chat to full screen">
          <svg class="expand-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
          <svg class="compress-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
            <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/>
          </svg>
        </button>
        <button class="chat-drawer-action-btn chat-drawer-close" type="button" aria-label="Close Ask ORCA" title="Close chat">×</button>
      </div>
    </div>`,O=Xe(),b.appendChild(O),b.appendChild(tt()),e.appendChild(b),P=document.createElement("button"),P.className="ask-orca-fab",P.type="button",P.innerHTML="<span>💬</span> Ask ORCA",P.setAttribute("aria-expanded","false"),P.addEventListener("click",de),e.appendChild(P),(i=b.querySelector(".chat-drawer-fullscreen"))==null||i.addEventListener("click",pe),(r=b.querySelector(".chat-drawer-close"))==null||r.addEventListener("click",be),window.addEventListener("keydown",c=>{c.key==="Escape"&&(b!=null&&b.classList.contains("is-open"))&&(b.classList.contains("is-fullscreen")?pe():be())}),et(),je(s,{onAskOrca:c=>{de(),xe(`Is ${c.name} suitable for ${c.likely_species[0]} today?`)},onZoneChange:a})}function de(){b&&(b.classList.add("is-open"),P==null||P.setAttribute("aria-expanded","true"),setTimeout(()=>h==null?void 0:h.focus(),180))}function pe(){if(!b)return;const e=b.classList.toggle("is-fullscreen"),t=b.querySelector(".expand-icon"),n=b.querySelector(".compress-icon"),a=b.querySelector(".chat-drawer-fullscreen");e?(a==null||a.setAttribute("aria-label","Exit full screen"),a&&(a.title="Exit full screen"),t&&(t.style.display="none"),n&&(n.style.display="block")):(a==null||a.setAttribute("aria-label","Enlarge chat to full screen"),a&&(a.title="Enlarge chat to full screen"),t&&(t.style.display="block"),n&&(n.style.display="none"))}function be(){b!=null&&b.classList.contains("is-fullscreen")&&pe(),b==null||b.classList.remove("is-open"),P==null||P.setAttribute("aria-expanded","false")}function Qe(){const e=document.createElement("header");return e.className="header",e.id="app-header",e.innerHTML=`
    <div class="header-brand">
      <div class="header-logo">🌊</div>
      <div>
        <div class="header-title">ORCA</div>
        <div class="header-subtitle">Marine Intelligence</div>
      </div>
    </div>
    <nav class="header-nav" aria-label="Primary navigation"><a href="#marine-home">Operations map</a><button type="button" class="header-ask-orca">Ask ORCA</button></nav>
    <div class="header-agent-status" id="header-agent-status" title="ORCA Marine Telemetry Core · Active">
      <span class="status-pulse-dot"></span>
      <span class="status-text">Marine Core Active</span>
    </div>
    <div class="header-controls">
      ${Ye()}
      ${Ee()?Je():""}
    </div>
  `,setTimeout(()=>{var a;(a=e.querySelector(".header-ask-orca"))==null||a.addEventListener("click",de);const t=e.querySelector("#lang-picker");t&&(t.value=te(),t.addEventListener("change",s=>{_e(s.target.value),h&&(h.placeholder=$e())}));const n=e.querySelector("#voice-toggle");n&&n.addEventListener("click",()=>{const s=He();n.classList.toggle("active",s),n.title=s?"Auto-speak: ON":"Auto-speak: OFF"})},0),e}function Te(e,t=!1){const n=document.getElementById("header-agent-status");if(!n)return;const a=n.querySelector(".status-pulse-dot"),s=n.querySelector(".status-text");a&&(a.className=t?"status-pulse-dot scanning":"status-pulse-dot"),s&&(s.textContent=e)}function Ye(){return`<select id="lang-picker" class="lang-picker" aria-label="Language">${Object.entries(ve).map(([t,n])=>`<option value="${t}">${n}</option>`).join("")}</select>`}function Je(){const e=Re();return`<button id="voice-toggle" class="voice-toggle-btn ${e?"active":""}" 
    title="${e?"Auto-speak: ON":"Auto-speak: OFF"}" aria-label="Toggle voice output">
    🔊
  </button>`}function Xe(){const e=document.createElement("div");return e.className="chat-area",e.id="chat-area",e}function et(){if(!O)return;B=document.createElement("div"),B.className="welcome",B.id="welcome-screen";const e=[{icon:"🎣",category:"Potential Fishing Zones",prompt:"Show PFZ zones in Maharashtra",desc:"Satellite SST & Chlorophyll-a pelagic hotspots"},{icon:"🌊",category:"Ocean & Sea State",prompt:"What are ocean conditions near Chennai?",desc:"Wave swell, sea temperature & tidal currents"},{icon:"🧭",category:"Navigational Safety",prompt:"Is it safe to go fishing today?",desc:"Coastal hazard alerts, high wave & squall checks"},{icon:"🐟",category:"Target Species Advice",prompt:"Where can I fish today near Mumbai?",desc:"Tuna, Mackerel & Pomfret location forecast"}];B.innerHTML=`
    <div class="welcome-icon">🌊</div>
    <h2>ORCA Marine Intelligence</h2>
    <p>AI-powered operational console for coastal navigation, Potential Fishing Zones (PFZ), satellite oceanography, and maritime safety.</p>
    <div class="welcome-suggestions-grid">
      ${e.map(t=>`
        <button class="suggestion-chip-card" data-prompt="${t.prompt}">
          <div class="chip-card-top">
            <span class="chip-card-icon">${t.icon}</span>
            <span class="chip-card-badge">${t.category}</span>
          </div>
          <div class="chip-card-prompt">${t.prompt}</div>
          <div class="chip-card-desc">${t.desc}</div>
        </button>
      `).join("")}
    </div>
  `,setTimeout(()=>{B.querySelectorAll(".suggestion-chip-card").forEach(t=>{t.addEventListener("click",()=>{const n=t.getAttribute("data-prompt")||t.textContent;G&&G(n)})})},0),O.appendChild(B)}function Ae(){B&&(B.remove(),B=null)}function tt(){const e=document.createElement("div");e.className="input-bar",e.id="input-bar";const t=document.createElement("div");t.className="input-wrapper",h=document.createElement("textarea"),h.className="input-field",h.id="message-input",h.placeholder=$e(),h.rows=1,h.setAttribute("aria-label","Message input"),h.addEventListener("input",()=>{h.style.height="auto";const a=Math.min(h.scrollHeight,120);h.style.height=a+"px",h.style.overflowY=h.scrollHeight>120?"auto":"hidden"}),h.addEventListener("keydown",a=>{a.key==="Enter"&&!a.shiftKey&&(a.preventDefault(),we())}),t.appendChild(h),Me()&&(A=document.createElement("button"),A.className="input-btn mic-btn",A.id="mic-btn",A.innerHTML="🎤",A.title="Voice input",A.setAttribute("aria-label","Voice input"),A.addEventListener("click",()=>{Ie()})),Z=document.createElement("button"),Z.className="input-btn send-btn",Z.id="send-btn",Z.innerHTML="➤",Z.title="Send message",Z.setAttribute("aria-label","Send message"),Z.addEventListener("click",we);const n=document.createElement("div");return n.className="chat-drawer-input-container",n.appendChild(t),A&&n.appendChild(A),n.appendChild(Z),e.appendChild(n),e}function we(){var t;const e=(t=h==null?void 0:h.value)==null?void 0:t.trim();!e||!ce||(h.value="",h.style.height="auto",h.style.overflowY="hidden",ce(e))}function Ce(e,t,n={}){var $,f,_,N,T,F,q,M;if(Ae(),!O)return;const a=document.createElement("div");a.className=`message ${e}`;const s=document.createElement("div");s.className="message-avatar",s.textContent=e==="user"?"👤":"🌊";const i=document.createElement("div");i.className="message-content";const r=document.createElement("div");if(r.className="message-bubble",r.innerHTML=st(t),e==="assistant"&&t){const w=document.createElement("div");if(w.className="msg-actions-bar",Ee()){const S=document.createElement("button");S.className="msg-action-btn msg-speak-btn",S.innerHTML="🔊",S.title="Listen to this response",S.setAttribute("aria-label","Listen to this response"),S.addEventListener("click",z=>{z.stopPropagation(),S.classList.add("speaking"),Fe(t,()=>{S.classList.remove("speaking")})}),w.appendChild(S)}const d=document.createElement("button");d.className="msg-action-btn msg-copy-btn",d.innerHTML="📋",d.title="Copy response text",d.setAttribute("aria-label","Copy response text"),d.addEventListener("click",S=>{S.stopPropagation(),navigator.clipboard.writeText(t).then(()=>{d.innerHTML="✓",d.classList.add("btn-copied"),setTimeout(()=>{d.innerHTML="📋",d.classList.remove("btn-copied")},1500)})}),w.appendChild(d),r.appendChild(w)}const c=document.createElement("div");c.className="message-time",c.textContent=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),i.appendChild(r),n.weatherData&&i.appendChild(it(n.weatherData)),n.airQualityData&&i.appendChild(ot(n.airQualityData));const l=n.orchestratorData,u=l==null?void 0:l.pfz_result,g=($=l==null?void 0:l.recommendation_result)==null?void 0:$.selected_pfz,m=n.pfzData||u;let C=null;if(n.coordinates||((f=l==null?void 0:l.map_data)==null?void 0:f.user_location)||m&&m.zones&&m.zones.length>0){const w=((_=l==null?void 0:l.map_data)==null?void 0:_.user_location)||n.coordinates||(g==null?void 0:g.coordinates)||((T=(N=m==null?void 0:m.zones)==null?void 0:N[0])==null?void 0:T.coordinates);w&&(C=pt(w,((F=n.weatherData)==null?void 0:F.city)||((q=n.forecastData)==null?void 0:q.city)||((M=l==null?void 0:l.weather_result)==null?void 0:M.city)||"",m))}const E=[];if(n.pfzData&&n.pfzData.zones&&n.pfzData.zones.forEach(w=>{const d=lt(w,n.pfzData.source,C,E);E.push(d),i.appendChild(d)}),l!=null&&l.recommendation_result&&i.appendChild(ct(l)),n.forecastData&&i.appendChild(dt(n.forecastData)),C&&(i.appendChild(C.element),g!=null&&g.coordinates&&C.focusZone(g.coordinates.lat,g.coordinates.lon,g.name)),e==="assistant"){const w=ut(n);w&&i.appendChild(w)}i.appendChild(c),a.appendChild(s),a.appendChild(i),O.appendChild(a),he()}function at(){if(Ae(),D||!O)return;Te("Scanning Ocean Telemetry...",!0),D=document.createElement("div"),D.className="typing-indicator agent-activity-card";let e=0;D.innerHTML=`
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
        ${oe[0]}
      </div>
    </div>
  `,O.appendChild(D),he(),Q&&clearInterval(Q),Q=setInterval(()=>{e=(e+1)%oe.length;const t=document.getElementById("activity-status-text");t&&(t.classList.remove("status-fade-in"),t.offsetWidth,t.textContent=oe[e],t.classList.add("status-fade-in"))},1300)}function ue(){Q&&(clearInterval(Q),Q=null),Te("Marine Core Active",!1),D&&(D.remove(),D=null)}function ne(e){if(ue(),!O)return;const t=document.createElement("div");t.className="message assistant",t.innerHTML=`
    <div class="message-avatar" style="background: var(--accent-gradient);">🌊</div>
    <div class="message-content">
      <div class="error-message">⚠️ ${e}</div>
      <div class="message-time">${new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
    </div>
  `,O.appendChild(t),he()}function Le(e){h&&(h.disabled=e),Z&&(Z.disabled=e),A&&(A.disabled=e)}function xe(e){h&&(h.value=e,h.style.height="auto",h.style.height=Math.min(h.scrollHeight,120)+"px",h.focus())}function nt(e){if(A)switch(e){case"listening":A.classList.add("recording"),A.innerHTML="⏹️";break;case"stopped":case"error":case"denied":A.classList.remove("recording"),A.innerHTML="🎤";break}}function st(e){return e?e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\n/g,"<br>"):""}function it(e){var s,i,r,c,l;const t=document.createElement("div");t.className="weather-card";const n=((s=e.weather)==null?void 0:s.icon)||"03d",a=Be(n);return t.innerHTML=`
    <div class="weather-card-header">
      <div>
        <div class="weather-card-city">${e.city||""}${e.country?", "+e.country:""}</div>
        <div class="weather-card-condition">${((i=e.weather)==null?void 0:i.description)||""}</div>
      </div>
    </div>
    <div class="weather-card-main">
      <div class="weather-card-temp">${((r=e.temperature)==null?void 0:r.current)??"--"}°C</div>
      <div class="weather-card-icon">${a}</div>
    </div>
    <div class="weather-card-details">
      <div class="weather-detail">
        <div class="weather-detail-label">Feels Like</div>
        <div class="weather-detail-value">${((c=e.temperature)==null?void 0:c.feels_like)??"--"}°C</div>
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
  `,t}function ot(e){var a,s,i,r,c,l,u,g;const t=document.createElement("div");t.className="aqi-card";const n={1:"aqi-good",2:"aqi-fair",3:"aqi-moderate",4:"aqi-poor",5:"aqi-very-poor"}[(a=e.aqi)==null?void 0:a.index]||"aqi-moderate";return t.innerHTML=`
    <div class="aqi-header">
      <div class="weather-card-city">Air Quality — ${e.city||""}</div>
      <span class="aqi-badge ${n}">${((s=e.aqi)==null?void 0:s.label)||"Unknown"}</span>
    </div>
    <div class="aqi-pollutants">
      ${((i=e.pollutants)==null?void 0:i.pm2_5)!=null?`
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">PM2.5</div>
        <div class="aqi-pollutant-value">${e.pollutants.pm2_5}</div>
      </div>`:""}
      ${((r=e.pollutants)==null?void 0:r.pm10)!=null?`
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">PM10</div>
        <div class="aqi-pollutant-value">${e.pollutants.pm10}</div>
      </div>`:""}
      ${((c=e.pollutants)==null?void 0:c.no2)!=null?`
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">NO₂</div>
        <div class="aqi-pollutant-value">${e.pollutants.no2}</div>
      </div>`:""}
      ${((l=e.pollutants)==null?void 0:l.o3)!=null?`
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">O₃</div>
        <div class="aqi-pollutant-value">${e.pollutants.o3}</div>
      </div>`:""}
      ${((u=e.pollutants)==null?void 0:u.co)!=null?`
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">CO</div>
        <div class="aqi-pollutant-value">${e.pollutants.co}</div>
      </div>`:""}
      ${((g=e.pollutants)==null?void 0:g.so2)!=null?`
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">SO₂</div>
        <div class="aqi-pollutant-value">${e.pollutants.so2}</div>
      </div>`:""}
    </div>
  `,t}function lt(e,t,n,a){var q,M,w;const s=document.createElement("div");s.className="pfz-card";const i=e.confidence??.7,r=i>=.8?"pfz-conf-high":i>=.6?"pfz-conf-moderate":"pfz-conf-low",c=e.confidence_label||(i>=.8?"High":i>=.6?"Moderate":"Low"),l=Math.round(i*100),u=e.coordinates,g=u?`${u.lat.toFixed(2)}°N, ${u.lon.toFixed(2)}°E`:"",m=u?`${u.lat.toFixed(4)}, ${u.lon.toFixed(4)}`:"",C=(q=e.conditions)==null?void 0:q.sst_celsius,v=(M=e.conditions)==null?void 0:M.chlorophyll_mg_m3,E=(w=e.conditions)==null?void 0:w.wind_speed_knots,$=e.depth_range_m,f=e.likely_species||[];s.innerHTML=`
    <div class="pfz-card-header">
      <div class="pfz-header-left">
        <div class="pfz-card-title">🎣 ${e.name||"PFZ Zone"}</div>
        <div class="pfz-card-location">📍 ${e.state||"Indian Ocean Coast"}${g?" · "+g:""}</div>
      </div>
      <div class="pfz-conf-badge-wrapper">
        <span class="pfz-conf-badge ${r}">● ${c} (${l}%)</span>
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

      ${v!=null?`
      <div class="pfz-telemetry-item chl-item">
        <div class="tel-header">
          <span class="tel-label">🌿 Chlorophyll</span>
          <span class="tel-value">${v} mg/m³</span>
        </div>
        <div class="tel-bar"><div class="tel-bar-fill chl-fill" style="width: ${Math.min(100,Math.max(15,v/.8*100))}%;"></div></div>
        <div class="tel-sub">Phytoplankton Bloom</div>
      </div>`:""}

      ${E!=null?`
      <div class="pfz-telemetry-item wind-item">
        <div class="tel-header">
          <span class="tel-label">💨 Sea Wind</span>
          <span class="tel-value">${E} kt</span>
        </div>
        <div class="tel-bar"><div class="tel-bar-fill wind-fill" style="width: ${Math.min(100,Math.max(15,E/28*100))}%;"></div></div>
        <div class="tel-sub">${E>18?"Caution · Gusty Swell":"Calm · Favorable Seas"}</div>
      </div>`:""}

      ${$?`
      <div class="pfz-telemetry-item depth-item">
        <div class="tel-header">
          <span class="tel-label">📏 Bathymetry</span>
          <span class="tel-value">${$.min}–${$.max} m</span>
        </div>
        <div class="tel-bar"><div class="tel-bar-fill depth-fill" style="width: ${Math.min(100,$.max/90*100)}%;"></div></div>
        <div class="tel-sub">Continental Shelf Zone</div>
      </div>`:""}
    </div>

    ${f.length>0?`
    <div class="pfz-species-section">
      <div class="pfz-section-title">🐟 Target Species (Click to query advice):</div>
      <div class="pfz-species-pills">
        ${f.map(d=>`<button class="pfz-species-pill" type="button" data-species="${d}">🐟 ${d}</button>`).join("")}
      </div>
    </div>`:""}

    <div class="pfz-card-actions">
      ${u&&n?`
      <button class="pfz-action-btn pfz-btn-map" type="button">
        🗺️ Focus Zone on Map
      </button>`:""}
      ${u?`
      <button class="pfz-action-btn pfz-btn-gps" type="button" data-gps="${m}">
        📋 Copy GPS
      </button>`:""}
      <button class="pfz-action-btn pfz-btn-weather" type="button">
        🌤️ Sea Weather
      </button>
    </div>

    <div class="pfz-source-tag">${t||"ORCA Mock Data"}</div>
  `;const _=()=>{n&&u&&(a&&a.forEach(d=>d.classList.remove("pfz-card--active")),s.classList.add("pfz-card--active"),n.focusZone(u.lat,u.lon,e.name))},N=s.querySelector(".pfz-btn-map");N&&N.addEventListener("click",d=>{d.stopPropagation(),_()}),s.addEventListener("click",d=>{d.target.closest("button")||_()}),s.querySelectorAll(".pfz-species-pill").forEach(d=>{d.addEventListener("click",S=>{S.stopPropagation();const z=d.getAttribute("data-species");G&&G(`What is the recommended gear, depth, and technique for catching ${z} in ${e.name||"this zone"}?`)})});const T=s.querySelector(".pfz-btn-gps");T&&m&&T.addEventListener("click",d=>{d.stopPropagation(),navigator.clipboard.writeText(m).then(()=>{const S=T.innerHTML;T.innerHTML="✓ Copied!",T.classList.add("btn-copied"),setTimeout(()=>{T.innerHTML=S,T.classList.remove("btn-copied")},1800)})});const F=s.querySelector(".pfz-btn-weather");return F&&F.addEventListener("click",d=>{d.stopPropagation(),G&&G(`What are the wind and ocean conditions at ${e.name||"this location"}?`)}),s}function rt(e){return e?e.confidence!=null?`${Math.round(e.confidence*100)}% confidence`:e.mg_m3!=null?`${e.mg_m3} mg/m³`:e.celsius!=null?`${e.celsius}°C`:e.significant_height_m!=null?`${e.significant_height_m} m`:e.condition!=null?e.condition:"Not available":"Not available"}function ct(e){var _,N,T,F,q;const t=e.recommendation_result,n=t.selected_pfz,a=((N=(_=e.gis_result)==null?void 0:_.candidates)==null?void 0:N.find(M=>M.id===(n==null?void 0:n.id)))||((T=e.gis_result)==null?void 0:T.nearest_pfz),s=t.factors||{},i=document.createElement("section");i.className="recommendation-card";const r=document.createElement("div");r.className="recommendation-card-header";const c=document.createElement("div"),l=document.createElement("span");l.className="recommendation-kicker",l.textContent="ORCA FISHING RECOMMENDATION";const u=document.createElement("strong");u.textContent=(n==null?void 0:n.name)||"No PFZ recommended",c.append(l,u);const g=document.createElement("span"),m=t.safety_status||((F=e.safety_result)==null?void 0:F.status)||"UNKNOWN";g.className=`recommendation-safety recommendation-safety--${m.toLowerCase()}`,g.textContent=m,r.append(c,g),i.appendChild(r);const C=document.createElement("div");C.className="recommendation-summary";const v=document.createElement("div");v.innerHTML=`<span>Suitability</span><strong>${t.score??"—"}<small>/100</small></strong>`;const E=document.createElement("div");E.innerHTML=`<span>Distance</span><strong>${(a==null?void 0:a.distance_km)!=null?`${a.distance_km} km`:"Not available"}</strong>`,C.append(v,E),i.appendChild(C);const $=[["PFZ",[s.pfz]],["Ocean",[s.chlorophyll,s.sst,s.waves]],["Weather",[s.weather]]],f=document.createElement("div");if(f.className="recommendation-factors",$.forEach(([M,w])=>{const d=document.createElement("div");d.className="recommendation-factor-group";const S=document.createElement("span");S.textContent=M,d.appendChild(S),w.filter(Boolean).forEach(z=>{const o=document.createElement("div");o.textContent=`${rt(z)} · ${z.score}/${z.weight_percent} pts`,d.appendChild(o)}),f.appendChild(d)}),i.appendChild(f),(q=t.reasons)!=null&&q.length){const M=document.createElement("ul");M.className="recommendation-reasons",t.reasons.slice(0,4).forEach(w=>{const d=document.createElement("li");d.textContent=w,M.appendChild(d)}),i.appendChild(M)}return i}function dt(e){var s;const t=document.createElement("div");t.className="forecast-chart-container";const n=document.createElement("div");n.className="forecast-chart-title",n.textContent=`📊 ${((s=e.forecast)==null?void 0:s.length)||5}-Day Forecast — ${e.city||""}`,t.appendChild(n);const a=document.createElement("div");return a.style.height="180px",a.style.position="relative",t.appendChild(a),setTimeout(()=>{We(a,e)},100),t}function pt(e,t,n){const a=document.createElement("div");a.className="map-wrapper";const s=n&&n.zones&&n.zones.length>0,i=document.createElement("button");i.className="map-toggle-btn",i.innerHTML=s?"🗺️ Show PFZ zones on map":"📍 Show on map",i.setAttribute("aria-label","Show location on map");let r=!1,c=null,l=null;const u=[];function g(){if(!r){if(c=document.createElement("div"),c.className="map-container",s&&c.classList.add("map-container--pfz"),a.appendChild(c),window.L){l=L.map(c,{zoomControl:!0,attributionControl:!1}).setView([e.lat,e.lon],10),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18}).addTo(l);const C=L.featureGroup();if(t){const v=L.marker([e.lat,e.lon]).bindPopup(`<b>${t}</b>`);v.addTo(l),C.addLayer(v)}s&&n.zones.forEach(v=>{var d,S;if(!v.coordinates)return;const{lat:E,lon:$}=v.coordinates,f=Math.round((v.confidence||0)*100),_=v.confidence_label||(v.confidence>=.8?"High":v.confidence>=.6?"Moderate":"Low"),N=v.confidence>=.8?"#4ade80":v.confidence>=.6?"#facc15":"#f87171",T=v.likely_species&&v.likely_species.length?v.likely_species.join(", "):"—",F=((d=v.conditions)==null?void 0:d.sst_celsius)!=null?v.conditions.sst_celsius+"°C":"—",q=((S=v.conditions)==null?void 0:S.chlorophyll_mg_m3)!=null?v.conditions.chlorophyll_mg_m3+" mg/m³":"—",M=`
            <div class="pfz-popup">
              <div class="pfz-popup-title">🎣 ${v.name||"PFZ Zone"}</div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">Confidence</span><span style="color:${N};font-weight:600">${_} (${f}%)</span></div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">Species</span><span>🐟 ${T}</span></div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">SST</span><span>🌡️ ${F}</span></div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">Chlorophyll</span><span>🌿 ${q}</span></div>
              <div class="pfz-popup-source">ORCA Mock Data</div>
            </div>`,w=L.circleMarker([E,$],{radius:11,fillColor:"#14b8a6",fillOpacity:.9,color:"#ffffff",weight:2}).bindPopup(M,{className:"pfz-leaflet-popup",maxWidth:260});w.addTo(l),C.addLayer(w),u.push({zoneName:v.name,lat:E,lon:$,marker:w})}),C.getLayers().length>1?setTimeout(()=>{l.fitBounds(C.getBounds().pad(.15))},250):!t&&s&&l.setView([e.lat,e.lon],9),setTimeout(()=>l.invalidateSize(),200)}i.innerHTML=s?"🗺️ Hide map":"📍 Hide map",r=!0}}function m(){r&&(c&&c.remove(),c=null,l=null,u.length=0,i.innerHTML=s?"🗺️ Show PFZ zones on map":"📍 Show on map",r=!1)}return i.addEventListener("click",()=>{r?m():g()}),a.appendChild(i),{element:a,openMap:g,focusZone:(C,v,E)=>{r||g(),setTimeout(()=>{if(l){l.flyTo([C,v],11,{duration:.8});const $=u.find(f=>E&&f.zoneName===E||Math.abs(f.lat-C)<.005&&Math.abs(f.lon-v)<.005);$&&$.marker.openPopup()}a.scrollIntoView({behavior:"smooth",block:"nearest"})},150)}}}function ut(e){let t=[];if(e.pfzData&&e.pfzData.zones&&e.pfzData.zones.length>0)t=["🧭 Is navigation safe in these zones today?","💨 Wind & wave swell forecast for these zones","🎣 Recommended fishing gear & depth"];else if(e.weatherData){const a=e.weatherData.city||"this area";t=[`🎣 Show PFZ zones near ${a}`,"🌊 Ocean swell and wave height",`📊 5-day marine forecast for ${a}`]}else return null;const n=document.createElement("div");return n.className="followup-suggestions",n.innerHTML=`
    <div class="followup-title">⚡ Quick Marine Follow-ups</div>
    <div class="followup-chips">
      ${t.map(a=>`<button class="followup-chip" type="button">${a}</button>`).join("")}
    </div>
  `,n.querySelectorAll(".followup-chip").forEach(a=>{a.addEventListener("click",()=>{G&&G(a.textContent)})}),n}function he(){O&&requestAnimationFrame(()=>{O.scrollTop=O.scrollHeight})}const U=[],Se=20;let me=null;function mt(e,t){if(!e||!t)return null;const n=Math.PI/180,a=(t.lat-e.lat)*n,s=(t.lon-e.lon)*n,i=Math.sin(a/2)**2+Math.cos(e.lat*n)*Math.cos(t.lat*n)*Math.sin(s/2)**2;return 6371*2*Math.atan2(Math.sqrt(i),Math.sqrt(1-i))}function vt(e,t){var n,a,s;if(!e){me=null;return}me={zoneName:e.name,state:e.state,coordinates:e.coordinates,confidence:e.confidence,targetSpecies:e.likely_species,sstCelsius:e.sst_celsius,chlorophyllMgM3:e.chlorophyll_mg_m3,windKnots:e.wind_speed_knots,waveHeightM:((a=(n=e.ocean)==null?void 0:n.wave)==null?void 0:a.significant_height_m)??null,riskStatus:(s=e.risk)==null?void 0:s.label,userLocation:t||null,distanceKm:mt(t,e.coordinates),source:"ORCA existing mock PFZ/ocean advisory"}}async function le(e){if(!e.trim())return;const t=te();Ce("user",e),U.push({role:"user",content:e}),U.length>Se&&U.splice(0,U.length-Se),Le(!0),at();try{const n=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e,language:t,mapContext:me,history:U.slice(0,-1)})});if(ue(),!n.ok){const s=await n.json().catch(()=>({}));n.status===401?ne(s.error||"API keys not configured. Check your .env file."):ne(s.error||"Something went wrong. Please try again.");return}const a=await n.json();Ce("assistant",a.reply,{weatherData:a.weatherData,forecastData:a.forecastData,airQualityData:a.airQualityData,pfzData:a.pfzData,orchestratorData:a.orchestratorData,coordinates:a.coordinates}),U.push({role:"assistant",content:a.reply}),Oe(a.originalReply||a.reply)}catch(n){ue(),n.name==="TypeError"&&n.message.includes("Failed to fetch")?ne("Cannot connect to the server. Make sure the backend is running (npm run dev)."):ne("An unexpected error occurred. Please try again."),console.error("Chat error:",n)}finally{Le(!1)}}async function ke(){var t,n;const e=document.getElementById("app");if(e){Ne(),ze();try{const s=await(await fetch("/api/health")).json();(!((t=s.keys)!=null&&t.groq)||!((n=s.keys)!=null&&n.owm))&&console.warn("Some API keys are missing; map demo remains available.")}catch(a){console.warn("Health check failed — server may not be running:",a.message)}Ke(e,{onSend:a=>le(a),onSuggestion:a=>le(a),onMapZoneChange:(a,s)=>vt(a,s)}),Me()&&qe(a=>{xe(a),le(a)},a=>{nt(a)}),console.log("🌊 ORCA initialized")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ke):ke();
