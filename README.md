# CVly (ResumeCheck)

AI-powered resume analyzer that simulates how three different real-world hiring personas evaluate a resume — an ATS Bot, an HR Person, and a Hiring Manager.

## Setup Instructions

1. **Configure API Key in AI Studio**:
   - Go to the **Secrets** panel in the side menu.
   - Add a new secret named `API_KEY_GEMINI`.
   - Paste your key from [Google AI Studio](https://aistudio.google.com/app/apikey).

2. **Wait for Inject**:
   - The platform will automatically inject this key into `process.env.API_KEY_GEMINI`.

3. **Run the App**:
   - The preview updates automatically. Just upload your PDF and start analysing.

## Tech Stack
- **Framework**: React + Vite + Express
- **AI**: Google Gemini API (gemini-1.5-flash)
- **PDF Parsing**: PDF.js
- **Styling**: Tailwind CSS + shadcn/ui inspired components
- **Visualization**: Recharts
