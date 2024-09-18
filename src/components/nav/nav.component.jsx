// =============== import dependency =========================
import React, {useState} from 'react';
import {ShoppingCartOutlined} from '@ant-design/icons';
import {Avatar, Input, Button, Badge, Drawer} from 'antd';

// =============== import assets ============================
import AvatarImage from "../../asset/test/avatar/OIP.jpeg";

const avatarSize = {
    xs: 30,   // Extra small
    sm: 35,   // Small
    md: 40,   // Medium
    lg: 45,   // Large
    xl: 50,   // Extra large
    xxl: 55   // Extra extra large
};

const Nav = () => {
    const [cartItems, setCartItems] = useState(2); // Example cart item count
    const [isDrawerVisible, setDrawerVisible] = useState(false); // Drawer visibility state

    // Function to handle cart click
    const handleCartClick = () => {
        setDrawerVisible(true); // Show the drawer when cart is clicked
    };

    // Function to close the drawer
    const handleDrawerClose = () => {
        setDrawerVisible(false);
    };

    return (
        <>
            <nav className="nav" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px',
                height: `${avatarSize.xxl}px`,
                position: 'relative'
            }}>
                {/* Left Section: Input */}
                <div className="nav-search" style={{flexGrow: 1, marginRight: '20px'}}>
                    <Input placeholder="Whats In Your Mind..." style={{width: '25vw', height: '100%'}}/>
                </div>

                {/* Center Section: Website Name */}
                <div className="nav-title"
                     style={{position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center'}}>
                    <h2 style={{margin: 0}}>Rata.Code</h2>
                </div>

                {/* Right Section: Cart and Avatar */}
                <div className="nav-cart-avatar" style={{display: "flex", alignItems: "center"}}>
                    {/* Cart button with badge */}
                    <Button type="text" onClick={handleCartClick} style={{marginRight: '15px'}}>
                        <Badge count={cartItems} showZero>
                            <ShoppingCartOutlined style={{fontSize: `${avatarSize.xxl * 0.6}px`}}/>
                        </Badge>
                    </Button>

                    {/* Avatar */}
                    <Avatar
                        size={avatarSize.xxl}
                        src={AvatarImage}
                    />
                </div>
            </nav>

            {/* Drawer Component */}
            <Drawer
                title="Shopping Cart"
                placement="right"
                onClose={handleDrawerClose}
                visible={isDrawerVisible}
                width={300}
            >
                {/* Cart Content: For now, just showing a list of items */}
                <p>Item 1</p>
                <p>Item 2</p>
                <p>Item 3</p>
                {/* You can add a list, pricing, and checkout options here */}
            </Drawer>
        </>
    );
}

export default Nav;
