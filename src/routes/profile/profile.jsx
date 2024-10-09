import React from 'react';
import { Layout } from 'antd';
import Nav from '../../components/nav/nav.component';
import ProfileBody from '../../components/profile-body/profile-body.component';
import './profile.style.scss';

const Profile = () => {
    return (
        <>
            <Nav />
            <Layout className="profile-layout">
                <ProfileBody />
            </Layout>
        </>
    );
};

export default Profile;
