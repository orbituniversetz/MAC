'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize, Minimize } from 'lucide-react';

export function FullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
      }
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleFullscreen}
      title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Mode"}
      className="w-auto flex items-center justify-center gap-2 bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-medium py-2 px-3 rounded-lg"
    >
      {isFullscreen ? (
        <>
          <Minimize className="h-4 w-4 text-red-500" />
          <span>Exit Fullscreen</span>
        </>
      ) : (
        <>
          <Maximize className="h-4 w-4 text-red-500" />
          <span>Fullscreen App</span>
        </>
      )}
    </Button>
  );
}
