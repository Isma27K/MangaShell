import React from 'react';
import Nav from "../../components/nav/nav.component";
import Dashboard from "../../components/dashboard/dashboard.component";
import Footer from '../../components/footer/footer.component.jsx';
import { useParams } from 'react-router-dom';
import './Home.style.scss';

const Home = () => {
    const { page } = useParams();

    return (
        <div className="home-container">
            <Nav />
            <main className="home-content">
                <Dashboard page={page} />
            </main>
            {/*<Footer />*/}
        </div>
    );
};

export default Home;
