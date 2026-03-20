import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Activity, Clock, FileText, Users, MessageSquareText } from "lucide-react";
import DataTable from "@/components/DataTable";
import Link from "next/link";

function generateSegmentsFromContent(content: string) {
  // If we don't have DB segments, we dynamically chunk the content to visualize the timeline
  const chunks = content.split('\n\n').filter(c => c.length > 50);
  if (chunks.length === 0) chunks.push(content);
  
  // Create ~10 chunks max for visualization
  const targetChunks = 10;
  const chunkSize = Math.max(1, Math.floor(chunks.length / targetChunks));
  
  const segments = [];
  const sentiments = ['Neutral', 'Enthusiastic', 'Positive', 'Conflict', 'Uncertainty'];
  
  for (let i = 0; i < chunks.length; i += chunkSize) {
    const textChunk = chunks.slice(i, i + chunkSize).join('\n\n');
    let sentimentStr = 'Neutral';
    
    // Very basic heuristic for demo purposes
    if (textChunk.toLowerCase().match(/happy|great|excellent|excited|good idea/)) sentimentStr = 'Enthusiastic';
    else if (textChunk.toLowerCase().match(/disagree|no|bad|wrong|issue|problem/)) sentimentStr = 'Conflict';
    else if (textChunk.toLowerCase().match(/maybe|not sure|perhaps/)) sentimentStr = 'Uncertainty';
    else if (textChunk.toLowerCase().match(/agree|yes|good/)) sentimentStr = 'Positive';
    
    segments.push({
      id: `seg-${i}`,
      text: textChunk,
      sentiment: sentimentStr,
      speaker: textChunk.split(':')[0] || 'Unknown'
    });
  }
  
  return segments;
}

export default async function MeetingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meeting = await prisma.transcript.findUnique({
    where: { id },
    include: { actionItems: true, decisions: true, segments: true }
  });

  if (!meeting) return notFound();

  const segments = meeting.segments.length > 0 ? meeting.segments : generateSegmentsFromContent(meeting.content);

  const sentimentColors: Record<string, string> = {
    'Positive': '#22c55e', // green
    'Neutral': '#64748b',  // slate
    'Negative': '#ef4444', // red
    'Conflict': '#f43f5e', // rose
    'Enthusiastic': '#3b82f6', // blue
    'Uncertainty': '#eab308'   // yellow
  };

  return (
    <div className="animate-fade-in flex flex-col gap-8">
      {/* Header */}
      <header>
        <Link href="/" className="text-secondary hover:text-white mb-4 inline-block transition-colors" style={{textDecoration: 'none'}}>
          ← Back to Dashboard
        </Link>
        <h1 className="gradient-text" style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>{meeting.title}</h1>
        <div className="flex gap-6 mt-4 text-secondary" style={{fontSize: '0.95rem'}}>
          <div className="flex items-center gap-2"><Clock size={18} /> {meeting.createdAt.toLocaleDateString()}</div>
          <div className="flex items-center gap-2"><Users size={18} /> {meeting.speakerCount} Speakers</div>
          <div className="flex items-center gap-2"><FileText size={18} /> {meeting.wordCount} Words</div>
          <div className="flex items-center gap-2">
            <Activity size={18} /> 
            <span style={{color: sentimentColors[meeting.sentiment || 'Neutral'], fontWeight: 600}}>{meeting.sentiment}</span>
          </div>
        </div>
      </header>

      {/* Sentiment Timeline Visualization */}
      <section className="glass-panel p-6" style={{padding: '1.5rem'}}>
        <h2 style={{fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <Activity size={20} className="text-secondary" />
          Meeting Sentiment Timeline
        </h2>
        
        <div className="flex rounded-full overflow-hidden h-8 w-full shadow-inner" style={{background: 'rgba(0,0,0,0.2)'}}>
          {segments.map((seg: any, idx: number) => (
            <div 
              key={seg.id}
              title={`${seg.speaker}: ${seg.sentiment}`}
              style={{
                flex: 1, 
                background: sentimentColors[seg.sentiment || 'Neutral'] || sentimentColors['Neutral'],
                opacity: 0.9,
                borderRight: idx !== segments.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                cursor: 'pointer',
                transition: 'opacity 0.2s hover:opacity-100'
              }}
              className="hover:opacity-100"
            />
          ))}
        </div>
        <div className="flex justify-between mt-3 text-secondary" style={{fontSize: '0.8rem'}}>
          <span>Start</span>
          <span>End</span>
        </div>
        
        {/* Legend */}
        <div className="flex gap-4 mt-6 flex-wrap justify-center">
          {Object.entries(sentimentColors).map(([label, color]) => (
            <div key={label} className="flex items-center gap-2 text-secondary" style={{fontSize: '0.85rem'}}>
              <div style={{width: '12px', height: '12px', borderRadius: '50%', background: color}}></div>
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Extracted Insights */}
      <section>
        <h2 style={{fontSize: '1.25rem', marginBottom: '1rem'}}>Extracted Insights</h2>
        {/* Pass array with just this meeting to reuse DataTable */}
        <DataTable transcripts={[meeting]} />
      </section>

      {/* Raw Transcript Area */}
      <section className="glass-panel p-6" style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '500px'}}>
        <h2 style={{fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <MessageSquareText size={20} className="text-secondary" />
          Raw Transcript Log
        </h2>
        <div className="flex-1 overflow-y-auto pr-4" style={{fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.6}}>
          {segments.map((seg: any) => (
            <div 
              key={seg.id} 
              className="mb-4 p-4 rounded-lg" 
              style={{
                borderLeft: `4px solid ${sentimentColors[seg.sentiment || 'Neutral'] || 'transparent'}`,
                background: 'rgba(255,255,255,0.02)'
              }}
            >
              <div className="font-bold mb-1 flex justify-between">
                <span>{seg.speaker}</span>
                <span style={{color: sentimentColors[seg.sentiment || 'Neutral'], fontSize: '0.8rem'}}>{seg.sentiment}</span>
              </div>
              <p className="text-secondary whitespace-pre-wrap">{seg.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
