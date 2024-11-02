import React, { useState, useEffect } from 'react';

import AdminBadge from '../badges/admin/admin.badges';
import AlphaBadge from '../badges/alpha/alpha.badge';
import ProgrammerBadge from '../badges/programmer/programmer.badge';
import ChatterBadge from '../badges/chatter/chatter.badge';
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
  const [bookmarkDetails, setBookmarkDetails] = useState([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [userBadges, setUserBadges] = useState([]);
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
            setUserBadges(data.badges || []);
            setImageUrl(photoURL);
            setEditUsername(data.username);
            
            const bookmarkIds = data.bookmarkedManga || [];
            console.log('Bookmark IDs:', bookmarkIds);
            setBookmarkedManga(bookmarkIds);

            if (bookmarkIds.length > 0) {
              setLoadingBookmarks(true);
              try {
                const mangaDetails = await Promise.all(
                  bookmarkIds.map(async (id) => {
                    try {
                      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/data/${id}`);
                      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                      return await response.json();
                    } catch (error) {
                      console.error(`Error fetching manga ${id}:`, error);
                      return null;
                    }
                  })
                );
                
                const validMangaDetails = mangaDetails.filter(manga => manga !== null);
                console.log('Fetched manga details:', validMangaDetails);
                setBookmarkDetails(validMangaDetails);
              } catch (error) {
                console.error('Error fetching manga details:', error);
                message.error('Failed to load some manga details');
              } finally {
                setLoadingBookmarks(false);
              }
            }
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
  }, [navigate]);

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

  const renderBookmarkContent = () => {
    if (loadingBookmarks) {
      return isMobile ? (
        <List
          itemLayout="horizontal"
          dataSource={[1, 2, 3, 4]}
          renderItem={(_, index) => (
            <List.Item key={index}>
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
          {[...Array(8)].map((_, index) => (
            <div key={index} className="card-item">
              <Skeleton active avatar paragraph={{ rows: 4 }} />
            </div>
          ))}
        </div>
      );
    }

    if (bookmarkDetails.length === 0) {
      return (
        <div className="no-bookmarks">
          <Text>No bookmarked manga yet</Text>
        </div>
      );
    }

    if (isMobile) {
      return (
        <List
          itemLayout="horizontal"
          dataSource={bookmarkDetails}
          renderItem={(manga) => (
            <CustomCard
              title={manga.title || 'Untitled'}
              description={manga.description || 'No description available'}
              cover_image={manga.cover_image}
              id={manga._id}
              isMobile={true}
            />
          )}
        />
      );
    }

    return (
      <div className="card-container">
        {bookmarkDetails.map((manga, index) => (
          <div key={index} className="card-item">
            <CustomCard
              title={manga.title || 'Untitled'}
              description={manga.description || 'No description available'}
              cover_image={manga.cover_image}
              id={manga._id}
              isMobile={false}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderBadges = () => {
    return (
      <>
        {userBadges.includes(0) && <ProgrammerBadge />}
        {userBadges.includes(1) && <AdminBadge />}
        {userBadges.includes(2) && <AlphaBadge />}
        {userBadges.includes(3) && <ChatterBadge />}
      </>
    );
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
              size="small"
            />
          </div>
          <div className="user-details">
            <Text>{userData.email}</Text>
            <Text>Joined: {userData.joinDate}</Text>
            <div className="badge-container">
              {renderBadges()}
            </div>
          </div>
        </Col>
      </Row>
      <Tabs defaultActiveKey="1">
        <TabPane tab={<span><BookOutlined />Bookmarked Manga</span>} key="1">
          {renderBookmarkContent()}
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
