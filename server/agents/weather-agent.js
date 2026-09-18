/**
 * ORCA — Weather Agent
 * Thin wrapper around the existing WeatherGPT weather.js module.
 * Provides ORCA-compatible agent interface without modifying original code.
 */

import { fetchCurrentWeather, fetchForecast, fetchAirQuality } from '../weather.js';

export const agentName = 'weather';
export const agentDescription = 'Provides real-time weather data, forecasts, and air quality information for any location using OpenWeatherMap.';

/**
 * Tool definitions for the Weather Agent (same as original WeatherGPT tools).
 */
export const agentTools = [
  {
    type: 'function',
    function: {
      name: 'get_current_weather',
      description:
        'Get the current weather conditions for a specific city. Returns temperature, feels-like, humidity, wind speed, weather description, and more.',
      parameters: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description: 'The city name, e.g. "Mumbai", "Kochi", "Chennai"',
          },
          country_code: {
            type: 'string',
            description: 'Optional ISO 3166-1 alpha-2 country code, e.g. "IN" for India.',
          },
        },
        required: ['city'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_forecast',
      description:
        'Get a multi-day weather forecast for a specific city. Returns daily temperature highs/lows, weather conditions, and precipitation probability for up to 5 days.',
      parameters: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description: 'The city name, e.g. "Mangalore", "Visakhapatnam"',
          },
          country_code: {
            type: 'string',
            description: 'Optional ISO 3166-1 alpha-2 country code.',
          },
          days: {
            type: 'number',
            description: 'Number of days for the forecast (1-5). Defaults to 5.',
          },
        },
        required: ['city'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_air_quality',
      description:
        'Get the current Air Quality Index (AQI) and pollutant levels for a specific city.',
      parameters: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description: 'The city name to check air quality for.',
          },
          country_code: {
            type: 'string',
            description: 'Optional ISO 3166-1 alpha-2 country code.',
          },
        },
        required: ['city'],
      },
    },
  },
];

/**
 * Handle tool calls for the Weather Agent.
 */
export const agentHandlers = {
  get_current_weather: async ({ city, country_code }) =>
    fetchCurrentWeather(city, country_code),
  get_forecast: async ({ city, country_code, days }) =>
    fetchForecast(city, country_code, days),
  get_air_quality: async ({ city, country_code }) =>
    fetchAirQuality(city, country_code),
};
