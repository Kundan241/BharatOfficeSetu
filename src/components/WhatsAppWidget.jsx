import React, { useState } from 'react';

export default function WhatsAppWidget() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="https://wa.me/917303338423"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #25D366, #128C7E)',
        /* box-shadow removed — triggers repaint on mobile; only transform is GPU-safe */
        transform: hovered ? 'scale(1.12)' : 'scale(1)',
        transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        textDecoration: 'none',
        willChange: 'transform',
      }}
    >
      {/* Pulse ring — will-change promotes to compositor layer */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'rgba(37,211,102,0.3)',
          animation: 'wa-pulse 2.4s ease-out infinite',
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
      />

      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="30"
        height="30"
        fill="none"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <path
          d="M16 1C7.716 1 1 7.716 1 16c0 2.69.707 5.25 2.048 7.488L1 31l7.72-2.023A14.93 14.93 0 0 0 16 31c8.284 0 15-6.716 15-15S24.284 1 16 1z"
          fill="#fff"
          opacity="0.12"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 3.5C8.82 3.5 3 9.32 3 16.5c0 2.385.652 4.617 1.785 6.528L3.25 28.5l5.648-1.52A12.46 12.46 0 0 0 16 29.5c7.18 0 13-5.82 13-13S23.18 3.5 16 3.5zm-3.944 7.04c.243 0 .494.006.714.012.244.007.568-.086.888.677.336.8 1.14 2.788 1.24 2.99.099.2.165.432.033.696-.133.264-.2.43-.396.664-.198.232-.416.52-.594.698-.198.198-.403.413-.174.81.23.396 1.02 1.682 2.193 2.724 1.508 1.344 2.78 1.76 3.175 1.958.396.2.627.166.858-.1.232-.264.993-1.156 1.258-1.553.264-.396.527-.33.89-.198.363.132 2.306 1.088 2.702 1.286.396.198.66.297.757.463.1.166.1.96-.232 1.888-.33.927-1.95 1.82-2.676 1.887-.727.066-1.41.33-4.76-.99-4.04-1.584-6.585-5.72-6.784-5.983-.198-.264-1.617-2.152-1.617-4.104 0-1.952 1.025-2.912 1.388-3.308.363-.396.793-.495 1.057-.495z"
          fill="#ffffff"
        />
      </svg>

      {/* Keyframe injection via a style tag */}
      <style>{`
        @keyframes wa-pulse {
          0%   { transform: scale(1);   opacity: 0.5; }
          70%  { transform: scale(1.6); opacity: 0;   }
          100% { transform: scale(1.6); opacity: 0;   }
        }
      `}</style>
    </a>
  );
}
