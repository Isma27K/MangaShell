import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Corrected import for Link
import { ShoppingCartOutlined, DownloadOutlined, BookOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { Avatar, Input, Button, Badge, Drawer, Menu, Dropdown } from 'antd';

// Import assets
import AvatarImage from "../../asset/test/avatar/OIP.jpeg";
import './nav.style.scss'; // Import the SCSS file for styling

const avatarSize = {
    xs: 30, sm: 35, md: 40, lg: 45, xl: 50, xxl: 55
};

const Nav = () => {
    const [cartItems] = useState(2); // If not used, you can remove setCartItems
    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const handleCartClick = () => {
        setDrawerVisible(true);
    };

    const handleDrawerClose = () => {
        setDrawerVisible(false);
    };

    // Define menu items for the avatar dropdown
    const menu = (
        <Menu className="menu">
            <Menu.Item key="1" icon={<DownloadOutlined />} className="menu-item">
                Downloads
            </Menu.Item>
            <Menu.Item key="2" icon={<BookOutlined />} className="menu-item">
                Saved
            </Menu.Item>
            <Menu.Item key="3" icon={<SettingOutlined />} className="menu-item">
                Settings
            </Menu.Item>
            <Menu.Item key="4" icon={<LogoutOutlined />} className="menu-item">
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <nav className="nav">
                <div className="nav-search">
                    <Input placeholder="What's In Your Mind..." />
                </div>
                <div className="nav-title">
                    <Link to="/"><h2>Rata.Code</h2></Link> {/* Corrected usage of Link */}
                </div>

                <div className="nav-cart-avatar">
                    <Button type="text" onClick={handleCartClick}>
                        <Badge count={cartItems} showZero>
                            <ShoppingCartOutlined className="cart-icon" />
                        </Badge>
                    </Button>

                    {/* Avatar with Dropdown */}
                    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                        <Avatar
                            size={avatarSize.xxl}
                            src={AvatarImage}
                            className="avatar"
                        />
                    </Dropdown>

                </div>
            </nav>

            <Drawer
                title="Shopping Cart"
                placement="right"
                onClose={handleDrawerClose}
                open={isDrawerVisible} // Updated to use 'open'
                width={300}
            >
                <p>Item 1</p>
                <p>Item 2</p>
                <p>Item 3</p>
            </Drawer>
        </>
    );
}

export default Nav;
