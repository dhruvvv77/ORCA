(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function a(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=a(s);fetch(s.href,i)}})();let B="en";const se={en:"English",hi:"हिन्दी",bn:"বাংলা",ta:"தமிழ்",te:"తెలుగు",mr:"मराठी",gu:"ગુજરાતી",kn:"ಕನ್ನಡ",ml:"മലയാളം",pa:"ਪੰਜਾਬੀ",ur:"اردو"};function G(){return B}function Ce(e){se[e]&&(B=e,localStorage.setItem("weathergpt-lang",e))}function Le(){const e=localStorage.getItem("weathergpt-lang");return e&&se[e]&&(B=e),B}function me(){const e={en:"Ask about fishing zones, ocean conditions, weather...",hi:"कहीं भी मौसम के बारे में पूछें...",bn:"যেকোনো জায়গার আবহাওয়া সম্পর্কে জিজ্ঞাসা করুন...",ta:"எங்கும் வானிலை பற்றி கேளுங்கள்...",te:"ఎక్కడైనా వాతావరణం గురించి అడగండి...",mr:"कुठेही हवामानाबद्दल विचारा...",gu:"ગમે ત્યાં હવામાન વિશે પૂછો...",kn:"ಎಲ್ಲಿಯಾದರೂ ಹವಾಮಾನದ ಬಗ್ಗೆ ಕೇಳಿ...",ml:"എവിടെയും കാലാവസ്ഥയെക്കുറിച്ച് ചോദിക്കൂ...",pa:"ਕਿਤੇ ਵੀ ਮੌਸਮ ਬਾਰੇ ਪੁੱਛੋ...",ur:"...کہیں بھی موسم کے بارے میں پوچھیں"};return e[B]||e.en}let E=null,Z=!1,N=!1,Y=null,M=null;const W={en:"en-IN",hi:"hi-IN",bn:"bn-IN",ta:"ta-IN",te:"te-IN",mr:"mr-IN",gu:"gu-IN",kn:"kn-IN",ml:"ml-IN",pa:"pa-IN",ur:"ur-IN"};function he(){return!!(window.SpeechRecognition||window.webkitSpeechRecognition)}function fe(){return!!window.speechSynthesis}function ke(e,t){Y=e,M=t;const a=window.SpeechRecognition||window.webkitSpeechRecognition;return a?(E=new a,E.continuous=!1,E.interimResults=!1,E.maxAlternatives=1,E.onresult=n=>{const s=n.results[0][0].transcript;Y&&Y(s)},E.onend=()=>{Z=!1,M&&M("stopped")},E.onerror=n=>{console.warn("Speech recognition error:",n.error),Z=!1,n.error==="not-allowed"?M&&M("denied"):M&&M("error")},!0):(console.warn("SpeechRecognition not supported"),!1)}function Se(){if(!E)return;if(Z){$e();return}const e=G();E.lang=W[e]||"en-IN";try{E.start(),Z=!0,M&&M("listening")}catch(t){console.warn("Failed to start recognition:",t),M&&M("error")}}function $e(){E&&Z&&(E.stop(),Z=!1,M&&M("stopped"))}function Me(e){var p;if(!window.speechSynthesis||!N)return;window.speechSynthesis.cancel();const t=e.replace(/[\u{1F300}-\u{1FAFF}]/gu,"").replace(/[*_~`#]/g,"").trim();if(!t)return;const a=new SpeechSynthesisUtterance(t),n=G();a.lang=W[n]||"en-IN",a.rate=1,a.pitch=1,a.volume=.9;const s=window.speechSynthesis.getVoices(),i=((p=W[n])==null?void 0:p.split("-")[0])||"en",l=s.find(c=>c.lang.startsWith(i));l&&(a.voice=l),window.speechSynthesis.speak(a)}function Te(e,t){var c;if(!window.speechSynthesis){t&&t();return}window.speechSynthesis.cancel();const a=e.replace(/[\u{1F300}-\u{1FAFF}]/gu,"").replace(/[*_~`#]/g,"").trim();if(!a){t&&t();return}const n=new SpeechSynthesisUtterance(a),s=G();n.lang=W[s]||"en-IN",n.rate=1,n.pitch=1,n.volume=.9;const i=window.speechSynthesis.getVoices(),l=((c=W[s])==null?void 0:c.split("-")[0])||"en",p=i.find(v=>v.lang.startsWith(l));p&&(n.voice=p),t&&(n.onend=()=>t(),n.onerror=()=>t()),window.speechSynthesis.speak(n)}function Ae(){var e;return N=!N,localStorage.setItem("weathergpt-autospeak",N),N||(e=window.speechSynthesis)==null||e.cancel(),N}function Ee(){return N}function xe(){return N=localStorage.getItem("weathergpt-autospeak")==="true",N}const Pe={"01d":"☀️","01n":"🌙","02d":"⛅","02n":"☁️","03d":"☁️","03n":"☁️","04d":"☁️","04n":"☁️","09d":"🌧️","09n":"🌧️","10d":"🌦️","10n":"🌧️","11d":"⛈️","11n":"⛈️","13d":"❄️","13n":"❄️","50d":"🌫️","50n":"🌫️"};function qe(e){return Pe[e]||"🌡️"}function Ne(e,t){if(!(t!=null&&t.forecast)||!window.Chart)return null;const a=t.forecast,n=document.createElement("canvas");n.classList.add("forecast-chart-canvas"),e.appendChild(n);const s=a.map(h=>h.day_name),i=a.map(h=>h.temperature.high),l=a.map(h=>h.temperature.low),p=n.getContext("2d"),c=p.createLinearGradient(0,0,0,200);c.addColorStop(0,"rgba(245, 158, 11, 0.3)"),c.addColorStop(1,"rgba(245, 158, 11, 0.02)");const v=p.createLinearGradient(0,0,0,200);return v.addColorStop(0,"rgba(96, 165, 250, 0.2)"),v.addColorStop(1,"rgba(96, 165, 250, 0.02)"),new Chart(p,{type:"line",data:{labels:s,datasets:[{label:"High",data:i,borderColor:"#f59e0b",backgroundColor:c,borderWidth:2.5,fill:!0,tension:.4,pointBackgroundColor:"#f59e0b",pointBorderColor:"#1a2035",pointBorderWidth:2,pointRadius:5,pointHoverRadius:7},{label:"Low",data:l,borderColor:"#60a5fa",backgroundColor:v,borderWidth:2.5,fill:!0,tension:.4,pointBackgroundColor:"#60a5fa",pointBorderColor:"#1a2035",pointBorderWidth:2,pointRadius:5,pointHoverRadius:7}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{intersect:!1,mode:"index"},plugins:{legend:{display:!0,position:"top",align:"end",labels:{color:"#94a3b8",font:{family:"'Inter', sans-serif",size:11},boxWidth:12,boxHeight:2,useBorderRadius:!0,borderRadius:1,padding:12}},tooltip:{backgroundColor:"rgba(17, 24, 39, 0.95)",titleColor:"#f1f5f9",bodyColor:"#94a3b8",borderColor:"rgba(255, 255, 255, 0.06)",borderWidth:1,cornerRadius:8,padding:10,titleFont:{family:"'Inter', sans-serif",weight:"600"},bodyFont:{family:"'Inter', sans-serif"},callbacks:{label:h=>`${h.dataset.label}: ${h.parsed.y}°C`}}},scales:{x:{grid:{display:!1},border:{display:!1},ticks:{color:"#64748b",font:{family:"'Inter', sans-serif",size:11,weight:"500"}}},y:{grid:{color:"rgba(255, 255, 255, 0.04)",drawTicks:!1},border:{display:!1},ticks:{color:"#64748b",font:{family:"'Inter', sans-serif",size:11},padding:8,callback:h=>`${h}°`}}}}})}let D=null,S=null,K=null;const _e=[15.5,76.2],P=(e="")=>String(e).replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]);function ee(e,t){const a=Math.PI/180,n=(t.lat-e.lat)*a,s=(t.lon-e.lon)*a,i=Math.sin(n/2)**2+Math.cos(e.lat*a)*Math.cos(t.lat*a)*Math.sin(s/2)**2;return 6371*2*Math.atan2(Math.sqrt(i),Math.sqrt(1-i))}function Q(e){var n,s;const t=e.risk.level==="favourable"?20:e.risk.level==="caution"?5:-30,a=((s=(n=e.ocean)==null?void 0:n.wave)==null?void 0:s.significant_height_m)||0;return e.confidence*100+t-e.wind_speed_knots*.35-a*2}function oe(e){return`<div class="marine-popup">
    <strong>🎣 ${P(e.name)}</strong>
    <span class="marine-popup-status" style="color:${e.risk.color}">● ${P(e.risk.label)}</span>
    <small>${Math.round(e.confidence*100)}% confidence · ${P(e.likely_species.join(", "))}</small>
  </div>`}function le(e){var s,i,l;if(!e)return'<div class="zone-empty"><span>🎣</span><strong>Select a PFZ zone</strong><p>Tap a coloured marine zone to see fish, safety and ocean telemetry.</p></div>';const t=S?`${ee(S,e.coordinates).toFixed(1)} km from you`:"Enable GPS to calculate distance",a=(s=e.ocean)==null?void 0:s.wave,n=e.risk.level;return`
    <div class="zone-panel-kicker">SELECTED PFZ · ${P(e.state)}</div>
    <div class="zone-panel-heading">
      <div><h2>${P(e.name)}</h2><p>🎣 ${P(e.likely_species.join(" · "))}</p></div>
      <span class="zone-risk ${n}">● ${P(e.risk.label)}</span>
    </div>
    <p class="zone-advisory">${P(e.advisory)}</p>
    <div class="zone-metrics">
      <div><span>Confidence</span><strong>${Math.round(e.confidence*100)}%</strong></div>
      <div><span>🌡️ SST</span><strong>${e.sst_celsius}°C</strong></div>
      <div><span>🌿 Chlorophyll</span><strong>${e.chlorophyll_mg_m3} mg/m³</strong></div>
      <div><span>💨 Wind</span><strong>${e.wind_speed_knots} kt</strong></div>
      <div><span>🌊 Wave</span><strong>${a?`${a.significant_height_m} m`:"—"}</strong></div>
      <div><span>📍 Distance</span><strong>${t}</strong></div>
    </div>
    <div class="zone-current">Current ${P((i=e.ocean)!=null&&i.current?`${e.ocean.current.speed_knots} kt ${e.ocean.current.direction}`:"not available")} · Depth ${e.depth_range_m.min}–${e.depth_range_m.max} m</div>
    <div class="zone-additional">
      <span>Coordinates ${e.coordinates.lat.toFixed(2)}°N, ${e.coordinates.lon.toFixed(2)}°E</span>
      <span>Salinity ${((l=e.ocean)==null?void 0:l.salinity_psu)??"—"} PSU</span>
      <span>Advisory valid until ${e.valid_until?new Date(e.valid_until).toLocaleString():"not supplied"}</span>
    </div>
    <div class="zone-panel-actions">
      <button type="button" class="zone-action zone-ask">💬 Ask ORCA</button>
      <a class="zone-action zone-navigate" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${e.coordinates.lat},${e.coordinates.lon}">🧭 Navigate</a>
      <button type="button" class="zone-action zone-details">⌄ Details</button>
    </div>
    <div class="zone-source">Demo advisory · existing ORCA mock data</div>`}async function Ie(e,{onAskOrca:t,onZoneChange:a}={}){K=a,e.innerHTML='<div class="marine-map-loading"><span>◌</span> Loading PFZ advisory layers…</div>';try{const n=await fetch("/api/marine-map");if(!n.ok)throw new Error("Map data request failed");const s=await n.json();Fe(e,s,t)}catch(n){e.innerHTML='<div class="marine-map-loading map-load-error">⚠️ Marine advisory layers are unavailable. The chat remains available.</div>',console.error("Marine map:",n)}}function Fe(e,t,a){var y;e.innerHTML=`
    <section class="marine-map-card" aria-label="ORCA marine operations map">
      <div class="marine-map-topbar">
        <div><div class="eyebrow">LIVE DEMO COMMAND MAP</div><h1>Marine intelligence, mapped.</h1></div>
        <div class="map-top-actions"><button type="button" class="map-locate">📍 My location</button><button type="button" class="best-zone">🎯 Find Best Zone</button></div>
      </div>
      <div class="marine-map-canvas" id="orca-marine-map"></div>
      <div class="marine-map-legend" aria-label="Map legend"><strong>ADVISORY STATUS</strong><span><i class="legend-dot good"></i> Favourable PFZ</span><span><i class="legend-dot caution"></i> Caution</span><span><i class="legend-dot danger"></i> High risk</span><span>🎣 PFZ target</span><span>🚤 Your position</span></div>
      <div class="marine-map-note">${P(t.source)} · updated ${new Date(t.last_updated).toLocaleDateString()}</div>
    </section>
    <aside class="zone-detail-panel" aria-live="polite">${le(null)}</aside>`;const n=e.querySelector("#orca-marine-map"),s=e.querySelector(".zone-detail-panel"),i=(y=window.L)==null?void 0:y.map(n,{zoomControl:!1,attributionControl:!0}).setView(_e,5);if(!i){n.innerHTML='<div class="map-load-error">Map engine unavailable.</div>';return}L.control.zoom({position:"bottomright"}).addTo(i),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:"© OpenStreetMap"}).addTo(i);const l={favourable:L.layerGroup().addTo(i),caution:L.layerGroup().addTo(i),"high-risk":L.layerGroup().addTo(i),targets:L.layerGroup().addTo(i),location:L.layerGroup().addTo(i)},p=new Map;let c=null;const v=(o,r)=>{var d;D=o,s.innerHTML=le(o),K==null||K(o,S),r&&(i.flyToBounds(r.getBounds?r.getBounds().pad(.7):L.latLngBounds([[o.coordinates.lat,o.coordinates.lon]]),{maxZoom:8,duration:.7}),(d=r.openPopup)==null||d.call(r)),C()},C=()=>{var o,r;(o=s.querySelector(".zone-ask"))==null||o.addEventListener("click",()=>a==null?void 0:a(D,S)),(r=s.querySelector(".zone-details"))==null||r.addEventListener("click",()=>{s.classList.toggle("zone-detail-expanded");const d=s.querySelector(".zone-details");d&&(d.textContent=s.classList.contains("zone-detail-expanded")?"⌃ Less":"⌄ Details")})};t.zones.forEach(o=>{const r=[[o.bounds.south,o.bounds.west],[o.bounds.north,o.bounds.east]],d=L.rectangle(r,{color:o.risk.color,weight:2,fillColor:o.risk.color,fillOpacity:.18}).bindPopup(oe(o),{closeButton:!1});d.on("click",()=>v(o,d)),d.addTo(l[o.risk.level]);const f=L.marker([o.coordinates.lat,o.coordinates.lon],{icon:L.divIcon({className:"pfz-target-icon",html:`<span style="--zone-color:${o.risk.color}">🎣</span>`,iconSize:[34,34],iconAnchor:[17,17]}),title:`${o.name} PFZ`}).bindPopup(oe(o),{closeButton:!1});f.on("click",()=>v(o,d)),f.addTo(l.targets),p.set(o.id,d)}),L.control.layers(null,{"🟢 Favourable PFZ":l.favourable,"🟡 Caution zones":l.caution,"🔴 High-risk zones":l["high-risk"],"🎣 PFZ targets":l.targets,"🚤 My location":l.location},{position:"topright",collapsed:!1}).addTo(i);const h=o=>{S={lat:o.coords.latitude,lon:o.coords.longitude},l.location.clearLayers(),L.marker([S.lat,S.lon],{icon:L.divIcon({className:"user-vessel-icon",html:"<span>🚤</span>",iconSize:[38,38],iconAnchor:[19,19]})}).bindPopup("Your GPS location").addTo(l.location),D&&(c&&l.location.removeLayer(c),c=L.polyline([[S.lat,S.lon],[D.coordinates.lat,D.coordinates.lon]],{color:"#38bdf8",dashArray:"7 8",weight:2}).addTo(l.location),v(D)),i.flyTo([S.lat,S.lon],8,{duration:.8});const d=e.querySelector(".map-locate");d&&(d.textContent="📍 GPS active")},b=()=>{const o=e.querySelector(".map-locate");if(!navigator.geolocation){o&&(o.textContent="GPS unavailable");return}o&&(o.textContent="Locating…"),navigator.geolocation.getCurrentPosition(h,()=>{o&&(o.textContent="GPS permission needed")},{enableHighAccuracy:!0,timeout:1e4,maximumAge:6e4})};e.querySelector(".map-locate").addEventListener("click",b),e.querySelector(".best-zone").addEventListener("click",()=>{const r=[...t.zones].sort((f,k)=>{const F=S?ee(S,f.coordinates)-ee(S,k.coordinates):0;return Q(k)-Q(f)||F})[0];v(r,p.get(r.id));const d=e.querySelector(".best-zone");d.textContent=`✓ Best: ${r.state}`,setTimeout(()=>{d.textContent="🎯 Find Best Zone"},2400)});const u=[...t.zones].sort((o,r)=>Q(r)-Q(o))[0];v(u,p.get(u.id)),setTimeout(()=>i.invalidateSize(),100)}let A=null,m=null,x=null,w=null,q=null,te=null,_=null,I=null,R=null,$=null,T=null;const J=["🛰️ Querying Marine Satellite Telemetry...","🌊 Analyzing Ocean SST & Chlorophyll-a Upwelling...","🧭 Synthesizing Advisory & PFZ Coordinates...","⚡ Finalizing Marine Recommendations..."];function He(e,{onSend:t,onSuggestion:a,onMapZoneChange:n}){te=t,_=a,e.innerHTML="",e.appendChild(De());const s=document.createElement("main");s.className="marine-home",s.id="marine-home",e.appendChild(s),$=document.createElement("aside"),$.className="chat-drawer",$.id="chat-drawer",$.setAttribute("aria-label","Ask ORCA assistant"),$.innerHTML=`
    <div class="chat-drawer-header">
      <div><span class="chat-drawer-eyebrow">ORCA AI COPILOT</span><strong>Ask ORCA</strong></div>
      <button class="chat-drawer-close" type="button" aria-label="Close Ask ORCA">×</button>
    </div>`,A=Ze(),$.appendChild(A),$.appendChild(We()),e.appendChild($),T=document.createElement("button"),T.className="ask-orca-fab",T.type="button",T.innerHTML="<span>💬</span> Ask ORCA",T.setAttribute("aria-expanded","false"),T.addEventListener("click",re),e.appendChild(T),$.querySelector(".chat-drawer-close").addEventListener("click",Oe),Be(),Ie(s,{onAskOrca:i=>{re(),ye(`Is ${i.name} suitable for ${i.likely_species[0]} today?`)},onZoneChange:n})}function re(){$&&($.classList.add("is-open"),T==null||T.setAttribute("aria-expanded","true"),setTimeout(()=>m==null?void 0:m.focus(),180))}function Oe(){$==null||$.classList.remove("is-open"),T==null||T.setAttribute("aria-expanded","false")}function De(){const e=document.createElement("header");return e.className="header",e.id="app-header",e.innerHTML=`
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
      ${ze()}
      ${fe()?Re():""}
    </div>
  `,setTimeout(()=>{const t=e.querySelector("#lang-picker");t&&(t.value=G(),t.addEventListener("change",n=>{Ce(n.target.value),m&&(m.placeholder=me())}));const a=e.querySelector("#voice-toggle");a&&a.addEventListener("click",()=>{const n=Ae();a.classList.toggle("active",n),a.title=n?"Auto-speak: ON":"Auto-speak: OFF"})},0),e}function ge(e,t=!1){const a=document.getElementById("header-agent-status");if(!a)return;const n=a.querySelector(".status-pulse-dot"),s=a.querySelector(".status-text");n&&(n.className=t?"status-pulse-dot scanning":"status-pulse-dot"),s&&(s.textContent=e)}function ze(){return`<select id="lang-picker" class="lang-picker" aria-label="Language">${Object.entries(se).map(([t,a])=>`<option value="${t}">${a}</option>`).join("")}</select>`}function Re(){const e=Ee();return`<button id="voice-toggle" class="voice-toggle-btn ${e?"active":""}" 
    title="${e?"Auto-speak: ON":"Auto-speak: OFF"}" aria-label="Toggle voice output">
    🔊
  </button>`}function Ze(){const e=document.createElement("div");return e.className="chat-area",e.id="chat-area",e}function Be(){if(!A)return;q=document.createElement("div"),q.className="welcome",q.id="welcome-screen";const e=[{icon:"🎣",category:"Potential Fishing Zones",prompt:"Show PFZ zones in Maharashtra",desc:"Satellite SST & Chlorophyll-a pelagic hotspots"},{icon:"🌊",category:"Ocean & Sea State",prompt:"What are ocean conditions near Chennai?",desc:"Wave swell, sea temperature & tidal currents"},{icon:"🧭",category:"Navigational Safety",prompt:"Is it safe to go fishing today?",desc:"Coastal hazard alerts, high wave & squall checks"},{icon:"🐟",category:"Target Species Advice",prompt:"Where can I fish today near Mumbai?",desc:"Tuna, Mackerel & Pomfret location forecast"}];q.innerHTML=`
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
  `,setTimeout(()=>{q.querySelectorAll(".suggestion-chip-card").forEach(t=>{t.addEventListener("click",()=>{const a=t.getAttribute("data-prompt")||t.textContent;_&&_(a)})})},0),A.appendChild(q)}function be(){q&&(q.remove(),q=null)}function We(){const e=document.createElement("div");e.className="input-bar",e.id="input-bar";const t=document.createElement("div");return t.className="input-wrapper",m=document.createElement("textarea"),m.className="input-field",m.id="message-input",m.placeholder=me(),m.rows=1,m.setAttribute("aria-label","Message input"),m.addEventListener("input",()=>{m.style.height="auto",m.style.height=Math.min(m.scrollHeight,120)+"px"}),m.addEventListener("keydown",a=>{a.key==="Enter"&&!a.shiftKey&&(a.preventDefault(),ce())}),t.appendChild(m),he()&&(w=document.createElement("button"),w.className="input-btn mic-btn",w.id="mic-btn",w.innerHTML="🎤",w.title="Voice input",w.setAttribute("aria-label","Voice input"),w.addEventListener("click",()=>{Se()})),x=document.createElement("button"),x.className="input-btn send-btn",x.id="send-btn",x.innerHTML="➤",x.title="Send message",x.setAttribute("aria-label","Send message"),x.addEventListener("click",ce),e.appendChild(t),w&&e.appendChild(w),e.appendChild(x),e}function ce(){var t;const e=(t=m==null?void 0:m.value)==null?void 0:t.trim();!e||!te||(m.value="",m.style.height="auto",te(e))}function de(e,t,a={}){var h,b,u,y,o;if(be(),!A)return;const n=document.createElement("div");n.className=`message ${e}`;const s=document.createElement("div");s.className="message-avatar",s.textContent=e==="user"?"👤":"🌊";const i=document.createElement("div");i.className="message-content";const l=document.createElement("div");if(l.className="message-bubble",l.innerHTML=je(t),e==="assistant"&&t){const r=document.createElement("div");if(r.className="msg-actions-bar",fe()){const f=document.createElement("button");f.className="msg-action-btn msg-speak-btn",f.innerHTML="🔊",f.title="Listen to this response",f.setAttribute("aria-label","Listen to this response"),f.addEventListener("click",k=>{k.stopPropagation(),f.classList.add("speaking"),Te(t,()=>{f.classList.remove("speaking")})}),r.appendChild(f)}const d=document.createElement("button");d.className="msg-action-btn msg-copy-btn",d.innerHTML="📋",d.title="Copy response text",d.setAttribute("aria-label","Copy response text"),d.addEventListener("click",f=>{f.stopPropagation(),navigator.clipboard.writeText(t).then(()=>{d.innerHTML="✓",d.classList.add("btn-copied"),setTimeout(()=>{d.innerHTML="📋",d.classList.remove("btn-copied")},1500)})}),r.appendChild(d),l.appendChild(r)}const p=document.createElement("div");p.className="message-time",p.textContent=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),i.appendChild(l),a.weatherData&&i.appendChild(Qe(a.weatherData)),a.airQualityData&&i.appendChild(Ue(a.airQualityData));let c=null;if(a.coordinates||a.pfzData&&a.pfzData.zones&&a.pfzData.zones.length>0){const r=a.coordinates||((u=(b=(h=a.pfzData)==null?void 0:h.zones)==null?void 0:b[0])==null?void 0:u.coordinates);r&&(c=Je(r,((y=a.weatherData)==null?void 0:y.city)||((o=a.forecastData)==null?void 0:o.city)||"",a.pfzData))}const C=[];if(a.pfzData&&a.pfzData.zones&&a.pfzData.zones.forEach(r=>{const d=Ke(r,a.pfzData.source,c,C);C.push(d),i.appendChild(d)}),a.forecastData&&i.appendChild(Ye(a.forecastData)),c&&i.appendChild(c.element),e==="assistant"){const r=Xe(a);r&&i.appendChild(r)}i.appendChild(p),n.appendChild(s),n.appendChild(i),A.appendChild(n),ie()}function Ge(){if(be(),I||!A)return;ge("Scanning Ocean Telemetry...",!0),I=document.createElement("div"),I.className="typing-indicator agent-activity-card";let e=0;I.innerHTML=`
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
        ${J[0]}
      </div>
    </div>
  `,A.appendChild(I),ie(),R&&clearInterval(R),R=setInterval(()=>{e=(e+1)%J.length;const t=document.getElementById("activity-status-text");t&&(t.classList.remove("status-fade-in"),t.offsetWidth,t.textContent=J[e],t.classList.add("status-fade-in"))},1300)}function ae(){R&&(clearInterval(R),R=null),ge("Marine Core Active",!1),I&&(I.remove(),I=null)}function U(e){if(ae(),!A)return;const t=document.createElement("div");t.className="message assistant",t.innerHTML=`
    <div class="message-avatar" style="background: var(--accent-gradient);">🌊</div>
    <div class="message-content">
      <div class="error-message">⚠️ ${e}</div>
      <div class="message-time">${new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
    </div>
  `,A.appendChild(t),ie()}function pe(e){m&&(m.disabled=e),x&&(x.disabled=e),w&&(w.disabled=e)}function ye(e){m&&(m.value=e,m.style.height="auto",m.style.height=Math.min(m.scrollHeight,120)+"px",m.focus())}function Ve(e){if(w)switch(e){case"listening":w.classList.add("recording"),w.innerHTML="⏹️";break;case"stopped":case"error":case"denied":w.classList.remove("recording"),w.innerHTML="🎤";break}}function je(e){return e?e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\n/g,"<br>"):""}function Qe(e){var s,i,l,p,c;const t=document.createElement("div");t.className="weather-card";const a=((s=e.weather)==null?void 0:s.icon)||"03d",n=qe(a);return t.innerHTML=`
    <div class="weather-card-header">
      <div>
        <div class="weather-card-city">${e.city||""}${e.country?", "+e.country:""}</div>
        <div class="weather-card-condition">${((i=e.weather)==null?void 0:i.description)||""}</div>
      </div>
    </div>
    <div class="weather-card-main">
      <div class="weather-card-temp">${((l=e.temperature)==null?void 0:l.current)??"--"}°C</div>
      <div class="weather-card-icon">${n}</div>
    </div>
    <div class="weather-card-details">
      <div class="weather-detail">
        <div class="weather-detail-label">Feels Like</div>
        <div class="weather-detail-value">${((p=e.temperature)==null?void 0:p.feels_like)??"--"}°C</div>
      </div>
      <div class="weather-detail">
        <div class="weather-detail-label">Humidity</div>
        <div class="weather-detail-value">${e.humidity??"--"}%</div>
      </div>
      <div class="weather-detail">
        <div class="weather-detail-label">Wind</div>
        <div class="weather-detail-value">${((c=e.wind)==null?void 0:c.speed)??"--"} m/s</div>
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
  `,t}function Ue(e){var n,s,i,l,p,c,v,C;const t=document.createElement("div");t.className="aqi-card";const a={1:"aqi-good",2:"aqi-fair",3:"aqi-moderate",4:"aqi-poor",5:"aqi-very-poor"}[(n=e.aqi)==null?void 0:n.index]||"aqi-moderate";return t.innerHTML=`
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
      ${((l=e.pollutants)==null?void 0:l.pm10)!=null?`
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">PM10</div>
        <div class="aqi-pollutant-value">${e.pollutants.pm10}</div>
      </div>`:""}
      ${((p=e.pollutants)==null?void 0:p.no2)!=null?`
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">NO₂</div>
        <div class="aqi-pollutant-value">${e.pollutants.no2}</div>
      </div>`:""}
      ${((c=e.pollutants)==null?void 0:c.o3)!=null?`
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">O₃</div>
        <div class="aqi-pollutant-value">${e.pollutants.o3}</div>
      </div>`:""}
      ${((v=e.pollutants)==null?void 0:v.co)!=null?`
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">CO</div>
        <div class="aqi-pollutant-value">${e.pollutants.co}</div>
      </div>`:""}
      ${((C=e.pollutants)==null?void 0:C.so2)!=null?`
      <div class="aqi-pollutant">
        <div class="aqi-pollutant-name">SO₂</div>
        <div class="aqi-pollutant-value">${e.pollutants.so2}</div>
      </div>`:""}
    </div>
  `,t}function Ke(e,t,a,n){var V,j,H;const s=document.createElement("div");s.className="pfz-card";const i=e.confidence??.7,l=i>=.8?"pfz-conf-high":i>=.6?"pfz-conf-moderate":"pfz-conf-low",p=e.confidence_label||(i>=.8?"High":i>=.6?"Moderate":"Low"),c=Math.round(i*100),v=e.coordinates,C=v?`${v.lat.toFixed(2)}°N, ${v.lon.toFixed(2)}°E`:"",h=v?`${v.lat.toFixed(4)}, ${v.lon.toFixed(4)}`:"",b=(V=e.conditions)==null?void 0:V.sst_celsius,u=(j=e.conditions)==null?void 0:j.chlorophyll_mg_m3,y=(H=e.conditions)==null?void 0:H.wind_speed_knots,o=e.depth_range_m,r=e.likely_species||[];s.innerHTML=`
    <div class="pfz-card-header">
      <div class="pfz-header-left">
        <div class="pfz-card-title">🎣 ${e.name||"PFZ Zone"}</div>
        <div class="pfz-card-location">📍 ${e.state||"Indian Ocean Coast"}${C?" · "+C:""}</div>
      </div>
      <div class="pfz-conf-badge-wrapper">
        <span class="pfz-conf-badge ${l}">● ${p} (${c}%)</span>
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

      ${y!=null?`
      <div class="pfz-telemetry-item wind-item">
        <div class="tel-header">
          <span class="tel-label">💨 Sea Wind</span>
          <span class="tel-value">${y} kt</span>
        </div>
        <div class="tel-bar"><div class="tel-bar-fill wind-fill" style="width: ${Math.min(100,Math.max(15,y/28*100))}%;"></div></div>
        <div class="tel-sub">${y>18?"Caution · Gusty Swell":"Calm · Favorable Seas"}</div>
      </div>`:""}

      ${o?`
      <div class="pfz-telemetry-item depth-item">
        <div class="tel-header">
          <span class="tel-label">📏 Bathymetry</span>
          <span class="tel-value">${o.min}–${o.max} m</span>
        </div>
        <div class="tel-bar"><div class="tel-bar-fill depth-fill" style="width: ${Math.min(100,o.max/90*100)}%;"></div></div>
        <div class="tel-sub">Continental Shelf Zone</div>
      </div>`:""}
    </div>

    ${r.length>0?`
    <div class="pfz-species-section">
      <div class="pfz-section-title">🐟 Target Species (Click to query advice):</div>
      <div class="pfz-species-pills">
        ${r.map(g=>`<button class="pfz-species-pill" type="button" data-species="${g}">🐟 ${g}</button>`).join("")}
      </div>
    </div>`:""}

    <div class="pfz-card-actions">
      ${v&&a?`
      <button class="pfz-action-btn pfz-btn-map" type="button">
        🗺️ Focus Zone on Map
      </button>`:""}
      ${v?`
      <button class="pfz-action-btn pfz-btn-gps" type="button" data-gps="${h}">
        📋 Copy GPS
      </button>`:""}
      <button class="pfz-action-btn pfz-btn-weather" type="button">
        🌤️ Sea Weather
      </button>
    </div>

    <div class="pfz-source-tag">${t||"ORCA Mock Data"}</div>
  `;const d=()=>{a&&v&&(n&&n.forEach(g=>g.classList.remove("pfz-card--active")),s.classList.add("pfz-card--active"),a.focusZone(v.lat,v.lon,e.name))},f=s.querySelector(".pfz-btn-map");f&&f.addEventListener("click",g=>{g.stopPropagation(),d()}),s.addEventListener("click",g=>{g.target.closest("button")||d()}),s.querySelectorAll(".pfz-species-pill").forEach(g=>{g.addEventListener("click",O=>{O.stopPropagation();const we=g.getAttribute("data-species");_&&_(`What is the recommended gear, depth, and technique for catching ${we} in ${e.name||"this zone"}?`)})});const k=s.querySelector(".pfz-btn-gps");k&&h&&k.addEventListener("click",g=>{g.stopPropagation(),navigator.clipboard.writeText(h).then(()=>{const O=k.innerHTML;k.innerHTML="✓ Copied!",k.classList.add("btn-copied"),setTimeout(()=>{k.innerHTML=O,k.classList.remove("btn-copied")},1800)})});const F=s.querySelector(".pfz-btn-weather");return F&&F.addEventListener("click",g=>{g.stopPropagation(),_&&_(`What are the wind and ocean conditions at ${e.name||"this location"}?`)}),s}function Ye(e){var s;const t=document.createElement("div");t.className="forecast-chart-container";const a=document.createElement("div");a.className="forecast-chart-title",a.textContent=`📊 ${((s=e.forecast)==null?void 0:s.length)||5}-Day Forecast — ${e.city||""}`,t.appendChild(a);const n=document.createElement("div");return n.style.height="180px",n.style.position="relative",t.appendChild(n),setTimeout(()=>{Ne(n,e)},100),t}function Je(e,t,a){const n=document.createElement("div");n.className="map-wrapper";const s=a&&a.zones&&a.zones.length>0,i=document.createElement("button");i.className="map-toggle-btn",i.innerHTML=s?"🗺️ Show PFZ zones on map":"📍 Show on map",i.setAttribute("aria-label","Show location on map");let l=!1,p=null,c=null;const v=[];function C(){if(!l){if(p=document.createElement("div"),p.className="map-container",s&&p.classList.add("map-container--pfz"),n.appendChild(p),window.L){c=L.map(p,{zoomControl:!0,attributionControl:!1}).setView([e.lat,e.lon],10),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18}).addTo(c);const b=L.featureGroup();if(t){const u=L.marker([e.lat,e.lon]).bindPopup(`<b>${t}</b>`);u.addTo(c),b.addLayer(u)}s&&a.zones.forEach(u=>{var g,O;if(!u.coordinates)return;const{lat:y,lon:o}=u.coordinates,r=Math.round((u.confidence||0)*100),d=u.confidence_label||(u.confidence>=.8?"High":u.confidence>=.6?"Moderate":"Low"),f=u.confidence>=.8?"#4ade80":u.confidence>=.6?"#facc15":"#f87171",k=u.likely_species&&u.likely_species.length?u.likely_species.join(", "):"—",F=((g=u.conditions)==null?void 0:g.sst_celsius)!=null?u.conditions.sst_celsius+"°C":"—",V=((O=u.conditions)==null?void 0:O.chlorophyll_mg_m3)!=null?u.conditions.chlorophyll_mg_m3+" mg/m³":"—",j=`
            <div class="pfz-popup">
              <div class="pfz-popup-title">🎣 ${u.name||"PFZ Zone"}</div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">Confidence</span><span style="color:${f};font-weight:600">${d} (${r}%)</span></div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">Species</span><span>🐟 ${k}</span></div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">SST</span><span>🌡️ ${F}</span></div>
              <div class="pfz-popup-row"><span class="pfz-popup-label">Chlorophyll</span><span>🌿 ${V}</span></div>
              <div class="pfz-popup-source">ORCA Mock Data</div>
            </div>`,H=L.circleMarker([y,o],{radius:11,fillColor:"#14b8a6",fillOpacity:.9,color:"#ffffff",weight:2}).bindPopup(j,{className:"pfz-leaflet-popup",maxWidth:260});H.addTo(c),b.addLayer(H),v.push({zoneName:u.name,lat:y,lon:o,marker:H})}),b.getLayers().length>1?setTimeout(()=>{c.fitBounds(b.getBounds().pad(.15))},250):!t&&s&&c.setView([e.lat,e.lon],9),setTimeout(()=>c.invalidateSize(),200)}i.innerHTML=s?"🗺️ Hide map":"📍 Hide map",l=!0}}function h(){l&&(p&&p.remove(),p=null,c=null,v.length=0,i.innerHTML=s?"🗺️ Show PFZ zones on map":"📍 Show on map",l=!1)}return i.addEventListener("click",()=>{l?h():C()}),n.appendChild(i),{element:n,openMap:C,focusZone:(b,u,y)=>{l||C(),setTimeout(()=>{if(c){c.flyTo([b,u],11,{duration:.8});const o=v.find(r=>y&&r.zoneName===y||Math.abs(r.lat-b)<.005&&Math.abs(r.lon-u)<.005);o&&o.marker.openPopup()}n.scrollIntoView({behavior:"smooth",block:"nearest"})},150)}}}function Xe(e){let t=[];if(e.pfzData&&e.pfzData.zones&&e.pfzData.zones.length>0)t=["🧭 Is navigation safe in these zones today?","💨 Wind & wave swell forecast for these zones","🎣 Recommended fishing gear & depth"];else if(e.weatherData){const n=e.weatherData.city||"this area";t=[`🎣 Show PFZ zones near ${n}`,"🌊 Ocean swell and wave height",`📊 5-day marine forecast for ${n}`]}else return null;const a=document.createElement("div");return a.className="followup-suggestions",a.innerHTML=`
    <div class="followup-title">⚡ Quick Marine Follow-ups</div>
    <div class="followup-chips">
      ${t.map(n=>`<button class="followup-chip" type="button">${n}</button>`).join("")}
    </div>
  `,a.querySelectorAll(".followup-chip").forEach(n=>{n.addEventListener("click",()=>{_&&_(n.textContent)})}),a}function ie(){A&&requestAnimationFrame(()=>{A.scrollTop=A.scrollHeight})}const z=[],ue=20;let ne=null;function et(e,t){if(!e||!t)return null;const a=Math.PI/180,n=(t.lat-e.lat)*a,s=(t.lon-e.lon)*a,i=Math.sin(n/2)**2+Math.cos(e.lat*a)*Math.cos(t.lat*a)*Math.sin(s/2)**2;return 6371*2*Math.atan2(Math.sqrt(i),Math.sqrt(1-i))}function tt(e,t){var a,n,s;if(!e){ne=null;return}ne={zoneName:e.name,state:e.state,coordinates:e.coordinates,confidence:e.confidence,targetSpecies:e.likely_species,sstCelsius:e.sst_celsius,chlorophyllMgM3:e.chlorophyll_mg_m3,windKnots:e.wind_speed_knots,waveHeightM:((n=(a=e.ocean)==null?void 0:a.wave)==null?void 0:n.significant_height_m)??null,riskStatus:(s=e.risk)==null?void 0:s.label,userLocation:t||null,distanceKm:et(t,e.coordinates),source:"ORCA existing mock PFZ/ocean advisory"}}async function X(e){if(!e.trim())return;const t=G();de("user",e),z.push({role:"user",content:e}),z.length>ue&&z.splice(0,z.length-ue),pe(!0),Ge();try{const a=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e,language:t,mapContext:ne,history:z.slice(0,-1)})});if(ae(),!a.ok){const s=await a.json().catch(()=>({}));a.status===401?U(s.error||"API keys not configured. Check your .env file."):U(s.error||"Something went wrong. Please try again.");return}const n=await a.json();de("assistant",n.reply,{weatherData:n.weatherData,forecastData:n.forecastData,airQualityData:n.airQualityData,pfzData:n.pfzData,coordinates:n.coordinates}),z.push({role:"assistant",content:n.reply}),Me(n.originalReply||n.reply)}catch(a){ae(),a.name==="TypeError"&&a.message.includes("Failed to fetch")?U("Cannot connect to the server. Make sure the backend is running (npm run dev)."):U("An unexpected error occurred. Please try again."),console.error("Chat error:",a)}finally{pe(!1)}}async function ve(){var t,a;const e=document.getElementById("app");if(e){Le(),xe();try{const s=await(await fetch("/api/health")).json();(!((t=s.keys)!=null&&t.groq)||!((a=s.keys)!=null&&a.owm))&&console.warn("Some API keys are missing; map demo remains available.")}catch(n){console.warn("Health check failed — server may not be running:",n.message)}He(e,{onSend:n=>X(n),onSuggestion:n=>X(n),onMapZoneChange:(n,s)=>tt(n,s)}),he()&&ke(n=>{ye(n),X(n)},n=>{Ve(n)}),console.log("🌊 ORCA initialized")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ve):ve();
