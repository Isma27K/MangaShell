import './App.css';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

// ============================= Routes ================================

import Home from './routes/home/Home.Routes';

// ============================= App ===================================

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
            </Routes>
        </Router>
    );
}

export default App;
