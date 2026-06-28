import { useEffect, useState } from 'react'
import { CLAY_PARTICLE_COLORS } from '@/data/constants'

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  color: string;
  size: number;
}

interface ParticleBurstProps {
  originX: number;
  originY: number;
  count?: number;
  onComplete: () => void;
}

export default function ParticleBurst({ originX, originY, count = 12, onComplete }: ParticleBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: originX,
      y: originY,
      angle: (360 / count) * i + Math.random() * 30,
      distance: 80 + Math.random() * 80,
      color: CLAY_PARTICLE_COLORS[Math.floor(Math.random() * CLAY_PARTICLE_COLORS.length)],
      size: 6 + Math.random() * 10,
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [originX, originY, count, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[150] pointer-events-none">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const destX = p.x + Math.cos(rad) * p.distance;
        const destY = p.y + Math.sin(rad) * p.distance;

        return (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              left: p.x,
              top: p.y,
              animation: 'particle-fly 0.8s ease-out forwards',
              ['--dest-x' as string]: `${destX - p.x}px`,
              ['--dest-y' as string]: `${destY - p.y}px`,
            }}
          />
        );
      })}
    </div>
  );
}
