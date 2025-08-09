
import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../integrations/supabase/client';

interface VideoItem {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

// Helper to normalize YouTube/Vimeo links to embeddable format
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
    return url; // fallback
  } catch {
    return url;
  }
};

type VideoSettings = {
  nav_label: string;
  page_title: string;
  page_description: string | null;
  show_in_nav: boolean;
};

const defaultSettings: VideoSettings = {
  nav_label: 'Videos',
  page_title: 'How‑to Videos',
  page_description: 'Short tutorials to get the most out of the platform.',
  show_in_nav: true,
};

const Videos: React.FC = () => {
  const { toast } = useToast();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [settings, setSettings] = useState<VideoSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      // Load settings (available to authenticated users per RLS; fallback to defaults)
      const settingsPromise = supabase
        .from('videos_settings')
        .select('nav_label, page_title, page_description, show_in_nav')
        .eq('key', 'default')
        .maybeSingle();

      // Load only published videos (RLS enforces is_published = true for authenticated users)
      const videosPromise = supabase
        .from('videos')
        .select('id, title, url, description, is_published, sort_order, created_at')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      const [{ data: sData, error: sErr }, { data: vData, error: vErr }] = await Promise.all([
        settingsPromise,
        videosPromise,
      ]);

      if (sErr) {
        console.warn('Videos settings not available, using defaults:', sErr);
        setSettings(defaultSettings);
      } else if (sData) {
        setSettings({
          nav_label: sData.nav_label ?? defaultSettings.nav_label,
          page_title: sData.page_title ?? defaultSettings.page_title,
          page_description: sData.page_description ?? defaultSettings.page_description,
          show_in_nav: sData.show_in_nav ?? true,
        });
      }

      if (vErr) {
        console.error('Error loading videos:', vErr);
        toast({ title: 'Error', description: 'Unable to load videos right now.' });
        setVideos([]);
      } else {
        setVideos((vData || []) as VideoItem[]);
      }

      setLoading(false);
    };

    loadAll();
  }, [toast]);

  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: videos.map((v, i) => ({
        '@type': 'VideoObject',
        position: i + 1,
        name: v.title,
        description: v.description || 'Instructional video',
        embedUrl: toEmbedUrl(v.url),
        url: v.url,
      })),
    }),
    [videos]
  );

  return (
    <>
      <Helmet>
        <title>{settings.page_title} | Tutorials and How-To</title>
        <meta
          name="description"
          content={settings.page_description || 'Instructional videos to learn how to use the platform.'}
        />
        <link rel="canonical" href="/videos" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <header className="border-b border-border bg-card/60">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {settings.page_title}
          </h1>
          {settings.page_description && (
            <p className="text-muted-foreground mt-1">{settings.page_description}</p>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-muted-foreground">Loading videos...</div>
        ) : (
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((v) => (
              <Card key={v.id} className="overflow-hidden">
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
                <div className="p-3">
                  <h3 className="font-semibold text-card-foreground truncate" title={v.title}>
                    {v.title}
                  </h3>
                  {v.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {v.description}
                    </p>
                  )}
                </div>
              </Card>
            ))}
            {videos.length === 0 && (
              <div className="text-muted-foreground">No videos available yet.</div>
            )}
          </section>
        )}
      </main>
    </>
  );
};

export default Videos;
