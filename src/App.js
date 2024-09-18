import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

// ============================= Routes ================================

import Home from './routes/home/Home.Routes';
import PageNotFound from "./routes/404/404.Routes";

// ============================= App ===================================

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>

                <Route path="*" element={<PageNotFound/>}/>
            </Routes>
        </Router>
    );
}

export default App;
