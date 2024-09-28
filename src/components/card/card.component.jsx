import React, { memo } from 'react';
import { Card } from 'antd';
import './card.style.scss';

const { Meta } = Card;

const CustomCard = memo(({ title, description, cover_image }) => {
  const truncateDescription = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <Card
      hoverable
      cover={<img alt={title} src={cover_image} loading="lazy" />}
      className="custom-card"
    >
      <div className="card-content">
        <Meta
          title={<div className="card-title">{title}</div>}
          description={<div className="card-description">{truncateDescription(description)}</div>}
        />
      </div>
    </Card>
  );
});

export default CustomCard;