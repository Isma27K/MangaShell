import React, { useEffect, useState } from 'react';
import { auth, getUserData } from '../../utility/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Ad = () => {
    const [user] = useAuthState(auth);
    const [shouldShowAd, setShouldShowAd] = useState(true);

    useEffect(() => {
        const checkAdPermission = async () => {
            if (user) {
                const userData = await getUserData(user.uid);
                setShouldShowAd(userData?.ads !== false);
            } else {
                setShouldShowAd(true);
            }
        };

        checkAdPermission();
    }, [user]);

    useEffect(() => {
        if (!shouldShowAd) return;

        const script = document.createElement('script');
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = '//pl24945657.profitablecpmrate.com/6f5f340cc429ea47ba798d4a24bcf9f1/invoke.js';
        
        const container = document.getElementById('container-6f5f340cc429ea47ba798d4a24bcf9f1');
        if (container) {
            container.parentNode.insertBefore(script, container);
        }

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, [shouldShowAd]);

    if (!shouldShowAd) return null;

    return (
        <div className="ad-container" style={{ margin: '20px 0', minHeight: '300px' }}>
            <div id="container-6f5f340cc429ea47ba798d4a24bcf9f1"></div>
        </div>
    );
};

export default Ad; 