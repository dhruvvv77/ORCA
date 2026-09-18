/**
 * WeatherGPT Express Server
 * Lightweight proxy that hides API keys and orchestrates the LLM tool-calling loop.
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { chat } from './llm.js';
import { registerToolHandlers } from './tools.js';
import { fetchCurrentWeather, fetchForecast, fetchAirQuality } from './weather.js';
import { translateText, SUPPORTED_LANGUAGES } from './translate.js';
import { getMarineMapData } from './marine-map.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Register weather functions as tool handlers
registerToolHandlers({
  get_current_weather: async ({ city, country_code }) =>
    fetchCurrentWeather(city, country_code),
  get_forecast: async ({ city, country_code, days }) =>
    fetchForecast(city, country_code, days),
  get_air_quality: async ({ city, country_code }) =>
    fetchAirQuality(city, country_code),
});

/**
 * Health check — reports API key configuration status.
 */
app.get('/api/health', (req, res) => {
  const groqKey = process.env.GROQ_API_KEY;
  const owmKey = process.env.OWM_API_KEY;

  res.json({
    status: 'ok',
    keys: {
      groq: !!(groqKey && groqKey !== 'your_groq_api_key_here'),
      owm: !!(owmKey && owmKey !== 'your_openweathermap_api_key_here'),
    },
    languages: SUPPORTED_LANGUAGES,
  });
});

/**
 * Dashboard map data composed from existing ORCA mock PFZ/ocean/GIS sources.
 * No external key is required, so the map remains useful in a demo setup.
 */
app.get('/api/marine-map', async (req, res) => {
  try {
    res.json(await getMarineMapData());
  } catch (error) {
    console.error('Marine map data error:', error);
    res.status(500).json({ error: 'Unable to load marine map data.' });
  }
});

/**
 * Main chat endpoint.
 * Receives { message, language, history, mapContext? } and returns { reply, weatherData?, forecastData?, ... }
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'en', history = [], mapContext = null } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`\n💬 User (${language}): ${message}`);

    // Step 1: Translate non-English input to English for the LLM
    let englishMessage = message;
    if (language !== 'en') {
      englishMessage = await translateText(message, language, 'en');
      console.log(`  ↳ Translated to English: ${englishMessage}`);
    }

    // Step 2: Build conversation history (translate if needed)
    const conversationHistory = [];
    for (const msg of history.slice(-10)) {
      // Keep last 10 messages for context
      conversationHistory.push({
        role: msg.role,
        content: msg.content,
      });
    }
    // The dashboard sends the selected PFZ as explicitly labelled, existing mock
    // telemetry. This keeps spatial questions grounded without exposing any keys.
    const mapContextText = mapContext?.zoneName
      ? `\n\n[Selected ORCA marine-map context — use these facts only when relevant: ${JSON.stringify(mapContext)}]`
      : '';
    conversationHistory.push({ role: 'user', content: `${englishMessage}${mapContextText}` });

    // Step 3: Run the LLM with tool-calling
    const result = await chat(conversationHistory);
    console.log(`  ↳ Assistant: ${result.reply?.substring(0, 100)}...`);

    // Step 4: Translate response back to user's language
    let translatedReply = result.reply;
    if (language !== 'en') {
      translatedReply = await translateText(result.reply, 'en', language);
      console.log(`  ↳ Translated to ${language}: ${translatedReply?.substring(0, 80)}...`);
    }

    res.json({
      reply: translatedReply,
      originalReply: language !== 'en' ? result.reply : undefined,
      weatherData: result.weatherData,
      forecastData: result.forecastData,
      airQualityData: result.airQualityData,
      pfzData: result.pfzData,
      oceanData: result.oceanData,
      coordinates: result.coordinates,
    });
  } catch (error) {
    console.error('Chat error:', error);

    const isKeyError =
      error.message.includes('not configured') ||
      error.message.includes('Invalid API Key') ||
      error.message.includes('401');

    res.status(isKeyError ? 401 : 500).json({
      error: isKeyError
        ? 'API keys are not configured. Please add your keys to the .env file.'
        : 'Sorry, something went wrong. Please try again.',
      details: error.message,
    });
  }
});

/**
 * Translation endpoint for frontend use.
 */
app.post('/api/translate', async (req, res) => {
  try {
    const { text, source = 'en', target = 'en' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const translated = await translateText(text, source, target);
    res.json({ translated, source, target });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed', details: error.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`\n⛅ WeatherGPT server running on http://localhost:${PORT}`);

  const groqOk = process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here';
  const owmOk = process.env.OWM_API_KEY && process.env.OWM_API_KEY !== 'your_openweathermap_api_key_here';

  if (!groqOk || !owmOk) {
    console.log('\n⚠️  API keys not configured! Add your keys to the .env file:');
    if (!groqOk) console.log('   - GROQ_API_KEY: Get one free at https://console.groq.com');
    if (!owmOk) console.log('   - OWM_API_KEY: Get one free at https://home.openweathermap.org/api_keys');
  } else {
    console.log('✅ All API keys configured');
  }
});

let retryCount = 0;
const MAX_RETRIES = 3;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    retryCount++;
    if (retryCount > MAX_RETRIES) {
      console.error(`\n❌ Port ${PORT} is still in use after ${MAX_RETRIES} retries. Please kill the other process and try again.`);
      console.error(`   Tip: Run "npx kill-port ${PORT}" or "taskkill /F /PID <PID>"`);
      process.exit(1);
    }
    console.warn(`\n⚠️  Port ${PORT} is in use. Retry ${retryCount}/${MAX_RETRIES} in 1 second...`);
    setTimeout(() => {
      try { server.close(); } catch (_) {}
      server.listen(PORT);
    }, 1000);
  } else {
    throw err;
  }
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});
