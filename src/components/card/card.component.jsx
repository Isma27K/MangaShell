import React, { memo } from 'react';
import { Card } from 'antd';
import './card.style.scss';

const CustomCard = memo(({ title, description, cover_image }) => {
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <Card
      hoverable
      cover={<img src={cover_image} loading="lazy" />}
      className="custom-card"
    >
      <div className="card-content">
        <h3 className="card-title">{truncateText(title, 50)}</h3>
        <p className="card-description">{truncateText(description, 100)}</p>
      </div>
    </Card>
  );
});

export default CustomCard;