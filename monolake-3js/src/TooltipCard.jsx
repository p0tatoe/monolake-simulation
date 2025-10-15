import React from 'react';

export default function TooltipCard({ 
  data,
  onClose,
  position = { top: '50%', left: '50%' },
  size = { width: '400px', maxHeight: '500px' },
  theme = {
    background: 'bg-gray-900',
    text: 'text-white',
    titleText: 'text-gray-100',
    bodyText: 'text-gray-300',
    border: 'border-gray-700'
  }
}) {
  if (!data) return null;

  const {
    title,
    description,
    image,
    imageAlt,
    customContent
  } = data;

  return (
    <div
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
        pointerEvents: 'auto',
      }}
    >
      <div
        className={`${theme.background} ${theme.text} rounded-xl shadow-2xl relative`}
        style={{
          width: size.width,
          maxHeight: size.maxHeight,
          overflowY: 'auto',
          padding: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
          animation: 'fadeIn 0.3s ease-out',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            color: '#aaa',
            fontSize: '14px',
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
          }}
        >
          ✕
        </button>

        {/* Title */}
        {title && (
          <div className={`text-lg font-semibold mb-3 text-center ${theme.titleText}`}>
            {title}
          </div>
        )}

        {/* Image */}
        {image && (
          <div className="mb-3">
            <img
              src={image}
              alt={imageAlt || title || 'Image'}
              className={`w-full h-auto rounded-lg object-cover border ${theme.border}`}
            />
          </div>
        )}

        {/* Description */}
        {description && (
          <div className={`text-xs ${theme.bodyText} leading-relaxed`}>
            {description}
          </div>
        )}

        {/* Custom content for more complex layouts */}
        {customContent && (
          <div className="mt-3">
            {customContent}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}