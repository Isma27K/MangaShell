import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './routes/home/Home.Routes';
import PageNotFound from "./routes/404/404.Routes";
import MangaDetail from './routes/mangaPage/mangaDetail';
//import Dashboard from './components/dashboard/dashboard.component';
import ReadManga from './routes/readManga/readManga';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="*" element={<PageNotFound />} />
                        <Route path="/manga/:id" element={<MangaDetail />} />
                        <Route path="/manga/:id/:chapter" element={<ReadManga />} />
                    </Routes>
                </div>
                
            </div>
        </Router>
    );
};

export default App;
