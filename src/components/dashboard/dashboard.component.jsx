import React, { useState, useEffect } from 'react';
import { Layout, Checkbox, Collapse, Skeleton, List, message } from 'antd';
import CustomCard from '../card/card.component.jsx';
import './dashboard.style.scss';

const { Sider, Content } = Layout;
const { Panel } = Collapse;

const Dashboard = () => {
  const [cardsData, setCardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/data/getManga`, { signal });
        if (!response.ok) {
          throw new Error('Failed to fetch manga data');
        }
        const data = await response.json();
        setCardsData(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching manga data:', error);
          setError('Failed to load manga data. Please try again later.');
          message.error('Failed to load manga data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, []);

  const genreFilters = [
    'Comedy', 'Drama', 'Horror', 'Manhua', 'Mystery', 'Psychological',
    'Sci fi', 'Shoujo ai', 'Slice of life', 'Supernatural', 'Action',
    'Cooking', 'Erotika', 'Harem', 'Isekai', 'Manhwa', 'Mecha',
    'One Shot', 'Romance', 'Seinen', 'Shounen', 'Smut', 'Tragedy',
    'Adventure', 'Fantasy', 'Historical', 'Josei', 'Martial Arts',
    'Medical', 'School Life', 'Shoujo', 'Shounen ai', 'Sports'
  ];

  const renderContent = () => {
    if (loading || (!loading && cardsData.length === 0)) {
      return isMobile ? (
        <List
          itemLayout="horizontal"
          dataSource={Array(5).fill({})}
          renderItem={() => (
            <List.Item>
              <Skeleton 
                avatar={{ shape: "square", className: "square-avatar" }} 
                active 
                paragraph={{ rows: 2 }} 
              />
            </List.Item>
          )}
        />
      ) : (
        <div className="card-container">
          {Array(12).fill().map((_, index) => (
            <div key={index} className="card-item">
              <Skeleton active avatar paragraph={{ rows: 4 }} />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (isMobile) {
      return (
        <List
          itemLayout="horizontal"
          dataSource={cardsData}
          renderItem={(card) => (
            <CustomCard
              title={card.title}
              description={card.description}
              cover_image={card.cover_image}
              genres={card.genres}
              id={card._id}
              isMobile={true}
            />
          )}
        />
      );
    }

    return (
      <div className="card-container">
        {cardsData.map((card, index) => (
          <div key={index} className="card-item">
            <CustomCard
              title={card.title}
              description={card.description}
              cover_image={card.cover_image}
              genres={card.genres}
              id={card._id}
              isMobile={false}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Layout className="dashboard-layout">
      {!isMobile && (
        <Sider className="sider-style" width={250}>
          <div className="filter-container">
            <h2 className="filter-title">Filters (Coming Soon)</h2>
            <Collapse defaultActiveKey={['1']} ghost expandIconPosition="end">
              <Panel header="Genres" key="1" disabled>
                <div className="genre-list">
                  {genreFilters.map((genre, index) => (
                    <Checkbox key={index} disabled>{genre}</Checkbox>
                  ))}
                </div>
              </Panel>
            </Collapse>
          </div>
        </Sider>
      )}

      <Layout className="content-layout">
        <Content className="content-style">
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default Dashboard;

