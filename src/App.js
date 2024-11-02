import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Home from './routes/home/Home.Routes';
import PageNotFound from "./routes/404/404.Routes";
import MangaDetail from './routes/mangaPage/mangaDetail';
import ReadManga from './routes/readManga/readManga';
import Profile from './routes/profile/profile';
import Login from './routes/login/login'
import Register from './routes/register/register'

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const auth = getAuth();
  const [isAuthenticated, setIsAuthenticated] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, [auth]);

  if (isAuthenticated === null) {
    // Still checking authentication status
    return null;
  }

  if (!isAuthenticated) {
    // Save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/page/:page" element={<Home />} />
                        <Route path="*" element={<PageNotFound />} />
                        <Route path="/manga/:id" element={<MangaDetail />} />
                        <Route path="/manga/:id/:chapter" element={<ReadManga />} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/login" element={<Login />} />
                        <Route path='/register' element={<Register/>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
