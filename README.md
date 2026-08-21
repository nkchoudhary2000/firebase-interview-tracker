# 🎯 InterviewTracker — Private Career Intelligence & Interview Management

A modern, secure **Interview Tracker** web application designed to manage, organize, and prepare for multi-stage technical interviews. Built with **React 18**, **Vite**, **Tailwind CSS**, **Firebase Authentication (Google Sign-In only)**, and **Cloud Firestore**, featuring an interactive **hierarchical tree view** and **multi-level Markdown export**.

---

## 🌐 Live Production Application

- **Live URL:** [https://interview-tracker-niomsolutionx.web.app](https://interview-tracker-niomsolutionx.web.app)
- **Firebase Project:** `niraj-portfolio-a7011`
- **Hosting Target:** `interview-tracker-niomsolutionx`

---

## ✨ Key Features

### 1. 🔒 Private Google Authentication Barrier
- **Strict Google Sign-In**: Unauthenticated visitors are presented with a private Google Sign-In landing page (`AuthGate`).
- **Zero Public Data**: No interview records, CTC details, or dossiers are accessible in the open.
- **Strict Per-User Firestore Scoping**: All interviews are isolated by `userId == user.uid` in Firestore security rules.

### 2. 🔍 Google-Style Company Name Search
- **Instant Search Suggestions**: As you type a company name, a clean dropdown suggests matching companies (Google, Stripe, Microsoft, Nvidia, etc.).
- **Manual Profile Control**: Selecting a company name populates only the company name, keeping all other profile fields blank for clean manual entry.

### 3. 🏢 Cloud Firestore Interview Data Model
Comprehensive schema tailored for multi-round interview tracking:
- **Company Profile**: Name, Size / Employee Count, Location, Applied Date, Target Role, URL.
- **Expected Compensation**: Target CTC / Comp breakdown.
- **Application Statuses**: `Applied`, `Screening`, `Interviewing`, `Offered`, `Accepted`, `Rejected`, `Withdrawn`.
- **HR & Talent Contacts**: Recruiter names, emails, direct phone lines, and notes.
- **Interviewers & Panelists**: Interviewer names, engineering titles, and LinkedIn profile URLs.
- **Rounds & Stages**: Round Name, Date, Status (`Scheduled`, `Cleared`, `Failed`, `Pending Feedback`), and round strategy notes.
- **Questions & Answers**: Technical questions, code snippets, talking points, and topic categorization.

### 4. 🌳 Recursive Collapsible Tree Hierarchy & Multi-Level Markdown Copier
- **Nested Tree Visualizer**: Explore the full structure: `Company -> Role Overview / HR Contacts / Interviewers / Rounds -> Round Details -> Q&A Pairs`.
- **Multi-Level Copy as Markdown**:
  - 🏢 **Company Root Node**: Copies complete dossier (Overview table, HR list, Interviewers, and all Rounds with Q&As).
  - 👥 **HR Contacts Subtree**: Copies formatted Markdown table of all recruiters.
  - 🧑‍💻 **Interviewers Subtree**: Copies list of interviewers with LinkedIn links.
  - 🎯 **Rounds Subtree**: Copies all rounds timeline with nested Q&As.
  - 📌 **Single Round Node**: Copies that specific round's details and questions.
  - 💬 **Individual Q&A Node**: Copies question, topic, and formatted answer blockquote.

### 5. 🧠 Central Q&A Knowledge Bank & Study Guide
- Centralized database of all technical questions logged across all companies.
- Filter questions by topic (e.g. *Distributed Systems*, *Browser Performance*, *Algorithms*, *System Design*).
- One-click **"Copy Filtered as Study Guide"** Markdown export for rapid interview preparation.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom dark glassmorphism and glowing palettes
- **BaaS & Database**: [Firebase Authentication](https://firebase.google.com/docs/auth), [Cloud Firestore](https://firebase.google.com/docs/firestore), [Firebase Hosting](https://firebase.google.com/docs/hosting)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Installation

```bash
# Clone repository
git clone https://github.com/nkchoudhary2000/firebase-interview-tracker.git
cd firebase-interview-tracker

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef1234567890"
VITE_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### 3. Running Locally

```bash
npm run dev
```

The application starts on `http://localhost:3000`.

### 4. Production Build & Deployment

```bash
# Build production bundle
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

---

## 📄 License
MIT License © 2026
