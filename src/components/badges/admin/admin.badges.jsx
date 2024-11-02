import React from 'react';
import './admin.badge.scss';

const AdminBadge = ({ size = 'medium' }) => {
  return (
    <div className={`admin-badge ${size}`}>
      <div className="badge-container">
        <div className="badge-inner">
          <div className="aura-ring"></div>
          <div className="aura-pulse"></div>
          <div className="flame-effect"></div>
          <span className="badge-text">ADMIN</span>
        </div>
      </div>
    </div>
  );
};

export default AdminBadge;
