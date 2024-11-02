import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../utility/firebase/firebase';

export const useMangaCache = () => {
  const [collection, setCollection] = useState([]);
  const [readChapters, setReadChapters] = useState({});
  const auth = getAuth();

  // Subscribe to user's manga collection in Firebase
  useEffect(() => {
    let unsubscribe;

    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setCollection(userData.bookmarkedManga || []);
        }
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [auth.currentUser]);

  // Check if manga is in collection
  const isInCollection = (mangaId) => {
    return collection.includes(mangaId);
  };

  // The rest of the read chapters functionality can remain the same
  // since it's client-side only functionality
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
    localStorage.setItem('readChapters', JSON.stringify(updatedReadChapters));
  };

  const isChapterRead = (mangaId, chapterId) => {
    return readChapters[mangaId]?.[chapterId]?.read || false;
  };

  return {
    collection,
    isInCollection,
    isChapterRead,
    markChapterRead
  };
};