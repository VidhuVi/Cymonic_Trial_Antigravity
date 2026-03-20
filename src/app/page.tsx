import Uploader from "@/components/Uploader";
import { prisma } from "@/lib/prisma";
import { FileText, Users, Clock, MessageSquareText } from "lucide-react";
import Link from "next/link";
import DeleteMeetingButton from "@/components/DeleteMeetingButton";

export default async function Home() {
  const transcripts = await prisma.transcript.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      actionItems: true,
      decisions: true
    }
  });

  const totalTranscripts = transcripts.length;
  const totalActionItems = transcripts.reduce((acc: number, t: any) => acc + t.actionItems.length, 0);
  const avgSentiment = "Neutral"; // Placeholder

  return (
    <div className="animate-fade-in">
      <header className="mb-8 flex flex-col gap-4">
        <div>
          <h1 className="gradient-text" style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>Meeting Dashboard</h1>
          <p className="text-secondary">Overview of all processed meeting transcripts and extracted insights.</p>
        </div>
      </header>
      
      {/* Stats Summary */}
      <section className="flex gap-4 mb-8">
        <div className="glass-panel" style={{flex: 1, padding: '1.5rem'}}>
          <h3 className="text-secondary" style={{fontSize: '0.9rem', marginBottom: '0.5rem'}}>Total Transcripts</h3>
          <p style={{fontSize: '2rem', fontWeight: 'bold'}}>{totalTranscripts}</p>
        </div>
        <div className="glass-panel" style={{flex: 1, padding: '1.5rem'}}>
          <h3 className="text-secondary" style={{fontSize: '0.9rem', marginBottom: '0.5rem'}}>Action Items</h3>
          <p style={{fontSize: '2rem', fontWeight: 'bold'}}>{totalActionItems}</p>
        </div>
        <div className="glass-panel" style={{flex: 1, padding: '1.5rem'}}>
          <h3 className="text-secondary" style={{fontSize: '0.9rem', marginBottom: '0.5rem'}}>Avg Sentiment</h3>
          <p style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)'}}>{avgSentiment}</p>
        </div>
      </section>

      {/* Upload Component */}
      <Uploader />

      {/* Recent Transcripts */}
      <section className="mt-12 pt-8" style={{borderTop: '1px solid var(--surface-border)'}}>
        <h2 style={{fontSize: '1.25rem', marginBottom: '1.5rem'}}>Recent Meetings</h2>
        
        {transcripts.length === 0 ? (
          <div className="glass-panel" style={{padding: '3rem', textAlign: 'center'}}>
            <p className="text-secondary">No transcripts uploaded yet.</p>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem'}}>
            {transcripts.map((t: any) => (
              <Link href={`/meeting/${t.id}`} key={t.id} style={{textDecoration: 'none'}}>
                <div 
                  className="glass-panel transcript-card" 
                  style={{
                    padding: '1.5rem', 
                    cursor: 'pointer', 
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h3 style={{fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)'}}>
                      <MessageSquareText size={20} style={{color: '#818cf8'}} />
                      {t.title}
                    </h3>
                    <DeleteMeetingButton id={t.id} />
                  </div>
                  <div className="flex flex-col gap-2 mt-4 text-secondary" style={{fontSize: '0.9rem'}}>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2"><Clock size={16} /> Uploaded</span>
                      <span>{t.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2"><Users size={16} /> Speakers</span>
                      <span>{t.speakerCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2"><FileText size={16} /> Words</span>
                      <span>{t.wordCount}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
