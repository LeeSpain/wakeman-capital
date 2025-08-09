import React, { useState } from 'react';


interface LiteYouTubeProps {
  videoId: string;
  title?: string;
}

const LiteYouTube: React.FC<LiteYouTubeProps> = ({ videoId, title = 'YouTube video' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbIndex, setThumbIndex] = useState(0);
  const thumbnailCandidates = [
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/default.jpg`,
    `https://i.ytimg.com/vi/${videoId}/default.jpg`,
  ];
  const thumbnailUrl = thumbnailCandidates[Math.min(thumbIndex, thumbnailCandidates.length - 1)];

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
            src={thumbnailUrl}
            alt={`${title} thumbnail`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            onError={() => setThumbIndex((i) => Math.min(i + 1, thumbnailCandidates.length - 1))}
          />
        </button>
      )}
    </div>
  );
};

export default LiteYouTube;
