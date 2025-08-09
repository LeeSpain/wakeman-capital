import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface LiteYouTubeProps {
  videoId: string;
  title?: string;
}

const LiteYouTube: React.FC<LiteYouTubeProps> = ({ videoId, title = 'YouTube video' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-muted/20 shadow-elegant">
      {isPlaying ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&playsinline=1`}
          title={title}
          loading="lazy"
          className="absolute inset-0 h-full w-full"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="group absolute inset-0 w-full h-full focus:outline-none"
          aria-label={`Play video: ${title}`}
        >
          <img
            src={thumbnail}
            alt={`${title} thumbnail`}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <span
            className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/10 to-transparent transition-opacity group-hover:opacity-60"
            aria-hidden
          />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg ring-1 ring-border transition-transform group-hover:scale-105">
            <Play className="w-6 h-6" />
          </span>
        </button>
      )}
    </div>
  );
};

export default LiteYouTube;
