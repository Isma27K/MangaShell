import React, { useEffect, useRef } from 'react';

const Ad = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        // Create script element
        const script = document.createElement('script');
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = '//pl24945657.profitablecpmrate.com/6f5f340cc429ea47ba798d4a24bcf9f1/invoke.js';
        
        // Append script to document
        document.head.appendChild(script);

        return () => {
            // Cleanup
            document.head.removeChild(script);
        };
    }, []);

    return (
        <div className="ad-container" style={{ margin: '20px 0' }}>
            <div id="container-6f5f340cc429ea47ba798d4a24bcf9f1" ref={containerRef}></div>
        </div>
    );
};

export default Ad; 