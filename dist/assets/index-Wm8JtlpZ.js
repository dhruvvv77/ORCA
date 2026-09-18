(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&t(r)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function t(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}})();let V="en";const oe={en:"English",hi:"हिन्दी",bn:"বাংলা",ta:"தமிழ்",te:"తెలుగు",mr:"मराठी",gu:"ગુજરાતી",kn:"ಕನ್ನಡ",ml:"മലയാളം",pa:"ਪੰਜਾਬੀ",ur:"اردو"};function U(){return V}function $e(e){oe[e]&&(V=e,localStorage.setItem("weathergpt-lang",e))}function Se(){const e=localStorage.getItem("weathergpt-lang");return e&&oe[e]&&(V=e),V}function ye(){const e={en:"Ask about fishing zones, ocean conditions, weather...",hi:"कहीं भी मौसम के बारे में पूछें...",bn:"যেকোনো জায়গার আবহাওয়া সম্পর্কে জিজ্ঞাসা করুন...",ta:"எங்கும் வானிலை பற்றி கேளுங்கள்...",te:"ఎక్కడైనా వాతావరణం గురించి అడగండి...",mr:"कुठेही हवामानाबद्दल विचारा...",gu:"ગમે ત્યાં હવામાન વિશે પૂછો...",kn:"ಎಲ್ಲಿಯಾದರೂ ಹವಾಮಾನದ ಬಗ್ಗೆ ಕೇಳಿ...",ml:"എവിടെയും കാലാവസ്ഥയെക്കുറിച്ച് ചോദിക്കൂ...",pa:"ਕਿਤੇ ਵੀ ਮੌਸਮ ਬਾਰੇ ਪੁੱਛੋ...",ur:"...کہیں بھی موسم کے بارے میں پوچھیں"};return e[V]||e.en}let P=null,G=!1,O=!1,J=null,A=null;const j={en:"en-IN",hi:"hi-IN",bn:"bn-IN",ta:"ta-IN",te:"te-IN",mr:"mr-IN",gu:"gu-IN",kn:"kn-IN",ml:"ml-IN",pa:"pa-IN",ur:"ur-IN"};function be(){return!!(window.SpeechRecognition||window.webkitSpeechRecognition)}function we(){return!!window.speechSynthesis}function Me(e,a){J=e,A=a;const n=window.SpeechRecognition||window.webkitSpeechRecognition;return n?(P=new n,P.continuous=!1,P.interimResults=!1,P.maxAlternatives=1,P.onresult=t=>{const s=t.results[0][0].transcript;J&&J(s)},P.onend=()=>{G=!1,A&&A("stopped")},P.onerror=t=>{console.warn("Speech recognition error:",t.error),G=!1,t.error==="not-allowed"?A&&A("denied"):A&&A("error")},!0):(console.warn("SpeechRecognition not supported"),!1)}function Te(){if(!P)return;if(G){Ee();return}const e=U();P.lang=j[e]||"en-IN";try{P.start(),G=!0,A&&A("listening")}catch(a){console.warn("Failed to start recognition:",a),A&&A("error")}}function Ee(){P&&G&&(P.stop(),G=!1,A&&A("stopped"))}function Ae(e){var c;if(!window.speechSynthesis||!O)return;window.speechSynthesis.cancel();const a=e.replace(/[\u{1F300}-\u{1FAFF}]/gu,"").replace(/[*_~`#]/g,"").trim();if(!a)return;const n=new SpeechSynthesisUtterance(a),t=U();n.lang=j[t]||"en-IN",n.rate=1,n.pitch=1,n.volume=.9;const s=window.speechSynthesis.getVoices(),i=((c=j[t])==null?void 0:c.split("-")[0])||"en",r=s.find(o=>o.lang.startsWith(i));r&&(n.voice=r),window.speechSynthesis.speak(n)}function _e(e,a){var o;if(!window.speechSynthesis){a&&a();return}window.speechSynthesis.cancel();const n=e.replace(/[\u{1F300}-\u{1FAFF}]/gu,"").replace(/[*_~`#]/g,"").trim();if(!n){a&&a();return}const t=new SpeechSynthesisUtterance(n),s=U();t.lang=j[s]||"en-IN",t.rate=1,t.pitch=1,t.volume=.9;const i=window.speechSynthesis.getVoices(),r=((o=j[s])==null?void 0:o.split("-")[0])||"en",c=i.find(p=>p.lang.startsWith(r));c&&(t.voice=c),a&&(t.onend=()=>a(),t.onerror=()=>a()),window.speechSynthesis.speak(t)}function xe(){var e;return O=!O,localStorage.setItem("weathergpt-autospeak",O),O||(e=window.speechSynthesis)==null||e.cancel(),O}function Ne(){return O}function Pe(){return O=localStorage.getItem("weathergpt-autospeak")==="true",O}const qe={"01d":"☀️","01n":"🌙","02d":"⛅","02n":"☁️","03d":"☁️","03n":"☁️","04d":"☁️","04n":"☁️","09d":"🌧️","09n":"🌧️","10d":"🌦️","10n":"🌧️","11d":"⛈️","11n":"⛈️","13d":"❄️","13n":"❄️","50d":"🌫️","50n":"🌫️"};function Ie(e){return qe[e]||"🌡️"}function Fe(e,a){if(!(a!=null&&a.forecast)||!window.Chart)return null;const n=a.forecast,t=document.createElement("canvas");t.classList.add("forecast-chart-canvas"),e.appendChild(t);const s=n.map(h=>h.day_name),i=n.map(h=>h.temperature.high),r=n.map(h=>h.temperature.low),c=t.getContext("2d"),o=c.createLinearGradient(0,0,0,200);o.addColorStop(0,"rgba(245, 158, 11, 0.3)"),o.addColorStop(1,"rgba(245, 158, 11, 0.02)");const p=c.createLinearGradient(0,0,0,200);return p.addColorStop(0,"rgba(96, 165, 250, 0.2)"),p.addColorStop(1,"rgba(96, 165, 250, 0.02)"),new Chart(c,{type:"line",data:{labels:s,datasets:[{label:"High",data:i,borderColor:"#f59e0b",backgroundColor:o,borderWidth:2.5,fill:!0,tension:.4,pointBackgroundColor:"#f59e0b",pointBorderColor:"#1a2035",pointBorderWidth:2,pointRadius:5,pointHoverRadius:7},{label:"Low",data:r,borderColor:"#60a5fa",backgroundColor:p,borderWidth:2.5,fill:!0,tension:.4,pointBackgroundColor:"#60a5fa",pointBorderColor:"#1a2035",pointBorderWidth:2,pointRadius:5,pointHoverRadius:7}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{intersect:!1,mode:"index"},plugins:{legend:{display:!0,position:"top",align:"end",labels:{color:"#94a3b8",font:{family:"'Inter', sans-serif",size:11},boxWidth:12,boxHeight:2,useBorderRadius:!0,borderRadius:1,padding:12}},tooltip:{backgroundColor:"rgba(17, 24, 39, 0.95)",titleColor:"#f1f5f9",bodyColor:"#94a3b8",borderColor:"rgba(255, 255, 255, 0.06)",borderWidth:1,cornerRadius:8,padding:10,titleFont:{family:"'Inter', sans-serif",weight:"600"},bodyFont:{family:"'Inter', sans-serif"},callbacks:{label:h=>`${h.dataset.label}: ${h.parsed.y}°C`}}},scales:{x:{grid:{display:!1},border:{display:!1},ticks:{color:"#64748b",font:{family:"'Inter', sans-serif",size:11,weight:"500"}}},y:{grid:{color:"rgba(255, 255, 255, 0.04)",drawTicks:!1},border:{display:!1},ticks:{color:"#64748b",font:{family:"'Inter', sans-serif",size:11},padding:8,callback:h=>`${h}°`}}}}})}let B=null,E=null,K=null;const He=[15.5,76.2],F=(e="")=>String(e).replace(/[&<>'"]/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[a]);function te(e,a){const n=Math.PI/180,t=(a.lat-e.lat)*n,s=(a.lon-e.lon)*n,i=Math.sin(t/2)**2+Math.cos(e.lat*n)*Math.cos(a.lat*n)*Math.sin(s/2)**2;return 6371*2*Math.atan2(Math.sqrt(i),Math.sqrt(1-i))}function Q(e){var t,s;const a=e.risk.level==="favourable"?20:e.risk.level==="caution"?5:-30,n=((s=(t=e.ocean)==null?void 0:t.wave)==null?void 0:s.significant_height_m)||0;return e.confidence*100+a-e.wind_speed_knots*.35-n*2}function ce(e){return`<div class="marine-popup">
    <strong>🎣 ${F(e.name)}</strong>
    <span class="marine-popup-status" style="color:${e.risk.color}">● ${F(e.risk.label)}</span>
    <small>${Math.round(e.confidence*100)}% confidence · ${F(e.likely_species.join(", "))}</small>
  </div>`}function de(e){var s,i,r;if(!e)return'<div class="zone-empty"><span>🎣</span><strong>Select a PFZ zone</strong><p>Tap a coloured marine zone to see fish, safety and ocean telemetry.</p></div>';const a=E?`${te(E,e.coordinates).toFixed(1)} km from you`:"Enable GPS to calculate distance",n=(s=e.ocean)==null?void 0:s.wave,t=e.risk.level;return`
    <div class="zone-panel-kicker">SELECTED PFZ · ${F(e.state)}</div>
    <div class="zone-panel-heading">
      <div><h2>${F(e.name)}</h2><p>🎣 ${F(e.likely_species.join(" · "))}</p></div>
      <span class="zone-risk ${t}">● ${F(e.risk.label)}</span>
    </div>
    <p class="zone-advisory">${F(e.advisory)}</p>
    <div class="zone-metrics">
      <div><span>Confidence</span><strong>${Math.round(e.confidence*100)}%</strong></div>
      <div><span>🌡️ SST</span><strong>${e.sst_celsius}°C</strong></div>
      <div><span>🌿 Chlorophyll</span><strong>${e.chlorophyll_mg_m3} mg/m³</strong></div>
      <div><span>💨 Wind</span><strong>${e.wind_speed_knots} kt</strong></div>
      <div><span>🌊 Wave</span><strong>${n?`${n.significant_height_m} m`:"—"}</strong></div>
      <div><span>📍 Distance</span><strong>${a}</strong></div>
    </div>
    <div class="zone-current">Current ${F((i=e.ocean)!=null&&i.current?`${e.ocean.current.speed_knots} kt ${e.ocean.current.direction}`:"not available")} · Depth ${e.depth_range_m.min}–${e.depth_range_m.max} m</div>
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
    <div class="zone-source">Demo advisory · existing ORCA mock data</div>`}async function Oe(e,{onAskOrca:a,onZoneChange:n}={}){K=n,e.innerHTML='<div class="marine-map-loading"><span>◌</span> Loading PFZ advisory layers…</div>';try{const t=await fetch("/api/marine-map");if(!t.ok)throw new Error("Map data request failed");const s=await t.json();ze(e,s,a)}catch(t){e.innerHTML='<div class="marine-map-loading map-load-error">⚠️ Marine advisory layers are unavailable. The chat remains available.</div>',console.error("Marine map:",t)}}function ze(e,a,n){var k;e.innerHTML=`
    <section class="marine-map-card" aria-label="ORCA marine operations map">
      <div class="marine-map-topbar">
        <div><div class="eyebrow">LIVE DEMO COMMAND MAP</div><h1>Marine intelligence, mapped.</h1></div>
        <div class="map-top-actions"><button type="button" class="map-locate">📍 My location</button><button type="button" class="best-zone">🎯 Find Best Zone</button></div>
      </div>
      <div class="marine-map-canvas" id="orca-marine-map"></div>
      <div class="marine-map-legend" aria-label="Map legend"><strong>ADVISORY STATUS</strong><span><i class="legend-dot good"></i> Favourable PFZ</span><span><i class="legend-dot caution"></i> Caution</span><span><i class="legend-dot danger"></i> High risk</span><span>🎣 PFZ target</span><span>🚤 Your position</span></div>
      <div class="marine-map-note">${F(a.source)} · updated ${new Date(a.last_updated).toLocaleDateString()}</div>
    </section>
    <aside class="zone-detail-panel" aria-live="polite">${de(null)}</aside>`;const t=e.querySelector("#orca-marine-map"),s=e.querySelector(".zone-detail-panel"),i=(k=window.L)==null?void 0:k.map(t,{zoomControl:!1,attributionControl:!0}).setView(He,5);if(!i){t.innerHTML='<div class="map-load-error">Map engine unavailable.</div>';return}L.control.zoom({position:"bottomright"}).addTo(i),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:"© OpenStreetMap"}).addTo(i);const r={favourable:L.layerGroup().addTo(i),caution:L.layerGroup().addTo(i),"high-risk":L.layerGroup().addTo(i),targets:L.layerGroup().addTo(i),location:L.layerGroup().addTo(i)},c=new Map;let o=null;const p=(l,m)=>{var f;B=l,s.innerHTML=de(l),K==null||K(l,E),m&&(i.flyToBounds(m.getBounds?m.getBounds().pad(.7):L.latLngBounds([[l.coordinates.lat,l.coordinates.lon]]),{maxZoom:8,duration:.7}),(f=m.openPopup)==null||f.call(m)),y()},y=()=>{var l,m;(l=s.querySelector(".zone-ask"))==null||l.addEventListener("click",()=>n==null?void 0:n(B,E)),(m=s.querySelector(".zone-details"))==null||m.addEventListener("click",()=>{s.classList.toggle("zone-detail-expanded");const f=s.querySelector(".zone-details");f&&(f.textContent=s.classList.contains("zone-detail-expanded")?"⌃ Less":"⌄ Details")})};a.zones.forEach(l=>{const m=[[l.bounds.south,l.bounds.west],[l.bounds.north,l.bounds.east]],f=L.rectangle(m,{color:l.risk.color,weight:2,fillColor:l.risk.color,fillOpacity:.18}).bindPopup(ce(l),{closeButton:!1});f.on("click",()=>p(l,f)),f.addTo(r[l.risk.level]);const S=L.marker([l.coordinates.lat,l.coordinates.lon],{icon:L.divIcon({className:"pfz-target-icon",html:`<span style="--zone-color:${l.risk.color}">🎣</span>`,iconSize:[34,34],iconAnchor:[17,17]}),title:`${l.name} PFZ`}).bindPopup(ce(l),{closeButton:!1});S.on("click",()=>p(l,f)),S.addTo(r.targets),c.set(l.id,f)}),L.control.layers(null,{"🟢 Favourable PFZ":r.favourable,"🟡 Caution zones":r.caution,"🔴 High-risk zones":r["high-risk"],"🎣 PFZ targets":r.targets,"🚤 My location":r.location},{position:"topright",collapsed:!1}).addTo(i);const h=l=>{E={lat:l.coords.latitude,lon:l.coords.longitude},r.location.clearLayers(),L.marker([E.lat,E.lon],{icon:L.divIcon({className:"user-vessel-icon",html:"<span>🚤</span>",iconSize:[38,38],iconAnchor:[19,19]})}).bindPopup("Your GPS location").addTo(r.location),B&&(o&&r.location.removeLayer(o),o=L.polyline([[E.lat,E.lon],[B.coordinates.lat,B.coordinates.lon]],{color:"#38bdf8",dashArray:"7 8",weight:2}).addTo(r.location),p(B)),i.flyTo([E.lat,E.lon],8,{duration:.8});const f=e.querySelector(".map-locate");f&&(f.textContent="📍 GPS active")},b=()=>{const l=e.querySelector(".map-locate");if(!navigator.geolocation){l&&(l.textContent="GPS unavailable");return}l&&(l.textContent="Locating…"),navigator.geolocation.getCurrentPosition(h,()=>{l&&(l.textContent="GPS permission needed")},{enableHighAccuracy:!0,timeout:1e4,maximumAge:6e4})};e.querySelector(".map-locate").addEventListener("click",b),e.querySelector(".best-zone").addEventListener("click",()=>{const m=[...a.zones].sort((S,$)=>{const N=E?te(E,S.coordinates)-te(E,$.coordinates):0;return Q($)-Q(S)||N})[0];p(m,c.get(m.id));const f=e.querySelector(".best-zone");f.textContent=`✓ Best: ${m.state}`,setTimeout(()=>{f.textContent="🎯 Find Best Zone"},2400)});const u=[...a.zones].sort((l,m)=>Q(m)-Q(l))[0];p(u,c.get(u.id)),setTimeout(()=>i.invalidateSize(),100)}let x=null,v=null,I=null,M=null,H=null,ae=null,z=null,R=null,D=null,g=null,_=null;const X=["🛰️ Querying Marine Satellite Telemetry...","🌊 Analyzing Ocean SST & Chlorophyll-a Upwelling...","🧭 Synthesizing Advisory & PFZ Coordinates...","⚡ Finalizing Marine Recommendations..."];function Re(e,{onSend:a,onSuggestion:n,onMapZoneChange:t}){var i,r;ae=a,z=n,e.innerHTML="",e.appendChild(Ze());const s=document.createElement("main");s.className="marine-home",s.id="marine-home",e.appendChild(s),g=document.createElement("aside"),g.className="chat-drawer",g.id="chat-drawer",g.setAttribute("aria-label","Ask ORCA assistant"),g.innerHTML=`
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
    </div>`,x=De(),g.appendChild(x),g.appendChild(Ve()),e.appendChild(g),_=document.createElement("button"),_.className="ask-orca-fab",_.type="button",_.innerHTML="<span>💬</span> Ask ORCA",_.setAttribute("aria-expanded","false"),_.addEventListener("click",pe),e.appendChild(_),(i=g.querySelector(".chat-drawer-fullscreen"))==null||i.addEventListener("click",ne),(r=g.querySelector(".chat-drawer-close"))==null||r.addEventListener("click",ue),window.addEventListener("keydown",c=>{c.key==="Escape"&&(g!=null&&g.classList.contains("is-open"))&&(g.classList.contains("is-fullscreen")?ne():ue())}),Ge(),Oe(s,{onAskOrca:c=>{pe(),Le(`Is ${c.name} suitable for ${c.likely_species[0]} today?`)},onZoneChange:t})}function pe(){g&&(g.classList.add("is-open"),_==null||_.setAttribute("aria-expanded","true"),setTimeout(()=>v==null?void 0:v.focus(),180))}function ne(){if(!g)return;const e=g.classList.toggle("is-fullscreen"),a=g.querySelector(".expand-icon"),n=g.querySelector(".compress-icon"),t=g.querySelector(".chat-drawer-fullscreen");e?(t==null||t.setAttribute("aria-label","Exit full screen"),t&&(t.title="Exit full screen"),a&&(a.style.display="none"),n&&(n.style.display="block")):(t==null||t.setAttribute("aria-label","Enlarge chat to full screen"),t&&(t.title="Enlarge chat to full screen"),a&&(a.style.display="block"),n&&(n.style.display="none"))}function ue(){g!=null&&g.classList.contains("is-fullscreen")&&ne(),g==null||g.classList.remove("is-open"),_==null||_.setAttribute("aria-expanded","false")}function Ze(){const e=document.createElement("header");return e.className="header",e.id="app-header",e.innerHTML=`
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
      ${Be()}
      ${we()?We():""}
    </div>
  `,setTimeout(()=>{const a=e.querySelector("#lang-picker");a&&(a.value=U(),a.addEventListener("change",t=>{$e(t.target.value),v&&(v.placeholder=ye())}));const n=e.querySelector("#voice-toggle");n&&n.addEventListener("click",()=>{const t=xe();n.classList.toggle("active",t),n.title=t?"Auto-speak: ON":"Auto-speak: OFF"})},0),e}function Ce(e,a=!1){const n=document.getElementById("header-agent-status");if(!n)return;const t=n.querySelector(".status-pulse-dot"),s=n.querySelector(".status-text");t&&(t.className=a?"status-pulse-dot scanning":"status-pulse-dot"),s&&(s.textContent=e)}function Be(){return`<select id="lang-picker" class="lang-picker" aria-label="Language">${Object.entries(oe).map(([a,n])=>`<option value="${a}">${n}</option>`).join("")}</select>`}function We(){const e=Ne();return`<button id="voice-toggle" class="voice-toggle-btn ${e?"active":""}" 
    title="${e?"Auto-speak: ON":"Auto-speak: OFF"}" aria-label="Toggle voice output">
    🔊
  </button>`}function De(){const e=document.createElement("div");return e.className="chat-area",e.id="chat-area",e}function Ge(){if(!x)return;H=document.createElement("div"),H.className="welcome",H.id="welcome-screen";const e=[{icon:"🎣",category:"Potential Fishing Zones",prompt:"Show PFZ zones in Maharashtra",desc:"Satellite SST & Chlorophyll-a pelagic hotspots"},{icon:"🌊",category:"Ocean & Sea State",prompt:"What are ocean conditions near Chennai?",desc:"Wave swell, sea temperature & tidal currents"},{icon:"🧭",category:"Navigational Safety",prompt:"Is it safe to go fishing today?",desc:"Coastal hazard alerts, high wave & squall checks"},{icon:"🐟",category:"Target Species Advice",prompt:"Where can I fish today near Mumbai?",desc:"Tuna, Mackerel & Pomfret location forecast"}];H.innerHTML=`
    <div class="welcome-icon">🌊</div>
    <h2>ORCA Marine Intelligence</h2>
    <p>AI-powered operational console for coastal navigation, Potential Fishing Zones (PFZ), satellite oceanography, and maritime safety.</p>
    <div class="welcome-suggestions-grid">
      ${e.map(a=>`
        <button class="suggestion-chip-card" data-prompt="${a.prompt}">
          <div class="chip-card-top">
            <span class="chip-card-icon">${a.icon}</span>
            <span class="chip-card-badge">${a.category}</span>
          </div>
          <div class="chip-card-prompt">${a.prompt}</div>
          <div class="chip-card-desc">${a.desc}</div>
        </button>
      `).join("")}
    </div>
  `,setTimeout(()=>{H.querySelectorAll(".suggestion-chip-card").forEach(a=>{a.addEventListener("click",()=>{const n=a.getAttribute("data-prompt")||a.textContent;z&&z(n)})})},0),x.appendChild(H)}function ke(){H&&(H.remove(),H=null)}function Ve(){const e=document.createElement("div");e.className="input-bar",e.id="input-bar";const a=document.createElement("div");a.className="input-wrapper",v=document.createElement("textarea"),v.className="input-field",v.id="message-input",v.placeholder=ye(),v.rows=1,v.setAttribute("aria-label","Message input"),v.addEventListener("input",()=>{v.style.height="auto";const t=Math.min(v.scrollHeight,120);v.style.height=t+"px",v.style.overflowY=v.scrollHeight>120?"auto":"hidden"}),v.addEventListener("keydown",t=>{t.key==="Enter"&&!t.shiftKey&&(t.preventDefault(),me())}),a.appendChild(v),be()&&(M=document.createElement("button"),M.className="input-btn mic-btn",M.id="mic-btn",M.innerHTML="🎤",M.title="Voice input",M.setAttribute("aria-label","Voice input"),M.addEventListener("click",()=>{Te()})),I=document.createElement("button"),I.className="input-btn send-btn",I.id="send-btn",I.innerHTML="➤",I.title="Send message",I.setAttribute("aria-label","Send message"),I.addEventListener("click",me);const n=document.createElement("div");return n.className="chat-drawer-input-container",n.appendChild(a),M&&n.appendChild(M),n.appendChild(I),e.appendChild(n),e}function me(){var a;const e=(a=v==null?void 0:v.value)==null?void 0:a.trim();!e||!ae||(v.value="",v.style.height="auto",v.style.overflowY="hidden",ae(e))}function ve(e,a,n={}){var l,m,f,S,$,N,q,T;if(ke(),!x)return;const t=document.createElement("div");t.className=`message ${e}`;const s=document.createElement("div");s.className="message-avatar",s.textContent=e==="user"?"👤":"🌊";const i=document.createElement("div");i.className="message-content";const r=document.createElement("div");if(r.className="message-bubble",r.innerHTML=Qe(a),e==="assistant"&&a){const w=document.createElement("div");if(w.className="msg-actions-bar",we()){const C=document.createElement("button");C.className="msg-action-btn msg-speak-btn",C.innerHTML="🔊",C.title="Listen to this response",C.setAttribute("aria-label","Listen to this response"),C.addEventListener("click",Z=>{Z.stopPropagation(),C.classList.add("speaking"),_e(a,()=>{C.classList.remove("speaking")})}),w.appendChild(C)}const d=document.createElement("button");d.className="msg-action-btn msg-copy-btn",d.innerHTML="📋",d.title="Copy response text",d.setAttribute("aria-label","Copy response text"),d.addEventListener("click",C=>{C.stopPropagation(),navigator.clipboard.writeText(a).then(()=>{d.innerHTML="✓",d.classList.add("btn-copied"),setTimeout(()=>{d.innerHTML="📋",d.classList.remove("btn-copied")},1500)})}),w.appendChild(d),r.appendChild(w)}const c=document.createElement("div");c.className="message-time",c.textContent=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),i.appendChild(r),n.weatherData&&i.appendChild(Ye(n.weatherData)),n.airQualityData&&i.appendChild(Ke(n.airQualityData));const o=n.orchestratorData,p=o==null?void 0:o.pfz_result,y=(l=o==null?void 0:o.recommendation_result)==null?void 0:l.selected_pfz,h=n.pfzData||p;let b=null;if(n.coordinates||((m=o==null?void 0:o.map_data)==null?void 0:m.user_location)||h&&h.zones&&h.zones.length>0){const w=((f=o==null?void 0:o.map_data)==null?void 0:f.user_location)||n.coordinates||(y==null?void 0:y.coordinates)||(($=(S=h==null?void 0:h.zones)==null?void 0:S[0])==null?void 0:$.coordinates);w&&(b=at(w,((N=n.weatherData)==null?void 0:N.city)||((q=n.forecastData)==null?void 0:q.city)||((T=o==null?void 0:o.weather_result)==null?void 0:T.city)||"",h))}const k=[];if(n.pfzData&&n.pfzData.zones&&n.pfzData.zones.forEach(w=>{const d=Je(w,n.pfzData.source,b,k);k.push(d),i.appendChild(d)}),o!=null&&o.recommendation_result&&i.appendChild(et(o)),n.forecastData&&i.appendChild(tt(n.forecastData)),b&&(i.appendChild(b.element),y!=null&&y.coordinates&&b.focusZone(y.coordinates.lat,y.coordinates.lon,y.name)),e==="assistant"){const w=nt(n);w&&i.appendChild(w)}i.appendChild(c),t.appendChild(s),t.appendChild(i),x.appendChild(t),le()}function je(){if(ke(),R||!x)return;Ce("Scanning Ocean Telemetry...",!0),R=document.createElement("div"),R.className="typing-indicator agent-activity-card";let e=0;R.innerHTML=`
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
        ${X[0]}
      </div>
    </div>
  `,x.appendChild(R),le(),D&&clearInterval(D),D=setInterval(()=>{e=(e+1)%X.length;const a=document.getElementById("activity-status-text");a&&(a.classList.remove("status-fade-in"),a.offsetWidth,a.textContent=X[e],a.classList.add("status-fade-in"))},1300)}function se(){D&&(clearInterval(D),D=null),Ce("Marine Core Active",!1),R&&(R.remove(),R=null)}function Y(e){if(se(),!x)return;const a=document.createElement("div");a.className="message assistant",a.innerHTML=`
    <div class="message-avatar" style="background: var(--accent-gradient);">🌊</div>
    <div class="message-content">
      <div class="error-message">⚠️ ${e}</div>
      <div class="message-time">${new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
    </div>
  `,x.appendChild(a),le()}function he(e){v&&(v.disabled=e),I&&(I.disabled=e),M&&(M.disabled=e)}function Le(e){v&&(v.value=e,v.style.height="auto",v.style.height=Math.min(v.scrollHeight,120)+"px",v.focus())}function Ue(e){if(M)switch(e){case"listening":M.classList.add("recording"),M.innerHTML="⏹️";break;case"stopped":case"error":case"denied":M.classList.remove("recording"),M.innerHTML="🎤";break}}function Qe(e){return e?e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\n/g,"<br>"):""}function Ye(e){var s,i,r,c,o;const a=document.createElement("div");a.className="weather-card";const n=((s=e.weather)==null?void 0:s.icon)||"03d",t=Ie(n);return a.innerHTML=`
    <div class="weather-card-header">
      <div>
        <div class="weather-card-city">${e.city||""}${e.country?", "+e.country:""}</div>
        <div class="weather-card-condition">${((i=e.weather)==null?void 0:i.description)||""}</div>
      </div>
    </div>
    <div class="weather-card-main">
      <div class="weather-card-temp">${((r=e.temperature)==null?void 0:r.current)??"--"}°C</div>
      <div class="weather-card-icon">${t}</div>
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
        <div class="weather-detail-value">${((o=e.wind)==null?void 0:o.speed)??"--"} m/s</div>
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
  `,a}function Ke(e){var t,s,i,r,c,o,p,y;const a=document.createElement("div");a.className="aqi-card";const n={1:"aqi-good",2:"aqi-fair",3:"aqi-moderate",4:"aqi-poor",5:"aqi-very-poor"}[(t=e.aqi)==null?void 0:t.index]||"aqi-moderate";return a.innerHTML=`
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
      ${((o=e.pollutants)==null?void 0:o.o3)!=null?`
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">O₃</div>
        <div class="aqi-pollutant-value">${e.pollutants.o3}</div>
      </div>`:""}
      ${((p=e.pollutants)==null?void 0:p.co)!=null?`
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">CO</div>
        <div class="aqi-pollutant-value">${e.pollutants.co}</div>
      </div>`:""}
      ${((y=e.pollutants)==null?void 0:y.so2)!=null?`
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">SO₂</div>
        <div class="aqi-pollutant-value">${e.pollutants.so2}</div>
      </div>`:""}
    </div>
  `,a}function Je(e,a,n,t){var q,T,w;const s=document.createElement("div");s.className="pfz-card";const i=e.confidence??.7,r=i>=.8?"pfz-conf-high":i>=.6?"pfz-conf-moderate":"pfz-conf-low",c=e.confidence_label||(i>=.8?"High":i>=.6?"Moderate":"Low"),o=Math.round(i*100),p=e.coordinates,y=p?`${p.lat.toFixed(2)}°N, ${p.lon.toFixed(2)}°E`:"",h=p?`${p.lat.toFixed(4)}, ${p.lon.toFixed(4)}`:"",b=(q=e.conditions)==null?void 0:q.sst_celsius,u=(T=e.conditions)==null?void 0:T.chlorophyll_mg_m3,k=(w=e.conditions)==null?void 0:w.wind_speed_knots,l=e.depth_range_m,m=e.likely_species||[];s.innerHTML=`
    <div class="pfz-card-header">
      <div class="pfz-header-left">
        <div class="pfz-card-title">🎣 ${e.name||"PFZ Zone"}</div>
        <div class="pfz-card-location">📍 ${e.state||"Indian Ocean Coast"}${y?" · "+y:""}</div>
      </div>
      <div class="pfz-conf-badge-wrapper">
        <span class="pfz-conf-badge ${r}">● ${c} (${o}%)</span>
      </div>
    </div>

    ${e.advisory?`
    <div class="pfz-advisory">
      <span class="advisory-icon">🧭</span>
      <div class="advisory-text">${e.advisory}</div>
    </div>`:""}

    <div class="pfz-telemetry-grid">
      ${b!=null?`
      <div class="pfz-telemetry-item sst-item">
        <div class="tel-header">
          <span class="tel-label">🌡️ SST</span>
          <span class="tel-value">${b}°C</span>
        </div>
        <div class="tel-bar"><div class="tel-bar-fill sst-fill" style="width: ${Math.min(100,Math.max(15,(b-20)/14*100))}%;"></div></div>
        <div class="tel-sub">Optimal Pelagic (26–29°C)</div>
      </div>`:""}

      ${u!=null?`
      <div class="pfz-telemetry-item chl-item">
        <div class="tel-header">
          <span class="tel-label">🌿 Chlorophyll</span>
          <span class="tel-value">${u} mg/m³</span>
        </div>
        <div class="tel-bar"><div class="tel-bar-fill chl-fill" style="width: ${Math.min(100,Math.max(15,u/.8*100))}%;"></div></div>
        <div class="tel-sub">Phytoplankton Bloom</div>
      </div>`:""}

      ${k!=null?`
      <div class="pfz-telemetry-item wind-item">
        <div class="tel-header">
          <span class="tel-label">💨 Sea Wind</span>
          <span class="tel-value">${k} kt</span>
        </div>
        <div class="tel-bar"><div class="tel-bar-fill wind-fill" style="width: ${Math.min(100,Math.max(15,k/28*100))}%;"></div></div>
        <div class="tel-sub">${k>18?"Caution · Gusty Swell":"Calm · Favorable Seas"}</div>
      </div>`:""}

      ${l?`
      <div class="pfz-telemetry-item depth-item">
        <div class="tel-header">
          <span class="tel-label">📏 Bathymetry</span>
          <span class="tel-value">${l.min}–${l.max} m</span>
        </div>
        <div class="tel-bar"><div class="tel-bar-fill depth-fill" style="width: ${Math.min(100,l.max/90*100)}%;"></div></div>
        <div class="tel-sub">Continental Shelf Zone</div>
      </div>`:""}
    </div>

    ${m.length>0?`
    <div class="pfz-species-section">
      <div class="pfz-section-title">🐟 Target Species (Click to query advice):</div>
      <div class="pfz-species-pills">
        ${m.map(d=>`<button class="pfz-species-pill" type="button" data-species="${d}">🐟 ${d}</button>`).join("")}
      </div>
    </div>`:""}

    <div class="pfz-card-actions">
      ${p&&n?`
      <button class="pfz-action-btn pfz-btn-map" type="button">
        🗺️ Focus Zone on Map
      </button>`:""}
      ${p?`
      <button class="pfz-action-btn pfz-btn-gps" type="button" data-gps="${h}">
        📋 Copy GPS
      </button>`:""}
      <button class="pfz-action-btn pfz-btn-weather" type="button">
        🌤️ Sea Weather
      </button>
    </div>

    <div class="pfz-source-tag">${a||"ORCA Mock Data"}</div>
  `;const f=()=>{n&&p&&(t&&t.forEach(d=>d.classList.remove("pfz-card--active")),s.classList.add("pfz-card--active"),n.focusZone(p.lat,p.lon,e.name))},S=s.querySelector(".pfz-btn-map");S&&S.addEventListener("click",d=>{d.stopPropagation(),f()}),s.addEventListener("click",d=>{d.target.closest("button")||f()}),s.querySelectorAll(".pfz-species-pill").forEach(d=>{d.addEventListener("click",C=>{C.stopPropagation();const Z=d.getAttribute("data-species");z&&z(`What is the recommended gear, depth, and technique for catching ${Z} in ${e.name||"this zone"}?`)})});const $=s.querySelector(".pfz-btn-gps");$&&h&&$.addEventListener("click",d=>{d.stopPropagation(),navigator.clipboard.writeText(h).then(()=>{const C=$.innerHTML;$.innerHTML="✓ Copied!",$.classList.add("btn-copied"),setTimeout(()=>{$.innerHTML=C,$.classList.remove("btn-copied")},1800)})});const N=s.querySelector(".pfz-btn-weather");return N&&N.addEventListener("click",d=>{d.stopPropagation(),z&&z(`What are the wind and ocean conditions at ${e.name||"this location"}?`)}),s}function Xe(e){return e?e.confidence!=null?`${Math.round(e.confidence*100)}% confidence`:e.mg_m3!=null?`${e.mg_m3} mg/m³`:e.celsius!=null?`${e.celsius}°C`:e.significant_height_m!=null?`${e.significant_height_m} m`:e.condition!=null?e.condition:"Not available":"Not available"}function et(e){var f,S,$,N,q;const a=e.recommendation_result,n=a.selected_pfz,t=((S=(f=e.gis_result)==null?void 0:f.candidates)==null?void 0:S.find(T=>T.id===(n==null?void 0:n.id)))||(($=e.gis_result)==null?void 0:$.nearest_pfz),s=a.factors||{},i=document.createElement("section");i.className="recommendation-card";const r=document.createElement("div");r.className="recommendation-card-header";const c=document.createElement("div"),o=document.createElement("span");o.className="recommendation-kicker",o.textContent="ORCA FISHING RECOMMENDATION";const p=document.createElement("strong");p.textContent=(n==null?void 0:n.name)||"No PFZ recommended",c.append(o,p);const y=document.createElement("span"),h=a.safety_status||((N=e.safety_result)==null?void 0:N.status)||"UNKNOWN";y.className=`recommendation-safety recommendation-safety--${h.toLowerCase()}`,y.textContent=h,r.append(c,y),i.appendChild(r);const b=document.createElement("div");b.className="recommendation-summary";const u=document.createElement("div");u.innerHTML=`<span>Suitability</span><strong>${a.score??"—"}<small>/100</small></strong>`;const k=document.createElement("div");k.innerHTML=`<span>Distance</span><strong>${(t==null?void 0:t.distance_km)!=null?`${t.distance_km} km`:"Not available"}</strong>`,b.append(u,k),i.appendChild(b);const l=[["PFZ",[s.pfz]],["Ocean",[s.chlorophyll,s.sst,s.waves]],["Weather",[s.weather]]],m=document.createElement("div");if(m.className="recommendation-factors",l.forEach(([T,w])=>{const d=document.createElement("div");d.className="recommendation-factor-group";const C=document.createElement("span");C.textContent=T,d.appendChild(C),w.filter(Boolean).forEach(Z=>{const re=document.createElement("div");re.textContent=`${Xe(Z)} · ${Z.score}/${Z.weight_percent} pts`,d.appendChild(re)}),m.appendChild(d)}),i.appendChild(m),(q=a.reasons)!=null&&q.length){const T=document.createElement("ul");T.className="recommendation-reasons",a.reasons.slice(0,4).forEach(w=>{const d=document.createElement("li");d.textContent=w,T.appendChild(d)}),i.appendChild(T)}return i}function tt(e){var s;const a=document.createElement("div");a.className="forecast-chart-container";const n=document.createElement("div");n.className="forecast-chart-title",n.textContent=`📊 ${((s=e.forecast)==null?void 0:s.length)||5}-Day Forecast — ${e.city||""}`,a.appendChild(n);const t=document.createElement("div");return t.style.height="180px",t.style.position="relative",a.appendChild(t),setTimeout(()=>{Fe(t,e)},100),a}function at(e,a,n){const t=document.createElement("div");t.className="map-wrapper";const s=n&&n.zones&&n.zones.length>0,i=document.createElement("button");i.className="map-toggle-btn",i.innerHTML=s?"🗺️ Show PFZ zones on map":"📍 Show on map",i.setAttribute("aria-label","Show location on map");let r=!1,c=null,o=null;const p=[];function y(){if(!r){if(c=document.createElement("div"),c.className="map-container",s&&c.classList.add("map-container--pfz"),t.appendChild(c),window.L){o=L.map(c,{zoomControl:!0,attributionControl:!1}).setView([e.lat,e.lon],10),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18}).addTo(o);const b=L.featureGroup();if(a){const u=L.marker([e.lat,e.lon]).bindPopup(`<b>${a}</b>`);u.addTo(o),b.addLayer(u)}s&&n.zones.forEach(u=>{var d,C;if(!u.coordinates)return;const{lat:k,lon:l}=u.coordinates,m=Math.round((u.confidence||0)*100),f=u.confidence_label||(u.confidence>=.8?"High":u.confidence>=.6?"Moderate":"Low"),S=u.confidence>=.8?"#4ade80":u.confidence>=.6?"#facc15":"#f87171",$=u.likely_species&&u.likely_species.length?u.likely_species.join(", "):"—",N=((d=u.conditions)==null?void 0:d.sst_celsius)!=null?u.conditions.sst_celsius+"°C":"—",q=((C=u.conditions)==null?void 0:C.chlorophyll_mg_m3)!=null?u.conditions.chlorophyll_mg_m3+" mg/m³":"—",T=`
            <div class="pfz-popup">
              <div class="pfz-popup-title">🎣 ${u.name||"PFZ Zone"}</div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">Confidence</span><span style="color:${S};font-weight:600">${f} (${m}%)</span></div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">Species</span><span>🐟 ${$}</span></div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">SST</span><span>🌡️ ${N}</span></div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">Chlorophyll</span><span>🌿 ${q}</span></div>
              <div class="pfz-popup-source">ORCA Mock Data</div>
            </div>`,w=L.circleMarker([k,l],{radius:11,fillColor:"#14b8a6",fillOpacity:.9,color:"#ffffff",weight:2}).bindPopup(T,{className:"pfz-leaflet-popup",maxWidth:260});w.addTo(o),b.addLayer(w),p.push({zoneName:u.name,lat:k,lon:l,marker:w})}),b.getLayers().length>1?setTimeout(()=>{o.fitBounds(b.getBounds().pad(.15))},250):!a&&s&&o.setView([e.lat,e.lon],9),setTimeout(()=>o.invalidateSize(),200)}i.innerHTML=s?"🗺️ Hide map":"📍 Hide map",r=!0}}function h(){r&&(c&&c.remove(),c=null,o=null,p.length=0,i.innerHTML=s?"🗺️ Show PFZ zones on map":"📍 Show on map",r=!1)}return i.addEventListener("click",()=>{r?h():y()}),t.appendChild(i),{element:t,openMap:y,focusZone:(b,u,k)=>{r||y(),setTimeout(()=>{if(o){o.flyTo([b,u],11,{duration:.8});const l=p.find(m=>k&&m.zoneName===k||Math.abs(m.lat-b)<.005&&Math.abs(m.lon-u)<.005);l&&l.marker.openPopup()}t.scrollIntoView({behavior:"smooth",block:"nearest"})},150)}}}function nt(e){let a=[];if(e.pfzData&&e.pfzData.zones&&e.pfzData.zones.length>0)a=["🧭 Is navigation safe in these zones today?","💨 Wind & wave swell forecast for these zones","🎣 Recommended fishing gear & depth"];else if(e.weatherData){const t=e.weatherData.city||"this area";a=[`🎣 Show PFZ zones near ${t}`,"🌊 Ocean swell and wave height",`📊 5-day marine forecast for ${t}`]}else return null;const n=document.createElement("div");return n.className="followup-suggestions",n.innerHTML=`
    <div class="followup-title">⚡ Quick Marine Follow-ups</div>
    <div class="followup-chips">
      ${a.map(t=>`<button class="followup-chip" type="button">${t}</button>`).join("")}
    </div>
  `,n.querySelectorAll(".followup-chip").forEach(t=>{t.addEventListener("click",()=>{z&&z(t.textContent)})}),n}function le(){x&&requestAnimationFrame(()=>{x.scrollTop=x.scrollHeight})}const W=[],fe=20;let ie=null;function st(e,a){if(!e||!a)return null;const n=Math.PI/180,t=(a.lat-e.lat)*n,s=(a.lon-e.lon)*n,i=Math.sin(t/2)**2+Math.cos(e.lat*n)*Math.cos(a.lat*n)*Math.sin(s/2)**2;return 6371*2*Math.atan2(Math.sqrt(i),Math.sqrt(1-i))}function it(e,a){var n,t,s;if(!e){ie=null;return}ie={zoneName:e.name,state:e.state,coordinates:e.coordinates,confidence:e.confidence,targetSpecies:e.likely_species,sstCelsius:e.sst_celsius,chlorophyllMgM3:e.chlorophyll_mg_m3,windKnots:e.wind_speed_knots,waveHeightM:((t=(n=e.ocean)==null?void 0:n.wave)==null?void 0:t.significant_height_m)??null,riskStatus:(s=e.risk)==null?void 0:s.label,userLocation:a||null,distanceKm:st(a,e.coordinates),source:"ORCA existing mock PFZ/ocean advisory"}}async function ee(e){if(!e.trim())return;const a=U();ve("user",e),W.push({role:"user",content:e}),W.length>fe&&W.splice(0,W.length-fe),he(!0),je();try{const n=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e,language:a,mapContext:ie,history:W.slice(0,-1)})});if(se(),!n.ok){const s=await n.json().catch(()=>({}));n.status===401?Y(s.error||"API keys not configured. Check your .env file."):Y(s.error||"Something went wrong. Please try again.");return}const t=await n.json();ve("assistant",t.reply,{weatherData:t.weatherData,forecastData:t.forecastData,airQualityData:t.airQualityData,pfzData:t.pfzData,orchestratorData:t.orchestratorData,coordinates:t.coordinates}),W.push({role:"assistant",content:t.reply}),Ae(t.originalReply||t.reply)}catch(n){se(),n.name==="TypeError"&&n.message.includes("Failed to fetch")?Y("Cannot connect to the server. Make sure the backend is running (npm run dev)."):Y("An unexpected error occurred. Please try again."),console.error("Chat error:",n)}finally{he(!1)}}async function ge(){var a,n;const e=document.getElementById("app");if(e){Se(),Pe();try{const s=await(await fetch("/api/health")).json();(!((a=s.keys)!=null&&a.groq)||!((n=s.keys)!=null&&n.owm))&&console.warn("Some API keys are missing; map demo remains available.")}catch(t){console.warn("Health check failed — server may not be running:",t.message)}Re(e,{onSend:t=>ee(t),onSuggestion:t=>ee(t),onMapZoneChange:(t,s)=>it(t,s)}),be()&&Me(t=>{Le(t),ee(t)},t=>{Ue(t)}),console.log("🌊 ORCA initialized")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ge):ge();
