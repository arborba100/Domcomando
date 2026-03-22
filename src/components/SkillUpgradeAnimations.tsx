import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface UpgradeAnimationProps {
  skillId: string;
  isUpgrading: boolean;
  isComplete: boolean;
  remainingTime: number;
  stateColor: string;
}

// Particle component for burst effect
function Particle({ delay, angle }: { delay: number; angle: number }) {
  const distance = 100;
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const y = Math.sin((angle * Math.PI) / 180) * distance;

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x, y, opacity: 0, scale: 0 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className="absolute w-2 h-2 rounded-full pointer-events-none"
      style={{
        background: 'radial-gradient(circle, #FFD700, #FFA500)',
        boxShadow: '0 0 8px #FFD700',
      }}
    />
  );
}

// Animated loading ring
function LoadingRing() {
  return (
    <motion.div
      className="absolute inset-0 rounded-lg"
      style={{
        border: '2px solid transparent',
        borderTopColor: '#FFD700',
        borderRightColor: '#FFD700',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    />
  );
}

// Flash effect on completion
function CompletionFlash() {
  return (
    <motion.div
      initial={{ opacity: 1, scale: 0.8 }}
      animate={{ opacity: 0, scale: 2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="absolute inset-0 rounded-lg pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(255, 215, 0, 0.8), transparent)',
        boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)',
      }}
    />
  );
}

// Connection line animation
export function AnimatedConnection({
  fromX,
  fromY,
  toX,
  toY,
  state,
  isAnimating,
}: {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  state: 'locked' | 'available' | 'upgrading' | 'complete';
  isAnimating: boolean;
}) {
  const getStrokeColor = () => {
    if (state === 'complete') return '#00FF00';
    if (state === 'upgrading') return '#FFD700';
    if (state === 'available') return '#FFD700';
    return '#666666';
  };

  const getStrokeOpacity = () => {
    if (state === 'locked') return 0.3;
    return 0.6;
  };

  return (
    <g>
      {/* Base line */}
      <line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        stroke={getStrokeColor()}
        strokeWidth="2"
        opacity={getStrokeOpacity()}
        style={{
          transition: 'stroke 0.3s ease, opacity 0.3s ease',
        }}
      />

      {/* Animated energy flow */}
      {isAnimating && (
        <motion.line
          x1={fromX}
          y1={fromY}
          x2={toX}
          y2={toY}
          stroke="#FFD700"
          strokeWidth="3"
          opacity={0.8}
          initial={{ strokeDasharray: '0 100%' }}
          animate={{ strokeDasharray: '100% 0' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={{
            filter: 'drop-shadow(0 0 4px #FFD700)',
          }}
        />
      )}

      {/* Glow effect for complete state */}
      {state === 'complete' && (
        <line
          x1={fromX}
          y1={fromY}
          x2={toX}
          y2={toY}
          stroke="#00FF00"
          strokeWidth="4"
          opacity="0.2"
          style={{
            filter: 'blur(2px)',
          }}
        />
      )}
    </g>
  );
}

export function SkillUpgradeAnimations({
  skillId,
  isUpgrading,
  isComplete,
  remainingTime,
  stateColor,
}: UpgradeAnimationProps) {
  const [showCompletion, setShowCompletion] = useState(false);
  const [particleCount, setParticleCount] = useState(0);

  // Trigger completion animation
  useEffect(() => {
    if (isComplete && !isUpgrading) {
      setShowCompletion(true);
      setParticleCount(12);
      const timer = setTimeout(() => setShowCompletion(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isComplete, isUpgrading]);

  // Determine animation state
  const getAnimationState = () => {
    if (isUpgrading) return 'upgrading';
    if (isComplete) return 'complete';
    return 'available';
  };

  const animationState = getAnimationState();

  return (
    <div className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden">
      {/* UPGRADING STATE: Pulsing node with loading ring */}
      {animationState === 'upgrading' && (
        <>
          {/* Continuous pulse */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              boxShadow: `0 0 20px ${stateColor}80, inset 0 0 20px ${stateColor}40`,
            }}
          />

          {/* Loading ring */}
          <LoadingRing />

          {/* Glow background */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: `radial-gradient(circle, ${stateColor}20, transparent)`,
            }}
          />
        </>
      )}

      {/* AVAILABLE STATE: Gentle pulsing glow */}
      {animationState === 'available' && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            boxShadow: `0 0 15px ${stateColor}60`,
          }}
        />
      )}

      {/* COMPLETE STATE: Green glow with breathing animation */}
      {animationState === 'complete' && (
        <>
          {/* Fixed green glow */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              boxShadow: `0 0 20px #00FF0080, inset 0 0 15px #00FF0040`,
            }}
          />

          {/* Breathing animation */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              boxShadow: `0 0 10px #00FF0040`,
            }}
          />
        </>
      )}

      {/* COMPLETION FLASH: Radial explosion */}
      {showCompletion && <CompletionFlash />}

      {/* COMPLETION PARTICLES: Burst effect */}
      {showCompletion &&
        Array.from({ length: particleCount }).map((_, i) => (
          <Particle
            key={`particle-${skillId}-${i}`}
            delay={i * 0.05}
            angle={(360 / particleCount) * i}
          />
        ))}

      {/* UNLOCK ANIMATION: Fade-in + scale for new skills */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="absolute inset-0 rounded-lg"
      />

      {/* Time display during upgrade */}
      {animationState === 'upgrading' && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-xs font-bold text-cyan-300 drop-shadow-lg">
            {formatUpgradeTime(remainingTime)}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Helper function to format time
function formatUpgradeTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

// Background glow effect on completion
export function CompletionBackgroundGlow({
  isActive,
}: {
  isActive: boolean;
}) {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0.8, scale: 0.5 }}
      animate={{ opacity: 0, scale: 1.5 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-0 pointer-events-none"
      style={{
        background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.3), transparent)',
      }}
    />
  );
}
