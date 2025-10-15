import React, { useEffect, useState } from 'react';
import { Html } from '@react-three/drei';

export default function InstructionsOverlay({ onDismiss }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleUserInteraction = () => {
      setVisible(false);
      if (onDismiss) onDismiss();

      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('wheel', handleUserInteraction);
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('wheel', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('wheel', handleUserInteraction);
    };
  }, [onDismiss]);

  return (
    <Html
      fullscreen
      style={{
        pointerEvents: 'none', // Doesn't block clicks or drags
        transition: 'opacity 1s ease',
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          textAlign: 'left',
          color: 'white',
          fontSize: '1rem', // ~16px
          lineHeight: '1.4',
          maxWidth: '250px',
          padding: '8px 12px',
          background: 'rgba(0, 0, 0, 0.3)', // subtle dark background for readability
          borderRadius: '8px',
        }}
      >
        <p>Click and drag to move the camera</p>
        <p>Scroll to zoom</p>
        <p>Click the animals to learn more</p>
      </div>
    </Html>
  );
}
