import React, { useEffect, useState, useRef } from 'react';
import { auth, getUserData } from '../../utility/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Ad = () => {
    const [user] = useAuthState(auth);
    const [shouldShowAd, setShouldShowAd] = useState(true);
    const retryCount = useRef(0);
    const maxRetries = 3;
    const retryTimeout = useRef(null);
    const uniqueId = useRef(`container-${Math.random().toString(36).substr(2, 9)}`);

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

    const injectAdScript = () => {
        try {
            // Remove any existing scripts first
            const existingScripts = document.querySelectorAll('script[data-ad-client]');
            existingScripts.forEach(script => {
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            });

            // Create new script with obfuscated attributes
            const script = document.createElement('script');
            script.async = true;
            script.setAttribute('data-ad-client', 'ca-pub');
            
            // Obfuscate the URL
            const base = atob('Ly9wbDI0OTQ1NjU3LnByb2ZpdGFibGVjcG1yYXRlLmNvbS82ZjVmMzQwY2M0MjllYTQ3YmE3OThkNGEyNGJjZjlmMS9pbnZva2UuanM=');
            script.src = base;
            
            // Find or create container
            const container = document.getElementById(uniqueId.current);
            if (container) {
                // Clear container
                container.innerHTML = '';
                
                // Create content wrapper
                const wrapper = document.createElement('div');
                wrapper.id = 'container-6f5f340cc429ea47ba798d4a24bcf9f1';
                container.appendChild(wrapper);
                
                // Add script after small delay
                setTimeout(() => {
                    container.appendChild(script);
                }, 100);
            }

            script.onload = () => {
                retryCount.current = 0;
                console.log('Content loaded successfully');
            };

            script.onerror = (e) => {
                console.log('Loading alternative content...');
                if (retryCount.current < maxRetries) {
                    if (script.parentNode) {
                        script.parentNode.removeChild(script);
                    }
                    retryTimeout.current = setTimeout(() => {
                        retryCount.current += 1;
                        injectAdScript();
                    }, 2000);
                }
            };
        } catch (error) {
            console.log('Alternative content unavailable');
        }
    };

    useEffect(() => {
        if (!shouldShowAd) return;

        const timer = setTimeout(() => {
            injectAdScript();
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearTimeout(retryTimeout.current);
            const scripts = document.querySelectorAll('script[data-ad-client]');
            scripts.forEach(script => {
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            });
        };
    }, [shouldShowAd]);

    if (!shouldShowAd) return null;

    return (
        <div className="content-container" style={{ margin: '20px 0', minHeight: '300px' }}>
            <div id={uniqueId.current}></div>
        </div>
    );
};

export default Ad; 