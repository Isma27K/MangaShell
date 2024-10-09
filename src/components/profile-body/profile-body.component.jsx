import React, { useState, useEffect } from 'react';
import { Layout, Typography, Avatar, Tabs, List, Skeleton, Row, Col } from 'antd';
import { UserOutlined, BookOutlined } from '@ant-design/icons';
import CustomCard from '../card/card.component';
import './profile-body.style.scss';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProfileBody = () => {
  const [userData, setUserData] = useState(null);
  const [bookmarkedManga, setBookmarkedManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Simulating API calls to fetch user data and bookmarked manga
    const fetchUserData = async () => {
      // Replace this with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserData({
        username: 'JohnDoe',
        email: 'johndoe@example.com',
        joinDate: '2023-01-01',
      });
    };

    const fetchBookmarkedManga = async () => {
      // Replace this with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBookmarkedManga([
        { id: '1', title: 'Manga 1', description: 'Description 1', cover_image: 'https://via.placeholder.com/150' },
        { id: '2', title: 'Manga 2', description: 'Description 2', cover_image: 'https://via.placeholder.com/150' },
        // Add more manga as needed
      ]);
    };

    Promise.all([fetchUserData(), fetchBookmarkedManga()]).then(() => setLoading(false));
  }, []);

  if (loading) {
    return <Skeleton active />;
  }

  return (
    <Content className="profile-body">
      <Row gutter={[16, 16]} className="profile-header">
        <Col xs={24} sm={6} md={4} lg={3}>
          <Avatar size={isMobile ? 80 : 100} icon={<UserOutlined />} />
        </Col>
        <Col xs={24} sm={18} md={20} lg={21} className="profile-info">
          <Title level={isMobile ? 3 : 2}>{userData.username}</Title>
          <Text>{userData.email}</Text>
          <Text>Joined: {userData.joinDate}</Text>
        </Col>
      </Row>
      <Tabs defaultActiveKey="1">
        <TabPane tab={<span><BookOutlined />Bookmarked Manga</span>} key="1">
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
            dataSource={bookmarkedManga}
            renderItem={item => (
              <List.Item>
                <CustomCard
                  title={item.title}
                  description={item.description}
                  cover_image={item.cover_image}
                  id={item.id}
                  isMobile={isMobile}
                />
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </Content>
  );
};

export default ProfileBody;
