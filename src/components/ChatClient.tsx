"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, FileText } from "lucide-react";

export default function ChatClient({ transcripts }: { transcripts: any[] }) {
  const [selectedTranscript, setSelectedTranscript] = useState<string>("ALL");
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Hello! I am your Meeting Intelligence assistant. Ask me anything about the uploaded meetings, and I will search the chosen transcripts to find the answer.' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage, 
          history: messages,
          transcriptId: selectedTranscript === "ALL" ? null : selectedTranscript
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error: " + (data.error || "Unknown error") }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, network error prevented the request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <header className="mb-6 flex flex-col gap-4">
        <div>
          <h1 className="gradient-text" style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>Contextual Query Engine</h1>
          <p className="text-secondary">Ask natural language questions across your meeting transcripts.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-secondary flex items-center gap-2" style={{fontSize: '0.9rem', whiteSpace: 'nowrap'}}>
            <FileText size={16} /> Chat Context:
          </label>
          <select 
            value={selectedTranscript}
            onChange={(e) => setSelectedTranscript(e.target.value)}
            className="input-field"
            style={{ padding: '0.5rem 1rem', maxWidth: '300px', cursor: 'pointer', background: 'var(--bg-color)', border: '1px solid var(--surface-border)' }}
          >
            <option value="ALL">All Meetings</option>
            {transcripts.map(t => (
              <option key={t.id} value={t.id}>{t.title} ({new Date(t.createdAt).toLocaleDateString()})</option>
            ))}
          </select>
        </div>
      </header>

      <div className="glass-panel flex-1 overflow-hidden flex flex-col" style={{display: 'flex', flexDirection: 'column'}}>
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          {messages.map((msg, idx) => (
            <div key={idx} className="flex gap-4" style={{display: 'flex', gap: '1rem', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'}}>
              <div className="shrink-0 rounded-full flex items-center justify-center" style={{width: '40px', height: '40px', background: msg.role === 'user' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(236, 72, 153, 0.2)', color: msg.role === 'user' ? 'var(--primary-color)' : 'var(--accent-color)'}}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div 
                className="p-4 rounded-2xl" 
                style={{
                  background: msg.role === 'user' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.05)', 
                  border: msg.role === 'user' ? 'none' : '1px solid var(--surface-border)',
                  color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                  maxWidth: '80%',
                  borderRadius: msg.role === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4" style={{display: 'flex', gap: '1rem'}}>
              <div className="shrink-0 rounded-full flex items-center justify-center" style={{width: '40px', height: '40px', background: 'rgba(236, 72, 153, 0.2)', color: 'var(--accent-color)'}}>
                <Bot size={20} />
              </div>
              <div className="p-4 rounded-2xl flex items-center gap-2 text-secondary" style={{background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--surface-border)', borderRadius: '16px 16px 16px 0'}}>
                <Loader2 size={16} className="animate-spin" /> Fetching insights...
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t" style={{borderTop: '1px solid var(--surface-border)', background: 'rgba(0, 0, 0, 0.2)'}}>
          <form onSubmit={sendMessage} className="flex gap-3" style={{display: 'flex', gap: '0.75rem'}}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g. What were the main concerns raised by the Finance Lead?"
              className="flex-1 input-field w-full"
              style={{background: 'rgba(255, 255, 255, 0.05)'}}
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="btn btn-primary" style={{padding: '0 1.5rem'}}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
