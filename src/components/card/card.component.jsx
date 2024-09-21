import React from 'react';
import { Card } from 'antd';
import PropTypes from 'prop-types';

const { Meta } = Card;

const CustomCard = ({ image, title, description }) => {
  return (
    <Card
      hoverable
      cover={<img alt={title} src={image} />}
      style={{ width: 225, margin: '16px auto' }} // Reduced width by 1/4
    >
      <Meta title={title} description={description} />
    </Card>
  );
};

CustomCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default CustomCard;
