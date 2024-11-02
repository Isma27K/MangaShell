import React from 'react';
import './alpha.badge.scss';

const AlphaBadge = ({ size = 'medium' }) => {
  return (
    <div className={`alpha-badge ${size}`}>
      <div className="badge-container">
        <div className="badge-inner">
          <div className="circuit-lines"></div>
          <div className="pulse-effect"></div>
          <span className="badge-text">α TESTER</span>
        </div>
      </div>
    </div>
  );
};

export default AlphaBadge;
