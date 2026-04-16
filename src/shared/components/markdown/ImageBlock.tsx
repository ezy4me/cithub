import { useState, useEffect } from 'react';
import { ZoomIn, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImageBlockProps {
  src: string;
  alt?: string;
  title?: string;
}

export function ImageBlock({ src, alt = '', title }: ImageBlockProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZoomed) {
        setIsZoomed(false);
      }
    };

    if (isZoomed) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isZoomed]);

  return (
    <>
      <figure className="not-prose my-8">
        <div 
          className="relative group cursor-zoom-in rounded-lg overflow-hidden border border-border bg-muted"
          onClick={() => setIsZoomed(true)}
        >
          <img
            src={src}
            alt={alt}
            className={`w-full h-auto transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
            </div>
          )}
          {isLoaded && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <ZoomIn className="h-8 w-8 text-white drop-shadow-lg" />
            </div>
          )}
        </div>
        {(title || alt) && (
          <figcaption className="mt-3 px-4 py-2 bg-muted/50 rounded-md text-center text-sm text-muted-foreground">
            {title || alt}
          </figcaption>
        )}
      </figure>

      {isZoomed && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-8"
          onClick={() => setIsZoomed(false)}
        >
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
            onClick={() => setIsZoomed(false)}
          >
            <X className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
          {(title || alt) && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 rounded-lg text-white/90 text-sm max-w-[80%] text-center">
              {title || alt}
            </div>
          )}
        </motion.div>
      )}
    </>
  );
}
