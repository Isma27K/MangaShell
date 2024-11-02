import { useState, useEffect } from 'react';

const MANGA_COLLECTION_KEY = 'mangaCollection';
const READ_CHAPTERS_KEY = 'readChapters';

export const useMangaCache = () => {
  const [collection, setCollection] = useState([]);
  const [readChapters, setReadChapters] = useState({});

  // Load saved data on initial mount
  useEffect(() => {
    const savedCollection = localStorage.getItem(MANGA_COLLECTION_KEY);
    const savedReadChapters = localStorage.getItem(READ_CHAPTERS_KEY);

    if (savedCollection) {
      setCollection(JSON.parse(savedCollection));
    }
    if (savedReadChapters) {
      setReadChapters(JSON.parse(savedReadChapters));
    }
  }, []);

  // Save manga to collection
  const saveManga = (manga) => {
    const updatedCollection = [...collection, manga];
    setCollection(updatedCollection);
    localStorage.setItem(MANGA_COLLECTION_KEY, JSON.stringify(updatedCollection));
  };

  // Remove manga from collection
  const removeManga = (mangaId) => {
    const updatedCollection = collection.filter(manga => manga.id !== mangaId);
    setCollection(updatedCollection);
    localStorage.setItem(MANGA_COLLECTION_KEY, JSON.stringify(updatedCollection));
  };

  // Automatically mark chapter as read when accessed
  const markChapterRead = (mangaId, chapterId) => {
    const updatedReadChapters = {
      ...readChapters,
      [mangaId]: {
        ...(readChapters[mangaId] || {}),
        [chapterId]: {
          read: true,
          timestamp: Date.now()
        }
      }
    };
    setReadChapters(updatedReadChapters);
    localStorage.setItem(READ_CHAPTERS_KEY, JSON.stringify(updatedReadChapters));
  };

  // Check if manga is in collection
  const isInCollection = (mangaId) => {
    return collection.some(manga => manga.id === mangaId);
  };

  // Check if chapter is read
  const isChapterRead = (mangaId, chapterId) => {
    return readChapters[mangaId]?.[chapterId]?.read || false;
  };

  // Get last read timestamp
  const getReadTimestamp = (mangaId, chapterId) => {
    return readChapters[mangaId]?.[chapterId]?.timestamp;
  };

  return {
    collection,
    readChapters,
    saveManga,
    removeManga,
    markChapterRead,
    isInCollection,
    isChapterRead,
    getReadTimestamp
  };
};