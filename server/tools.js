/**
 * Groq function-calling tool definitions.
 * Weather tools + ORCA marine agent tools (PFZ, Ocean).
 */

import { agentTools as pfzTools, agentHandlers as pfzHandlers } from './agents/pfz-agent.js';
import { agentTools as oceanTools, agentHandlers as oceanHandlers } from './agents/ocean-agent.js';
import { agentTools as gisTools, agentHandlers as gisHandlers } from './agents/gis-agent.js';
import { agentTools as safetyTools, agentHandlers as safetyHandlers } from './agents/safety-agent.js';
import { agentTools as marineAlertsTools, agentHandlers as marineAlertsHandlers } from './agents/marine-alerts-agent.js';
import { agentTools as recommendationTools, agentHandlers as recommendationHandlers } from './agents/recommendation-agent.js';
import { orchestratorTools, orchestratorHandlers } from './orchestrator.js';

export const toolDefinitions = [
  {
    type: 'function',
    function: {
      name: 'get_current_weather',
      description: 'Get current weather conditions for a city.',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string', description: 'City name (e.g. Mumbai).' },
          country_code: { type: 'string', description: 'Country code (e.g. IN).' },
        },
        required: ['city'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_forecast',
      description: 'Get 1-5 day weather forecast for a city.',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string', description: 'City name.' },
          country_code: { type: 'string' },
          days: { type: 'number', description: 'Days (1-5).' },
        },
        required: ['city'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_air_quality',
      description: 'Get AQI and pollutant levels for a city.',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string', description: 'City name.' },
          country_code: { type: 'string' },
        },
        required: ['city'],
      },
    },
  },
  // ORCA marine agent tools
  ...pfzTools,
  ...oceanTools,
  ...gisTools,
  ...safetyTools,
  ...marineAlertsTools,
  ...recommendationTools,
  ...orchestratorTools,
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
  Object.assign(toolHandlers, gisHandlers);
  Object.assign(toolHandlers, safetyHandlers);
  Object.assign(toolHandlers, marineAlertsHandlers);
  Object.assign(toolHandlers, recommendationHandlers);
  Object.assign(toolHandlers, orchestratorHandlers);
}
