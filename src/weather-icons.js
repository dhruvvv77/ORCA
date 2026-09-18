/**
 * WeatherGPT — SVG Weather Icons
 * Inline animated SVG icons for weather conditions.
 * Maps OpenWeatherMap icon codes to custom SVGs.
 */

const icons = {
  // Clear sky - day
  '01d': `<svg viewBox="0 0 64 64" class="weather-svg"><circle cx="32" cy="32" r="12" fill="#fbbf24" class="sun-core"><animate attributeName="r" values="12;13;12" dur="3s" repeatCount="indefinite"/></circle><g stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" class="sun-rays"><line x1="32" y1="6" x2="32" y2="14"><animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="20s" repeatCount="indefinite"/></line><line x1="32" y1="50" x2="32" y2="58"/><line x1="6" y1="32" x2="14" y2="32"/><line x1="50" y1="32" x2="58" y2="32"/><line x1="13.6" y1="13.6" x2="19.3" y2="19.3"/><line x1="44.7" y1="44.7" x2="50.4" y2="50.4"/><line x1="13.6" y1="50.4" x2="19.3" y2="44.7"/><line x1="44.7" y1="19.3" x2="50.4" y2="13.6"/><animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="20s" repeatCount="indefinite"/></g></svg>`,

  // Clear sky - night
  '01n': `<svg viewBox="0 0 64 64" class="weather-svg"><path d="M36 12a20 20 0 1 0 16 32A16 16 0 0 1 36 12z" fill="#e2e8f0" opacity="0.9"><animate attributeName="opacity" values="0.9;1;0.9" dur="4s" repeatCount="indefinite"/></path><circle cx="48" cy="14" r="1" fill="#e2e8f0" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/></circle><circle cx="54" cy="24" r="0.8" fill="#e2e8f0" opacity="0.5"><animate attributeName="opacity" values="0.2;0.7;0.2" dur="3s" repeatCount="indefinite"/></circle></svg>`,

  // Few clouds - day
  '02d': `<svg viewBox="0 0 64 64" class="weather-svg"><circle cx="26" cy="22" r="10" fill="#fbbf24"/><g stroke="#fbbf24" stroke-width="2" stroke-linecap="round"><line x1="26" y1="6" x2="26" y2="10"/><line x1="26" y1="34" x2="26" y2="38"/><line x1="10" y1="22" x2="14" y2="22"/><line x1="38" y1="22" x2="42" y2="22"/></g><path d="M22 44h28a10 10 0 0 0-2-20 14 14 0 0 0-26 8 8 8 0 0 0-2 16z" fill="#cbd5e1" opacity="0.85"><animate attributeName="opacity" values="0.85;0.95;0.85" dur="4s" repeatCount="indefinite"/></path></svg>`,

  // Few clouds - night
  '02n': `<svg viewBox="0 0 64 64" class="weather-svg"><path d="M20 18a10 10 0 0 0 8 16" fill="none" stroke="#e2e8f0" stroke-width="2" opacity="0.6"/><path d="M22 44h28a10 10 0 0 0-2-20 14 14 0 0 0-26 8 8 8 0 0 0-2 16z" fill="#94a3b8" opacity="0.8"/></svg>`,

  // Scattered clouds
  '03d': `<svg viewBox="0 0 64 64" class="weather-svg"><path d="M18 46h32a12 12 0 0 0-4-24 16 16 0 0 0-30 10 10 10 0 0 0 2 18z" fill="#94a3b8" opacity="0.9"><animate attributeName="opacity" values="0.85;0.95;0.85" dur="5s" repeatCount="indefinite"/></path></svg>`,
  '03n': `<svg viewBox="0 0 64 64" class="weather-svg"><path d="M18 46h32a12 12 0 0 0-4-24 16 16 0 0 0-30 10 10 10 0 0 0 2 18z" fill="#64748b" opacity="0.85"/></svg>`,

  // Broken clouds
  '04d': `<svg viewBox="0 0 64 64" class="weather-svg"><path d="M24 38h24a8 8 0 0 0-2-16 12 12 0 0 0-22 6 7 7 0 0 0 0 14z" fill="#64748b" opacity="0.7"/><path d="M14 50h34a11 11 0 0 0-3-22 15 15 0 0 0-28 9 9 9 0 0 0-3 17z" fill="#94a3b8" opacity="0.9"/></svg>`,
  '04n': `<svg viewBox="0 0 64 64" class="weather-svg"><path d="M24 38h24a8 8 0 0 0-2-16 12 12 0 0 0-22 6 7 7 0 0 0 0 14z" fill="#475569" opacity="0.7"/><path d="M14 50h34a11 11 0 0 0-3-22 15 15 0 0 0-28 9 9 9 0 0 0-3 17z" fill="#64748b" opacity="0.85"/></svg>`,

  // Shower rain
  '09d': `<svg viewBox="0 0 64 64" class="weather-svg"><path d="M16 36h32a10 10 0 0 0-2-20 14 14 0 0 0-26 8 8 8 0 0 0-4 16z" fill="#94a3b8" opacity="0.9"/><g stroke="#60a5fa" stroke-width="2" stroke-linecap="round" opacity="0.8"><line x1="22" y1="42" x2="20" y2="52"><animate attributeName="y2" values="48;54;48" dur="1s" repeatCount="indefinite"/></line><line x1="32" y1="42" x2="30" y2="52"><animate attributeName="y2" values="48;54;48" dur="1s" begin="0.2s" repeatCount="indefinite"/></line><line x1="42" y1="42" x2="40" y2="52"><animate attributeName="y2" values="48;54;48" dur="1s" begin="0.4s" repeatCount="indefinite"/></line></g></svg>`,
  '09n': `<svg viewBox="0 0 64 64" class="weather-svg"><path d="M16 36h32a10 10 0 0 0-2-20 14 14 0 0 0-26 8 8 8 0 0 0-4 16z" fill="#64748b" opacity="0.85"/><g stroke="#60a5fa" stroke-width="2" stroke-linecap="round" opacity="0.7"><line x1="22" y1="42" x2="20" y2="52"><animate attributeName="y2" values="48;54;48" dur="1s" repeatCount="indefinite"/></line><line x1="32" y1="42" x2="30" y2="52"><animate attributeName="y2" values="48;54;48" dur="1s" begin="0.2s" repeatCount="indefinite"/></line><line x1="42" y1="42" x2="40" y2="52"><animate attributeName="y2" values="48;54;48" dur="1s" begin="0.4s" repeatCount="indefinite"/></line></g></svg>`,

  // Rain
  '10d': `<svg viewBox="0 0 64 64" class="weather-svg"><circle cx="24" cy="18" r="8" fill="#fbbf24" opacity="0.7"/><path d="M16 38h32a10 10 0 0 0-2-20 14 14 0 0 0-26 8 8 8 0 0 0-4 16z" fill="#94a3b8" opacity="0.9"/><g stroke="#60a5fa" stroke-width="2" stroke-linecap="round" opacity="0.8"><line x1="24" y1="44" x2="22" y2="54"><animate attributeName="y2" values="50;56;50" dur="0.8s" repeatCount="indefinite"/></line><line x1="34" y1="44" x2="32" y2="54"><animate attributeName="y2" values="50;56;50" dur="0.8s" begin="0.3s" repeatCount="indefinite"/></line></g></svg>`,
  '10n': `<svg viewBox="0 0 64 64" class="weather-svg"><path d="M16 38h32a10 10 0 0 0-2-20 14 14 0 0 0-26 8 8 8 0 0 0-4 16z" fill="#64748b" opacity="0.85"/><g stroke="#60a5fa" stroke-width="2" stroke-linecap="round" opacity="0.7"><line x1="24" y1="44" x2="22" y2="54"><animate attributeName="y2" values="50;56;50" dur="0.8s" repeatCount="indefinite"/></line><line x1="34" y1="44" x2="32" y2="54"><animate attributeName="y2" values="50;56;50" dur="0.8s" begin="0.3s" repeatCount="indefinite"/></line></g></svg>`,

  // Thunderstorm
  '11d': `<svg viewBox="0 0 64 64" class="weather-svg"><path d="M14 34h36a11 11 0 0 0-3-22 15 15 0 0 0-28 9 9 9 0 0 0-5 17z" fill="#64748b" opacity="0.9"/><polygon points="30,36 26,48 32,48 28,58 38,44 32,44 36,36" fill="#fbbf24"><animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/></polygon></svg>`,
  '11n': `<svg viewBox="0 0 64 64" class="weather-svg"><path d="M14 34h36a11 11 0 0 0-3-22 15 15 0 0 0-28 9 9 9 0 0 0-5 17z" fill="#475569" opacity="0.85"/><polygon points="30,36 26,48 32,48 28,58 38,44 32,44 36,36" fill="#fbbf24"><animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/></polygon></svg>`,

  // Snow
  '13d': `<svg viewBox="0 0 64 64" class="weather-svg"><path d="M16 36h32a10 10 0 0 0-2-20 14 14 0 0 0-26 8 8 8 0 0 0-4 16z" fill="#94a3b8" opacity="0.9"/><g fill="#e2e8f0" opacity="0.9"><circle cx="22" cy="46" r="2"><animate attributeName="cy" values="42;54;42" dur="2s" repeatCount="indefinite"/></circle><circle cx="32" cy="48" r="2"><animate attributeName="cy" values="44;56;44" dur="2s" begin="0.5s" repeatCount="indefinite"/></circle><circle cx="42" cy="46" r="2"><animate attributeName="cy" values="42;54;42" dur="2s" begin="1s" repeatCount="indefinite"/></circle></g></svg>`,
  '13n': `<svg viewBox="0 0 64 64" class="weather-svg"><path d="M16 36h32a10 10 0 0 0-2-20 14 14 0 0 0-26 8 8 8 0 0 0-4 16z" fill="#64748b" opacity="0.85"/><g fill="#cbd5e1" opacity="0.8"><circle cx="22" cy="46" r="2"><animate attributeName="cy" values="42;54;42" dur="2s" repeatCount="indefinite"/></circle><circle cx="32" cy="48" r="2"><animate attributeName="cy" values="44;56;44" dur="2s" begin="0.5s" repeatCount="indefinite"/></circle><circle cx="42" cy="46" r="2"><animate attributeName="cy" values="42;54;42" dur="2s" begin="1s" repeatCount="indefinite"/></circle></g></svg>`,

  // Mist/Fog
  '50d': `<svg viewBox="0 0 64 64" class="weather-svg"><g stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" opacity="0.7"><line x1="12" y1="24" x2="52" y2="24"><animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite"/></line><line x1="16" y1="32" x2="48" y2="32"><animate attributeName="opacity" values="0.7;0.4;0.7" dur="3s" begin="0.5s" repeatCount="indefinite"/></line><line x1="12" y1="40" x2="52" y2="40"><animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" begin="1s" repeatCount="indefinite"/></line><line x1="18" y1="48" x2="46" y2="48"><animate attributeName="opacity" values="0.6;0.3;0.6" dur="3s" begin="1.5s" repeatCount="indefinite"/></line></g></svg>`,
  '50n': `<svg viewBox="0 0 64 64" class="weather-svg"><g stroke="#64748b" stroke-width="2.5" stroke-linecap="round" opacity="0.6"><line x1="12" y1="24" x2="52" y2="24"><animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" repeatCount="indefinite"/></line><line x1="16" y1="32" x2="48" y2="32"><animate attributeName="opacity" values="0.6;0.3;0.6" dur="3s" begin="0.5s" repeatCount="indefinite"/></line><line x1="12" y1="40" x2="52" y2="40"><animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" begin="1s" repeatCount="indefinite"/></line><line x1="18" y1="48" x2="46" y2="48"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="3s" begin="1.5s" repeatCount="indefinite"/></line></g></svg>`,
};

// Emoji fallback mapping
const emojiMap = {
  '01d': '☀️', '01n': '🌙',
  '02d': '⛅', '02n': '☁️',
  '03d': '☁️', '03n': '☁️',
  '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

/**
 * Get SVG icon HTML for an OWM icon code.
 */
export function getWeatherIcon(iconCode, size = 48) {
  const svg = icons[iconCode] || icons['03d'];
  return `<div class="weather-icon-wrapper" style="width:${size}px;height:${size}px">${svg}</div>`;
}

/**
 * Get emoji for an OWM icon code (fallback for small inline use).
 */
export function getWeatherEmoji(iconCode) {
  return emojiMap[iconCode] || '🌡️';
}

export default { getWeatherIcon, getWeatherEmoji };
