import React from 'react';
import './programmer.badge.scss';

const ProgrammerBadge = ({ size = 'medium' }) => {
  return (
    <div className={`programmer-badge ${size}`}>
      <div className="badge-container">
        <div className="badge-inner">
          <div className="matrix-effect"></div>
          <div className="energy-ring"></div>
          <div className="glitch-effect"></div>
          <span className="badge-text" data-text="DEVELOPER">DEVELOPER</span>
          <div className="sparks">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`spark spark-${i + 1}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgrammerBadge;
