import React, { useMemo, useState } from 'react';

interface LiteYouTubeProps {
  id: string;
  title?: string;
  className?: string;
  alt?: string;
  params?: string; // optional extra query params, e.g. "start=30"
}

const LiteYouTube: React.FC<LiteYouTubeProps> = ({ id, title, className, alt, params }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [posterIndex, setPosterIndex] = useState(0);

  const qualities = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault', 'default'] as const;

  const posters = useMemo(() => qualities.map(q => `https://i.ytimg.com/vi/${id}/${q}.jpg`), [id]);

  const handlePosterError = () => {
    setPosterIndex((i) => (i < posters.length - 1 ? i + 1 : i));
  };

  const iframeSrc = useMemo(() => {
    const base = `https://www.youtube-nocookie.com/embed/${id}`;
    const query = new URLSearchParams({
      autoplay: '1',
      modestbranding: '1',
      rel: '0',
      playsinline: '1',
      ...(params ? Object.fromEntries(new URLSearchParams(params)) : {}),
    }).toString();
    return `${base}?${query}`;
  }, [id, params]);

  return (
    <div className={`absolute inset-0 h-full w-full ${className ?? ''}`}>
      {!isPlaying ? (
        <>
          <img
            src={posters[posterIndex]}
            alt={alt ?? `${title ?? 'YouTube'} thumbnail`}
            onError={handlePosterError}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
          {/* Invisible button overlay to start playback without any icon overlay */}
          <button
            type="button"
            aria-label={`Play video: ${title ?? 'YouTube video'}`}
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          />
        </>
      ) : (
        <iframe
          src={iframeSrc}
          title={title ?? 'YouTube video'}
          loading="lazy"
          className="absolute inset-0 h-full w-full"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
    </div>
  );
};

export default LiteYouTube;
