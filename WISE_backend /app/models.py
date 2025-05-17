# WISE_backend/app/models.py

"""
Pydantic models for structuring data and API responses.
"""
from pydantic import BaseModel, Field
from typing import List, Optional

# --- Pydantic Models for Structured Output (aligned with UI_jsonExpectation.md) ---

class Metadata(BaseModel):
    author: Optional[str] = Field(None, description="Author of the text, null if not determined")
    date: str = Field(..., description="Date of analysis in YYYY-MM-DD format") # Assuming API provides this now
    overallIntent: str = Field(..., description="Overall assessed intent, e.g., 'Primarily Manipulation'")
    confidenceScore: Optional[int] = Field(None, description="Confidence score (0-100) as a number")
    tacticDensity: Optional[str] = Field(None, description="Density of tactics, e.g., 'High', 'Medium', 'Low'")
    input_data_description: Optional[str] = Field(None, description="Description of the input source")

class ExecutiveSummary(BaseModel):
    primary_intent: str = Field(..., description="Overall assessed intent")
    confidence_score: str = Field(..., description="Confidence score as a string (as per API)")
    tactic_density: str = Field(..., description="Density of tactics")
    dominant_tactics: str = Field(..., description="Most prominent tactics used")
    structural_bias: str = Field(..., description="Underlying biases in the text's structure")

class IntentBreakdownItem(BaseModel):
    name: str = Field(..., description="Intent classification name (e.g., 'Blatant Manipulation')")
    value: int = Field(..., description="Count of tactics with this intent")

class ManipulationCategory(BaseModel):
    name: str = Field(..., description="Category name")
    blatant: int = Field(..., description="Count of blatant tactics in this category")
    borderline: int = Field(..., description="Count of borderline tactics in this category")

class OverallAssessment(BaseModel):
    summary_text: str = Field(..., description="Full text summary of the overall assessment")
    confidence_score_note: str = Field(..., description="Note explaining the confidence score")

class Tactic(BaseModel):
    id: int = Field(..., description="ID attributed to the tactic within the taxonomy") # Clarified description
    name: str = Field(..., description="Name of the tactic from the taxonomy")
    category: str = Field(..., description="Category of the tactic")
    intent: str = Field(..., description="Classification: 'Legitimate Use', 'Borderline Manipulation', or 'Blatant Manipulation'")
    quote: str = Field(..., description="Specific text excerpt where the tactic is used")
    explanation: str = Field(..., description="Explanation of how the tactic is used and classified")
    resistanceStrategy: str = Field(..., description="How to recognize and resist the tactic")
    sources: Optional[str] = Field(None, description="Shortened URL's of sources used to justify the tactic") # Made optional

class DetailedReportSections(BaseModel):
    confidence_levels_discussion: str = Field(...)
    context_handling: str = Field(...)
    persuasion_vs_manipulation_distinction: str = Field(...)
    manipulative_elements_summary: str = Field(...)
    # Removed methodology as it's not in the final API response spec based on the prompt
    # methodology: str = Field(...)

# Structure requested FROM the API
class AnalysisResultFromAPI(BaseModel):
    metadata: Metadata
    executive_summary: ExecutiveSummary
    intentBreakdown: List[IntentBreakdownItem]
    overall_assessment: OverallAssessment
    tactics: List[Tactic]
    detailed_report_sections: DetailedReportSections

# Final structure returned BY the endpoint (includes calculated fields)
class FinalAnalysisResult(AnalysisResultFromAPI):
    manipulationByCategory: List[ManipulationCategory]