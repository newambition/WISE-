// src/testAnalysisData.js
// Test data for development mode. Covers all intent types and some variety.

const testAnalysisData = {
  tactics: [
    {
      id: 1,
      name: 'Bandwagon',
      category: 'Logical Fallacy',
      intent: 'Blatant Manipulation',
      quote: "Everyone is doing it, so you should too!",
      resistanceStrategy: "Think independently and evaluate the evidence yourself."
    },
    {
      id: 2,
      name: 'Loaded Language',
      category: 'Language',
      intent: 'Blatant Manipulation',
      quote: "This is a complete disaster!",
      resistanceStrategy: "Identify emotionally charged words and consider the facts."
    },
    {
      id: 3,
      name: 'Appeal to Fear',
      category: 'Emotional Appeal',
      intent: 'Borderline Manipulation',
      quote: "If you don't act now, terrible things will happen.",
      resistanceStrategy: "Assess the actual risk and look for evidence."
    },
    {
      id: 4,
      name: 'In-group Bias',
      category: 'Cognitive Bias',
      intent: 'Borderline Manipulation',
      quote: "People like us know the real truth.",
      resistanceStrategy: "Be aware of groupthink and seek diverse perspectives."
    },
    {
      id: 5,
      name: 'Citations',
      category: 'Source Credibility',
      intent: 'Legitimate Use',
      quote: "According to a recent study, ...",
      resistanceStrategy: "Check the cited sources for credibility."
    },
    {
      id: 6,
      name: 'Affirmation',
      category: 'Positive Framing',
      intent: 'Legitimate Use',
      quote: "You did a great job on this project!",
      resistanceStrategy: "Accept positive feedback, but remain objective."
    }
  ],
  metadata: {
    overallIntent: 'Mixed',
    confidenceScore: 85
  },
  intentBreakdown: [
    { name: 'Blatant Manipulation', value: 2 },
    { name: 'Borderline Manipulation', value: 2 },
    { name: 'Legitimate Use', value: 2 }
  ],
  manipulationByCategory: [
    { name: 'Logical Fallacy', blatant: 1, borderline: 0, legitimate: 0 },
    { name: 'Language', blatant: 1, borderline: 0, legitimate: 0 },
    { name: 'Emotional Appeal', blatant: 0, borderline: 1, legitimate: 0 },
    { name: 'Cognitive Bias', blatant: 0, borderline: 1, legitimate: 0 },
    { name: 'Source Credibility', blatant: 0, borderline: 0, legitimate: 1 },
    { name: 'Positive Framing', blatant: 0, borderline: 0, legitimate: 1 }
  ],
  overall_assessment: {
    confidence_score_note: 'Test data for development mode.'
  },
  detailed_report_sections: {
    confidence_levels_discussion: 'This is a mock discussion for dev mode.'
  }
};

export default testAnalysisData; 