/**
 * OpenWeatherMap API wrapper functions.
 * Uses the free Classic API tier (/data/2.5/).
 */

const OWM_BASE = 'https://api.openweathermap.org/data/2.5';

function getApiKey() {
  const key = process.env.OWM_API_KEY;
  if (!key || key === 'your_openweathermap_api_key_here') {
    throw new Error('OWM_API_KEY not configured');
  }
  return key;
}

/**
 * Fetch current weather for a city.
 * Returns a structured object with key weather data.
 */
export async function fetchCurrentWeather(city, countryCode) {
  const apiKey = getApiKey();
  const q = countryCode ? `${city},${countryCode}` : city;
  const url = `${OWM_BASE}/weather?q=${encodeURIComponent(q)}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `OpenWeatherMap error: ${res.status}`);
  }

  const data = await res.json();

  return {
    city: data.name,
    country: data.sys?.country,
    coordinates: { lat: data.coord?.lat, lon: data.coord?.lon },
    temperature: {
      current: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      min: Math.round(data.main.temp_min),
      max: Math.round(data.main.temp_max),
      unit: '°C',
    },
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    wind: {
      speed: data.wind?.speed,
      direction: data.wind?.deg,
      unit: 'm/s',
    },
    visibility: data.visibility ? data.visibility / 1000 : null, // km
    clouds: data.clouds?.all,
    weather: {
      main: data.weather?.[0]?.main,
      description: data.weather?.[0]?.description,
      icon: data.weather?.[0]?.icon,
    },
    sunrise: data.sys?.sunrise
      ? new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      : null,
    sunset: data.sys?.sunset
      ? new Date(data.sys.sunset * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      : null,
    timestamp: new Date(data.dt * 1000).toISOString(),
  };
}

/**
 * Fetch 5-day/3-hour forecast, condensed to daily summaries.
 */
export async function fetchForecast(city, countryCode, days = 5) {
  const apiKey = getApiKey();
  const q = countryCode ? `${city},${countryCode}` : city;
  const url = `${OWM_BASE}/forecast?q=${encodeURIComponent(q)}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `OpenWeatherMap forecast error: ${res.status}`);
  }

  const data = await res.json();

  // Group 3-hour intervals by date
  const dailyMap = {};
  for (const entry of data.list) {
    const date = entry.dt_txt.split(' ')[0];
    if (!dailyMap[date]) {
      dailyMap[date] = {
        date,
        temps: [],
        humidity: [],
        descriptions: [],
        icons: [],
        wind_speeds: [],
        pop: [], // probability of precipitation
      };
    }
    const day = dailyMap[date];
    day.temps.push(entry.main.temp);
    day.humidity.push(entry.main.humidity);
    day.descriptions.push(entry.weather[0]?.description);
    day.icons.push(entry.weather[0]?.icon);
    day.wind_speeds.push(entry.wind?.speed || 0);
    day.pop.push(entry.pop || 0);
  }

  // Condense each day
  const dailyForecast = Object.values(dailyMap)
    .slice(0, days)
    .map((day) => {
      // Find the most common weather description
      const descCounts = {};
      day.descriptions.forEach((d) => {
        descCounts[d] = (descCounts[d] || 0) + 1;
      });
      const mainDescription = Object.entries(descCounts).sort((a, b) => b[1] - a[1])[0][0];

      // Find the most common icon
      const iconCounts = {};
      day.icons.forEach((i) => {
        iconCounts[i] = (iconCounts[i] || 0) + 1;
      });
      const mainIcon = Object.entries(iconCounts).sort((a, b) => b[1] - a[1])[0][0];

      return {
        date: day.date,
        day_name: new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
        temperature: {
          high: Math.round(Math.max(...day.temps)),
          low: Math.round(Math.min(...day.temps)),
          unit: '°C',
        },
        humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
        wind_speed: +(day.wind_speeds.reduce((a, b) => a + b, 0) / day.wind_speeds.length).toFixed(1),
        precipitation_chance: Math.round(Math.max(...day.pop) * 100),
        weather: {
          description: mainDescription,
          icon: mainIcon,
        },
      };
    });

  return {
    city: data.city?.name,
    country: data.city?.country,
    coordinates: { lat: data.city?.coord?.lat, lon: data.city?.coord?.lon },
    forecast: dailyForecast,
  };
}

/**
 * Fetch air quality data for a city.
 * First geocodes the city, then calls the air pollution endpoint.
 */
export async function fetchAirQuality(city, countryCode) {
  const apiKey = getApiKey();

  // First, get coordinates via current weather (simplest geocoding)
  const q = countryCode ? `${city},${countryCode}` : city;
  const geoUrl = `${OWM_BASE}/weather?q=${encodeURIComponent(q)}&appid=${apiKey}`;
  const geoRes = await fetch(geoUrl);
  if (!geoRes.ok) {
    throw new Error(`Could not find location: ${city}`);
  }
  const geoData = await geoRes.json();
  const { lat, lon } = geoData.coord;

  // Now fetch air quality
  const aqUrl = `${OWM_BASE}/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const aqRes = await fetch(aqUrl);
  if (!aqRes.ok) {
    throw new Error(`Air quality data unavailable for ${city}`);
  }
  const aqData = await aqRes.json();
  const item = aqData.list?.[0];

  const aqiLabels = {
    1: 'Good',
    2: 'Fair',
    3: 'Moderate',
    4: 'Poor',
    5: 'Very Poor',
  };

  return {
    city: geoData.name,
    country: geoData.sys?.country,
    coordinates: { lat, lon },
    aqi: {
      index: item?.main?.aqi,
      label: aqiLabels[item?.main?.aqi] || 'Unknown',
    },
    pollutants: {
      pm2_5: item?.components?.pm2_5,
      pm10: item?.components?.pm10,
      no2: item?.components?.no2,
      o3: item?.components?.o3,
      co: item?.components?.co,
      so2: item?.components?.so2,
      unit: 'μg/m³',
    },
    timestamp: item?.dt ? new Date(item.dt * 1000).toISOString() : null,
  };
}
