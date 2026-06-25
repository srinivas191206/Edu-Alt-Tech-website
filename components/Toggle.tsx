import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => {
  return (
    <div className="relative inline-flex items-center" style={{ padding: '0 60px' }}>
      <input
        type="checkbox"
        className="toggle-input absolute -left-[999em]"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <div className="toggle">
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
  );
};

export default Toggle;
