# Resistance Hub Implementation Plan

This document outlines the design and implementation plan for the "Resistance Hub" feature within the WISE UI, replacing the previous `ResistanceTabContent`.

## 1. Chosen Design: Sidebar Navigation Hub

The Resistance Hub will utilize a two-column layout when the "Protect Yourself" tab is active:

1.  **Sidebar (Left):** A persistent navigation area dedicated to the Hub's content.
    *   Contains top-level collapsible sections (accordions/dropdowns) for major categories:
        *   **Tactic Library:** Expands to show a scrollable list of all identified manipulation tactics (e.g., Gaslighting, Straw Man, etc.).
        *   **Build Your Skills:** Expands to show subsections related to skill development (e.g., "Identify Biases", "Simulation Hub", "Critical Questioning").
        *   **Plan Your Strategies:** Expands to show subsections for strategic planning (e.g., "Personalized Defense Plan", "Source Vetting Checklist").
    *   Provides a clear, constant overview of the Hub's structure.
    *   Clicking an item in the sidebar controls the content displayed in the main area.

2.  **Main Content Area (Right):** Displays the detailed information or interactive UI corresponding to the sidebar selection.
    *   If a **tactic** is selected from the Tactic Library, this area shows the detailed breakdown for *that specific tactic* (Description, How it Works, Examples, How to Resist, Variations), potentially using internal tabs or accordions for layering.
    *   If a **subsection** (e.g., "Simulation Hub") is selected, this area loads the UI for that specific feature.
    *   The content dynamically updates based on the sidebar selection, ensuring focus.

**Key Advantages:**

*   **Clear Navigation:** Stable structure for exploring diverse content.
*   **Scalability:** Easily accommodates numerous tactics and feature sections.
*   **Context:** Users always know their location within the Hub.
*   **Focused Content:** Main area displays only relevant information.
*   **Flexibility:** Supports different layouts (detailed text vs. interactive tools) in the main area.

## 2. Implementation Sketch (React)

*   **`ResistanceTabContent.js` (Container):**
    *   Manages the overall two-column layout (Sidebar + Main Content).
    *   Holds state to track the currently selected item in the sidebar (e.g., `activeHubItem` with structure like `{ type: 'tactic' | 'skill' | 'strategy', id: string }`).
    *   Renders `ResistanceSidebar` and the appropriate main content component.
*   **`ResistanceSidebar.js` (Component):**
    *   Renders the collapsible sections and list items (tactics, skill subsections, strategy subsections).
    *   Accepts the current `activeHubItem` as a prop (for highlighting).
    *   Takes a callback function prop (e.g., `onSelectItem`) to notify the parent (`ResistanceTabContent`) when an item is clicked, passing the item's type and id.
*   **Main Content Components:**
    *   **`TacticDetailViewer.js`:** Receives a tactic `id` prop. Fetches or receives the detailed data for that tactic. Uses internal components (e.g., `<Accordion>`, `<Tabs>`) to display structured information (Description, Examples, Resistance, etc.).
    *   **`SimulationHub.js`:** Renders the UI for the simulation feature. May have its own internal state and logic.
    *   **`StrategyPlanner.js`:** Renders the UI for the strategy planning feature.
    *   **(Other feature components as needed)**
*   **Conditional Rendering:** `ResistanceTabContent` uses the `activeHubItem` state to determine which main content component to render.
*   **Data:** Tactic details might be stored in a structured format (e.g., a JSON file or fetched from an API) and passed down or fetched by `TacticDetailViewer`.

## 3. Implementation Guide (Steps)

- [x] **Component Scaffolding:**
    - [x] Modify `ResistanceTabContent.js` to set up the basic two-column layout (e.g., using Flexbox or Grid).
    - [x] Create the initial `ResistanceSidebar.js` component file.
    - [x] Create placeholder files for main content components (`TacticDetailViewer.js`, `SimulationHub.js`, etc.).
- [x] **Sidebar Structure & State:**
    - [x] Define the structure for the sidebar content (categories, tactics, subsections) - maybe as a constant array/object.
    - [x] Implement the state (`activeHubItem`) in `ResistanceTabContent` to track selection (define initial state, e.g., show a welcome message or the first tactic).
    - [x] Implement the rendering logic in `ResistanceSidebar` to display the collapsible sections and items based on the defined structure.
    - [x] Implement the `onSelectItem` callback mechanism to update the state in `ResistanceTabContent` when a sidebar item is clicked.
    - [x] Add styling to highlight the active item in the sidebar.
- [x] **Tactic Data Structure:**
    - [x] Define the detailed data structure for a single tactic (Description, How it Works, Examples, How to Resist, Variations, etc.).
    - [x] Create a data source (e.g., a `tacticsData.json` file) containing the information for all 21 tactics according to the defined structure.
- [x] **Tactic Detail View:**
    - [x] Implement `TacticDetailViewer.js`.
    - [x] It should receive a tactic `id` as a prop.
    - [x] Load the corresponding tactic data from the data source based on the `id`.
    - [x] Implement the internal layout using tabs or accordions to display the different fields (Description, Examples, etc.).
- [ ] **Conditional Content Rendering:**
    - [ ] In `ResistanceTabContent`, implement the logic to render the correct main content component based on `activeHubItem.type` (e.g., if type is 'tactic', render `TacticDetailViewer` with the `id`; if type is 'skill' and id is 'simulationHub', render `SimulationHub`, etc.).
- [ ] **Build Other Hub Sections:**
    - [ ] Implement the UI and logic for `SimulationHub.js`, `StrategyPlanner.js`, and any other defined subsections.
- [ ] **Styling & Refinement:**
    - [ ] Apply consistent styling according to the application's theme.
    - [ ] Ensure proper spacing, alignment, and visual hierarchy.
- [ ] **Responsiveness:**
    - [ ] Implement responsive design rules for the sidebar (e.g., collapse to a button on small screens) and main content area.
- [ ] **Testing:**
    - [ ] Test navigation between all sidebar items.
    - [ ] Verify correct content display for tactics and subsections.
    - [ ] Test responsiveness across different screen sizes.
