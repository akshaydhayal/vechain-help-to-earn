'use client';

import { useState, useEffect } from 'react';

interface NoSSRProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function NoSSR({ children, fallback }: NoSSRProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback || (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
        <div className="bg-black border-2 border-cyan-400 rounded-lg hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-400/50 transition-all duration-300 p-8 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
          <div className="text-center relative z-10">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-4 text-cyan-300 font-mono">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

