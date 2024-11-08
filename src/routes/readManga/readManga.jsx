import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Spin, Button, message, Breadcrumb, Select, FloatButton } from 'antd';
import { LeftOutlined, RightOutlined, HomeOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import './readManga.style.scss';
import { useMangaCache } from '../../hooks/useMangaCache';
import Ad from '../../components/Ad/Ad';

const ReadManga = () => {
    const { id, chapter } = useParams();
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [mangaInfo, setMangaInfo] = useState(null);
    const [currentChapter, setCurrentChapter] = useState(null);
    const { markChapterRead } = useMangaCache();
    const [priorityLoad, setPriorityLoad] = useState(() => {
        const savedPriority = localStorage.getItem('mangaPriorityLoad');
        return savedPriority ? parseInt(savedPriority) : 5;
    });

    useEffect(() => {
        let isSubscribed = true;
        
        const fetchData = async () => {
            setInitialLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/data/${id}`);
                if (!response.ok) throw new Error('Failed to fetch manga info');
                const data = await response.json();
                if (isSubscribed) {
                    setMangaInfo(data);
                }
            } catch (error) {
                console.error('Error fetching manga info:', error);
                if (isSubscribed) {
                    message.error('Failed to load manga information');
                }
            } finally {
                if (isSubscribed) {
                    setInitialLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isSubscribed = false;
        };
    }, [id]);

    useEffect(() => {
        if (mangaInfo) {
            const foundChapter = mangaInfo.chapters.find(ch => ch._id.toString() === chapter);
            setCurrentChapter(foundChapter);
            if (foundChapter) {
                fetchChapterImages(foundChapter._id);
                markChapterRead(id, chapter);
            }
        }
    }, [mangaInfo, chapter]);

    const fetchChapterImages = async (chapterId) => {
        setImages([]);

        const eventSource = new EventSource(
            `${process.env.REACT_APP_BACKEND_URL}/data/${id}/${chapterId}`
        );

        let pendingImages = [];
        let processedUrls = new Set();

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.end) {
                eventSource.close();
                setImages(prev => [...prev, ...pendingImages]);
                return;
            }

            if (data.error) {
                console.error(`Error loading image ${data.index}: ${data.error}`);
                return;
            }

            const imageUrl = `${process.env.REACT_APP_BACKEND_URL}/data/proxy-image?url=${encodeURIComponent(data.url)}`;
            
            if (processedUrls.has(imageUrl)) {
                return;
            }
            processedUrls.add(imageUrl);

            if (data.index < priorityLoad) {
                setImages(prevImages => {
                    const newImages = [...prevImages];
                    newImages[data.index] = imageUrl;
                    return newImages;
                });
            } else {
                pendingImages[data.index - priorityLoad] = imageUrl;
            }
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
            message.error('Failed to load chapter images');
        };

        return () => {
            eventSource.close();
        };
    };

    const handlePriorityChange = (value) => {
        setPriorityLoad(value);
        localStorage.setItem('mangaPriorityLoad', value.toString());
        if (currentChapter) {
            fetchChapterImages(currentChapter._id);
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

    const renderImagesWithAds = () => {
        const result = [];
        
        // Add images with ad between second and third image
        images.forEach((imageUrl, index) => {
            if (imageUrl) {
                result.push(
                    <img 
                        key={`img-${index}`}
                        src={imageUrl}
                        alt={`Page ${index + 1}`}
                        className="manga-page"
                    />
                );
                
                // Insert ad after second image (index 1)
                if (index === 1) {
                    result.push(<Ad key="mid-ad" />);
                }
            }
        });

        return result;
    };

    if (initialLoading) {
        return (
            <div className="read-manga-container">
                <div className="loading-overlay">
                    <Spin size="large" />
                </div>
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
                <div className="loading-controls">
                    <span>Priority Load: </span>
                    <Select
                        value={priorityLoad}
                        onChange={handlePriorityChange}
                        options={[
                            { value: 1, label: 'First Image' },
                            { value: 3, label: 'First 3 Images' },
                            { value: 5, label: 'First 5 Images' },
                            { value: 10, label: 'First 10 Images' },
                            { value: Infinity, label: 'Load All' }
                        ]}
                        className="priority-select"
                    />
                </div>
                <div className="chapter-navigation top">
                    <div className="navigation-content">
                        <div className="left-nav">
                            {!isLastChapter && (
                                <Button onClick={() => navigateChapter('prev')}>
                                    <LeftOutlined /> Previous Chapter
                                </Button>
                            )}
                        </div>
                        <div className="right-nav">
                            {!isFirstChapter && (
                                <Button onClick={() => navigateChapter('next')}>
                                    Next Chapter <RightOutlined />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="manga-images">
                {renderImagesWithAds()}
            </div>

            <div className="chapter-navigation-bottom">
                <div className="navigation-content">
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

            <FloatButton.Group shape="circle" style={{ right: 24 }}>
                <FloatButton
                    icon={<VerticalAlignTopOutlined />}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="desktop-only"
                />
            </FloatButton.Group>
        </div>
    );
};

export default ReadManga;
