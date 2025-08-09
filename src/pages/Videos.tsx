import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';

interface VideoItem {
  id: string;
  title: string;
  url: string;
  description?: string;
}

// Helper to normalize YouTube links to embeddable format
const toEmbedUrl = (url: string) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
      // handle /embed/ or /shorts/
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

const defaultVideos: VideoItem[] = [
  {
    id: 'getting-started',
    title: 'Getting Started: Dashboard Tour',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Overview of the interface and where to find key features.'
  },
  {
    id: 'signals',
    title: 'Using Real-time Signals',
    url: 'https://www.youtube.com/embed/aqz-KE-bpKQ',
    description: 'Learn how to act on signals, manage risk, and log outcomes.'
  }
];

const Videos: React.FC = () => {
  const { toast } = useToast();
  const [videos, setVideos] = useState<VideoItem[]>(defaultVideos);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const structuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: videos.map((v, i) => ({
      '@type': 'VideoObject',
      position: i + 1,
      name: v.title,
      description: v.description || 'Instructional video',
      embedUrl: toEmbedUrl(v.url),
      url: v.url
    }))
  }), [videos]);

  const addVideo = () => {
    if (!title.trim() || !url.trim()) {
      toast({ title: 'Missing info', description: 'Please add a title and a URL.' });
      return;
    }
    const item: VideoItem = { id: `${Date.now()}`, title: title.trim(), url: url.trim() };
    setVideos((prev) => [item, ...prev]);
    setTitle('');
    setUrl('');
    toast({ title: 'Video added', description: 'Your video was added locally. Persisting can be added later.' });
  };

  return (
    <>
      <Helmet>
        <title>Videos | Tutorials and How-To</title>
        <meta name="description" content="Instructional videos to learn how to use the platform, real-time signals, analytics, and journaling." />
        <link rel="canonical" href="/videos" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <header className="border-b border-border bg-card/60">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">How‑to Videos</h1>
          <p className="text-muted-foreground mt-1">Short tutorials to get the most out of the platform.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Add new video */}
        <section className="mb-6">
          <Card className="p-4 bg-muted/30 border-border">
            <div className="grid md:grid-cols-3 gap-3">
              <div className="md:col-span-1">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Video title"
                  aria-label="Video title"
                />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="YouTube/Vimeo URL"
                  aria-label="Video URL"
                />
                <Button onClick={addVideo} variant="default">Add</Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Video grid */}
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
                <h3 className="font-semibold text-card-foreground truncate" title={v.title}>{v.title}</h3>
                {v.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{v.description}</p>
                )}
              </div>
            </Card>
          ))}
        </section>
      </main>
    </>
  );
};

export default Videos;
