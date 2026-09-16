# MyResume Builder

A modern, high-performance, modular React application designed for building, customizing, and optimizing resumes and CVs with smart ATS compatibility checks and token-optimized AI Career Advisor integration.

---

## 🌟 Key Features

### 🎨 Category-Matched Templates & Design Controls

- **144+ Style Combinations**: Switch between 6 distinct document layouts (Standard, Executive, Minimal, Modern, Sidebar, Compact), curated color palettes, and Google Fonts typography.
- **US vs. International Standards**: Toggle seamlessly between US Resume (US Letter, no photo/DOB) and International CV (A4, optional headshot photo, photo alignment controls, Date of Birth).
- **Fine-Tuned Spacing & Sizing**: Real-time sliders for font size, line height, and section spacing with live print page-break indicators.

### 📊 Smart ATS Check & Requirement Fit Matrix

- **100-Point Readiness Score**: Automated analysis checking action verbs, contact details, metric densities, bullet counts, section structure, and photo layout alignment risks.
- **Job Description Keyword Analysis**: Weighted term-frequency analysis comparing candidate content against target job postings.
- **1-Click Missing Skill Pills**: Instantly inject missing technical and soft skills directly into your resume with a single click.

### 🤖 OpenRouter AI Career Advisor

- **Multi-Dimension Fit Breakdown**: Evaluates Technical Skills, Leadership & Strategy, Impact & Metrics, and Format & Structure.
- **1-Click Content Improvements**: Apply AI-suggested professional summaries and bullet-by-bullet STAR optimizations directly to your active draft.
- **Interview Preparation & Cover Letters**: Generates likely interview questions with STAR strategy tips and tailored cover letters exportable to plain text.
- **Full-Screen Loading Protection**: Prevents accidental context switching while AI analysis is processing, complete with a direct "Continue Editing" quick-route button.

### 💾 Persistent Workspace & Backup

- **Tab & Reload Persistence**: Auto-saves active drafts and generated AI reviews to `localStorage` (`myresume_builder_auto_draft`) so your evaluation results stay intact across tab navigation and browser refreshes.
- **Version Snapshots & JSON Portability**: Save named version snapshots in-browser or export/import complete `.json` backup files for total document control.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Installation

Clone or navigate to the project directory and install dependencies:

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory (or update existing `.env`):

```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_OPENROUTER_MODEL=openai/gpt-4o-mini
```

### 3. Development Server

Start the local Vite development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### 4. Production Build

To create an optimized production build:

```bash
npm run build
```

The output files will be generated in the `dist/` directory.

---

## 🔒 Security & Token Optimization

- **Zero Security Breaches**: API keys are loaded strictly via environment variables (`VITE_OPENROUTER_API_KEY`) and are never exposed in UI input forms or source control.
- **Strict Token Limits**: Input resume text is truncated to 2,000 characters and job descriptions to 1,500 characters prior to sending requests to OpenRouter. Max response tokens are capped at `1200` with `temperature: 0.2` to minimize latency and credit consumption.

---

## 📄 License

MIT License. Designed for personal and professional career enhancement.
