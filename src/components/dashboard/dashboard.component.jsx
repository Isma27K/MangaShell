import React, { useState, useEffect } from 'react';
import { Layout, Checkbox, Collapse } from 'antd';
import CustomCard from '../card/card.component.jsx';
import './dashboard.style.scss';

const { Sider, Content } = Layout;
const { Panel } = Collapse;

const Dashboard = () => {
  const [cardsData, setCardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/data/getManga', { signal });
        const data = await response.json();
        setCardsData(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching manga data:', error);
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

  return (
    <Layout className="dashboard-layout">
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

      <Layout className="content-layout">
        <Content className="content-style">
          {loading ? (
            <div className="loading-container">
              <p className="loading-text">Loading your manga collection...</p>
            </div>
          ) : (
            <div className="card-container">
              {cardsData.map((card, index) => (
                <div key={index} className="card-item">
                  <CustomCard
                    title={card.title}
                    description={card.description}
                    cover_image={card.cover_image}
                    genres={card.genres} // Add this line to pass genres
                    id={card._id}
                  />
                </div>
              ))}
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

export default Dashboard;

