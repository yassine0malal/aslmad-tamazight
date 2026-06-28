import { useEffect, useState } from 'react';

interface FloatingScoreProps {
  points: number;
  startX: number;
  startY: number;
  onComplete: () => void;
}

export default function FloatingScore({ points, startX, startY, onComplete }: FloatingScoreProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className="fixed z-[200] pointer-events-none"
      style={{
        left: startX,
        top: startY,
        animation: 'float-up 1.5s ease-out forwards',
      }}
    >
      <span
        className="text-5xl font-bold"
        style={{
          color: 'var(--clay-ochre)',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)',
        }}
      >
        +{points}
      </span>
    </div>
  );
}
