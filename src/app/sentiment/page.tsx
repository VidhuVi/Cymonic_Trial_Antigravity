import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Activity, Clock, Users, ChevronRight } from "lucide-react";

export default async function SentimentPage() {
  const transcripts = await prisma.transcript.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const sentimentColors: Record<string, string> = {
    'Positive': '#22c55e',
    'Neutral': '#64748b',
    'Negative': '#ef4444',
    'Conflict': '#f43f5e',
    'Enthusiastic': '#3b82f6',
    'Uncertainty': '#eab308'
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="gradient-text" style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>Meeting Sentiment</h1>
        <p className="text-secondary">Track the emotional tone and overall vibe of your organizational meetings.</p>
      </header>
      
      <div className="grid grid-cols-1 gap-4">
        {transcripts.map((t: any) => (
          <Link href={`/meeting/${t.id}`} key={t.id} style={{textDecoration: 'none'}}>
            <div className="glass-panel flex items-center p-6 hover:bg-white/5 transition-colors" style={{padding: '1.5rem', display: 'flex', alignItems: 'center'}}>
              
              <div className="flex-1">
                <h3 style={{fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)'}}>{t.title}</h3>
                <div className="flex gap-4 text-secondary" style={{fontSize: '0.9rem'}}>
                  <span className="flex items-center gap-1"><Clock size={14}/>{t.createdAt.toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Users size={14}/>{t.speakerCount} Speakers</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2" style={{color: sentimentColors[t.sentiment || 'Neutral'], fontWeight: 600}}>
                  <Activity size={18} />
                  {t.sentiment || 'Neutral'}
                </div>
                <div className="flex items-center text-indigo-400" style={{fontSize: '0.85rem'}}>
                  View Detail <ChevronRight size={14} />
                </div>
              </div>

            </div>
          </Link>
        ))}

        {transcripts.length === 0 && (
          <div className="glass-panel p-12 text-center text-secondary">
            No meeting data available to analyze sentiment.
          </div>
        )}
      </div>
    </div>
  );
}
