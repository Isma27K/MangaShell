import React from 'react';
import Nav from "../../components/nav/nav.component";
import Footer from '../../components/footer/footer.component.jsx';
import BodyMangaDetail from '../../components/bodyMangaDetail/bodyMangaDetail.component.jsx';
import './mangaDetail.style.scss';

const MangaDetail = () => {
    return (
        <div className="manga-detail-page">
            <Nav />
            <div className="manga-detail-content">
                <BodyMangaDetail />
            </div>
            <Footer />
        </div>
    )
}

export default MangaDetail;