import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './routes/home/Home.Routes';
import PageNotFound from "./routes/404/404.Routes";

function App() {
    return (
        <Router>
            <div className="app-container">
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </div>
                
            </div>
        </Router>
    );
}

export default App;
