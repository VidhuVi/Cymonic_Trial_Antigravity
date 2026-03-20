# Meeting Intelligence Hub 🎙️🧠

The **Meeting Intelligence Hub** is an AI-powered web application that turns hours of dense meeting transcripts into actionable, organized insights in seconds. Simply drag and drop your meeting files, and let the system extract critical action items, document key decisions, and provide a global contextual chat assistant to search across all your organization's history.

> 🚀 **Built with Google Antigravity**  
> This entire application—from the Next.js backend schema to the sleek Vanilla CSS frontend—was designed, coded, and deployed iteratively using **Google's Antigravity AI coding assistant**. It serves as a comprehensive case study and learning project to explore advanced agentic AI capabilities, context-aware coding, and autonomous feature implementation.

---

## ✨ Features

- **Multi-Transcript Ingestion:** Drag-and-drop file interface with automatic `.txt` and `.vtt` parsing.
- **AI Insight Extractor:** Employs the `gemini-2.5-flash` model to instantly extract tasks, assignees, deadlines, and critical business decisions.
- **Global Chat Assistant:** A contextual chat UI that allows you to query specific meetings, or search across *all* accumulated transcripts simultaneously using conversational natural language.
- **Sentiment Timeline:** Visual dashboard tracking the emotional tone ("consensus", "conflict", "uncertainty") of conversations across different meetings.
- **Sleek UI/UX:** Built completely without UI libraries—featuring a stunning, responsive, dark-mode Glassmorphism aesthetic via pure Vanilla CSS/CSS Variables.

## 🛠️ Technology Stack

- **Frontend:** Next.js 15 (React, App Router)
- **Styling:** Custom Vanilla CSS
- **AI Integration:** Google Gemini API (`@google/genai`)
- **Database:** PostgreSQL (via Supabase / Neon)
- **ORM:** Prisma

---

## 🚀 Local Development Setup

To run this project locally, you will need Node.js and a PostgreSQL connection string.

1. **Clone the repository**
   ```bash
   git clone https://github.com/VidhuVi/Cymonic.git
   cd Cymonic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your keys:
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@your-postgres-url:6543/postgres?pgbouncer=true"
   GEMINI_API_KEY="your_google_ai_studio_key"
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```

4. **Initialize the Database**
   Push the Prisma schema to your remote database:
   ```bash
   npx prisma db push
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result!

---

## 📝 License & Credits
Created by Vidhu P. Vinod as an experimental deep-dive into AI-assisted frontend and backend engineering with Google DeepMind's Antigravity system.
