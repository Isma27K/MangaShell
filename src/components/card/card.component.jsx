import React, { memo } from 'react';
import { Card, Popover, Tag } from 'antd';
import './card.style.scss';

const CustomCard = memo(({ title, description, cover_image, genres = [] }) => {
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const content = (
    <div className="card-popover-content">
      <h3>{title}</h3>
      <p>{description}</p>
      {genres && genres.length > 0 && (
        <div className="genre-tags">
          <h4>Genres:</h4>
          {genres.map((genre, index) => (
            <Tag key={index} className="monochrome-tag">{genre}</Tag>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Popover
      content={content}
      title="Story Details"
      trigger="hover"
      mouseEnterDelay={1}
      overlayClassName="card-popover"
      placement="right"
      align={{
        offset: [10, 0],
      }}
    >
      <Card
        hoverable
        cover={<img src={cover_image} alt={title} loading="lazy" />}
        className="custom-card"
      >
        <div className="card-content">
          <h3 className="card-title">{truncateText(title, 50)}</h3>
          <p className="card-description">{truncateText(description, 100)}</p>
        </div>
      </Card>
    </Popover>
  );
});

export default CustomCard;