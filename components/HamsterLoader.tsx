import React from 'react';

/**
 * HamsterLoader — the single shared full-page loader used everywhere.
 * Uses inline styles only so it's immune to Tailwind preflight resets.
 */
export default function HamsterLoader() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg, #f8fafc)', gap: '1.5rem',
    }}>
      <HamsterWheel />
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', color: '#64748b', letterSpacing: '0.05em', margin: 0 }}>
        Loading…
      </p>
    </div>
  );
}

/** Inline-only hamster wheel — zero class names, no Tailwind conflicts */
export function HamsterWheel() {
  const DUR = '1s';
  const s: React.CSSProperties = { position: 'absolute' };

  return (
    <div style={{ position: 'relative', width: 168, height: 168, fontSize: 14 }}>
      {/* Wheel ring */}
      <div style={{
        ...s, borderRadius: '50%', top: 0, left: 0, width: '100%', height: '100%',
        background: 'radial-gradient(100% 100% at center, hsla(0,0%,60%,0) 47.8%, hsl(0,0%,60%) 48%)',
        zIndex: 2,
      }} />

      {/* Spokes */}
      <div style={{
        ...s, borderRadius: '50%', top: 0, left: 0, width: '100%', height: '100%',
        background: `radial-gradient(100% 100% at center, hsl(0,0%,60%) 4.8%, hsla(0,0%,60%,0) 5%),
          linear-gradient(hsla(0,0%,55%,0) 46.9%, hsl(0,0%,65%) 47% 52.9%, hsla(0,0%,65%,0) 53%) 50% 50% / 99% 99% no-repeat`,
        animation: `hl-spoke ${DUR} linear infinite`,
        zIndex: 0,
      }} />

      {/* Hamster group */}
      <div style={{
        ...s,
        top: '50%', left: 'calc(50% - 49px)',
        width: 98, height: 52.5,
        transform: 'rotate(4deg) translate(-11.2px, 25.9px)',
        transformOrigin: '50% 0',
        animation: `hl-ham ${DUR} ease-in-out infinite`,
        zIndex: 1,
      }}>
        {/* Head */}
        <div style={{
          ...s,
          top: 0, left: -28, width: 38.5, height: 35,
          background: 'hsl(30,90%,55%)',
          borderRadius: '70% 30% 0 100% / 40% 25% 25% 60%',
          boxShadow: '0 -3.5px 0 hsl(30,90%,80%) inset, 10.5px -21.7px 0 hsl(30,90%,90%) inset',
          transformOrigin: '100% 50%',
          animation: `hl-head ${DUR} ease-in-out infinite`,
        }}>
          {/* Ear */}
          <div style={{
            ...s,
            top: -3.5, right: -3.5, width: 10.5, height: 10.5,
            background: 'hsl(0,90%,85%)',
            borderRadius: '50%',
            boxShadow: '-3.5px 0 hsl(30,90%,55%) inset',
            transformOrigin: '50% 75%',
            animation: `hl-ear ${DUR} ease-in-out infinite`,
          }} />
          {/* Eye */}
          <div style={{
            ...s,
            top: 5.25, left: 17.5, width: 7, height: 7,
            background: 'hsl(0,0%,0%)',
            borderRadius: '50%',
            animation: `hl-eye ${DUR} linear infinite`,
          }} />
          {/* Nose */}
          <div style={{
            ...s,
            top: 10.5, left: 0, width: 2.8, height: 3.5,
            background: 'hsl(0,90%,75%)',
            borderRadius: '35% 65% 85% 15% / 70% 50% 50% 30%',
          }} />
        </div>

        {/* Body */}
        <div style={{
          ...s,
          top: 3.5, left: 28, width: 63, height: 42,
          background: 'hsl(30,90%,90%)',
          borderRadius: '50% 30% 50% 30% / 15% 60% 40% 40%',
          boxShadow: '1.4px 10.5px 0 hsl(30,90%,55%) inset, 2.1px -7px 0 hsl(30,90%,80%) inset',
          transformOrigin: '17% 50%',
          transformStyle: 'preserve-3d',
          animation: `hl-body ${DUR} ease-in-out infinite`,
        }}>
          {/* Front-right limb */}
          <div style={{
            ...s,
            top: 28, left: 7, width: 14, height: 21,
            clipPath: 'polygon(0 0,100% 0,70% 80%,60% 100%,0% 100%,40% 80%)',
            transformOrigin: '50% 0',
            background: 'linear-gradient(hsl(30,90%,80%) 80%, hsl(0,90%,75%) 80%)',
            transform: 'rotate(15deg) translateZ(-1px)',
            animation: `hl-frlimb ${DUR} linear infinite`,
          }} />
          {/* Front-left limb */}
          <div style={{
            ...s,
            top: 28, left: 7, width: 14, height: 21,
            clipPath: 'polygon(0 0,100% 0,70% 80%,60% 100%,0% 100%,40% 80%)',
            transformOrigin: '50% 0',
            background: 'linear-gradient(hsl(30,90%,90%) 80%, hsl(0,90%,85%) 80%)',
            transform: 'rotate(15deg)',
            animation: `hl-fllimb ${DUR} linear infinite`,
          }} />
          {/* Back-right limb */}
          <div style={{
            ...s,
            top: 14, left: 39.2, width: 21, height: 35,
            borderRadius: '10.5px 10.5px 0 0',
            clipPath: 'polygon(0 0,100% 0,100% 30%,70% 90%,70% 100%,30% 100%,40% 90%,0% 30%)',
            transformOrigin: '50% 30%',
            background: 'linear-gradient(hsl(30,90%,80%) 90%, hsl(0,90%,75%) 90%)',
            transform: 'rotate(-25deg) translateZ(-1px)',
            animation: `hl-brlimb ${DUR} linear infinite`,
          }} />
          {/* Back-left limb */}
          <div style={{
            ...s,
            top: 14, left: 39.2, width: 21, height: 35,
            borderRadius: '10.5px 10.5px 0 0',
            clipPath: 'polygon(0 0,100% 0,100% 30%,70% 90%,70% 100%,30% 100%,40% 90%,0% 30%)',
            transformOrigin: '50% 30%',
            background: 'linear-gradient(hsl(30,90%,90%) 90%, hsl(0,90%,85%) 90%)',
            transform: 'rotate(-25deg)',
            animation: `hl-bllimb ${DUR} linear infinite`,
          }} />
          {/* Tail */}
          <div style={{
            ...s,
            top: 21, right: -7, width: 14, height: 7,
            background: 'hsl(0,90%,85%)',
            borderRadius: '3.5px 50% 50% 3.5px',
            boxShadow: '0 -2.8px 0 hsl(0,90%,75%) inset',
            transform: 'rotate(30deg) translateZ(-1px)',
            transformOrigin: '3.5px 3.5px',
            animation: `hl-tail ${DUR} linear infinite`,
          }} />
        </div>
      </div>

      {/* Keyframes injected once */}
      <style>{`
        @keyframes hl-spoke { from { transform: rotate(0) } to { transform: rotate(-1turn) } }
        @keyframes hl-ham { from, to { transform: rotate(4deg) translate(-11.2px,25.9px) } 50% { transform: rotate(0) translate(-11.2px,25.9px) } }
        @keyframes hl-head { from,25%,50%,75%,to { transform: rotate(0) } 12.5%,37.5%,62.5%,87.5% { transform: rotate(8deg) } }
        @keyframes hl-ear  { from,25%,50%,75%,to { transform: rotate(0) } 12.5%,37.5%,62.5%,87.5% { transform: rotate(12deg) } }
        @keyframes hl-eye  { from,90%,to { transform: scaleY(1) } 95% { transform: scaleY(0) } }
        @keyframes hl-body { from,25%,50%,75%,to { transform: rotate(0) } 12.5%,37.5%,62.5%,87.5% { transform: rotate(-2deg) } }
        @keyframes hl-frlimb { from,25%,50%,75%,to { transform: rotate(50deg) translateZ(-1px) } 12.5%,37.5%,62.5%,87.5% { transform: rotate(-30deg) translateZ(-1px) } }
        @keyframes hl-fllimb { from,25%,50%,75%,to { transform: rotate(-30deg) } 12.5%,37.5%,62.5%,87.5% { transform: rotate(50deg) } }
        @keyframes hl-brlimb { from,25%,50%,75%,to { transform: rotate(-60deg) translateZ(-1px) } 12.5%,37.5%,62.5%,87.5% { transform: rotate(20deg) translateZ(-1px) } }
        @keyframes hl-bllimb { from,25%,50%,75%,to { transform: rotate(20deg) } 12.5%,37.5%,62.5%,87.5% { transform: rotate(-60deg) } }
        @keyframes hl-tail  { from,25%,50%,75%,to { transform: rotate(30deg) translateZ(-1px) } 12.5%,37.5%,62.5%,87.5% { transform: rotate(10deg) translateZ(-1px) } }
      `}</style>
    </div>
  );
}
