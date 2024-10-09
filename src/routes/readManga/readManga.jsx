import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Spin, Button, message, Breadcrumb } from 'antd';
import { LeftOutlined, RightOutlined, HomeOutlined } from '@ant-design/icons';
import './readManga.style.scss';

const ReadManga = () => {
    const { id, chapter } = useParams();
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mangaInfo, setMangaInfo] = useState(null);
    const [currentChapter, setCurrentChapter] = useState(null);

    useEffect(() => {
        fetchMangaInfo();
    }, [id]);

    useEffect(() => {
        if (mangaInfo) {
            const foundChapter = mangaInfo.chapters.find(ch => ch._id.toString() === chapter);
            setCurrentChapter(foundChapter);
            if (foundChapter) {
                fetchChapterImages(foundChapter._id);
            }
        }
    }, [mangaInfo, chapter]);

    const fetchMangaInfo = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://api.ratacode.top/data/${id}`);
            if (!response.ok) throw new Error('Failed to fetch manga info');
            const data = await response.json();
            setMangaInfo(data);
        } catch (error) {
            console.error('Error fetching manga info:', error);
            message.error('Failed to load manga information');
        } finally {
            setLoading(false);
        }
    };

    const fetchChapterImages = async (chapterId) => {
        setLoading(true);
        try {
            const response = await fetch(`https://api.ratacode.top/data/${id}/${chapterId}`);
            if (!response.ok) throw new Error('Failed to fetch chapter images');
            const data = await response.json();
            setImages(data);
        } catch (error) {
            console.error('Error fetching chapter images:', error);
            message.error('Failed to load chapter images');
        } finally {
            setLoading(false);
        }
    };

    const navigateChapter = (direction) => {
        if (!mangaInfo || !mangaInfo.chapters || !currentChapter) return;
        const currentIndex = mangaInfo.chapters.findIndex(ch => ch._id === currentChapter._id);
        if (currentIndex === -1) return;

        let newChapter;
        if (direction === 'next' && currentIndex > 0) {
            newChapter = mangaInfo.chapters[currentIndex - 1];
        } else if (direction === 'prev' && currentIndex < mangaInfo.chapters.length - 1) {
            newChapter = mangaInfo.chapters[currentIndex + 1];
        }

        if (newChapter) {
            navigate(`/manga/${id}/${newChapter._id}`);
        }
    };

    const isFirstChapter = currentChapter && mangaInfo?.chapters[0]._id === currentChapter._id;
    const isLastChapter = currentChapter && mangaInfo?.chapters[mangaInfo.chapters.length - 1]._id === currentChapter._id;

    if (loading) {
        return (
            <div className="read-manga-container">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="read-manga-container">
            <div className="manga-header">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>
                        <Link to="/"><HomeOutlined /> Home</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={`/manga/${id}`}>{mangaInfo?.title}</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{currentChapter?.title}</Breadcrumb.Item>
                </Breadcrumb>
                <h1>{mangaInfo?.title} - {currentChapter?.title}</h1>
                <div className="chapter-navigation top">
                    {!isLastChapter && (
                        <Button onClick={() => navigateChapter('prev')}>
                            <LeftOutlined /> Previous Chapter
                        </Button>
                    )}
                    {!isFirstChapter && (
                        <Button onClick={() => navigateChapter('next')}>
                            Next Chapter <RightOutlined />
                        </Button>
                    )}
                </div>
            </div>
            <div className="manga-images">
                {images.map((image, index) => (
                    <img 
                        key={index} 
                        src={`data:${image.contentType};base64,${image.data}`} 
                        alt={`Page ${index + 1}`}
                    />
                ))}
            </div>
            <div className="chapter-navigation bottom">
                {!isLastChapter && (
                    <Button onClick={() => navigateChapter('prev')}>
                        <LeftOutlined /> Previous Chapter
                    </Button>
                )}
                {!isFirstChapter && (
                    <Button onClick={() => navigateChapter('next')}>
                        Next Chapter <RightOutlined />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ReadManga;
