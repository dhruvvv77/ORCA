/**
 * Groq function-calling tool definitions.
 * Weather tools + ORCA marine agent tools (PFZ, Ocean).
 */

import { agentTools as pfzTools, agentHandlers as pfzHandlers } from './agents/pfz-agent.js';
import { agentTools as oceanTools, agentHandlers as oceanHandlers } from './agents/ocean-agent.js';

export const toolDefinitions = [
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
            description:
              'The city name, e.g. "Mumbai", "New Delhi", "London"',
          },
          country_code: {
            type: 'string',
            description:
              'Optional ISO 3166-1 alpha-2 country code, e.g. "IN" for India, "US" for USA. Helps disambiguate city names.',
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
            description: 'The city name, e.g. "Bangalore", "Chennai"',
          },
          country_code: {
            type: 'string',
            description:
              'Optional ISO 3166-1 alpha-2 country code, e.g. "IN"',
          },
          days: {
            type: 'number',
            description:
              'Number of days for the forecast (1-5). Defaults to 5.',
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
        'Get the current Air Quality Index (AQI) and pollutant levels for a specific city. Returns AQI category, PM2.5, PM10, NO2, O3, and other pollutant concentrations.',
      parameters: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description: 'The city name to check air quality for.',
          },
          country_code: {
            type: 'string',
            description:
              'Optional ISO 3166-1 alpha-2 country code, e.g. "IN"',
          },
        },
        required: ['city'],
      },
    },
  },
  // ORCA marine agent tools
  ...pfzTools,
  ...oceanTools,
];

/**
 * Map of tool function names to their handler functions.
 * Populated at server startup by registerToolHandlers().
 */
export const toolHandlers = {};

/**
 * Register the actual handler functions for each tool.
 * Also registers ORCA agent handlers.
 * Called from index.js after weather.js is imported.
 */
export function registerToolHandlers(handlers) {
  Object.assign(toolHandlers, handlers);
  // Register ORCA marine agent handlers
  Object.assign(toolHandlers, pfzHandlers);
  Object.assign(toolHandlers, oceanHandlers);
}
