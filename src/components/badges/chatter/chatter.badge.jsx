import React from 'react';
import './chatter.badge.scss';

const ChatterBadge = ({ size = 'medium' }) => {
  return (
    <div className={`chatter-badge ${size}`}>
      <div className="badge-container">
        <div className="badge-inner">
          <div className="wave-effect"></div>
          <div className="ripple-rings">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`ripple ripple-${i + 1}`}></div>
            ))}
          </div>
          <div className="connection-lines"></div>
          <span className="badge-text">SOCIALITE</span>
        </div>
      </div>
    </div>
  );
};

export default ChatterBadge;
