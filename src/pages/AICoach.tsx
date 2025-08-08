import React, { useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/button';
import { supabase } from '../integrations/supabase/client';

const tabs = ['Chat', 'Settings', 'Sources', 'Alerts'] as const;

type Tab = typeof tabs[number];

type Message = { role: 'user' | 'assistant'; content: string };

const AICoach = () => {
  const [active, setActive] = useState<Tab>('Chat');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Welcome to AI Trading Coach. Ask me about SMC setups, risk, or trade management.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const send = async () => {
    if (!canSend) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-coach-chat', {
        body: { messages: [...messages, userMsg] }
      });
      if (error) throw error;
      const reply = (data as any)?.reply || 'Sorry, I could not generate a response.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', content: 'There was an error. Please try again.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }), 50);
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Coach | Wakeman Capital</title>
        <meta name="description" content="Live SMC trading coach: chat for strategies, risk, entries, and management." />
        <link rel="canonical" href="/coach" />
      </Helmet>
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <header className="mb-4">
            <h1 className="text-3xl font-bold text-foreground mb-2">AI Coach</h1>
            <p className="text-muted-foreground">Chat with an SMC-focused trading coach. London session focus, RRR ≥ 2:1.</p>
          </header>

          <div className="rounded-lg border border-border bg-card">
            <div className="grid grid-cols-4 gap-0 border-b border-border text-sm">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setActive(t)}
                  className={`py-3 px-4 text-center ${active === t ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="p-6">
              {active === 'Chat' && (
                <section className="space-y-4">
                  <div ref={listRef} className="h-80 rounded-md border border-border bg-background/60 p-4 overflow-y-auto">
                    <ul className="space-y-3">
                      {messages.map((m, i) => (
                        <li key={i} className={`max-w-[85%] ${m.role === 'user' ? 'ml-auto' : ''}`}>
                          <div className={`rounded-md px-3 py-2 text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-card-foreground'}`}>
                            {m.content}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-end gap-3">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask anything about SMC, risk, entries, or management..."
                      className="flex-1 rounded-md border border-input bg-background p-3 text-sm"
                      rows={3}
                    />
                    <Button onClick={send} disabled={!canSend}>{loading ? 'Thinking…' : 'Ask'}</Button>
                  </div>
                </section>
              )}

              {active === 'Settings' && <p className="text-muted-foreground">Model: OpenAI • gpt-4o-mini. Voice/Realtime coming next.</p>}
              {active === 'Sources' && <p className="text-muted-foreground">Manage sources (X, News, custom URLs) — not yet connected.</p>}
              {active === 'Alerts' && <p className="text-muted-foreground">Configure trading alerts — uses your existing Alerts in Signals.</p>}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AICoach;
