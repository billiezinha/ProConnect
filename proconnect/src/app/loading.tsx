"use client";
import React from 'react';

export default function Loading() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'transparent',
    }}>
      <style>{`
        .gooey-loader {
          position: relative;
          width: 120px;
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          filter: url(#goo);
        }
        
        .goo-dot {
          position: absolute;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8B2CF5, #d946ef);
        }

        .goo-dot:nth-child(1) {
          animation: split-left 1.2s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate;
        }

        .goo-dot:nth-child(2) {
          z-index: 2;
          background: #8B2CF5;
          transform: scale(1.1);
        }

        .goo-dot:nth-child(3) {
          animation: split-right 1.2s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate;
        }
        
        @keyframes split-left {
          0%, 15% { transform: translateX(0) scale(1); }
          100% { transform: translateX(-40px) scale(0.85); }
        }
        
        @keyframes split-right {
          0%, 15% { transform: translateX(0) scale(1); }
          100% { transform: translateX(40px) scale(0.85); }
        }

        .loading-text {
          margin-top: 1.5rem;
          font-weight: 800;
          font-size: 0.9rem;
          color: #8B2CF5;
          letter-spacing: 3px;
          text-transform: uppercase;
          animation: pulse-text 1.2s ease-in-out infinite alternate;
        }
        
        @keyframes pulse-text {
          0% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>

      {/* Filtro SVG que cria o efeito "Gooey" de fusão entre as bolinhas */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  
                      0 1 0 0 0  
                      0 0 1 0 0  
                      0 0 0 20 -9" 
              result="goo" 
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className="gooey-loader">
        <div className="goo-dot"></div>
        <div className="goo-dot"></div>
        <div className="goo-dot"></div>
      </div>
      
      <span className="loading-text">
        ProConnect
      </span>
    </div>
  );
}
