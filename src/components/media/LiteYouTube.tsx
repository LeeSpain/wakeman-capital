import React, { useState } from 'react';


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
        </button>
      )}
    </div>
  );
};

export default LiteYouTube;
