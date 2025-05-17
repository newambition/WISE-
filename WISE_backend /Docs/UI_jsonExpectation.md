{
  // --- Essential Top-Level Keys ---
  "metadata": {
    "author": "Author Name (Optional)",        // string - Renamed from speaker. Frontend will display if present, omit if null/missing.
    "overallIntent": "Detected Overall Intent", // string - Displayed if present (e.g., "Primarily Manipulation").

    // --- Fields used by Header / OverviewTabContent ---
    "confidenceScore": 85,                      // number (0-100) - Displayed if present.
    "tacticDensity": "Low/Medium/High"          // string (Optional, initially used in mock data, currently not displayed but could be added)
    // Add any other relevant metadata fields your backend generates
  },
  "tactics": [
    // Array must exist, can be empty if no tactics found.
    {
      "id": 1,                                  // number or string (Unique ID for this tactic instance)
      "name": "Tactic Name",                   // string (e.g., "Appeal to Emotion")
      "category": "Tactic Category",            // string (e.g., "Emotional Manipulation")
      "intent": "Intent Classification",        // string (e.g., "Blatant Manipulation", "Borderline Manipulation")
      "quote": "The specific text quote demonstrating the tactic.", // string
      "explanation": "Why this quote is an example of the tactic.", // string
      "resistanceStrategy": "How to resist this specific tactic.", // string
      "icon": "🔥"                               // string (Emoji or identifier, optional)
      // Add other tactic-specific fields if needed
    },
    // ... more tactic objects
  ],

  // --- Additional Expected Keys for OverviewTabContent ---
  "intentBreakdown": [
    // Expected structure for the horizontal bar chart legend/data
    {
      "name": "Blatant Manipulation",           // string
      "value": 5,                               // number (Count of tactics with this intent)
    },
    {
      "name": "Borderline Manipulation",        // string
      "value": 3,                               // number
    },
    {
       "name": "Legitimate Use",                // string
       "value": 2,                               // number
    }
    // ... potentially other intent categories
  ],
  "manipulationByCategory": [
    // Expected structure for the vertical bar chart (Overview) & radar chart (Protect)
    {
      "name": "Emotional Manipulation",         // string (Category name)
      "blatant": 3,                             // number (Count of blatant tactics in this category)
      "borderline": 2                           // number (Count of borderline tactics in this category)
      // Add 'legitimate' count if needed
    },
    {
      "name": "Logical Fallacies",              // string
      "blatant": 1,                             // number
      "borderline": 1                           // number
    }
    // ... more category objects
  ]
  // --- Potentially other top-level keys if your analysis provides more data ---
}
```

MUST HAVE: The JSON response must include "metadata": {} and "tactics": [] at the top level. Even if metadata is sparse or no tactics are found, the keys must exist.
Author Field: Use the key "author" inside "metadata". Provide it if the LLM can determine it, otherwise omit it or send null.
Title Field: You can include "title" inside "metadata", but the frontend will ignore it for display purposes.
Other Metadata: Include "date", "overallIntent", and "confidenceScore" within "metadata" if available.
Tactics Array: Ensure each object in the "tactics" array has the fields (id, name, category, intent, quote, explanation, resistanceStrategy).
Overview Data: Include "intentBreakdown" and "manipulationByCategory" arrays with the structures shown if you want the overview charts to populate correctly.