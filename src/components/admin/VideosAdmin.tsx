
import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../hooks/useAuth';
import { Trash2, Plus, Save, RefreshCw, Link as LinkIcon, PlayCircle } from 'lucide-react';

type VideoRow = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type VideoSettings = {
  key: string;
  nav_label: string;
  page_title: string;
  page_description: string | null;
  show_in_nav: boolean;
  updated_at: string;
};

const defaultSettings: Omit<VideoSettings, 'updated_at'> = {
  key: 'default',
  nav_label: 'Videos',
  page_title: 'How‑to Videos',
  page_description: 'Short tutorials to get the most out of the platform.',
  show_in_nav: true,
};

const toEmbedUrl = (url: string) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (u.pathname.startsWith('/embed/')) return url;
      if (u.pathname.startsWith('/shorts/')) {
        const id = u.pathname.split('/')[2];
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.replace('/', '');
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  } catch {
    return url;
  }
};

const VideosAdmin: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const [settings, setSettings] = useState<VideoSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSortOrder, setNewSortOrder] = useState<number>(0);
  const [adding, setAdding] = useState(false);

  const loadSettings = async () => {
    setLoadingSettings(true);
    const { data, error } = await supabase
      .from('videos_settings')
      .select('*')
      .eq('key', 'default')
      .maybeSingle();
    if (error) {
      console.error('Error loading videos_settings:', error);
      toast({ title: 'Error', description: 'Failed to load Video page settings.' });
      setSettings({ ...defaultSettings, updated_at: new Date().toISOString() });
    } else if (!data) {
      setSettings({ ...defaultSettings, updated_at: new Date().toISOString() });
    } else {
      setSettings(data as VideoSettings);
    }
    setLoadingSettings(false);
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSavingSettings(true);
    const payload = {
      key: 'default',
      nav_label: settings.nav_label || defaultSettings.nav_label,
      page_title: settings.page_title || defaultSettings.page_title,
      page_description: settings.page_description ?? defaultSettings.page_description,
      show_in_nav: settings.show_in_nav ?? true,
      updated_by: user?.id ?? null,
    };
    const { error } = await supabase
      .from('videos_settings')
      .upsert(payload, { onConflict: 'key' });
    if (error) {
      console.error('Error saving videos_settings:', error);
      toast({ title: 'Error', description: 'Could not save settings.' });
    } else {
      toast({ title: 'Saved', description: 'Settings updated successfully.' });
      loadSettings();
    }
    setSavingSettings(false);
  };

  const loadVideos = async () => {
    setLoadingVideos(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error loading videos:', error);
      toast({ title: 'Error', description: 'Failed to load videos.' });
      setVideos([]);
    } else {
      setVideos((data || []) as VideoRow[]);
    }
    setLoadingVideos(false);
  };

  const addVideo = async () => {
    if (!newTitle.trim() || !newUrl.trim()) {
      toast({ title: 'Missing info', description: 'Please add a title and a URL.' });
      return;
    }
    setAdding(true);
    const payload = {
      title: newTitle.trim(),
      url: newUrl.trim(),
      description: newDescription.trim() || null,
      sort_order: Number.isFinite(newSortOrder) ? newSortOrder : 0,
      created_by: user?.id ?? null,
      is_published: true,
    };
    const { error } = await supabase.from('videos').insert(payload);
    if (error) {
      console.error('Error adding video:', error);
      toast({ title: 'Error', description: 'Could not add video.' });
    } else {
      toast({ title: 'Added', description: 'Video was added.' });
      setNewTitle('');
      setNewUrl('');
      setNewDescription('');
      setNewSortOrder(0);
      await loadVideos();
    }
    setAdding(false);
  };

  const togglePublish = async (id: string, next: boolean) => {
    const { error } = await supabase.from('videos').update({ is_published: next }).eq('id', id);
    if (error) {
      console.error('Error updating publish state:', error);
      toast({ title: 'Error', description: 'Failed to update publish state.' });
    } else {
      setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, is_published: next } : v)));
    }
  };

  const deleteVideo = async (id: string) => {
    const { error } = await supabase.from('videos').delete().eq('id', id);
    if (error) {
      console.error('Error deleting video:', error);
      toast({ title: 'Error', description: 'Failed to delete video.' });
    } else {
      setVideos((prev) => prev.filter((v) => v.id !== id));
      toast({ title: 'Deleted', description: 'Video removed.' });
    }
  };

  useEffect(() => {
    // initial load
    loadSettings();
    loadVideos();
  }, []);

  const previewEmbed = useMemo(() => (newUrl ? toEmbedUrl(newUrl) : ''), [newUrl]);

  return (
    <div className="space-y-6">
      {/* Settings */}
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <LinkIcon className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-card-foreground">Video Page Settings</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <label className="text-sm text-muted-foreground">Navigation label</label>
            <Input
              value={settings?.nav_label ?? ''}
              onChange={(e) => setSettings((s) => ({ ...(s ?? { ...defaultSettings, updated_at: '' }), nav_label: e.target.value } as VideoSettings))}
              placeholder="e.g. Videos"
            />
            <div className="flex items-center gap-3 mt-2">
              <Switch
                checked={settings?.show_in_nav ?? true}
                onCheckedChange={(ch) => setSettings((s) => ({ ...(s ?? { ...defaultSettings, updated_at: '' }), show_in_nav: ch } as VideoSettings))}
              />
              <span className="text-sm text-muted-foreground">Show link in navigation</span>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-sm text-muted-foreground">Page title</label>
            <Input
              value={settings?.page_title ?? ''}
              onChange={(e) => setSettings((s) => ({ ...(s ?? { ...defaultSettings, updated_at: '' }), page_title: e.target.value } as VideoSettings))}
              placeholder="e.g. How‑to Videos"
            />
          </div>
          <div className="md:col-span-2 space-y-3">
            <label className="text-sm text-muted-foreground">Page description</label>
            <Textarea
              value={settings?.page_description ?? ''}
              onChange={(e) => setSettings((s) => ({ ...(s ?? { ...defaultSettings, updated_at: '' }), page_description: e.target.value } as VideoSettings))}
              placeholder="Short description shown under the title"
              rows={3}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button onClick={saveSettings} disabled={savingSettings}>
            <Save className="w-4 h-4 mr-2" />
            Save settings
          </Button>
          <Button variant="outline" onClick={loadSettings} disabled={loadingSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </Card>

      {/* Add new video */}
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-card-foreground">Add Video</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-sm text-muted-foreground">Title</label>
            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Video title" />
            <label className="text-sm text-muted-foreground">Video URL (YouTube/Vimeo)</label>
            <Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." />
            <label className="text-sm text-muted-foreground">Description (optional)</label>
            <Textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} rows={3} placeholder="Short description" />
            <label className="text-sm text-muted-foreground">Sort order (lower shows first)</label>
            <Input
              type="number"
              value={newSortOrder}
              onChange={(e) => setNewSortOrder(parseInt(e.target.value || '0', 10))}
              placeholder="0"
            />
            <div className="pt-2">
              <Button onClick={addVideo} disabled={adding}>
                <PlayCircle className="w-4 h-4 mr-2" />
                Add video
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Preview</div>
            <div className="aspect-video bg-muted rounded overflow-hidden">
              {previewEmbed ? (
                <iframe
                  className="w-full h-full"
                  src={previewEmbed}
                  title="Preview"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                  Paste a URL to preview
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Manage existing videos */}
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground">Manage Videos</h2>
          <Button variant="outline" onClick={loadVideos} disabled={loadingVideos}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v) => (
            <div key={v.id} className="border border-border rounded overflow-hidden">
              <div className="aspect-video bg-muted">
                <iframe
                  className="w-full h-full"
                  src={toEmbedUrl(v.url)}
                  title={v.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-card-foreground line-clamp-2">{v.title}</h3>
                  <Button size="icon" variant="ghost" onClick={() => deleteVideo(v.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                {v.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{v.description}</p>
                )}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={v.is_published}
                      onCheckedChange={(ch) => togglePublish(v.id, ch)}
                    />
                    <span className="text-sm text-muted-foreground">Published</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Order: {v.sort_order}</span>
                </div>
              </div>
            </div>
          ))}
          {videos.length === 0 && !loadingVideos && (
            <div className="text-sm text-muted-foreground">No videos yet.</div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VideosAdmin;
