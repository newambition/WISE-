import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import ConfidenceGauge from './ConfidenceGauge';
import ConfidenceDetailModal from './ConfidenceDetailModal';
import OverviewModal from './OverviewModal'; // Assuming this is for tactic details
import { chartColors, intentColorMap } from '../theme/themeConfig';

// Custom label renderer for vertical bar chart segments
const renderCustomizedLabel = (props) => {
  const { x, y, width, height, value } = props;
  if (value > 0 && width > 15) {
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
  // Log received data immediately using JSON.stringify for a snapshot if complex
  console.log('[OverviewTabContent] Received analysisData prop:', analysisData ? JSON.parse(JSON.stringify(analysisData)) : analysisData);

  const [isConfidenceModalOpen, setIsConfidenceModalOpen] = useState(false);
  const [selectedTactic, setSelectedTactic] = useState(null);

  // Enhanced Guard Clause with individual logging
  if (!analysisData) {
    console.error('[OverviewTabContent] Guard Clause Failed: analysisData is null or undefined.');
    return <div className="p-6 text-base-content opacity-75">Overview data is not available.</div>;
  }
  if (!analysisData.tactics || !Array.isArray(analysisData.tactics)) { // Also check if array
    console.error('[OverviewTabContent] Guard Clause Failed: analysisData.tactics is missing or not an array. Value:', analysisData.tactics);
    return <div className="p-6 text-base-content opacity-75">Tactics data is loading, incomplete, or invalid...</div>;
  }
  if (!analysisData.metadata || typeof analysisData.metadata !== 'object') {
    console.error('[OverviewTabContent] Guard Clause Failed: analysisData.metadata is missing or not an object. Value:', analysisData.metadata);
    return <div className="p-6 text-base-content opacity-75">Metadata is loading, incomplete, or invalid...</div>;
  }
  if (!analysisData.intentBreakdown || !Array.isArray(analysisData.intentBreakdown)) {
    console.error('[OverviewTabContent] Guard Clause Failed: analysisData.intentBreakdown is missing or not an array. Value:', analysisData.intentBreakdown);
    return <div className="p-6 text-base-content opacity-75">Intent breakdown is loading, incomplete, or invalid...</div>;
  }
  if (!analysisData.manipulationByCategory || !Array.isArray(analysisData.manipulationByCategory)) {
    console.error('[OverviewTabContent] Guard Clause Failed: analysisData.manipulationByCategory is missing or not an array. Value:', analysisData.manipulationByCategory);
    return <div className="p-6 text-base-content opacity-75">Manipulation by category data is loading, incomplete, or invalid...</div>;
  }
  // Add checks for other potentially critical top-level keys if they cause issues downstream
  if (!analysisData.overall_assessment) {
     console.warn('[OverviewTabContent] Optional data missing: analysisData.overall_assessment. Value:', analysisData.overall_assessment);
     // Decide if this is critical enough to stop rendering
  }
   if (!analysisData.detailed_report_sections) {
     console.warn('[OverviewTabContent] Optional data missing: analysisData.detailed_report_sections. Value:', analysisData.detailed_report_sections);
     // Decide if this is critical enough to stop rendering
  }


  console.log('[OverviewTabContent] Guard clause passed. Rendering main content.');

  const totalTactics = analysisData.tactics.length;
  console.log('[OverviewTabContent] Total tactics for display:', totalTactics);
  console.log('[OverviewTabContent] Metadata for display:', analysisData.metadata);
  console.log('[OverviewTabContent] Intent breakdown for display:', analysisData.intentBreakdown);
  console.log('[OverviewTabContent] Manipulation by category for chart:', analysisData.manipulationByCategory);
  console.log('[OverviewTabContent] Overall assessment for gauge:', analysisData.overall_assessment);
  console.log('[OverviewTabContent] Detailed report sections for modal:', analysisData.detailed_report_sections);


  const handleGaugeClick = () => {
    console.log("[OverviewTabContent] Confidence Gauge clicked!");
    setIsConfidenceModalOpen(true);
  };

  const modalJustification = analysisData.detailed_report_sections?.confidence_levels_discussion;

  if (isConfidenceModalOpen) {
    console.log("[OverviewTabContent] Attempting to render ConfidenceDetailModal. Justification:", modalJustification);
  }
  
  // Check if any item in manipulationByCategory has a 'legitimate' property with a value > 0
  // This check itself is not strictly necessary if we just remove the bar, but good for logging.
  const hasActualLegitimateDataInChart = analysisData.manipulationByCategory.some(item => item.legitimate && item.legitimate > 0);
  console.log('[OverviewTabContent] Chart data has actual legitimate values > 0:', hasActualLegitimateDataInChart);


  return (
    <>
      <div className="space-y-12">
        {/* Manipulation Intent Card */}
        <div className="bg-base-200 border border-base-300 rounded-lg shadow-lg mx-16 mb-8 mt-12 p-6">
          <h2 className="text-xl font-semibold mb-4 text-base-content">Manipulation Intent</h2>
          <p className="text-base-content opacity-90 mb-6">
            This analysis detected <span className="text-error font-bold">{totalTactics}</span> instances of persuasive tactics,
            with <span className="text-error font-bold">{analysisData.metadata?.confidenceScore || 'N/A'}%</span> confidence of manipulation intent.
          </p>

          <div className="h-12 bg-base-100 rounded-lg overflow-hidden flex mb-2">
            {analysisData.intentBreakdown.map((item, i) => {
              const color = intentColorMap[item.name] || intentColorMap.default;
              return item.value > 0 && (
                <div
                  key={i} // Using index as key is okay if list is static and items don't have stable IDs
                  style={{
                    backgroundColor: color,
                    width: totalTactics > 0 ? `${(item.value / totalTactics) * 100}%` : '0%',
                  }}
                  className="flex items-center pl-2"
                  title={`${item.name}: ${item.value}`}
                >
                  <span className="text-base-content font-bold">{item.value}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {analysisData.intentBreakdown.map((item, i) => {
              const color = intentColorMap[item.name] || intentColorMap.default;
              return item.value > 0 && (
                <div key={i} className="flex items-center"> {/* Again, index as key */}
                  <div
                    className="w-3 h-3 rounded mr-2"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-base-content opacity-90">{item.name}</span>
                </div>
              );
            })}
          </div>

          {analysisData.metadata?.overallIntent && ( 
              <div className="mt-6 bg-base-200 p-4 rounded-lg">
              <p className="text-base-content opacity-90">
                  <span className="font-semibold">What this means:</span> The overall intent detected is '{analysisData.metadata.overallIntent}'. This suggests the content may strategically use persuasive techniques. Evaluate carefully.
              </p>
              </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mx-16">
          <div className="bg-base-200 border border-base-300 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-base-content text-center">Tactics by Category</h2>
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={analysisData.manipulationByCategory}
                  layout="horizontal"
                  margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.base300} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: chartColors.baseContent, fontSize: 10, opacity: 0.8 }}
                    interval={0}
                  /> 
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
                    <LabelList dataKey="blatant" position="center" content={renderCustomizedLabel} />
                  </Bar>
                  <Bar dataKey="borderline" name="Borderline" fill={chartColors.borderline} stackId="a">
                    <LabelList dataKey="borderline" position="center" content={renderCustomizedLabel} />
                  </Bar>
                  {/* Temporarily commenting out the "Legitimate" bar as the 'legitimate' dataKey
                    is likely missing from the live analysisData.manipulationByCategory items.
                    If the UI renders correctly without this, this was the main issue for this chart.
                  */}
                  {/* <Bar dataKey="legitimate" name="Legitimate" fill={chartColors.legitimate} stackId="a">
                    <LabelList dataKey="legitimate" position="center" content={renderCustomizedLabel} />
                  </Bar> 
                  */}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

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

      <div className="mx-16 mt-16 mb-12">
        <h2 className="text-2xl font-bold mb-12 text-black text-center">Detected Tactics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {analysisData.tactics.map(tactic => {
            if (!tactic || typeof tactic.id === 'undefined') { // Add a check for valid tactic object
              console.warn("[OverviewTabContent] Invalid tactic object found:", tactic);
              return null; // Skip rendering this invalid tactic
            }
            let pillBg = 'bg-neutral text-neutral-content';
            if (tactic.intent === 'Blatant Manipulation') pillBg = 'bg-error text-error-content';
            else if (tactic.intent === 'Borderline Manipulation') pillBg = 'bg-warning text-warning-content';
            else if (tactic.intent === 'Legitimate Use') pillBg = 'bg-success text-success-content';
            return (
              <div
                key={tactic.id} // Assuming tactic.id is unique and present
                className="group bg-base-200 p-6 rounded-lg shadow-lg border-base-300 border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-info/20 relative cursor-pointer"
                onClick={() => setSelectedTactic(tactic)}
                tabIndex={0}
                onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && setSelectedTactic(tactic)}
              >
                <span className={`absolute top-4 right-4 inline-block ${pillBg} px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm`}>
                  {tactic.intent || 'Unknown'}
                </span>
                <div className="flex items-start mb-4">
                  <div>
                    <p className="text-2xl font-bold text-black mb-1">{tactic.name || 'Unnamed Tactic'}</p>
                    <p className="text-md font-semibold text-black/70 pb-2">{tactic.category || 'Uncategorized'}</p>
                  </div>
                </div>
                {tactic.quote && (
                  <p className="text-black/80 pb-4 mb-3 italic text-lg">
                    "{tactic.quote}"
                  </p>
                )}
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

      <OverviewModal 
        tactic={selectedTactic} 
        onClose={() => setSelectedTactic(null)} 
      />

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
      // Add other expected metadata fields if necessary for prop validation
    }),
    tactics: PropTypes.arrayOf(PropTypes.shape({ // Make tactics array items more specific if needed
        id: PropTypes.number.isRequired,
        name: PropTypes.string,
        category: PropTypes.string,
        intent: PropTypes.string,
        quote: PropTypes.string,
        resistanceStrategy: PropTypes.string,
    })),
    intentBreakdown: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })),
    manipulationByCategory: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      blatant: PropTypes.number,
      borderline: PropTypes.number,
      // legitimate: PropTypes.number, // Comment out or make optional for prop validation
    })),
    overall_assessment: PropTypes.shape({
        confidence_score_note: PropTypes.string,
        // Add other expected fields
    }),
    detailed_report_sections: PropTypes.shape({
        confidence_levels_discussion: PropTypes.string,
        // Add other expected fields
    }),
    // Add executive_summary if used directly by this component, or its children, for prop validation
  }),
};

OverviewTabContent.defaultProps = { // Add defaultProps if analysisData can sometimes be null/undefined by design
    analysisData: null, // Or a default structure if that makes more sense
};

export default OverviewTabContent;