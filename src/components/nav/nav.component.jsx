import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button, Drawer } from 'antd';
import { MenuOutlined, HomeOutlined, BookOutlined, UserOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './nav.style.scss';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    return (
        <nav className="nav">
            <div className="nav-content">
                <div className="nav-title">
                    <h2 onClick={() => navigate('/')}>MangaShell</h2>
                </div>
                <div className="nav-search">
                    <Input placeholder="What's In Your Mind..." />
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
