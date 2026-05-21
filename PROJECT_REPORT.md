# Project Information Sheet

| Field | Details |
| :--- | :--- |
| **Project ID** | PBL-2026-CSD-042 |
| **Title** | **CVly**: AI-Powered Multi-Persona Resume Analysis System |
| **Problem Statement** | Modern hiring processes create a "black box" where candidates don't know why their resumes are rejected. Static keyword matchers fail to capture the nuanced evaluation performed by HR teams and Hiring Managers. There is a need for a tool that simulates real-world hiring filters to provide actionable feedback. |
| **Name of Mentor** | Prof. [To be assigned] |
| **Group Members** | 1. Bhushan Baskar (bhushanbaskar3@gmail.com) <br> 2. [Member 2] <br> 3. [Member 3] <br> 4. [Member 4] |

---

# Abstract

**Introduction:**
CVly is an advanced web application designed to bridge the gap between job seekers and employers using Artificial Intelligence. It provides a multi-dimensional analysis of resumes by simulating the filters and perspectives of various hiring stakeholders.

**Motivation:**
The motivation behind CVly is to empower candidates with the same level of analytical insight that recruiters use. By understanding how an ATS, an HR professional, and a Hiring Manager perceive their profile, candidates can make strategic improvements that significantly increase their chances of landing an interview.

**Outcome:**
The project delivers a high-performance, interactive dashboard that processes PDF resumes in real-time. It yields categorized scores, specific "what they liked" and "what to improve" sections, and comparative metrics between different resume versions. The application successfully integrates the Gemini 1.5 Pro model for deep semantic understanding of professional documents.

**Keywords:**
AI, Resume Analysis, ATS Optimization, Hiring Personas, Gemini API, React, Data Visualization.

---

# Chapter 1: INTRODUCTION

### 1.1 PROJECT IDEA
The project idea is to build a "Hiring Simulation Engine." Unlike traditional resume checkers that only look for keyword density, CVly uses Large Language Models (LLMs) to perform a role-play analysis. It takes a user's resume and a target job description as input and generates detailed reports from three specific viewpoints:
*   **The Robot (ATS):** Checks for parseability and keyword alignment.
*   **The Gatekeeper (HR):** Looks for soft skills, formatting, and cultural indicators.
*   **The Expert (Hiring Manager):** Deep dives into experience, achievements, and technical impact.

### 1.2 MOTIVATION OF THE PROJECT
In a competitive job market, candidates often send hundreds of applications with little to no feedback. Our motivation is to provide immediate, high-quality, and constructive feedback. We want to reduce the anxiety of the job search by providing a transparent look into how their professional story is being read by both algorithms and humans.

---

# Chapter 2: LITERATURE SURVEY / EXISTING SYSTEM

### Review of the existing systems
Current systems like Jobscan or ResumeWorded primarily focus on ATS compatibility. While useful, they often miss the human element. They might tell you if you have the word "Python" ten times, but they won't tell you if your description of a project sounds impactful to a technical lead. 

### Description
CVly improves upon these by:
1.  **Semantic Analysis:** Using Gemini's advanced context window to understand the *meaning* behind sentences, not just the words.
2.  **Persona Simulation:** Providing specific critique tailored to different roles in the hiring chain.
3.  **Real-time PDF Parsing:** All processing happens in the browser or via a secure backend, providing instant results without manual data entry.
4.  **Automatic Job Extraction:** Users can simply paste a URL, and the system extracts the relevant requirements.

---

# Chapter 3: PROBLEM DEFINITION AND SCOPE

### 3.1 Goal statement
To develop a production-ready web application that provides holistic resume evaluation and design suggestions using the Google Gemini API.

### 3.2 Objectives
*   Implement secure PDF text extraction.
*   Build a responsive UI using React and Tailwind CSS.
*   Develop a backend proxy for secure Gemini API integration.
*   Visualize scoring data using interactive charts (Recharts).
*   Provide a comparison engine for A/B testing resumes.

### 3.3 Questions to stakeholders
*   "What are the top 3 reasons a resume is discarded in the first 5 seconds?"
*   "How often do recruiters actually use ATS scores vs. human scanning?"
*   "What design elements make a resume stand out to a Hiring Manager?"

### 3.4 Problem Canvas
*   **Users:** Job seekers, career switchers, students.
*   **Pain Points:** Lack of feedback, ATS rejection, poor formatting knowledge.
*   **Solutions:** AI-driven persona feedback, role-based analytics.

### 3.5 Solution Canvas
*   **Core Feature:** Multi-persona scoring gauge.
*   **Secondary Feature:** Job description URL parser.
*   **Delighters:** Smooth GSAP animations, dark mode support, comparative view.

### 3.6 MAJOR CONSTRAINTS
*   **API Rate Limits:** Managing the volume of requests to the Gemini API.
*   **PDF Complexity:** Handling multi-column or image-heavy resume layouts.
*   **Privacy:** Ensuring candidate data is processed securely and not stored permanently.

### 3.7 OUTCOME
*   A functional web application hosted on Cloud Run.
*   A comprehensive analysis report for every uploaded resume.
*   Increased user awareness of resume presentation.

### 3.8 APPLICATIONS
*   Career centers in educational institutes.
*   Recruitment agencies for pre-screening guidance.
*   Self-service career coaching platforms.

### 3.9 HARDWARE RESOURCES REQUIRED
| Sr. No. | Parameter | Minimum Requirement | Justification |
| :--- | :--- | :--- | :--- |
| 1 | CPU | 2 GHz (Modern Quad-Core) | Essential for real-time PDF rendering and UI responsiveness. |
| 2 | RAM | 4 GB | Required to handle multiple browser tabs and heavy JS execution. |
| 3 | Network | 5 Mbps | Needed for fast API communication with Gemini servers. |

### 3.10 SOFTWARE RESOURCES REQUIRED
*   **Operating System:** Windows/macOS/Linux
*   **IDE:** VS Code / AI Studio
*   **Programming Language:** TypeScript, Node.js
*   **Frameworks:** React 19, Vite, Express
*   **Libraries:** Gemini SDK (@google/genai), GSAP, Tailwind CSS, Recharts

---

# Chapter 4: PHOTOGRAPHS / SCREENSHOTS

*(In a live report, these would be actual images. Below are descriptions of the primary screens)*

1.  **Hero Section:** A sleek, dark-themed landing page with a "Remix Your Resume" call to action and floating abstract visual elements created with GSAP.
2.  **Upload Dashboard:** An interactive zone where users can drag and drop their resumes and paste job URLs. Includes real-time validation feedback.
3.  **Analysis View:** A bento-grid style dashboard showing three persona cards (ATS, HR, Manager) with circular progress indicators, pros/cons lists, and a combined bar chart.
4.  **Comparison Mode:** A side-by-side view highlighting which resume version performed better across different metrics.

---

# Chapter 5: SUMMARY AND CONCLUSION

**Summary:**
CVly addresses a critical gap in the ed-tech and HR-tech space. By leveraging the latest breakthroughs in Generative AI, we have moved beyond simple keyword matching to a sophisticated evaluation system that respects the complexity of professional backgrounds.

**Conclusion:**
The project demonstrates that AI can be a powerful tool for transparency in hiring. Through a clean, modern interface and robust architectural design, CVly provides users with a distinct advantage in their career journey. Future developments could include LinkedIn profile scraping and automated resume tailoring.

---

# REFERENCES
1.  **Google Gemini Documentation:** [https://ai.google.dev/docs](https://ai.google.dev/docs)
2.  **React Documentation:** [https://react.dev/](https://react.dev/)
3.  **Tailwind CSS Documentation:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
4.  **PDF.js Documentation:** [https://mozilla.github.io/pdf.js/](https://mozilla.github.io/pdf.js/)
5.  **GSAP Animation Docs:** [https://gsap.com/docs/](https://gsap.com/docs/)
