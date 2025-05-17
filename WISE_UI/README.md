# WISE Frontend: Wisdom in Identifying and Stopping Exploitation

This is the frontend application for the WISE project, designed to analyze text content (from files or direct input) and identify potential manipulation techniques and persuasive tactics. It provides users with insights into the intent behind the communication and offers strategies for critical evaluation.

## Features

*   **Analyze Content:** Upload text files (`.txt`, `.md`, `.docx`) or paste text directly for analysis.
*   **Manipulation Intent Overview:** Get a high-level summary including overall detected intent (e.g., Blatant Manipulation, Borderline Manipulation, Legitimate Use), confidence score, and a breakdown of detected tactic intents.
*   **Tactics Explorer:** View a detailed list of specific persuasive tactics identified in the text, including:
    *   Tactic Name and Category
    *   Identified Intent
    *   Example Quote from the text
    *   Explanation of the tactic
    *   Tailored Defense/Resistance Strategy
*   **Protect Yourself:** Access general strategies for resisting manipulation and view a personalized "Manipulation Defense Radar" highlighting the categories of tactics most prevalent in the analyzed content.
*   **Interactive Charts:** Visualize intent breakdown and tactics by category using bar charts and radar charts (powered by Recharts).
*   **Responsive Design:** Built with Tailwind CSS for a clean and responsive user interface.

## Tech Stack

*   **Framework:** React.js
*   **Styling:** Tailwind CSS
*   **Charting:** Recharts
*   **State Management:** React Hooks (useState, useCallback, custom hooks)
*   **API Communication:** Fetch API

## Project Setup

Follow these steps to get the frontend development environment running:

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd WISE_UI # Or your frontend project directory name
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Configure Environment Variables:**
    *   Create a file named `.env` in the root of the frontend project (`WISE_UI/`).
    *   Add the URL of your running WISE backend API:
        ```dotenv
        REACT_APP_API_URL=http://localhost:8000
        ```
        *(Replace `http://localhost:8000` if your backend runs on a different address or port).*
    *   **Important:** Add `.env` to your `.gitignore` file to prevent committing sensitive information.

4.  **Ensure Backend is Running:** This frontend requires the WISE backend API to be running and accessible at the URL specified in `.env`. Make sure your backend server is started.

5.  **Run the Development Server:**
    ```bash
    npm start
    # or
    # yarn start
    ```
    This will open the application in your default browser, usually at `http://localhost:3000`. The app will automatically reload if you make changes to the code.

## Available Scripts

In the project directory, you can run:

*   `npm start`: Runs the app in development mode.
*   `npm test`: Launches the test runner (if tests are configured).
*   `npm run build`: Builds the app for production to the `build` folder.

## Backend API

This frontend relies on a backend API for text analysis. The expected endpoint for analysis is `/api/analyze` relative to the `REACT_APP_API_URL`. The backend is responsible for:

*   Receiving text or file uploads.
*   Performing the manipulation/tactic analysis (using an LLM).
*   Calculating aggregated data (e.g., `manipulationByCategory`, `intentBreakdown`).
*   Returning the analysis results in the expected JSON format (refer to development discussions or backend documentation for the exact schema).
*   Having CORS configured to allow requests from the frontend origin (e.g., `http://localhost:3000`).

## Future Development / Contributing

*   Implement comprehensive unit and integration tests.
*   Further refine UI/UX based on user feedback.
*   Explore adding more detailed explanations or resources for identified tactics.

*(Optional: Add contribution guidelines if applicable)*

## License

*None*
