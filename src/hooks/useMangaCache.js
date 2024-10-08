import { useState, useEffect } from 'react';

const useMangaCache = (mangaId, chapterId) => {
    const [cachedData, setCachedData] = useState(null);

    useEffect(() => {
        const key = `manga_${mangaId}_${chapterId}`;
        const cached = localStorage.getItem(key);
        if (cached) {
            setCachedData(JSON.parse(cached));
        }
    }, [mangaId, chapterId]);

    const updateCache = (data) => {
        const key = `manga_${mangaId}_${chapterId}`;
        localStorage.setItem(key, JSON.stringify(data));
        setCachedData(data);
    };

    return [cachedData, updateCache];
};

export default useMangaCache;