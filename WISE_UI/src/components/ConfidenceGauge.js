import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';

// Define theme colors potentially needed for the gauge (MATCHING FINAL THEME from tailwind.config.js)
const THEME_COLORS = {
  primary: 'oklch(45% 0.24 277.023)', // Using the selected primary color
  success: 'oklch(64.8% 0.15 160)',
  warning: 'oklch(84.71% 0.199 83.87)',
  error: 'oklch(71.76% 0.221 22.18)',
  baseContent: 'oklch(16.961% 0.001 17.32)',
  base300: 'oklch(79.938% 0.001 17.197)',
};

const ConfidenceGauge = ({ score, note }) => {
  // Default score to 0 if null/undefined
  const normalizedScore = score != null ? score : 0;

  // Gradient stops based on score thresholds and theme colors
  const gradientStops = [
    { offset: 0, color: THEME_COLORS.error },     // 0% score = error color
    { offset: 65, color: THEME_COLORS.warning },   // 65% score = warning color
    { offset: 85, color: THEME_COLORS.success },   // 85% score = success color
  ];

  const options = {
    chart: {
      type: 'radialBar',
      offsetY: -50, // Adjust vertical position if needed
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: THEME_COLORS.base300, // Use light grey from theme for track
          strokeWidth: '97%',
          margin: 5, // Margin between track and bar
        },
        dataLabels: {
          name: {
            show: false // Hide the default series name
          },
          value: {
            offsetY: -2, // Adjust vertical position of the value label
            fontSize: '22px',
            color: THEME_COLORS.baseContent, // Use theme text color
            // Add formatter to append '%'
            formatter: function (val) {
              return val + "%";
            }
          }
        }
      }
    },
    grid: {
      padding: {
        top: -10
      }
    },
    fill: {
      // Apply gradient instead of solid color
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: "horizontal", // Or 'vertical', 'diagonal'
        shadeIntensity: 0.5,
        gradientToColors: undefined, // Let ApexCharts handle the transition based on stops
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: gradientStops.map(s => s.offset), // Pass offsets [0, 65, 85]
        colorStops: gradientStops.map(s => ({ offset: s.offset, color: s.color, opacity: 1 })) // Pass full color stops
      },
    },
    labels: ['Confidence'], // This label isn't shown due to sparkline/name:false
    series: [normalizedScore], // The score value
    stroke: {
      lineCap: "round", // Optional: makes the bar ends rounded
    },
  };

  return (
    <div className="text-center w-full h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-2 text-base-content">Confidence Score</h3>
      <div id="confidence-gauge-chart" className="flex-grow">
        <Chart options={options} series={options.series} type="radialBar" height="100%" />
      </div>
      {/* Display the justification note if provided */}
      {note && (
        <p className="text-sm text-base-content opacity-80 mt-2 px-4">
          {note}
        </p>
      )}
    </div>
  );
};

ConfidenceGauge.propTypes = {
  score: PropTypes.number, // Score can be null initially
  note: PropTypes.string, // Added prop type for the note
};

export default ConfidenceGauge; 