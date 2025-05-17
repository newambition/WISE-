import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import ConfidenceGauge from './ConfidenceGauge';
import ConfidenceDetailModal from './ConfidenceDetailModal';
import OverviewModal from './OverviewModal';
import { chartColors, intentColorMap } from '../theme/themeConfig';

// Custom label renderer for vertical bar chart segments
const renderCustomizedLabel = (props) => {
  const { x, y, width, height, value } = props;
  if (value > 0 && width > 15) { // Only render if value > 0 and bar is wide enough
    return (
      <text x={x + width / 2} y={y + height / 2} fill={chartColors.baseContent} textAnchor="middle" dy={4} fontSize={10}>
        {value}
      </text>
    );
  }
  return null;
};

// Custom formatter for Legend text color
const renderLegendText = (value, entry) => {
  return <span style={{ color: chartColors.baseContent }}>{value}</span>;
};

const OverviewTabContent = ({ analysisData }) => {
  // State for confidence modal
  const [isConfidenceModalOpen, setIsConfidenceModalOpen] = useState(false);
  // State for tactic detail modal
  const [selectedTactic, setSelectedTactic] = useState(null);

  // Return null or a placeholder if analysisData is not available or doesn't have expected properties
  if (!analysisData || !analysisData.tactics || !analysisData.metadata || !analysisData.intentBreakdown || !analysisData.manipulationByCategory) {
    // Use theme text color for placeholder
    return <div className="p-6 text-base-content opacity-75">Overview data is loading or incomplete...</div>;
  }

  const totalTactics = analysisData.tactics.length; // Calculate total tactics for percentage calculation

  // Handler for opening the modal
  const handleGaugeClick = () => {
    console.log("Confidence Gauge clicked!"); // Log click
    setIsConfidenceModalOpen(true);
  };

  // Log justification data before rendering modal const justificationNote = analysisData.overall_assessment?.confidence_score_note;
  const modalJustification = analysisData.detailed_report_sections?.confidence_levels_discussion;

  if (isConfidenceModalOpen) {
      console.log("Attempting to render modal. Justification:", modalJustification);
  }

  return (
    <>
      <div className="space-y-12">
        {/* Manipulation Intent Card - Use theme bg/border */}
        <div className="bg-base-200 border border-base-300 rounded-lg shadow-lg mx-16 mb-8 mt-12 p-6">
          {/* Use theme text color */}
          <h2 className="text-xl font-semibold mb-4 text-base-content">Manipulation Intent</h2>
          {/* Use theme text color, error color for highlights */}
          <p className="text-base-content opacity-90 mb-6">
            This analysis detected <span className="text-error font-bold">{totalTactics}</span> instances of persuasive tactics,
            with <span className="text-error font-bold">{analysisData.metadata.confidenceScore}%</span> confidence of manipulation intent.
          </p>

          {/* Manipulation Intent Bar - Use theme base-100 for container */}
          <div className="h-12 bg-base-100 rounded-lg overflow-hidden flex mb-2">
            {analysisData.intentBreakdown.map((item, i) => {
              const color = intentColorMap[item.name] || intentColorMap.default;
              return item.value > 0 && (
                <div
                  key={i}
                  style={{
                    backgroundColor: color,
                    width: totalTactics > 0 ? `${(item.value / totalTactics) * 100}%` : '0%',
                  }}
                  className="flex items-center pl-2"
                  title={`${item.name}: ${item.value}`}
                >
                  {/* Keep dark text for contrast on colored bars */}
                  <span className="text-base-content font-bold">{item.value}</span>
                </div>
              );
            })}
          </div>

          {/* Legend - Use theme text color */}
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {analysisData.intentBreakdown.map((item, i) => {
              const color = intentColorMap[item.name] || intentColorMap.default;
              return item.value > 0 && (
                <div key={i} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded mr-2"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-base-content opacity-90">{item.name}</span>
                </div>
              );
            })}
          </div>

          {analysisData.metadata.overallIntent && ( 
              // Use theme base-200 (same as card) for inner box
              <div className="mt-6 bg-base-200 p-4 rounded-lg">
              <p className="text-base-content opacity-90">
                  <span className="font-semibold">What this means:</span> The overall intent detected is '{analysisData.metadata.overallIntent}'. This suggests the content may strategically use persuasive techniques. Evaluate carefully.
              </p>
              </div>
          )}
        </div>

        {/* New two-column layout for charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mx-16">
          
          {/* Tactics by Category Chart (Left Column) - Rotated */}
          <div className="bg-base-200 border border-base-300 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-base-content text-center">Tactics by Category</h2>
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={analysisData.manipulationByCategory}
                  layout="horizontal" // Changed layout to horizontal
                  margin={{ top: 5, right: 10, left: -25, bottom: 5 }} // Adjusted margins
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.base300} />
                  {/* XAxis is now Category */}
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: chartColors.baseContent, fontSize: 10, opacity: 0.8 }}
                    interval={0} // Ensure all labels show
                  /> 
                  {/* YAxis is now Number */}
                  <YAxis 
                    type="number" 
                    allowDecimals={false} 
                    tick={{ fill: chartColors.baseContent, fontSize: 10, opacity: 0.8 }}
                  /> 
                  <Tooltip formatter={(value, name) => [value, name === 'blatant' ? 'Blatant' : 'Borderline']} /> 
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    formatter={renderLegendText} 
                  /> 
                  <Bar dataKey="blatant" name="Blatant" fill={chartColors.blatant} stackId="a">
                    {/* Add LabelList for segment counts */}
                    <LabelList dataKey="blatant" position="center" content={renderCustomizedLabel} />
                  </Bar>
                  <Bar dataKey="borderline" name="Borderline" fill={chartColors.borderline} stackId="a">
                    <LabelList dataKey="borderline" position="center" content={renderCustomizedLabel} />
                  </Bar>
                  <Bar dataKey="legitimate" name="Legitimate" fill={chartColors.legitimate} stackId="a">
                    <LabelList dataKey="legitimate" position="center" content={renderCustomizedLabel} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Confidence Score Gauge (Right Column) - Made clickable */}
          <div 
            className="bg-base-200 border border-base-300 rounded-lg shadow-lg p-6 flex flex-col justify-center items-center cursor-pointer"
            onClick={handleGaugeClick}
            title="Click to view full justification"
          >
            <ConfidenceGauge 
              score={analysisData.metadata?.confidenceScore} 
              note={analysisData.overall_assessment?.confidence_score_note}
            />
          </div>

        </div>
      </div>
      <br />

      {/* Tactic Cards Section - improved layout */}
      <div className="mx-16 mt-16 mb-12">
        <h2 className="text-2xl font-bold mb-12 text-black text-center">Detected Tactics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {analysisData.tactics.map(tactic => {
            // Pill color logic
            let pillBg = 'bg-neutral text-neutral-content';
            if (tactic.intent === 'Blatant Manipulation') pillBg = 'bg-error text-error-content';
            else if (tactic.intent === 'Borderline Manipulation') pillBg = 'bg-warning text-warning-content';
            else if (tactic.intent === 'Legitimate Use') pillBg = 'bg-success text-success-content';
            return (
              <div
                key={tactic.id}
                className="group bg-base-200 p-6 rounded-lg shadow-lg border-base-300 border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-info/20 relative cursor-pointer"
                onClick={() => setSelectedTactic(tactic)}
                tabIndex={0}
                onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && setSelectedTactic(tactic)}
              >
                {/* Pill label - styled, no animation */}
                <span className={`absolute top-4 right-4 inline-block ${pillBg} px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm`}>
                  {tactic.intent || 'Unknown'}
                </span>
                {/* Icon/Title/Subtitle Block */}
                <div className="flex items-start mb-4">
                  {/* Optionally add an icon here if desired */}
                  <div>
                    <p className="text-2xl font-bold text-black mb-1">{tactic.name || 'Unnamed Tactic'}</p>
                    <p className="text-md font-semibold text-black/70 pb-2">{tactic.category || 'Uncategorized'}</p>
                  </div>
                </div>
                {/* Quote */}
                {tactic.quote && (
                  <p className="text-black/80 pb-4 mb-3 italic text-lg">
                    "{tactic.quote}"
                  </p>
                )}
                {/* Defense Strategy */}
                {tactic.resistanceStrategy && (
                  <div className="bg-info/5 border-l-4 border-info/40 p-5 rounded-lg mt-4 transition-all duration-300 group-hover:border-info/60 group-hover:bg-info/10">
                    <p className="font-semibold text-left text-info/80 mb-1 text-md">YOUR DEFENSE</p>
                    <p className="text-left text-black/90 text-md">{tactic.resistanceStrategy}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tactic Detail Modal */}
      <OverviewModal 
        tactic={selectedTactic} 
        onClose={() => setSelectedTactic(null)} 
      />

      {/* Render the Confidence Detail Modal */}
      {isConfidenceModalOpen && (
          <ConfidenceDetailModal 
            isOpen={isConfidenceModalOpen}
            onClose={() => setIsConfidenceModalOpen(false)}
            justification={modalJustification}
          />
      )}
    </>
  );
};

OverviewTabContent.propTypes = {
  analysisData: PropTypes.shape({
    metadata: PropTypes.shape({
      confidenceScore: PropTypes.number,
      overallIntent: PropTypes.string,
    }),
    tactics: PropTypes.array, // Check if it's an array
    intentBreakdown: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })),
    manipulationByCategory: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      blatant: PropTypes.number,
      borderline: PropTypes.number,
    })),
  }), // Make analysisData optional or required based on parent logic
};

export default OverviewTabContent; 