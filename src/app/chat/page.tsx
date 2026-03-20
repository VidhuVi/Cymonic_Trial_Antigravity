import { prisma } from "@/lib/prisma";
import ChatClient from "@/components/ChatClient";

export default async function ChatPage() {
  const transcripts = await prisma.transcript.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, createdAt: true }
  });

  return <ChatClient transcripts={transcripts} />;
}
