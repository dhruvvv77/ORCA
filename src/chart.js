/**
 * WeatherGPT — Chart.js Forecast Visualization
 * Renders temperature forecast line charts styled for dark theme.
 */

/**
 * Render a forecast chart inside a container element.
 * @param {HTMLElement} container - DOM element to render the chart in
 * @param {object} forecastData - Forecast data from the API
 * @returns {Chart} The Chart.js instance
 */
export function renderForecastChart(container, forecastData) {
  if (!forecastData?.forecast || !window.Chart) return null;

  const forecast = forecastData.forecast;

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.classList.add('forecast-chart-canvas');
  container.appendChild(canvas);

  const labels = forecast.map((d) => d.day_name);
  const highs = forecast.map((d) => d.temperature.high);
  const lows = forecast.map((d) => d.temperature.low);

  const ctx = canvas.getContext('2d');

  // Gradient for high temps
  const highGradient = ctx.createLinearGradient(0, 0, 0, 200);
  highGradient.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
  highGradient.addColorStop(1, 'rgba(245, 158, 11, 0.02)');

  // Gradient for low temps
  const lowGradient = ctx.createLinearGradient(0, 0, 0, 200);
  lowGradient.addColorStop(0, 'rgba(96, 165, 250, 0.2)');
  lowGradient.addColorStop(1, 'rgba(96, 165, 250, 0.02)');

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'High',
          data: highs,
          borderColor: '#f59e0b',
          backgroundColor: highGradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#f59e0b',
          pointBorderColor: '#1a2035',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'Low',
          data: lows,
          borderColor: '#60a5fa',
          backgroundColor: lowGradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#60a5fa',
          pointBorderColor: '#1a2035',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            color: '#94a3b8',
            font: { family: "'Inter', sans-serif", size: 11 },
            boxWidth: 12,
            boxHeight: 2,
            useBorderRadius: true,
            borderRadius: 1,
            padding: 12,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleColor: '#f1f5f9',
          bodyColor: '#94a3b8',
          borderColor: 'rgba(255, 255, 255, 0.06)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 10,
          titleFont: { family: "'Inter', sans-serif", weight: '600' },
          bodyFont: { family: "'Inter', sans-serif" },
          callbacks: {
            label: (context) => `${context.dataset.label}: ${context.parsed.y}°C`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: '#64748b',
            font: { family: "'Inter', sans-serif", size: 11, weight: '500' },
          },
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.04)',
            drawTicks: false,
          },
          border: { display: false },
          ticks: {
            color: '#64748b',
            font: { family: "'Inter', sans-serif", size: 11 },
            padding: 8,
            callback: (val) => `${val}°`,
          },
        },
      },
    },
  });

  return chart;
}
