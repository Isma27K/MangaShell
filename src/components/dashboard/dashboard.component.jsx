import React from 'react';
import { Layout, Menu, Input, Checkbox } from 'antd';
import CustomCard from '../card/card.component.jsx';
import './dashboard.style.scss'; // Import the SCSS file

const { Sider, Content } = Layout;
const { Search } = Input;

const Dashboard = () => {
  const cardsData = [
    {
      image: 'https://via.placeholder.com/300',
      title: 'Sample Card 1',
      description: 'Description for card 1.'
    },
    {
      image: 'https://via.placeholder.com/300',
      title: 'Sample Card 2',
      description: 'Description for card 2.'
    },
    {
      image: 'https://via.placeholder.com/300',
      title: 'Sample Card 3',
      description: 'Description for card 3.'
    },
    {
      image: 'https://via.placeholder.com/300',
      title: 'Sample Card 4',
      description: 'Description for card 4.'
    }
  ];

  return (
    <Layout className="dashboard-layout">
      <Sider className="sider-style" width="250px">
        <div style={{ padding: '16px' }}>
          <h2>Filters</h2>
          <Search placeholder="Search filters" style={{ marginBottom: '16px' }} />
          <Menu mode="inline" defaultSelectedKeys={['1']}>
            <Menu.ItemGroup key="g1" title="Framework">
              <Menu.Item key="1"><Checkbox>React</Checkbox></Menu.Item>
              <Menu.Item key="2"><Checkbox>Vue</Checkbox></Menu.Item>
              <Menu.Item key="3"><Checkbox>Angular</Checkbox></Menu.Item>
            </Menu.ItemGroup>
          </Menu>
        </div>
      </Sider>
      <Layout style={{ marginLeft: 250, padding: '24px' }}>
        <Content className="content-style">
          <h1>React Templates, Source Code Download</h1>
          <p>This is where you would display your main content, such as a grid or list of templates.</p>

          <div className="card-container">
            {cardsData.map((card, index) => (
              <div key={index} className="card-item">
                <CustomCard {...card} />
              </div>
            ))}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Dashboard;

