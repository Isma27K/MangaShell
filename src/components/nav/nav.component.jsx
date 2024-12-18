import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AutoComplete, Button, Drawer, Image, Avatar, message } from 'antd';
import { HomeOutlined, UserOutlined, LogoutOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { auth, getUserData, signOutUser } from '../../utility/firebase/firebase';
import fallbackImage from '../../asset/fallback-image.png';
import defaultAvatar from '../../asset/default-avatar.png';
import './nav.style.scss';

// Add this function to truncate text
const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength - 3) + '...';
};

const Nav = () => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [options, setOptions] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const autoCompleteRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [userData, setUserData] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const data = await getUserData(user.uid);
                    const photoURL = user.photoURL || data?.photoURL || null;
                    setUserData(data);
                    setImageUrl(photoURL);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                setUserData(null);
                setImageUrl('');
            }
        });

        return () => unsubscribe();
    }, []);

    const getTitleMaxLength = () => {
        if (windowWidth < 768) return 30;
        if (windowWidth < 1024) return 40;
        return 70;
    };

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const handleSearch = async (value) => {
        setSearchValue(value);
        if (value) {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/search?q=${value}`);
                const data = await response.json();
                const titleMaxLength = getTitleMaxLength();
                const formattedOptions = data.map(item => ({
                    value: item._id.toString(), // Use _id as the value
                    label: (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Image
                                src={item.cover_image}
                                alt={item.title}
                                width={40}
                                height={60}
                                style={{ marginRight: '10px', objectFit: 'cover' }}
                                fallback={fallbackImage}
                                onError={(e) => {
                                    console.log(`Failed to load image for ${item.title}`);
                                }}
                            />
                            <span>{truncateText(item.title, titleMaxLength)}</span>
                        </div>
                    ),
                }));
                setOptions(formattedOptions);
            } catch (error) {
                console.error('Error fetching search results:', error);
                setOptions([]);
            }
        } else {
            setOptions([]);
        }
    };

    const onSelect = (value) => {
        // Navigate to the manga detail page
        navigate(`/manga/${value}`);
        setSearchValue('');
        setOptions([]);
        if (autoCompleteRef.current) {
            autoCompleteRef.current.blur();
        }
    };

    // Update this function to handle the MangaShell click
    const handleLogoClick = () => {
        navigate('/');
        // Force a reload to ensure we get fresh data for page 1
        window.location.reload();
    };

    const handleLogout = async () => {
        try {
            await signOutUser();
            message.success('Logged out successfully');
            navigate('/');
            onClose();
        } catch (error) {
            console.error("Error logging out:", error);
            message.error('Failed to logout');
        }
    };

    const renderMenuItems = () => {
        if (userData) {
            return (
                <>
                    <div className="menu-items-top">
                        <li className="menu-item">
                            <Link to="/profile" onClick={onClose}>
                                <UserOutlined /> Profile
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/" onClick={onClose}>
                                <HomeOutlined /> Home
                            </Link>
                        </li>
                    </div>
                    <div className="menu-items-bottom">
                        <li className="menu-item">
                            <Button 
                                type="text" 
                                onClick={handleLogout} 
                                icon={<LogoutOutlined />}
                                className="logout-button"
                            >
                                Logout
                            </Button>
                        </li>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className="menu-items-top">
                        <li className="menu-item">
                            <Link to="/" onClick={onClose}>
                                <HomeOutlined /> Home
                            </Link>
                        </li>
                    </div>
                    <div className="menu-items-bottom">
                        <li className="menu-item">
                            <Link to="/login" onClick={onClose}>
                                <LoginOutlined /> Login
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/register" onClick={onClose}>
                                <UserAddOutlined /> Register
                            </Link>
                        </li>
                    </div>
                </>
            );
        }
    };

    return (
        <nav className="nav">
            <div className="nav-content">
                <div className="nav-title">
                    <h2 onClick={handleLogoClick}>MangaShell</h2>
                </div>
                <div className="nav-search">
                    <AutoComplete
                        ref={autoCompleteRef}
                        style={{ width: '100%' }}
                        options={options}
                        onSearch={handleSearch}
                        onSelect={onSelect}
                        value={searchValue}
                        onChange={setSearchValue}
                        placeholder="What's In Your Mind..."
                    />
                    <Avatar 
                        size={32}
                        src={imageUrl || defaultAvatar}
                        icon={!imageUrl && !defaultAvatar && <UserOutlined />}
                        onClick={showDrawer}
                        style={{ cursor: 'pointer' }}
                        className="nav-avatar"
                    />
                </div>
            </div>
            <Drawer
                title="Menu"
                placement="right"
                onClose={onClose}
                open={visible}
                className="mobile-menu"
            >
                <ul className="menu-list">
                    {renderMenuItems()}
                </ul>
            </Drawer>
        </nav>
    );
}

export default Nav;
