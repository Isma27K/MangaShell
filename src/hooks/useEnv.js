import { useState, useEffect } from 'react';

export const useEnv = () => {
  const [env, setEnv] = useState({});

  useEffect(() => {
    setEnv({
      //REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL || 'http://localhost:5001',
      // Add other environment variables here if needed
    });
  }, []);

  return env;
};