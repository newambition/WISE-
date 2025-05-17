import React, { useState, useCallback } from 'react';
import LandingPageContent from './LandingPageContent';
import useAnalysisApi from '../hooks/useAnalysisApi'; // Import the custom hook
import Header from './Header'; // Import Header component
import Footer from './Footer'; // Import Footer component
import NavigationBar from './NavigationBar';
import OverviewTabContent from './OverviewTabContent';
import OverviewModal from './OverviewModal';
import AnalysisModal from './AnalysisModal';
import testAnalysisData from '../testAnalysisData'; // Dev mode test data
import ResourcesTabContent from './ResourcesTabContent';
import LearningHubTabContent from './LearningHubTabContent';

// API URL is now defined within the hook


const WISEDashboard = () => {

  // DEV MODE: If URL contains ?dev=1, use testAnalysisData for analysisData
  const { isLoading: apiIsLoading, error, analysisData: apiAnalysisData, triggerAnalysis, setError } = useAnalysisApi();
  const isDevMode = typeof window !== 'undefined' && window.location.search.includes('dev=1');
  const analysisData = isDevMode ? testAnalysisData : apiAnalysisData;
  const isLoading = isDevMode ? false : apiIsLoading;

  
  // Component-specific UI state
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTactic, setSelectedTactic] = useState(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [displayTitle, setDisplayTitle] = useState('');
  
  // Handlers for the modal
  const handleOpenModal = useCallback(() => {
    setIsAnalysisModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsAnalysisModalOpen(false);
  }, []);

  // Analysis submission handler - Now triggered ONLY from the modal
  const handleAnalysisSubmit = useCallback(async (options = {}) => {
    // Inputs (file/text) now come ONLY from the modal via options
    const { file, text } = options;

    // Determine and set display title *before* calling the hook
    if (file) {
      setDisplayTitle(file.name);
    } else if (text) {
      setDisplayTitle("Text Input Analysis");
    } else {
      // This case shouldn't be reachable if modal validates input
      setError('No input provided.'); 
      return;
    }

    try {
      // Close the modal immediately before starting analysis
      handleCloseModal(); 

      // Call the analysis function from the hook
      await triggerAnalysis({ file, text });

      // --- Post-Success Actions ---
      // Inputs are managed within the modal, no need to clear here
      setActiveTab('overview');

    } catch (error) {
      console.error("Analysis submission failed:", error.message);
      // Optionally re-open the modal on failure?
      // handleOpenModal(); // Or leave it closed and show error in main dashboard?
    }
  // Dependencies: Removed local file/text state, added modal handlers
  }, [triggerAnalysis, setError, handleCloseModal, setDisplayTitle, setActiveTab]); // Removed handleOpenModal if not reopening on error

  // Prepare radar chart data
  const radarData = analysisData && analysisData.manipulationByCategory ? [
    { subject: 'Emotional Appeals', A: analysisData.manipulationByCategory.find(c => c.name === "Emotional Manipulation")?.blatant + analysisData.manipulationByCategory.find(c => c.name === "Emotional Manipulation")?.borderline || 0 },
    { subject: 'Logical Fallacies', A: analysisData.manipulationByCategory.find(c => c.name === "Logical Fallacies")?.blatant + analysisData.manipulationByCategory.find(c => c.name === "Logical Fallacies")?.borderline || 0 },
    { subject: 'Identity Framing', A: analysisData.manipulationByCategory.find(c => c.name === "Identity Framing")?.blatant + analysisData.manipulationByCategory.find(c => c.name === "Identity Framing")?.borderline || 0 },
    { subject: 'Info Distortion', A: analysisData.manipulationByCategory.find(c => c.name === "Information Distortion")?.blatant + analysisData.manipulationByCategory.find(c => c.name === "Information Distortion")?.borderline || 0 } // Shortened label
    // Consider adding 'fullMark' if needed by the component/chart
  ].map(item => ({ ...item, A: Math.max(0, item.A) })) // Ensure 'A' is not negative
  : []; // Default to empty array if no analysisData or manipulationByCategory
  
  // Log state before rendering

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Use Header component - Pass displayTitle and handleOpenModal */}
      <Header
        analysisData={analysisData}
        displayTitle={displayTitle}
        onReanalyzeClick={handleOpenModal}
        onGetStartedClick={handleOpenModal}
      />
      
      {/* Navigation - Render only when results are available */}
      {analysisData && !isLoading && (
        <NavigationBar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          displayTitle={displayTitle} 
          overallIntent={analysisData?.metadata?.overallIntent}
        />
      )}
      
      {/* Main Content Area based on state */}
      <div className="flex-grow px-4 py-6">
        {/* Loading State - REMOVED */}
        {/* {isLoading && ( <LoadingIndicator /> )} */}

        {/* Initial View State - Show LandingPageContent */}
        {!isDevMode && !analysisData && (
          <LandingPageContent 
            onGetStartedClick={handleOpenModal}
            analysisData={analysisData}
            isLoading={isLoading}
          />
        )}

        {/* Results View State - Show whenever analysis data exists */}
        {analysisData && (
          <main> 
            {/* Display error prominently if analysis failed AFTER data was previously loaded */}
            {error && (
               <div className="mb-4 text-red-700 bg-red-100 p-4 rounded border border-red-300" role="alert">
                  <strong>Error during last analysis attempt:</strong> {error}
               </div>
            )}
            {/* Render active tab content using new components */}
            {activeTab === 'overview' && (
              <OverviewTabContent analysisData={analysisData} />
            )}
            
            {activeTab === 'learningHub' && (
              <LearningHubTabContent radarData={radarData} />
            )}
            
            {activeTab === 'resources' && (
              <ResourcesTabContent />
            )}
          </main>
        )}
      </div>
      
      {/* Tactic Detail Modal (Render using the extracted component) */}
      <OverviewModal 
        tactic={selectedTactic} 
        onClose={() => setSelectedTactic(null)} 
      />
      
      {/* Use Footer component */}
      <Footer />

      {/* Analysis Modal (unified for initial and re-analysis) */}
      <AnalysisModal 
        isOpen={isAnalysisModalOpen}
        onClose={handleCloseModal}
        onAnalyze={handleAnalysisSubmit} 
        isLoading={isLoading} 
      /> 

    </div>
  );
};

export default WISEDashboard; 