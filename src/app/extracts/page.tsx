import { prisma } from "@/lib/prisma";
import DataTable from "@/components/DataTable";

export default async function ExtractsPage() {
  const transcripts = await prisma.transcript.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      actionItems: true,
      decisions: true
    }
  });

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="gradient-text" style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>Decisions & Actions</h1>
        <p className="text-secondary">Review all automatically extracted action items and key decisions from your meetings.</p>
      </header>
      
      <DataTable transcripts={transcripts} />
    </div>
  );
}
