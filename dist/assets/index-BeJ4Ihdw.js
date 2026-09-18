(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function a(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=a(s);fetch(s.href,i)}})();let V="en";const ie={en:"English",hi:"हिन्दी",bn:"বাংলা",ta:"தமிழ்",te:"తెలుగు",mr:"मराठी",gu:"ગુજરાતી",kn:"ಕನ್ನಡ",ml:"മലയാളം",pa:"ਪੰਜਾਬੀ",ur:"اردو"};function U(){return V}function Le(e){ie[e]&&(V=e,localStorage.setItem("weathergpt-lang",e))}function $e(){const e=localStorage.getItem("weathergpt-lang");return e&&ie[e]&&(V=e),V}function fe(){const e={en:"Ask about fishing zones, ocean conditions, weather...",hi:"कहीं भी मौसम के बारे में पूछें...",bn:"যেকোনো জায়গার আবহাওয়া সম্পর্কে জিজ্ঞাসা করুন...",ta:"எங்கும் வானிலை பற்றி கேளுங்கள்...",te:"ఎక్కడైనా వాతావరణం గురించి అడగండి...",mr:"कुठेही हवामानाबद्दल विचारा...",gu:"ગમે ત્યાં હવામાન વિશે પૂછો...",kn:"ಎಲ್ಲಿಯಾದರೂ ಹವಾಮಾನದ ಬಗ್ಗೆ ಕೇಳಿ...",ml:"എവിടെയും കാലാവസ്ഥയെക്കുറിച്ച് ചോദിക്കൂ...",pa:"ਕਿਤੇ ਵੀ ਮੌਸਮ ਬਾਰੇ ਪੁੱਛੋ...",ur:"...کہیں بھی موسم کے بارے میں پوچھیں"};return e[V]||e.en}let P=null,G=!1,O=!1,J=null,_=null;const j={en:"en-IN",hi:"hi-IN",bn:"bn-IN",ta:"ta-IN",te:"te-IN",mr:"mr-IN",gu:"gu-IN",kn:"kn-IN",ml:"ml-IN",pa:"pa-IN",ur:"ur-IN"};function ge(){return!!(window.SpeechRecognition||window.webkitSpeechRecognition)}function be(){return!!window.speechSynthesis}function ke(e,t){J=e,_=t;const a=window.SpeechRecognition||window.webkitSpeechRecognition;return a?(P=new a,P.continuous=!1,P.interimResults=!1,P.maxAlternatives=1,P.onresult=n=>{const s=n.results[0][0].transcript;J&&J(s)},P.onend=()=>{G=!1,_&&_("stopped")},P.onerror=n=>{console.warn("Speech recognition error:",n.error),G=!1,n.error==="not-allowed"?_&&_("denied"):_&&_("error")},!0):(console.warn("SpeechRecognition not supported"),!1)}function Se(){if(!P)return;if(G){Me();return}const e=U();P.lang=j[e]||"en-IN";try{P.start(),G=!0,_&&_("listening")}catch(t){console.warn("Failed to start recognition:",t),_&&_("error")}}function Me(){P&&G&&(P.stop(),G=!1,_&&_("stopped"))}function Te(e){var d;if(!window.speechSynthesis||!O)return;window.speechSynthesis.cancel();const t=e.replace(/[\u{1F300}-\u{1FAFF}]/gu,"").replace(/[*_~`#]/g,"").trim();if(!t)return;const a=new SpeechSynthesisUtterance(t),n=U();a.lang=j[n]||"en-IN",a.rate=1,a.pitch=1,a.volume=.9;const s=window.speechSynthesis.getVoices(),i=((d=j[n])==null?void 0:d.split("-")[0])||"en",r=s.find(o=>o.lang.startsWith(i));r&&(a.voice=r),window.speechSynthesis.speak(a)}function Ee(e,t){var o;if(!window.speechSynthesis){t&&t();return}window.speechSynthesis.cancel();const a=e.replace(/[\u{1F300}-\u{1FAFF}]/gu,"").replace(/[*_~`#]/g,"").trim();if(!a){t&&t();return}const n=new SpeechSynthesisUtterance(a),s=U();n.lang=j[s]||"en-IN",n.rate=1,n.pitch=1,n.volume=.9;const i=window.speechSynthesis.getVoices(),r=((o=j[s])==null?void 0:o.split("-")[0])||"en",d=i.find(p=>p.lang.startsWith(r));d&&(n.voice=d),t&&(n.onend=()=>t(),n.onerror=()=>t()),window.speechSynthesis.speak(n)}function _e(){var e;return O=!O,localStorage.setItem("weathergpt-autospeak",O),O||(e=window.speechSynthesis)==null||e.cancel(),O}function Ae(){return O}function Ne(){return O=localStorage.getItem("weathergpt-autospeak")==="true",O}const xe={"01d":"☀️","01n":"🌙","02d":"⛅","02n":"☁️","03d":"☁️","03n":"☁️","04d":"☁️","04n":"☁️","09d":"🌧️","09n":"🌧️","10d":"🌦️","10n":"🌧️","11d":"⛈️","11n":"⛈️","13d":"❄️","13n":"❄️","50d":"🌫️","50n":"🌫️"};function Pe(e){return xe[e]||"🌡️"}function qe(e,t){if(!(t!=null&&t.forecast)||!window.Chart)return null;const a=t.forecast,n=document.createElement("canvas");n.classList.add("forecast-chart-canvas"),e.appendChild(n);const s=a.map(h=>h.day_name),i=a.map(h=>h.temperature.high),r=a.map(h=>h.temperature.low),d=n.getContext("2d"),o=d.createLinearGradient(0,0,0,200);o.addColorStop(0,"rgba(245, 158, 11, 0.3)"),o.addColorStop(1,"rgba(245, 158, 11, 0.02)");const p=d.createLinearGradient(0,0,0,200);return p.addColorStop(0,"rgba(96, 165, 250, 0.2)"),p.addColorStop(1,"rgba(96, 165, 250, 0.02)"),new Chart(d,{type:"line",data:{labels:s,datasets:[{label:"High",data:i,borderColor:"#f59e0b",backgroundColor:o,borderWidth:2.5,fill:!0,tension:.4,pointBackgroundColor:"#f59e0b",pointBorderColor:"#1a2035",pointBorderWidth:2,pointRadius:5,pointHoverRadius:7},{label:"Low",data:r,borderColor:"#60a5fa",backgroundColor:p,borderWidth:2.5,fill:!0,tension:.4,pointBackgroundColor:"#60a5fa",pointBorderColor:"#1a2035",pointBorderWidth:2,pointRadius:5,pointHoverRadius:7}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{intersect:!1,mode:"index"},plugins:{legend:{display:!0,position:"top",align:"end",labels:{color:"#94a3b8",font:{family:"'Inter', sans-serif",size:11},boxWidth:12,boxHeight:2,useBorderRadius:!0,borderRadius:1,padding:12}},tooltip:{backgroundColor:"rgba(17, 24, 39, 0.95)",titleColor:"#f1f5f9",bodyColor:"#94a3b8",borderColor:"rgba(255, 255, 255, 0.06)",borderWidth:1,cornerRadius:8,padding:10,titleFont:{family:"'Inter', sans-serif",weight:"600"},bodyFont:{family:"'Inter', sans-serif"},callbacks:{label:h=>`${h.dataset.label}: ${h.parsed.y}°C`}}},scales:{x:{grid:{display:!1},border:{display:!1},ticks:{color:"#64748b",font:{family:"'Inter', sans-serif",size:11,weight:"500"}}},y:{grid:{color:"rgba(255, 255, 255, 0.04)",drawTicks:!1},border:{display:!1},ticks:{color:"#64748b",font:{family:"'Inter', sans-serif",size:11},padding:8,callback:h=>`${h}°`}}}}})}let B=null,T=null,Y=null;const Ie=[15.5,76.2],F=(e="")=>String(e).replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]);function te(e,t){const a=Math.PI/180,n=(t.lat-e.lat)*a,s=(t.lon-e.lon)*a,i=Math.sin(n/2)**2+Math.cos(e.lat*a)*Math.cos(t.lat*a)*Math.sin(s/2)**2;return 6371*2*Math.atan2(Math.sqrt(i),Math.sqrt(1-i))}function Q(e){var n,s;const t=e.risk.level==="favourable"?20:e.risk.level==="caution"?5:-30,a=((s=(n=e.ocean)==null?void 0:n.wave)==null?void 0:s.significant_height_m)||0;return e.confidence*100+t-e.wind_speed_knots*.35-a*2}function re(e){return`<div class="marine-popup">
    <strong>🎣 ${F(e.name)}</strong>
    <span class="marine-popup-status" style="color:${e.risk.color}">● ${F(e.risk.label)}</span>
    <small>${Math.round(e.confidence*100)}% confidence · ${F(e.likely_species.join(", "))}</small>
  </div>`}function ce(e){var s,i,r;if(!e)return'<div class="zone-empty"><span>🎣</span><strong>Select a PFZ zone</strong><p>Tap a coloured marine zone to see fish, safety and ocean telemetry.</p></div>';const t=T?`${te(T,e.coordinates).toFixed(1)} km from you`:"Enable GPS to calculate distance",a=(s=e.ocean)==null?void 0:s.wave,n=e.risk.level;return`
    <div class="zone-panel-kicker">SELECTED PFZ · ${F(e.state)}</div>
    <div class="zone-panel-heading">
      <div><h2>${F(e.name)}</h2><p>🎣 ${F(e.likely_species.join(" · "))}</p></div>
      <span class="zone-risk ${n}">● ${F(e.risk.label)}</span>
    </div>
    <p class="zone-advisory">${F(e.advisory)}</p>
    <div class="zone-metrics">
      <div><span>Confidence</span><strong>${Math.round(e.confidence*100)}%</strong></div>
      <div><span>🌡️ SST</span><strong>${e.sst_celsius}°C</strong></div>
      <div><span>🌿 Chlorophyll</span><strong>${e.chlorophyll_mg_m3} mg/m³</strong></div>
      <div><span>💨 Wind</span><strong>${e.wind_speed_knots} kt</strong></div>
      <div><span>🌊 Wave</span><strong>${a?`${a.significant_height_m} m`:"—"}</strong></div>
      <div><span>📍 Distance</span><strong>${t}</strong></div>
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
    <div class="zone-source">Demo advisory · existing ORCA mock data</div>`}async function Fe(e,{onAskOrca:t,onZoneChange:a}={}){Y=a,e.innerHTML='<div class="marine-map-loading"><span>◌</span> Loading PFZ advisory layers…</div>';try{const n=await fetch("/api/marine-map");if(!n.ok)throw new Error("Map data request failed");const s=await n.json();He(e,s,t)}catch(n){e.innerHTML='<div class="marine-map-loading map-load-error">⚠️ Marine advisory layers are unavailable. The chat remains available.</div>',console.error("Marine map:",n)}}function He(e,t,a){var C;e.innerHTML=`
    <section class="marine-map-card" aria-label="ORCA marine operations map">
      <div class="marine-map-topbar">
        <div><div class="eyebrow">LIVE DEMO COMMAND MAP</div><h1>Marine intelligence, mapped.</h1></div>
        <div class="map-top-actions"><button type="button" class="map-locate">📍 My location</button><button type="button" class="best-zone">🎯 Find Best Zone</button></div>
      </div>
      <div class="marine-map-canvas" id="orca-marine-map"></div>
      <div class="marine-map-legend" aria-label="Map legend"><strong>ADVISORY STATUS</strong><span><i class="legend-dot good"></i> Favourable PFZ</span><span><i class="legend-dot caution"></i> Caution</span><span><i class="legend-dot danger"></i> High risk</span><span>🎣 PFZ target</span><span>🚤 Your position</span></div>
      <div class="marine-map-note">${F(t.source)} · updated ${new Date(t.last_updated).toLocaleDateString()}</div>
    </section>
    <aside class="zone-detail-panel" aria-live="polite">${ce(null)}</aside>`;const n=e.querySelector("#orca-marine-map"),s=e.querySelector(".zone-detail-panel"),i=(C=window.L)==null?void 0:C.map(n,{zoomControl:!1,attributionControl:!0}).setView(Ie,5);if(!i){n.innerHTML='<div class="map-load-error">Map engine unavailable.</div>';return}L.control.zoom({position:"bottomright"}).addTo(i),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:"© OpenStreetMap"}).addTo(i);const r={favourable:L.layerGroup().addTo(i),caution:L.layerGroup().addTo(i),"high-risk":L.layerGroup().addTo(i),targets:L.layerGroup().addTo(i),location:L.layerGroup().addTo(i)},d=new Map;let o=null;const p=(l,m)=>{var f;B=l,s.innerHTML=ce(l),Y==null||Y(l,T),m&&(i.flyToBounds(m.getBounds?m.getBounds().pad(.7):L.latLngBounds([[l.coordinates.lat,l.coordinates.lon]]),{maxZoom:8,duration:.7}),(f=m.openPopup)==null||f.call(m)),g()},g=()=>{var l,m;(l=s.querySelector(".zone-ask"))==null||l.addEventListener("click",()=>a==null?void 0:a(B,T)),(m=s.querySelector(".zone-details"))==null||m.addEventListener("click",()=>{s.classList.toggle("zone-detail-expanded");const f=s.querySelector(".zone-details");f&&(f.textContent=s.classList.contains("zone-detail-expanded")?"⌃ Less":"⌄ Details")})};t.zones.forEach(l=>{const m=[[l.bounds.south,l.bounds.west],[l.bounds.north,l.bounds.east]],f=L.rectangle(m,{color:l.risk.color,weight:2,fillColor:l.risk.color,fillOpacity:.18}).bindPopup(re(l),{closeButton:!1});f.on("click",()=>p(l,f)),f.addTo(r[l.risk.level]);const k=L.marker([l.coordinates.lat,l.coordinates.lon],{icon:L.divIcon({className:"pfz-target-icon",html:`<span style="--zone-color:${l.risk.color}">🎣</span>`,iconSize:[34,34],iconAnchor:[17,17]}),title:`${l.name} PFZ`}).bindPopup(re(l),{closeButton:!1});k.on("click",()=>p(l,f)),k.addTo(r.targets),d.set(l.id,f)}),L.control.layers(null,{"🟢 Favourable PFZ":r.favourable,"🟡 Caution zones":r.caution,"🔴 High-risk zones":r["high-risk"],"🎣 PFZ targets":r.targets,"🚤 My location":r.location},{position:"topright",collapsed:!1}).addTo(i);const h=l=>{T={lat:l.coords.latitude,lon:l.coords.longitude},r.location.clearLayers(),L.marker([T.lat,T.lon],{icon:L.divIcon({className:"user-vessel-icon",html:"<span>🚤</span>",iconSize:[38,38],iconAnchor:[19,19]})}).bindPopup("Your GPS location").addTo(r.location),B&&(o&&r.location.removeLayer(o),o=L.polyline([[T.lat,T.lon],[B.coordinates.lat,B.coordinates.lon]],{color:"#38bdf8",dashArray:"7 8",weight:2}).addTo(r.location),p(B)),i.flyTo([T.lat,T.lon],8,{duration:.8});const f=e.querySelector(".map-locate");f&&(f.textContent="📍 GPS active")},b=()=>{const l=e.querySelector(".map-locate");if(!navigator.geolocation){l&&(l.textContent="GPS unavailable");return}l&&(l.textContent="Locating…"),navigator.geolocation.getCurrentPosition(h,()=>{l&&(l.textContent="GPS permission needed")},{enableHighAccuracy:!0,timeout:1e4,maximumAge:6e4})};e.querySelector(".map-locate").addEventListener("click",b),e.querySelector(".best-zone").addEventListener("click",()=>{const m=[...t.zones].sort((k,$)=>{const x=T?te(T,k.coordinates)-te(T,$.coordinates):0;return Q($)-Q(k)||x})[0];p(m,d.get(m.id));const f=e.querySelector(".best-zone");f.textContent=`✓ Best: ${m.state}`,setTimeout(()=>{f.textContent="🎯 Find Best Zone"},2400)});const u=[...t.zones].sort((l,m)=>Q(m)-Q(l))[0];p(u,d.get(u.id)),setTimeout(()=>i.invalidateSize(),100)}let N=null,v=null,I=null,S=null,H=null,ae=null,z=null,R=null,W=null,E=null,A=null;const X=["🛰️ Querying Marine Satellite Telemetry...","🌊 Analyzing Ocean SST & Chlorophyll-a Upwelling...","🧭 Synthesizing Advisory & PFZ Coordinates...","⚡ Finalizing Marine Recommendations..."];function Oe(e,{onSend:t,onSuggestion:a,onMapZoneChange:n}){ae=t,z=a,e.innerHTML="",e.appendChild(Re());const s=document.createElement("main");s.className="marine-home",s.id="marine-home",e.appendChild(s),E=document.createElement("aside"),E.className="chat-drawer",E.id="chat-drawer",E.setAttribute("aria-label","Ask ORCA assistant"),E.innerHTML=`
    <div class="chat-drawer-header">
      <div><span class="chat-drawer-eyebrow">ORCA AI COPILOT</span><strong>Ask ORCA</strong></div>
      <button class="chat-drawer-close" type="button" aria-label="Close Ask ORCA">×</button>
    </div>`,N=De(),E.appendChild(N),E.appendChild(Ge()),e.appendChild(E),A=document.createElement("button"),A.className="ask-orca-fab",A.type="button",A.innerHTML="<span>💬</span> Ask ORCA",A.setAttribute("aria-expanded","false"),A.addEventListener("click",de),e.appendChild(A),E.querySelector(".chat-drawer-close").addEventListener("click",ze),We(),Fe(s,{onAskOrca:i=>{de(),Ce(`Is ${i.name} suitable for ${i.likely_species[0]} today?`)},onZoneChange:n})}function de(){E&&(E.classList.add("is-open"),A==null||A.setAttribute("aria-expanded","true"),setTimeout(()=>v==null?void 0:v.focus(),180))}function ze(){E==null||E.classList.remove("is-open"),A==null||A.setAttribute("aria-expanded","false")}function Re(){const e=document.createElement("header");return e.className="header",e.id="app-header",e.innerHTML=`
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
      ${Ze()}
      ${be()?Be():""}
    </div>
  `,setTimeout(()=>{const t=e.querySelector("#lang-picker");t&&(t.value=U(),t.addEventListener("change",n=>{Le(n.target.value),v&&(v.placeholder=fe())}));const a=e.querySelector("#voice-toggle");a&&a.addEventListener("click",()=>{const n=_e();a.classList.toggle("active",n),a.title=n?"Auto-speak: ON":"Auto-speak: OFF"})},0),e}function ye(e,t=!1){const a=document.getElementById("header-agent-status");if(!a)return;const n=a.querySelector(".status-pulse-dot"),s=a.querySelector(".status-text");n&&(n.className=t?"status-pulse-dot scanning":"status-pulse-dot"),s&&(s.textContent=e)}function Ze(){return`<select id="lang-picker" class="lang-picker" aria-label="Language">${Object.entries(ie).map(([t,a])=>`<option value="${t}">${a}</option>`).join("")}</select>`}function Be(){const e=Ae();return`<button id="voice-toggle" class="voice-toggle-btn ${e?"active":""}" 
    title="${e?"Auto-speak: ON":"Auto-speak: OFF"}" aria-label="Toggle voice output">
    🔊
  </button>`}function De(){const e=document.createElement("div");return e.className="chat-area",e.id="chat-area",e}function We(){if(!N)return;H=document.createElement("div"),H.className="welcome",H.id="welcome-screen";const e=[{icon:"🎣",category:"Potential Fishing Zones",prompt:"Show PFZ zones in Maharashtra",desc:"Satellite SST & Chlorophyll-a pelagic hotspots"},{icon:"🌊",category:"Ocean & Sea State",prompt:"What are ocean conditions near Chennai?",desc:"Wave swell, sea temperature & tidal currents"},{icon:"🧭",category:"Navigational Safety",prompt:"Is it safe to go fishing today?",desc:"Coastal hazard alerts, high wave & squall checks"},{icon:"🐟",category:"Target Species Advice",prompt:"Where can I fish today near Mumbai?",desc:"Tuna, Mackerel & Pomfret location forecast"}];H.innerHTML=`
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
  `,setTimeout(()=>{H.querySelectorAll(".suggestion-chip-card").forEach(t=>{t.addEventListener("click",()=>{const a=t.getAttribute("data-prompt")||t.textContent;z&&z(a)})})},0),N.appendChild(H)}function we(){H&&(H.remove(),H=null)}function Ge(){const e=document.createElement("div");e.className="input-bar",e.id="input-bar";const t=document.createElement("div");return t.className="input-wrapper",v=document.createElement("textarea"),v.className="input-field",v.id="message-input",v.placeholder=fe(),v.rows=1,v.setAttribute("aria-label","Message input"),v.addEventListener("input",()=>{v.style.height="auto",v.style.height=Math.min(v.scrollHeight,120)+"px"}),v.addEventListener("keydown",a=>{a.key==="Enter"&&!a.shiftKey&&(a.preventDefault(),pe())}),t.appendChild(v),ge()&&(S=document.createElement("button"),S.className="input-btn mic-btn",S.id="mic-btn",S.innerHTML="🎤",S.title="Voice input",S.setAttribute("aria-label","Voice input"),S.addEventListener("click",()=>{Se()})),I=document.createElement("button"),I.className="input-btn send-btn",I.id="send-btn",I.innerHTML="➤",I.title="Send message",I.setAttribute("aria-label","Send message"),I.addEventListener("click",pe),e.appendChild(t),S&&e.appendChild(S),e.appendChild(I),e}function pe(){var t;const e=(t=v==null?void 0:v.value)==null?void 0:t.trim();!e||!ae||(v.value="",v.style.height="auto",ae(e))}function ue(e,t,a={}){var l,m,f,k,$,x,q,M;if(we(),!N)return;const n=document.createElement("div");n.className=`message ${e}`;const s=document.createElement("div");s.className="message-avatar",s.textContent=e==="user"?"👤":"🌊";const i=document.createElement("div");i.className="message-content";const r=document.createElement("div");if(r.className="message-bubble",r.innerHTML=Ue(t),e==="assistant"&&t){const y=document.createElement("div");if(y.className="msg-actions-bar",be()){const w=document.createElement("button");w.className="msg-action-btn msg-speak-btn",w.innerHTML="🔊",w.title="Listen to this response",w.setAttribute("aria-label","Listen to this response"),w.addEventListener("click",Z=>{Z.stopPropagation(),w.classList.add("speaking"),Ee(t,()=>{w.classList.remove("speaking")})}),y.appendChild(w)}const c=document.createElement("button");c.className="msg-action-btn msg-copy-btn",c.innerHTML="📋",c.title="Copy response text",c.setAttribute("aria-label","Copy response text"),c.addEventListener("click",w=>{w.stopPropagation(),navigator.clipboard.writeText(t).then(()=>{c.innerHTML="✓",c.classList.add("btn-copied"),setTimeout(()=>{c.innerHTML="📋",c.classList.remove("btn-copied")},1500)})}),y.appendChild(c),r.appendChild(y)}const d=document.createElement("div");d.className="message-time",d.textContent=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),i.appendChild(r),a.weatherData&&i.appendChild(Qe(a.weatherData)),a.airQualityData&&i.appendChild(Ke(a.airQualityData));const o=a.orchestratorData,p=o==null?void 0:o.pfz_result,g=(l=o==null?void 0:o.recommendation_result)==null?void 0:l.selected_pfz,h=a.pfzData||p;let b=null;if(a.coordinates||((m=o==null?void 0:o.map_data)==null?void 0:m.user_location)||h&&h.zones&&h.zones.length>0){const y=((f=o==null?void 0:o.map_data)==null?void 0:f.user_location)||a.coordinates||(g==null?void 0:g.coordinates)||(($=(k=h==null?void 0:h.zones)==null?void 0:k[0])==null?void 0:$.coordinates);y&&(b=tt(y,((x=a.weatherData)==null?void 0:x.city)||((q=a.forecastData)==null?void 0:q.city)||((M=o==null?void 0:o.weather_result)==null?void 0:M.city)||"",h))}const C=[];if(a.pfzData&&a.pfzData.zones&&a.pfzData.zones.forEach(y=>{const c=Ye(y,a.pfzData.source,b,C);C.push(c),i.appendChild(c)}),o!=null&&o.recommendation_result&&i.appendChild(Xe(o)),a.forecastData&&i.appendChild(et(a.forecastData)),b&&(i.appendChild(b.element),g!=null&&g.coordinates&&b.focusZone(g.coordinates.lat,g.coordinates.lon,g.name)),e==="assistant"){const y=at(a);y&&i.appendChild(y)}i.appendChild(d),n.appendChild(s),n.appendChild(i),N.appendChild(n),oe()}function Ve(){if(we(),R||!N)return;ye("Scanning Ocean Telemetry...",!0),R=document.createElement("div"),R.className="typing-indicator agent-activity-card";let e=0;R.innerHTML=`
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
  `,N.appendChild(R),oe(),W&&clearInterval(W),W=setInterval(()=>{e=(e+1)%X.length;const t=document.getElementById("activity-status-text");t&&(t.classList.remove("status-fade-in"),t.offsetWidth,t.textContent=X[e],t.classList.add("status-fade-in"))},1300)}function ne(){W&&(clearInterval(W),W=null),ye("Marine Core Active",!1),R&&(R.remove(),R=null)}function K(e){if(ne(),!N)return;const t=document.createElement("div");t.className="message assistant",t.innerHTML=`
    <div class="message-avatar" style="background: var(--accent-gradient);">🌊</div>
    <div class="message-content">
      <div class="error-message">⚠️ ${e}</div>
      <div class="message-time">${new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
    </div>
  `,N.appendChild(t),oe()}function me(e){v&&(v.disabled=e),I&&(I.disabled=e),S&&(S.disabled=e)}function Ce(e){v&&(v.value=e,v.style.height="auto",v.style.height=Math.min(v.scrollHeight,120)+"px",v.focus())}function je(e){if(S)switch(e){case"listening":S.classList.add("recording"),S.innerHTML="⏹️";break;case"stopped":case"error":case"denied":S.classList.remove("recording"),S.innerHTML="🎤";break}}function Ue(e){return e?e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\n/g,"<br>"):""}function Qe(e){var s,i,r,d,o;const t=document.createElement("div");t.className="weather-card";const a=((s=e.weather)==null?void 0:s.icon)||"03d",n=Pe(a);return t.innerHTML=`
    <div class="weather-card-header">
      <div>
        <div class="weather-card-city">${e.city||""}${e.country?", "+e.country:""}</div>
        <div class="weather-card-condition">${((i=e.weather)==null?void 0:i.description)||""}</div>
      </div>
    </div>
    <div class="weather-card-main">
      <div class="weather-card-temp">${((r=e.temperature)==null?void 0:r.current)??"--"}°C</div>
      <div class="weather-card-icon">${n}</div>
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
  `,t}function Ke(e){var n,s,i,r,d,o,p,g;const t=document.createElement("div");t.className="aqi-card";const a={1:"aqi-good",2:"aqi-fair",3:"aqi-moderate",4:"aqi-poor",5:"aqi-very-poor"}[(n=e.aqi)==null?void 0:n.index]||"aqi-moderate";return t.innerHTML=`
    <div class="aqi-header">
      <div class="weather-card-city">Air Quality — ${e.city||""}</div>
      <span class="aqi-badge ${a}">${((s=e.aqi)==null?void 0:s.label)||"Unknown"}</span>
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
      ${((d=e.pollutants)==null?void 0:d.no2)!=null?`
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
      ${((g=e.pollutants)==null?void 0:g.so2)!=null?`
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">SO₂</div>
        <div class="aqi-pollutant-value">${e.pollutants.so2}</div>
      </div>`:""}
    </div>
  `,t}function Ye(e,t,a,n){var q,M,y;const s=document.createElement("div");s.className="pfz-card";const i=e.confidence??.7,r=i>=.8?"pfz-conf-high":i>=.6?"pfz-conf-moderate":"pfz-conf-low",d=e.confidence_label||(i>=.8?"High":i>=.6?"Moderate":"Low"),o=Math.round(i*100),p=e.coordinates,g=p?`${p.lat.toFixed(2)}°N, ${p.lon.toFixed(2)}°E`:"",h=p?`${p.lat.toFixed(4)}, ${p.lon.toFixed(4)}`:"",b=(q=e.conditions)==null?void 0:q.sst_celsius,u=(M=e.conditions)==null?void 0:M.chlorophyll_mg_m3,C=(y=e.conditions)==null?void 0:y.wind_speed_knots,l=e.depth_range_m,m=e.likely_species||[];s.innerHTML=`
    <div class="pfz-card-header">
      <div class="pfz-header-left">
        <div class="pfz-card-title">🎣 ${e.name||"PFZ Zone"}</div>
        <div class="pfz-card-location">📍 ${e.state||"Indian Ocean Coast"}${g?" · "+g:""}</div>
      </div>
      <div class="pfz-conf-badge-wrapper">
        <span class="pfz-conf-badge ${r}">● ${d} (${o}%)</span>
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

      ${C!=null?`
      <div class="pfz-telemetry-item wind-item">
        <div class="tel-header">
          <span class="tel-label">💨 Sea Wind</span>
          <span class="tel-value">${C} kt</span>
        </div>
        <div class="tel-bar"><div class="tel-bar-fill wind-fill" style="width: ${Math.min(100,Math.max(15,C/28*100))}%;"></div></div>
        <div class="tel-sub">${C>18?"Caution · Gusty Swell":"Calm · Favorable Seas"}</div>
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
        ${m.map(c=>`<button class="pfz-species-pill" type="button" data-species="${c}">🐟 ${c}</button>`).join("")}
      </div>
    </div>`:""}

    <div class="pfz-card-actions">
      ${p&&a?`
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

    <div class="pfz-source-tag">${t||"ORCA Mock Data"}</div>
  `;const f=()=>{a&&p&&(n&&n.forEach(c=>c.classList.remove("pfz-card--active")),s.classList.add("pfz-card--active"),a.focusZone(p.lat,p.lon,e.name))},k=s.querySelector(".pfz-btn-map");k&&k.addEventListener("click",c=>{c.stopPropagation(),f()}),s.addEventListener("click",c=>{c.target.closest("button")||f()}),s.querySelectorAll(".pfz-species-pill").forEach(c=>{c.addEventListener("click",w=>{w.stopPropagation();const Z=c.getAttribute("data-species");z&&z(`What is the recommended gear, depth, and technique for catching ${Z} in ${e.name||"this zone"}?`)})});const $=s.querySelector(".pfz-btn-gps");$&&h&&$.addEventListener("click",c=>{c.stopPropagation(),navigator.clipboard.writeText(h).then(()=>{const w=$.innerHTML;$.innerHTML="✓ Copied!",$.classList.add("btn-copied"),setTimeout(()=>{$.innerHTML=w,$.classList.remove("btn-copied")},1800)})});const x=s.querySelector(".pfz-btn-weather");return x&&x.addEventListener("click",c=>{c.stopPropagation(),z&&z(`What are the wind and ocean conditions at ${e.name||"this location"}?`)}),s}function Je(e){return e?e.confidence!=null?`${Math.round(e.confidence*100)}% confidence`:e.mg_m3!=null?`${e.mg_m3} mg/m³`:e.celsius!=null?`${e.celsius}°C`:e.significant_height_m!=null?`${e.significant_height_m} m`:e.condition!=null?e.condition:"Not available":"Not available"}function Xe(e){var f,k,$,x,q;const t=e.recommendation_result,a=t.selected_pfz,n=((k=(f=e.gis_result)==null?void 0:f.candidates)==null?void 0:k.find(M=>M.id===(a==null?void 0:a.id)))||(($=e.gis_result)==null?void 0:$.nearest_pfz),s=t.factors||{},i=document.createElement("section");i.className="recommendation-card";const r=document.createElement("div");r.className="recommendation-card-header";const d=document.createElement("div"),o=document.createElement("span");o.className="recommendation-kicker",o.textContent="ORCA FISHING RECOMMENDATION";const p=document.createElement("strong");p.textContent=(a==null?void 0:a.name)||"No PFZ recommended",d.append(o,p);const g=document.createElement("span"),h=t.safety_status||((x=e.safety_result)==null?void 0:x.status)||"UNKNOWN";g.className=`recommendation-safety recommendation-safety--${h.toLowerCase()}`,g.textContent=h,r.append(d,g),i.appendChild(r);const b=document.createElement("div");b.className="recommendation-summary";const u=document.createElement("div");u.innerHTML=`<span>Suitability</span><strong>${t.score??"—"}<small>/100</small></strong>`;const C=document.createElement("div");C.innerHTML=`<span>Distance</span><strong>${(n==null?void 0:n.distance_km)!=null?`${n.distance_km} km`:"Not available"}</strong>`,b.append(u,C),i.appendChild(b);const l=[["PFZ",[s.pfz]],["Ocean",[s.chlorophyll,s.sst,s.waves]],["Weather",[s.weather]]],m=document.createElement("div");if(m.className="recommendation-factors",l.forEach(([M,y])=>{const c=document.createElement("div");c.className="recommendation-factor-group";const w=document.createElement("span");w.textContent=M,c.appendChild(w),y.filter(Boolean).forEach(Z=>{const le=document.createElement("div");le.textContent=`${Je(Z)} · ${Z.score}/${Z.weight_percent} pts`,c.appendChild(le)}),m.appendChild(c)}),i.appendChild(m),(q=t.reasons)!=null&&q.length){const M=document.createElement("ul");M.className="recommendation-reasons",t.reasons.slice(0,4).forEach(y=>{const c=document.createElement("li");c.textContent=y,M.appendChild(c)}),i.appendChild(M)}return i}function et(e){var s;const t=document.createElement("div");t.className="forecast-chart-container";const a=document.createElement("div");a.className="forecast-chart-title",a.textContent=`📊 ${((s=e.forecast)==null?void 0:s.length)||5}-Day Forecast — ${e.city||""}`,t.appendChild(a);const n=document.createElement("div");return n.style.height="180px",n.style.position="relative",t.appendChild(n),setTimeout(()=>{qe(n,e)},100),t}function tt(e,t,a){const n=document.createElement("div");n.className="map-wrapper";const s=a&&a.zones&&a.zones.length>0,i=document.createElement("button");i.className="map-toggle-btn",i.innerHTML=s?"🗺️ Show PFZ zones on map":"📍 Show on map",i.setAttribute("aria-label","Show location on map");let r=!1,d=null,o=null;const p=[];function g(){if(!r){if(d=document.createElement("div"),d.className="map-container",s&&d.classList.add("map-container--pfz"),n.appendChild(d),window.L){o=L.map(d,{zoomControl:!0,attributionControl:!1}).setView([e.lat,e.lon],10),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18}).addTo(o);const b=L.featureGroup();if(t){const u=L.marker([e.lat,e.lon]).bindPopup(`<b>${t}</b>`);u.addTo(o),b.addLayer(u)}s&&a.zones.forEach(u=>{var c,w;if(!u.coordinates)return;const{lat:C,lon:l}=u.coordinates,m=Math.round((u.confidence||0)*100),f=u.confidence_label||(u.confidence>=.8?"High":u.confidence>=.6?"Moderate":"Low"),k=u.confidence>=.8?"#4ade80":u.confidence>=.6?"#facc15":"#f87171",$=u.likely_species&&u.likely_species.length?u.likely_species.join(", "):"—",x=((c=u.conditions)==null?void 0:c.sst_celsius)!=null?u.conditions.sst_celsius+"°C":"—",q=((w=u.conditions)==null?void 0:w.chlorophyll_mg_m3)!=null?u.conditions.chlorophyll_mg_m3+" mg/m³":"—",M=`
            <div class="pfz-popup">
              <div class="pfz-popup-title">🎣 ${u.name||"PFZ Zone"}</div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">Confidence</span><span style="color:${k};font-weight:600">${f} (${m}%)</span></div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">Species</span><span>🐟 ${$}</span></div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">SST</span><span>🌡️ ${x}</span></div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">Chlorophyll</span><span>🌿 ${q}</span></div>
              <div class="pfz-popup-source">ORCA Mock Data</div>
            </div>`,y=L.circleMarker([C,l],{radius:11,fillColor:"#14b8a6",fillOpacity:.9,color:"#ffffff",weight:2}).bindPopup(M,{className:"pfz-leaflet-popup",maxWidth:260});y.addTo(o),b.addLayer(y),p.push({zoneName:u.name,lat:C,lon:l,marker:y})}),b.getLayers().length>1?setTimeout(()=>{o.fitBounds(b.getBounds().pad(.15))},250):!t&&s&&o.setView([e.lat,e.lon],9),setTimeout(()=>o.invalidateSize(),200)}i.innerHTML=s?"🗺️ Hide map":"📍 Hide map",r=!0}}function h(){r&&(d&&d.remove(),d=null,o=null,p.length=0,i.innerHTML=s?"🗺️ Show PFZ zones on map":"📍 Show on map",r=!1)}return i.addEventListener("click",()=>{r?h():g()}),n.appendChild(i),{element:n,openMap:g,focusZone:(b,u,C)=>{r||g(),setTimeout(()=>{if(o){o.flyTo([b,u],11,{duration:.8});const l=p.find(m=>C&&m.zoneName===C||Math.abs(m.lat-b)<.005&&Math.abs(m.lon-u)<.005);l&&l.marker.openPopup()}n.scrollIntoView({behavior:"smooth",block:"nearest"})},150)}}}function at(e){let t=[];if(e.pfzData&&e.pfzData.zones&&e.pfzData.zones.length>0)t=["🧭 Is navigation safe in these zones today?","💨 Wind & wave swell forecast for these zones","🎣 Recommended fishing gear & depth"];else if(e.weatherData){const n=e.weatherData.city||"this area";t=[`🎣 Show PFZ zones near ${n}`,"🌊 Ocean swell and wave height",`📊 5-day marine forecast for ${n}`]}else return null;const a=document.createElement("div");return a.className="followup-suggestions",a.innerHTML=`
    <div class="followup-title">⚡ Quick Marine Follow-ups</div>
    <div class="followup-chips">
      ${t.map(n=>`<button class="followup-chip" type="button">${n}</button>`).join("")}
    </div>
  `,a.querySelectorAll(".followup-chip").forEach(n=>{n.addEventListener("click",()=>{z&&z(n.textContent)})}),a}function oe(){N&&requestAnimationFrame(()=>{N.scrollTop=N.scrollHeight})}const D=[],ve=20;let se=null;function nt(e,t){if(!e||!t)return null;const a=Math.PI/180,n=(t.lat-e.lat)*a,s=(t.lon-e.lon)*a,i=Math.sin(n/2)**2+Math.cos(e.lat*a)*Math.cos(t.lat*a)*Math.sin(s/2)**2;return 6371*2*Math.atan2(Math.sqrt(i),Math.sqrt(1-i))}function st(e,t){var a,n,s;if(!e){se=null;return}se={zoneName:e.name,state:e.state,coordinates:e.coordinates,confidence:e.confidence,targetSpecies:e.likely_species,sstCelsius:e.sst_celsius,chlorophyllMgM3:e.chlorophyll_mg_m3,windKnots:e.wind_speed_knots,waveHeightM:((n=(a=e.ocean)==null?void 0:a.wave)==null?void 0:n.significant_height_m)??null,riskStatus:(s=e.risk)==null?void 0:s.label,userLocation:t||null,distanceKm:nt(t,e.coordinates),source:"ORCA existing mock PFZ/ocean advisory"}}async function ee(e){if(!e.trim())return;const t=U();ue("user",e),D.push({role:"user",content:e}),D.length>ve&&D.splice(0,D.length-ve),me(!0),Ve();try{const a=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e,language:t,mapContext:se,history:D.slice(0,-1)})});if(ne(),!a.ok){const s=await a.json().catch(()=>({}));a.status===401?K(s.error||"API keys not configured. Check your .env file."):K(s.error||"Something went wrong. Please try again.");return}const n=await a.json();ue("assistant",n.reply,{weatherData:n.weatherData,forecastData:n.forecastData,airQualityData:n.airQualityData,pfzData:n.pfzData,orchestratorData:n.orchestratorData,coordinates:n.coordinates}),D.push({role:"assistant",content:n.reply}),Te(n.originalReply||n.reply)}catch(a){ne(),a.name==="TypeError"&&a.message.includes("Failed to fetch")?K("Cannot connect to the server. Make sure the backend is running (npm run dev)."):K("An unexpected error occurred. Please try again."),console.error("Chat error:",a)}finally{me(!1)}}async function he(){var t,a;const e=document.getElementById("app");if(e){$e(),Ne();try{const s=await(await fetch("/api/health")).json();(!((t=s.keys)!=null&&t.groq)||!((a=s.keys)!=null&&a.owm))&&console.warn("Some API keys are missing; map demo remains available.")}catch(n){console.warn("Health check failed — server may not be running:",n.message)}Oe(e,{onSend:n=>ee(n),onSuggestion:n=>ee(n),onMapZoneChange:(n,s)=>st(n,s)}),ge()&&ke(n=>{Ce(n),ee(n)},n=>{je(n)}),console.log("🌊 ORCA initialized")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",he):he();
