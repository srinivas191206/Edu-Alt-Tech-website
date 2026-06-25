import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => {
  return (
    <div className="relative inline-flex items-center" style={{ padding: '0 50px' }}>
      <div className="relative" style={{ transform: 'scale(0.65)', transformOrigin: 'center' }}>
        <input
          type="checkbox"
          className="toggle-input absolute inset-0 w-full h-full z-10 cursor-pointer opacity-0 m-0"
          style={{ width: '90px', height: '50px' }}
          checked={checked}
          onChange={e => onChange(e.target.checked)}
        />
        <div className="toggle pointer-events-none">
          <div className="toggle__handler">
            <div className="crater crater--1" />
            <div className="crater crater--2" />
            <div className="crater crater--3" />
          </div>
          <div className="star star--1" />
          <div className="star star--2" />
          <div className="star star--3" />
          <div className="star star--4" />
          <div className="star star--5" />
          <div className="star star--6" />
        </div>
      </div>
    </div>
  );
};

export default Toggle;
