import React, { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import * as XLSX from 'xlsx';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../hooks/useAuth';

const normalizeUrl = (u: string) => {
  try {
    let url = u.trim();
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    url = url.replace(/[),.;]+$/g, '');
    const parsed = new URL(url);
    parsed.host = parsed.host.toLowerCase();
    if ((parsed.protocol === 'http:' && parsed.port === '80') || (parsed.protocol === 'https:' && parsed.port === '443')) parsed.port = '';
    return parsed.toString();
  } catch {
    return '';
  }
};

const AICoachSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  type Settings = { provider: 'OpenAI' | 'Anthropic'; model: string; systemPrompt: string; temperature: number };
  const defaultPrompt = "You are Wakeman Capital's AI Trading Coach. Be concise, structured, and risk-aware. Prefer London session setups, SMC concepts (CHoCH, BOS, FVG, OB, liquidity), and enforce RRR ≥ 2:1 with disciplined risk management.";

  const [settings, setSettings] = useState<Settings>({ provider: 'OpenAI', model: 'gpt-4o-mini', systemPrompt: defaultPrompt, temperature: 0.3 });
  const [settingsRowId, setSettingsRowId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [sources, setSources] = useState<string[]>([]);
  const [newSource, setNewSource] = useState('');

  // Load settings and sources for this admin (per-account)
  useEffect(() => {
    const init = async () => {
      if (!user) return;
      const [settingsRes, sourcesRes] = await Promise.all([
        supabase.from('ai_coach_settings').select('id,provider,model,system_prompt,tools').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('ai_coach_sources').select('url,is_active').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);
      const sData: any = settingsRes.data;
      if (sData) {
        setSettingsRowId(sData.id);
        setSettings(prev => ({
          ...prev,
          provider: sData.provider?.toLowerCase() === 'anthropic' ? 'Anthropic' : 'OpenAI',
          model: sData.model ?? prev.model,
          systemPrompt: sData.system_prompt ?? prev.systemPrompt,
          temperature: typeof sData.tools?.temperature === 'number' ? sData.tools.temperature : prev.temperature,
        }));
      }
      const srcData: any[] = (sourcesRes.data as any[]) || [];
      setSources(srcData.filter(r => r.is_active).map(r => r.url));
    };
    init();
  }, [user]);

  const saveSettings = async () => {
    try {
      setSaving(true);
      if (!user) throw new Error('Not authenticated');
      const payload: any = {
        user_id: user.id,
        provider: settings.provider.toLowerCase(),
        model: settings.model,
        system_prompt: settings.systemPrompt,
        tools: { temperature: settings.temperature },
      };
      if (settingsRowId) {
        const { error } = await supabase.from('ai_coach_settings').update(payload).eq('id', settingsRowId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('ai_coach_settings').insert(payload).select('id').single();
        if (error) throw error;
        setSettingsRowId((data as any)?.id ?? null);
      }
      toast({ title: 'Settings saved', description: 'AI Coach configuration updated.' });
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Save failed', description: e?.message ?? 'Could not save settings.' });
    } finally {
      setSaving(false);
    }
  };

  const importFile = async (files: FileList | null) => {
    try {
      if (!files || files.length === 0) return;
      const file = files[0];
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      const DOMAIN_OR_URL = /((https?:\/\/)?(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[\w\-._~:\/?#\[\]@!$&'()*+,;=%]*)?)/gi;
      const extracted = new Set<string>();
      for (const row of rows) {
        if (!Array.isArray(row)) continue;
        for (const cell of row) {
          if (typeof cell !== 'string') continue;
          for (const match of cell.matchAll(DOMAIN_OR_URL)) {
            const norm = normalizeUrl(match[0]);
            if (norm) extracted.add(norm);
          }
        }
      }
      const existingSet = new Set(sources.map(s => normalizeUrl(s)).filter(Boolean));
      const newUrls = Array.from(extracted).filter((u) => !existingSet.has(u));
      if (newUrls.length === 0) {
        toast({ title: 'No new sources found', description: 'Make sure cells contain URLs or domains.' });
        return;
      }
      setSources(prev => [...prev, ...newUrls]);
      if (user) {
        const payload = newUrls.map((url) => ({ user_id: user.id, url, is_active: true }));
        const { error } = await supabase.from('ai_coach_sources').upsert(payload, { onConflict: 'user_id,url' });
        if (error) throw error;
      }
      toast({ title: 'Sources imported', description: `Added/updated ${newUrls.length} source(s).` });
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Import failed', description: e?.message ?? 'Please check your file and try again.' });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Coach Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
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
          <div className="flex gap-2">
            <Button onClick={saveSettings} disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</Button>
            <Button variant="outline" onClick={() => setSettings({ provider: 'OpenAI', model: 'gpt-4o-mini', systemPrompt: defaultPrompt, temperature: 0.3 })}>Reset to default</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Coach Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              placeholder="Add source URL or keyword (e.g. https://news.site/forex)"
              className="flex-1 min-w-[240px] rounded-md border border-input bg-background p-2 text-sm"
            />
            <Button
              onClick={async () => {
                const raw = newSource.trim();
                const v = normalizeUrl(raw);
                if (!v) return;
                if (sources.includes(v)) { setNewSource(''); return; }
                setSources(prev => [...prev, v]);
                setNewSource('');
                try {
                  if (user) {
                    const { error } = await supabase.from('ai_coach_sources').upsert({ user_id: user.id, url: v, is_active: true }, { onConflict: 'user_id,url' });
                    if (error) console.error('Add source error:', error);
                  }
                } catch (e) { console.error('Add source exception:', e); }
              }}
              disabled={!newSource.trim()}
            >Add</Button>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              Import file
            </Button>
            <input type="file" ref={fileInputRef} accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => importFile(e.target.files)} />
          </div>

          {sources.length === 0 ? (
            <p className="text-muted-foreground text-sm">No sources yet. Add your preferred news, X accounts, or custom URLs.</p>
          ) : (
            <ul className="space-y-2">
              {sources.map((s, i) => (
                <li key={i} className="flex items-center justify-between rounded-md border border-border bg-card/50 p-2">
                  <span className="truncate text-sm text-card-foreground" title={s}>{s}</span>
                  <button
                    onClick={async () => {
                      const url = s;
                      setSources(prev => prev.filter((_, idx) => idx !== i));
                      try {
                        if (user) {
                          const { error } = await supabase.from('ai_coach_sources').update({ is_active: false }).match({ user_id: user.id, url });
                          if (error) console.error('Remove source error:', error);
                        }
                      } catch (e) { console.error('Remove source exception:', e); }
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >Remove</button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AICoachSettings;
