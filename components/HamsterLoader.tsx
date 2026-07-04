import React from 'react';

/**
 * HamsterLoader — the single shared full-page loader used everywhere.
 */
export default function HamsterLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6" style={{ background: 'var(--bg, #f8fafc)' }}>
      <div className="wheel-and-hamster">
        <div className="wheel" />
        <div className="hamster">
          <div className="hamster__head">
            <div className="hamster__ear" />
            <div className="hamster__eye" />
            <div className="hamster__nose" />
          </div>
          <div className="hamster__body">
            <div className="hamster__limb--fr" />
            <div className="hamster__limb--fl" />
            <div className="hamster__limb--br" />
            <div className="hamster__limb--bl" />
            <div className="hamster__tail" />
          </div>
        </div>
        <div className="spoke" />
      </div>
      <p className="text-text-muted font-medium tracking-wide m-0" style={{ fontSize: '0.95rem' }}>
        Loading…
      </p>
    </div>
  );
}
