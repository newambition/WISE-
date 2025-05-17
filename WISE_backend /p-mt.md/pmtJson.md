{
  "type": "object",
  "description": "Schema defining the structure for an analysis report on persuasive or manipulative tactics within a given input text.",
  "properties": {
    "metadata": {
      "type": "object",
      "description": "Contains metadata about the input data being analyzed.",
      "properties": {
        "input_data_description": {
          "type": "string",
          "description": "A brief description identifying the source of the input data."
        }
      },
      "required": [
        "input_data_description"
      ]
    },
    "executive_summary": {
      "type": "object",
      "description": "Provides a concise high-level summary of the analysis findings.",
      "properties": {
        "primary_intent": {
          "type": "string",
          "description": "The main assessed intent of the text 'Legitimate Use,' 'Borderline Manipulation,' or 'Blatant Manipulation.'."
        },
        "confidence_score": {
          "type": "string",
          "description": "A numerical score indicating the confidence level in the assessed primary intent 1-100"
        },
        "tactic_density": {
          "type": "string",
          "description": "An assessment of the frequency of persuasive/manipulative tactics used (e.g., Low, Medium, High)."
        },
        "dominant_tactics": {
          "type": "string",
          "description": "Lists the most frequently observed or impactful tactics (e.g., Emotional Appeals (Anger/Grievance) & Tribal Framing / Identity Politics)."
        },
        "structural_bias": {
          "type": "string",
          "description": "Identifies any inherent biases observed in the structure or framing of the text (e.g., Populist 'Us-vs-Them' framing)."
        }
      },
      "required": [
        "primary_intent",
        "confidence_score",
        "tactic_density",
        "dominant_tactics",
        "structural_bias"
      ]
    },
    "overall_assessment": {
      "type": "object",
      "description": "Contains the main textual summary of the assessment and rationale for the confidence score.",
      "properties": {
        "summary_text": {
          "type": "string",
          "description": "A detailed textual summary providing the overall assessment of the input text."
        },
        "confidence_score_note": {
          "type": "string",
          "description": "A brief note (approx. 30 words) explaining the primary reason for the assigned confidence score."
        }
      },
      "required": [
        "summary_text",
        "confidence_score_note"
      ]
    },
    "tactical_analysis": {
      "type": "array",
      "description": "An array containing detailed analyses of specific tactics identified within the text.",
      "items": {
        "type": "object",
        "description": "Describes a single instance of an identified tactic.",
        "properties": {
          "tactic_id": {
            "type": "integer",
            "description": "The ID atributed to the tactic within the taxonomy."
          },
          "tactic_name": {
            "type": "string",
            "description": "The name of the identified tactic (e.g., Affirmation, Appeal to Anger/Grievance)."
          },
          "example_quote": {
            "type": "string",
            "description": "A direct quote from the input text that exemplifies the identified tactic."
          },
          "intent_qualifier": {
            "type": "string",
            "description": "Qualifies the perceived intent of this specific tactic instance (e.g., Borderline Manipulation, Blatant Manipulation or Legitimate Use)."
          },
          "explanation": {
            "type": "string",
            "description": "An explanation of how the example quote demonstrates the tactic and its assessed intent."
          },
          "resistance_strategy": {
            "type": "string",
            "description": "Suggest a mental strategv or awareness technique to resist the influence of this tactic."
          }
        },
        "required": [
          "tactic_id",
          "tactic_name",
          "example_quote",
          "intent_qualifier",
          "explanation",
          "resistance_strategy"
        ]
      }
    },
    "detailed_report_sections": {
      "type": "object",
      "description": "Contains supplementary sections providing further detail on methodology, context, and definitions.",
      "properties": {
        "methodology": {
          "type": "string",
          "description": "Describes the methods and approach used to conduct the analysis."
        },
        "confidence_levels_discussion": {
          "type": "string",
          "description": "A more detailed discussion (approx. 150 words) elaborating on the reasoning behind the overall confidence score."
        },
        "context_handling": {
          "type": "string",
          "description": "Explains how the broader context of the input text was considered during the analysis."
        },
        "persuasion_vs_manipulation_distinction": {
          "type": "string",
          "description": "Defines the criteria used to differentiate between legitimate persuasion and manipulative techniques."
        },
        "manipulative_elements_summary": {
          "type": "string",
          "description": "Summarizes where the text turns from persuasion or harmful rhetoric/manipulation."
        }
      },
      "required": [
        "methodology",
        "confidence_levels_discussion",
        "context_handling",
        "persuasion_vs_manipulation_distinction",
        "manipulative_elements_summary"
      ]
    }
  },
  "required": [
    "metadata",
    "executive_summary",
    "overall_assessment",
    "tactical_analysis",
    "detailed_report_sections"
  ]
}