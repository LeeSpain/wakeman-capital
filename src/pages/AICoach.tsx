import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/button';
import { supabase } from '../integrations/supabase/client';
import { AlertsList } from '../components/signals/AlertsList';

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

  type Settings = { provider: 'OpenAI' | 'Anthropic'; model: string; systemPrompt: string; temperature: number };
  const defaultPrompt = "You are Wakeman Capital's AI Trading Coach. Be concise, structured, and risk-aware. Prefer London session setups, SMC concepts (CHoCH, BOS, FVG, OB, liquidity), and enforce RRR ≥ 2:1 with disciplined risk management.";

  const [settings, setSettings] = useState<Settings>({ provider: 'OpenAI', model: 'gpt-4o-mini', systemPrompt: defaultPrompt, temperature: 0.3 });
  const [sources, setSources] = useState<string[]>([]);
  const [newSource, setNewSource] = useState('');
  const [contextUsed, setContextUsed] = useState<{ tools: string[]; sources: string[] }>({ tools: [], sources: [] });

  useEffect(() => {
    try {
      const s = localStorage.getItem('aiCoach.settings');
      const src = localStorage.getItem('aiCoach.sources');
      if (s) setSettings(prev => ({ ...prev, ...JSON.parse(s) }));
      if (src) setSources(JSON.parse(src));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('aiCoach.settings', JSON.stringify(settings));
      localStorage.setItem('aiCoach.sources', JSON.stringify(sources));
    } catch {}
  }, [settings, sources]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const send = async (textOverride?: string) => {
    const content = (textOverride ?? input).trim();
    if (!content || loading) return;
    const userMsg: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    if (!textOverride) setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-coach-chat', {
        body: { messages: [...messages, userMsg], settings, sources }
      });
      if (error) throw error;
      const reply = (data as any)?.reply || 'Sorry, I could not generate a response.';
      const used_tools = (data as any)?.used_tools ?? [];
      const used_sources = (data as any)?.used_sources ?? [];
      setContextUsed({ tools: used_tools, sources: used_sources });
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
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm" onClick={() => send('Show top 5 active signals with confidence ≥ 88. For each: symbol, timeframe, direction, entry, stop, TP1, and include a TradingView link.')}>Top opps</Button>
                    <Button variant="secondary" size="sm" onClick={() => send('Summarize the latest trend_analysis: strongest confluence symbols by timeframe (brief bullets).')}>Latest trends</Button>
                    <Button variant="secondary" size="sm" onClick={() => send('Give a market snapshot for XAUUSD on 4h: recent OHLCV changes, any active signal alignment, and a TradingView link.')}>XAUUSD 4h</Button>
                    <Button variant="secondary" size="sm" onClick={() => send('Summarize key points from my saved sources relevant to FX today. Cite source names.')}>Summarize sources</Button>
                  </div>
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

                  { (contextUsed.tools.length > 0 || contextUsed.sources.length > 0) && (
                    <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                      <span>Context used:</span>
                      {contextUsed.tools.map((t, i) => (
                        <span key={i} className="rounded border border-border bg-card/60 px-2 py-0.5">{t.replace('_', ' ')}</span>
                      ))}
                      {contextUsed.sources.slice(0, 2).map((s, i) => (
                        <span key={i} className="rounded border border-border bg-card/60 px-2 py-0.5" title={s}>{s}</span>
                      ))}
                      {contextUsed.sources.length > 2 && (
                        <span className="text-muted-foreground">+{contextUsed.sources.length - 2} more</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-end gap-3">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask anything about SMC, risk, entries, or management..."
                      className="flex-1 rounded-md border border-input bg-background p-3 text-sm"
                      rows={3}
                    />
                    <Button onClick={() => send()} disabled={!canSend}>{loading ? 'Thinking…' : 'Ask'}</Button>
                  </div>
                </section>
              )}

              {active === 'Settings' && (
                <section className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Provider</label>
                      <select
                        value={settings.provider}
                        onChange={(e) => setSettings(s => ({ ...s, provider: e.target.value as Settings['provider'] }))}
                        className="w-full rounded-md border border-input bg-background p-2 text-sm"
                      >
                        <option>OpenAI</option>
                        <option>Anthropic</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Model</label>
                      <input
                        value={settings.model}
                        onChange={(e) => setSettings(s => ({ ...s, model: e.target.value }))}
                        className="w-full rounded-md border border-input bg-background p-2 text-sm"
                        placeholder="e.g. gpt-4o-mini"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Temperature: {settings.temperature.toFixed(2)}</label>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={settings.temperature}
                        onChange={(e) => setSettings(s => ({ ...s, temperature: Number(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">System Prompt</label>
                    <textarea
                      value={settings.systemPrompt}
                      onChange={(e) => setSettings(s => ({ ...s, systemPrompt: e.target.value }))}
                      className="w-full rounded-md border border-input bg-background p-3 text-sm"
                      rows={5}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Settings are saved locally and used for all AI Coach replies.</p>
                </section>
              )}
              {active === 'Sources' && (
                <section className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      value={newSource}
                      onChange={(e) => setNewSource(e.target.value)}
                      placeholder="Add source URL or keyword (e.g. https://news.site/forex)"
                      className="flex-1 rounded-md border border-input bg-background p-2 text-sm"
                    />
                    <Button
                      onClick={() => {
                        const v = newSource.trim();
                        if (!v) return;
                        if (sources.includes(v)) return setNewSource('');
                        setSources(prev => [...prev, v]);
                        setNewSource('');
                      }}
                      disabled={!newSource.trim()}
                    >Add</Button>
                  </div>
                  {sources.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No sources yet. Add your preferred news, X accounts, or custom URLs.</p>
                  ) : (
                    <ul className="space-y-2">
                      {sources.map((s, i) => (
                        <li key={i} className="flex items-center justify-between rounded-md border border-border bg-card/50 p-2">
                          <span className="truncate text-sm text-card-foreground" title={s}>{s}</span>
                          <button
                            onClick={() => setSources(prev => prev.filter((_, idx) => idx !== i))}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >Remove</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )}
              {active === 'Alerts' && (
                <section className="space-y-3">
                  <p className="text-sm text-muted-foreground">Your latest alerts</p>
                  <AlertsList />
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AICoach;
