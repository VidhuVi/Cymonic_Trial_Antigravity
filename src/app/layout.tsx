import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Mic, LayoutDashboard, ListChecks, MessageSquare, Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "Meeting Intelligence Hub",
  description: "AI-powered gathering of insights from meeting transcripts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          {/* Sidebar Navigation */}
          <aside className="sidebar pb-8">
            <div className="flex items-center gap-2 mb-8 mt-2">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl" style={{background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))'}}>
                <Mic size={24} color="white" />
              </div>
              <h1 className="text-xl font-bold m-0 pl-1" style={{fontSize: '1.1rem'}}>Intelligence Hub</h1>
            </div>

            <nav className="flex flex-col gap-2 mt-4" style={{flex: 1}}>
              <Link href="/" className="nav-item">
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>
              <Link href="/extracts" className="nav-item">
                <ListChecks size={20} />
                <span>Decisions & Actions</span>
              </Link>
              <Link href="/chat" className="nav-item">
                <MessageSquare size={20} />
                <span>AI Chatbot</span>
              </Link>
              <Link href="/sentiment" className="nav-item">
                <Activity size={20} />
                <span>Speaker Sentiment</span>
              </Link>
            </nav>
            
            <div className="mt-auto pt-4 border-t" style={{borderTop: '1px solid var(--surface-border)'}}>
              <p className="text-secondary" style={{fontSize: '0.8rem'}}>© 2026 Operations</p>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
