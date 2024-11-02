import React, { useState, useEffect } from 'react';
import { Layout, Typography, Avatar, Tabs, List, Skeleton, Row, Col, message, Button, Modal, Input, Upload } from 'antd';
import { UserOutlined, BookOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { auth, getUserData, updateUserProfile, storage } from '../../utility/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import CustomCard from '../card/card.component';
import './profile-body.style.scss';
import { useNavigate } from 'react-router-dom';
const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProfileBody = () => {
  const [userData, setUserData] = useState(null);
  const [bookmarkedManga, setBookmarkedManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('Current user:', user);
        try {
          const data = await getUserData(user.uid);
          console.log('Firestore user data:', data);
          
          const photoURL = user.photoURL || data?.photoURL || null;
          
          if (data) {
            const formattedDate = data.createdAt?.toDate().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }) || 'N/A';
            
            setUserData({
              username: data.username,
              email: data.email,
              joinDate: formattedDate,
              bookmarkedManga: data.bookmarkedManga || [],
              photoURL: photoURL
            });
            setImageUrl(photoURL);
            setEditUsername(data.username);
            setBookmarkedManga(data.bookmarkedManga || []);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          message.error("Failed to load user data");
        }
      } else {
        message.error("Please login to view profile");
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsEditModalVisible(false);
    setEditUsername(userData.username); // Reset to current username
  };

  const handleImageUpload = async (file) => {
    try {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG files!');
        return false;
      }

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return false;
      }

      setUploading(true);
      const user = auth.currentUser;
      if (!user) {
        message.error('Please login first');
        return false;
      }

      const filename = `${user.uid}_${Date.now()}`;
      const storageRef = ref(storage, `profile-images/${filename}`);
      
      console.log('Uploading file...');
      const uploadTask = await uploadBytes(storageRef, file);
      console.log('File uploaded, getting URL...');
      const downloadURL = await getDownloadURL(uploadTask.ref);
      console.log('Download URL:', downloadURL);

      await Promise.all([
        updateUserProfile(user.uid, { photoURL: downloadURL }),
        user.updateProfile({ photoURL: downloadURL })
      ]);

      setImageUrl(downloadURL);
      setUserData(prev => ({
        ...prev,
        photoURL: downloadURL
      }));

      message.success('Profile image updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      await updateUserProfile(user.uid, {
        username: editUsername,
      });

      setUserData(prev => ({
        ...prev,
        username: editUsername
      }));

      message.success('Profile updated successfully');
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile');
    }
  };

  if (loading) return <Skeleton active />;
  if (!userData) return <div>No user data available</div>;

  return (
    <Content className="profile-body">
      <Row gutter={[16, 16]} className="profile-header">
        <Col xs={24} sm={6} md={4} lg={3} className="avatar-container">
          <Avatar 
            size={isMobile ? 80 : 100} 
            src={imageUrl} 
            icon={!imageUrl && <UserOutlined />}
          />
        </Col>
        <Col xs={24} sm={18} md={20} lg={21} className="profile-info">
          <div className="profile-header-content">
            <Title level={isMobile ? 3 : 2}>{userData.username}</Title>
            <Button 
              icon={<EditOutlined />} 
              onClick={handleEditProfile}
              type="primary"
              ghost
            >
              Edit Profile
            </Button>
          </div>
          <Text>{userData.email}</Text>
          <Text>Joined: {userData.joinDate}</Text>
        </Col>
      </Row>
      <Tabs defaultActiveKey="1">
        <TabPane tab={<span><BookOutlined />Bookmarked Manga</span>} key="1">
          {bookmarkedManga.length > 0 ? (
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
          ) : (
            <div className="no-bookmarks">
              <Text>No bookmarked manga yet</Text>
            </div>
          )}
        </TabPane>
      </Tabs>

      <Modal
        title="Edit Profile"
        open={isEditModalVisible}
        onOk={handleSaveProfile}
        onCancel={handleModalCancel}
        confirmLoading={uploading}
      >
        <div className="edit-profile-form">
          <div className="form-item">
            <label>Username</label>
            <Input
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              placeholder="Enter new username"
            />
          </div>
        </div>
      </Modal>
    </Content>
  );
};

export default ProfileBody;
