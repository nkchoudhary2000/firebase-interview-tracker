# 🎯 InterviewTracker — Career Intelligence & Interview Management

A modern, full-stack **Interview Tracker** web service designed to manage, organize, and prepare for multi-stage technical interviews. Built with **React**, **Tailwind CSS**, **Firebase (Auth & Firestore)**, and **Google Workspace (Gmail API)** integration, featuring an interactive **hierarchical tree view** with **multi-level Markdown export**.

---

## ✨ Key Features

### 1. 🔐 Google Authentication & Gmail OAuth
- **Strict Google Sign-In**: Authenticate using verified Gmail accounts.
- **Gmail Readonly Scope**: Seamlessly requests `https://www.googleapis.com/auth/gmail.readonly` during OAuth login.
- **OAuth Token Management**: Securely passes the access token to the Google Workspace Gmail REST API v1.

### 2. 📬 Google Workspace Gmail Integration
- **Labels Explorer**: Fetch and filter user inbox labels (`INBOX`, `STARRED`, `Interviews`, `Job Offers`, etc.) with message counters.
- **Email Thread Viewer**: Read conversation threads, recruitment updates, and offer letters directly in a clean card/accordion UI.
- **One-Click Dossier Draft**: Automatically convert an interview invitation email into an interview profile with pre-filled recruiter details.

### 3. 🏢 Cloud Firestore Interview Data Model
Comprehensive schema tailored for multi-round interview tracking:
- **Company Profile**: Name, Size, Location, Applied Date, Target Role, URL.
- **Expected Compensation**: Target CTC, Base + Bonus + Equity breakdown.
- **Application Statuses**: `Applied`, `Screening`, `Interviewing`, `Offered`, `Accepted`, `Rejected`, `Withdrawn`.
- **HR & Talent Contacts**: Recruiter names, emails, direct phone lines, and communication notes.
- **Interviewers & Panelists**: Interviewer names, engineering roles, and LinkedIn links.
- **Rounds & Stages**: Round Name, Date, Status (`Scheduled`, `Cleared`, `Failed`, `Pending Feedback`), notes, and feedback.
- **Questions & Answers**: Question text, answer talking points, code snippets, and topic categories.

### 4. 🌳 Recursive Collapsible Tree Structure & Multi-Level Markdown Copier
- **Nested Tree Visualizer**: Explore the full hierarchy: `Company -> Overview / HR Contacts / Interviewers / Rounds -> Round Details -> Q&A Pairs`.
- **Copy as Markdown at EVERY Level**:
  - 🏢 **Company Root Node**: Copies the complete interview dossier (Overview table, HR list, Interviewers, all Rounds with Q&As).
  - 👥 **HR Contacts Subtree**: Copies formatted Markdown table of all recruiters.
  - 🧑‍💻 **Interviewers Subtree**: Copies list of interviewers with LinkedIn links.
  - 🎯 **Rounds Subtree**: Copies all rounds timeline with nested Q&As.
  - 📌 **Single Round Node**: Copies that specific round's details and questions.
  - 💬 **Individual Q&A Node**: Copies question, topic, and formatted answer blockquote.
  - 👤 **Single Contact Node**: Copies contact card.

### 5. 🧠 Central Q&A Knowledge Bank & Study Guide
- Centralized database of all technical questions logged across all companies.
- Filter questions by topic (e.g. *Distributed Systems*, *Browser Performance*, *Memory Management*, *Behavioral*).
- One-click **"Copy Filtered as Study Guide"** Markdown export for rapid interview preparation.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom dark glassmorphism and glowing palettes
- **BaaS & Database**: [Firebase Authentication](https://firebase.google.com/docs/auth), [Cloud Firestore](https://firebase.google.com/docs/firestore), [Firebase Hosting](https://firebase.google.com/docs/hosting)
- **Integrations**: [Google Workspace Gmail API v1](https://developers.google.com/gmail/api)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Firebase project with **Authentication (Google provider)** and **Firestore Database** enabled.

### 2. Installation

```bash
# Clone repository
git clone <repo-url>
cd firebase-interview-tracker

# Install dependencies
npm install
```

### 3. Environment Configuration

Create a `.env` file from the provided `.env.example`:

```bash
cp .env.example .env
```

Populate `.env` with your Firebase web app keys (from [Firebase Console](https://console.firebase.google.com/)):

```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef1234567890"
VITE_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"
```

> **Note**: The application includes a rich **Demo Mode** enabled by default when API keys are pending, allowing full interactive exploration of the tree visualizer, sample dossiers, and simulated Gmail explorer.

### 4. Running Locally

```bash
npm run dev
```

The application will start on `http://localhost:3000`.

### 5. Production Build

```bash
npm run build
npm run preview
```

---

## 🔒 Security & Google OAuth Configuration

1. In the **Google Cloud Console** / **Firebase Authentication** settings:
   - Enable **Google** sign-in provider.
   - Under **Google API Scopes**, add `https://www.googleapis.com/auth/gmail.readonly`.
   - Add your local dev URL (`http://localhost:3000`) and production hosting domain to **Authorized Domains**.
2. **Firestore Security Rules**:
   - `firestore.rules` is configured so each authenticated user can only read and write their own interview documents (`userId == request.auth.uid`).

---

## 📄 License
MIT License © 2026
