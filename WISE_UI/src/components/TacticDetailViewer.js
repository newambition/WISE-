import React, { useState, useEffect } from 'react';
import tacticsData from '../tacticsData.json';
import {
  LightbulbIcon, Target, AlertTriangle, XCircle, CheckCircle,
  Eye, MessageCircle, Users, Clock, Shield,
  Brain, BookOpen, ArrowRight, ChevronDown,
  AlertCircle, Zap, Filter
} from 'lucide-react';

// Helper function to get appropriate icon for How to Spot cards
const getSpotIcon = (index) => {
  const icons = [
    { icon: Eye, color: 'text-blue-500' },         // Visual observation
    { icon: MessageCircle, color: 'text-indigo-500' }, // Message content
    { icon: Users, color: 'text-violet-500' },     // Group dynamics
    { icon: Clock, color: 'text-purple-500' },     // Timing/pressure
    { icon: Shield, color: 'text-pink-500' },      // Protection/defense
    { icon: Filter, color: 'text-rose-500' },      // Analysis/filtering
    { icon: AlertCircle, color: 'text-orange-500' }  // Warning signs
  ];
  return icons[index % icons.length];
};

// InsightCard: Main expandable card component
// Styling adjustments:
// - bg-tactic-card-gradient: Background color of the card
// - shadow/shadow-lg: Card elevation in collapsed/expanded states
// - rounded-lg: Card corner radius
// - p-4: Internal padding
// - gap-3: Spacing between icon and content
const InsightCard = ({ title, icon, previewText, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`bg-tactic-card-gradient rounded-lg transition-all duration-300 ease-in-out overflow-hidden
        ${isExpanded ? 'shadow-lg ring-1 ring-tactic-primary-10' : 'shadow hover:shadow-md hover:ring-1 m-4 hover:ring-tactic-primary-5 cursor-pointer'}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-5 flex items-start gap-4">
        <div className={`p-2 rounded-lg bg-tactic-primary-5 ${isExpanded ? 'text-primary' : 'text-primary/70'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2 text-base-content flex items-center gap-2">
            {title}
            <ChevronDown 
              className={`w-4 h-4 text-primary/70 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </h3>
          {!isExpanded && (
            <p className="text-tactic-muted text-base/6 leading-relaxed">
              {previewText}
            </p>
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-5 pb-5 pt-2 border-t border-tactic-base-300-50">
          {children}
        </div>
      )}
    </div>
  );
};

// ContentCard: Individual card component for grid layouts
// Styling adjustments:
// - bg-tactic-card-gradient: Card background color
// - shadow-sm: Default card elevation
// - hover:shadow-md: Hover state elevation
// - rounded-lg: Card corner radius
// - p-4: Internal padding
// - gap spacing in flex layout
const ContentCard = ({ title, description, example, icon, customColor = 'text-primary' }) => (
  <div className="bg-tactic-card-gradient rounded-lg shadow-sm p-5 hover:shadow-md transition-all duration-200 
    flex flex-col h-full ring-1 ring-tactic-base-300-50 hover:ring-tactic-primary-10 group">
    <div className="flex items-start gap-3 mb-3">
      <div className={`p-2 rounded-lg bg-tactic-base-200-50 group-hover:bg-tactic-primary-5 transition-colors duration-200 ${customColor}`}>
        {icon}
      </div>
      {title && (
        <h4 className="font-heading font-semibold text-lg text-base-content pt-2">{title}</h4>
      )}
    </div>
    <p className="text-sm text-tactic-muted-strong mb-4 leading-relaxed">{description}</p>
    {example && (
      <div className="pt-3 border-t border-tactic-base-200-50">
        <p className="text-sm mt-4 italic text-tactic-muted flex items-start gap-2">
          <ArrowRight className="w-4 h-4 mt-1 text-primary/50" />
          {example}
        </p>
      </div>
    )}
  </div>
);

// Helper to render superscripted citation links
function renderCitations(citationIds = [], allCitations = []) {
  if (!citationIds || citationIds.length === 0) return null;
  return citationIds.map((id, idx) => {
    const citation = allCitations?.find(c => c.id === id);
    if (!citation) return null;
    return (
      <sup key={id} className="ml-0.5">
        <a
          href={citation.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary/80"
          style={{ fontSize: '0.7em', verticalAlign: 'super' }}
        >
          {idx + 1}
        </a>
      </sup>
    );
  });
}

const TacticDetailViewer = ({ tacticId, tacticData }) => {
  const [tactic, setTactic] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // If direct tactic data is provided, use it
    if (tacticData) {
      setTactic(tacticData);
      return;
    }
    
    // Otherwise, load from tacticsData using ID
    if (tacticId) {
      const selectedTactic = tacticsData.find(t => t.id === tacticId);
      setTactic(selectedTactic);
    }
  }, [tacticId, tacticData]);

  if (!tactic) {
    return <div className="p-4">Loading tactic details...</div>;
  }

  // Tab button styling adjustments:
  // - px-4 py-2: Button padding
  // - rounded-t-lg: Top corner radius
  // - border-b-2: Active indicator thickness
  // - text-primary: Active text color
  const TabButton = ({ id, label }) => (
    <button
      className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 ${
        activeTab === id
          ? 'bg-base-200 text-primary shadow-sm'
          : 'text-base-content/70 hover:text-base-content hover:bg-base-200/50'
      }`}
      onClick={() => setActiveTab(id)}
    >
      {label}
    </button>
  );

  // Intent Spectrum grid styling:
  const renderIntentSpectrum = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 m-6 gap-6">
      {Object.entries(tactic.intent_spectrum).map(([level, content]) => {
        const icons = {
          legitimate: { icon: CheckCircle, color: 'text-success' },
          borderline: { icon: AlertTriangle, color: 'text-warning' },
          blatant: { icon: XCircle, color: 'text-error' }
        };
        const { icon: Icon, color } = icons[level];
        return (
          <ContentCard
            key={level}
            title={level.charAt(0).toUpperCase() + level.slice(1)}
            description={
              <>
                {content.description}
                {renderCitations(content.citations, tactic.citations)}
              </>
            }
            example={content.example}
            icon={<Icon className="w-5 h-5" />}
            customColor={color}
          />
        );
      })}
    </div>
  );

  // How to Spot grid styling:
  // - Adjust grid-cols-* for different breakpoints
  // - gap-4: Spacing between cards
  const renderHowToSpot = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 m-6 gap-6">
      {tactic.how_to_spot.map((item, index) => {
        const { icon: Icon, color } = getSpotIcon(index);
        return (
          <ContentCard
            key={index}
            description={item}
            icon={<Icon className="w-5 h-5" />}
            customColor={color}
          />
        );
      })}
    </div>
  );

  // Common Scenarios grid styling:
  const renderCommonScenarios = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 m-6 gap-6">
      {tactic.common_scenarios.map((scenario, index) => (
        <ContentCard
          key={index}
          title={scenario.context}
          description={
            <>
              {scenario.description}
              {renderCitations(scenario.citations, tactic.citations)}
            </>
          }
          icon={<BookOpen className="w-5 h-5" />}
        />
      ))}
    </div>
  );

  // Resistance strategies grid styling:
  const renderResistanceStrategies = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tactic.resistance_strategies.map((strategy, index) => (
        <ContentCard
          key={index}
          title={strategy.title}
          description={
            <ul className="list-disc list-inside space-y-2">
              {strategy.steps.map((step, stepIndex) => (
                <li key={stepIndex} className="text-tactic-muted">
                  {step}
                  {renderCitations(step.citations, tactic.citations)}
                </li>
              ))}
              {renderCitations(strategy.citations, tactic.citations)}
            </ul>
          }
          icon={<Shield className="w-5 h-5" />}
        />
      ))}
    </div>
  );

  return (
    // Main container styling:
    // - bg-tactic-base-100: Background color
    // - shadow-lg: Container elevation
    // - rounded-lg: Corner radius
    <div className="bg-tactic-base-100 rounded-xl shadow-lg">
      {/* Header section with gradient accent */}
      <div className="p-8 border-b border-tactic-base-300-50 bg-tactic-header-fade">
        <h1 className="text-2xl font-bold text-base-content mb-3">{tactic.name}</h1>
        <p className="text-tactic-muted-strong leading-relaxed">{tactic.definition}</p>
      </div>

      {/* Tab navigation with subtle hover effects */}
      <div className="flex gap-2 px-6 pt-6 border-b border-tactic-base-300-50">
        <TabButton id="overview" label="Overview" />
        <TabButton id="scenarios" label="Common Scenarios" />
        <TabButton id="biases" label="Related Biases" />
        <TabButton id="resistance" label="Resistance Strategies" />
      </div>

      {/* Content area styling - adjust padding and spacing between sections */}
      <div className="p-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Core Mechanism with enhanced styling */}
            <section className="bg-tactic-primary-10 p-6 rounded-lg border border-tactic-primary-10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-3">
                <LightbulbIcon className="w-6 h-6 text-primary" />
                Core Mechanism
              </h2>
              <p className="text-tactic-muted leading-relaxed">{tactic.core_mechanism}</p>
            </section>

            <InsightCard
              title="Intent Spectrum"
              icon={<Target className="w-5 h-5" />}
              previewText="Understand how this tactic can be used across different levels of intent - from legitimate to manipulative."
            >
              {renderIntentSpectrum()}
            </InsightCard>

            <InsightCard
              title="How to Spot"
              icon={<Eye className="w-5 h-5" />}
              previewText="Learn the key indicators and warning signs to identify this tactic in action."
            >
              {renderHowToSpot()}
            </InsightCard>
          </div>
        )}

        {/* Scenarios grid styling - adjust columns and spacing */}
        {activeTab === 'scenarios' && renderCommonScenarios()}

        {/* Biases grid styling - adjust columns and spacing */}
        {activeTab === 'biases' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tactic.related_biases.map((bias, index) => (
              <ContentCard
                key={index}
                title={bias.name}
                description={
                  <>
                    {bias.description}
                    {renderCitations(bias.citations, tactic.citations)}
                  </>
                }
                icon={<Brain className="w-5 h-5" />}
              />
            ))}
          </div>
        )}

        {/* Resistance strategies grid styling - adjust columns and spacing */}
        {activeTab === 'resistance' && renderResistanceStrategies()}
      </div>

      {/* Interactive Learning section with enhanced styling */}
      <div className="p-8 border-t border-tactic-base-300-50">
        <div className="bg-tactic-header-fade p-6 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Interactive Learning
          </h3>
          <p className="text-tactic-muted">{tactic.simulation_link}</p>
        </div>
      </div>
    </div>
  );
};

export default TacticDetailViewer; 