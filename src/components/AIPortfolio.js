'use client'
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import ErrorBoundary from './ErrorBoundary';

const ThreeCanvas = dynamic(
  () => import('./3D/ThreeCanvas'),
  { 
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-white text-2xl">Loading 3D Portfolio...</div>
      </div>
    )
  }
);

const AIPortfolio = () => {
  const [hoverInfo, setHoverInfo] = useState(null);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* 3D Space Environment */}
      <ErrorBoundary 
        fallback={
          <div className="fixed inset-0 bg-gradient-to-b from-blue-900/20 to-black" />
        }
      >
        <div className="fixed inset-0">
          <ThreeCanvas onHoverInfo={setHoverInfo} />
        </div>
      </ErrorBoundary>

      {/* Centered Hover Information */}
      {hoverInfo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-lg p-8 rounded-xl max-w-2xl w-full mx-4 
                        transform transition-all duration-300 ease-in-out
                        border border-blue-500/20 shadow-xl shadow-blue-500/10">
            <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 
                         bg-clip-text text-transparent">
              {hoverInfo.name}
            </h3>
            <div className="space-y-2">
              {hoverInfo.description.split('\n').map((line, index) => (
                <p key={index} className="text-xl leading-relaxed text-gray-200">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Initial Instructions */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 
                    bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full text-sm
                    animate-fade-in opacity-75 hover:opacity-100 transition-opacity">
        Use mouse to explore the space. Click and drag to rotate. Scroll to zoom.
      </div>
    </div>
  );
};

export default AIPortfolio;