import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AutoComplete, Button, Drawer, Image } from 'antd';
import { MenuOutlined, HomeOutlined, BookOutlined, UserOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './nav.style.scss';

// Add this import for a fallback image
import fallbackImage from '../../asset/fallback-image.png'; // Make sure to add a fallback image to your assets

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

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
                </div>
                <div className="burger-menu">
                    <Button type="text" onClick={showDrawer}>
                        <MenuOutlined />
                    </Button>
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
                    <li className="menu-item">
                        <Link to="/" onClick={onClose}>
                            <HomeOutlined /> Home
                        </Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/browse" onClick={onClose}>
                            <BookOutlined /> Browse Manga
                        </Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/profile" onClick={onClose}>
                            <UserOutlined /> Profile
                        </Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/about" onClick={onClose}>
                            <InfoCircleOutlined /> About
                        </Link>
                    </li>
                </ul>
            </Drawer>
        </nav>
    );
}

export default Nav;
