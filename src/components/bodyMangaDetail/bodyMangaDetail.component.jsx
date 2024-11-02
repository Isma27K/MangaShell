import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Typography, Tag, List, Skeleton, Row, Col, Space, Button, Modal } from 'antd';
import noMangaFound from '../../asset/fallback-image.png';
import { useMangaCache } from '../../hooks/useMangaCache';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import './bodyMangaDetail.styles.scss';
import { getAuth } from 'firebase/auth';
import { addMangaToCollection, removeMangaFromCollection, verifyUserDocument } from '../../utility/firebase/firebase';

const { Title, Text, Paragraph } = Typography;

const BodyMangaDetail = () => {
    const { id } = useParams();
    const [manga, setManga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const { 
        isInCollection, 
        saveManga, 
        removeManga,
        isChapterRead
    } = useMangaCache();
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        const fetchManga = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/data/${id}`);
                setManga(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch manga details');
                setLoading(false);
            }
        };

        fetchManga();
    }, [id]);

    useEffect(() => {
        const verifyUser = async () => {
            if (auth.currentUser) {
                try {
                    await verifyUserDocument(auth.currentUser.uid);
                } catch (error) {
                    console.error('Error verifying user document:', error);
                }
            }
        };
        
        verifyUser();
    }, [auth.currentUser]);

    if (loading) return <Skeleton active />;

    if (error) {
        return (
            <div className="error-container">
                <span className="error-text">No manga found</span>
                <img src={noMangaFound} alt="No manga found" className="error-image" />
            </div>
        );
    }

    if (!manga) {
        return (
            <div className="error-container">
                <img src={noMangaFound} alt="No manga found" className="error-image" />
                <span className="error-text">No manga found</span>
            </div>
        );
    }

    const truncateDescription = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, text.lastIndexOf(' ', maxLength)) + '...';
    };

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const handleSaveToggle = async () => {
        if (!auth.currentUser) {
            setIsLoginModalVisible(true);
            return;
        }

        try {
            console.log('Starting save toggle operation');
            console.log('Current user:', auth.currentUser);
            console.log('Manga:', manga);
            console.log('Manga ID:', id);

            if (isInCollection(id)) {
                console.log('Removing manga from collection...');
                await removeMangaFromCollection(auth.currentUser.uid, id);
                removeManga(id);
            } else {
                console.log('Adding manga to collection...');
                await addMangaToCollection(auth.currentUser.uid, id);
                saveManga(manga);
            }
        } catch (error) {
            console.error("Detailed error in handleSaveToggle:", error);
            Modal.error({
                title: 'Error',
                content: `Failed to update collection: ${error.message}`,
            });
        }
    };

    const handleLoginModalClose = () => {
        setIsLoginModalVisible(false);
    };

    const ChapterListItem = ({ chapter }) => {
        const isRead = isChapterRead(id, chapter._id);
        
        return (
            <List.Item className="chapter-item">
                <Link 
                    to={`/manga/${id}/${chapter._id}`}
                    className={`chapter-link ${isRead ? 'read' : ''}`}
                >
                    <div className="chapter-content">
                        {isRead && <div className="read-indicator" />}
                        <span className="chapter-title">{chapter.title}</span>
                    </div>
                    <span className="chapter-date">{chapter.release_date}</span>
                </Link>
            </List.Item>
        );
    };

    return (
        <div className="manga-detail">
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card className="manga-info-card">
                        <div className="manga-header">
                            <div className="manga-cover-container">
                                <img src={manga.cover_image} alt={manga.title} className="manga-cover" />
                            </div>
                            <div className="manga-info">
                                <Title level={2}>{manga.title}</Title>
                                <Space direction="vertical" size="small" className="info-items">
                                    <Text>
                                        <Text strong>Alternative Names:</Text> {manga.alt_names.join(', ')}
                                    </Text>
                                    <Text>
                                        <Text strong>Author(s):</Text> {manga.authors.join(', ')}
                                    </Text>
                                    <Text>
                                        <Text strong>Status:</Text> 
                                        <Tag color={manga.status.toLowerCase() === 'ongoing' ? 'green' : 'blue'}>
                                            {manga.status}
                                        </Tag>
                                    </Text>
                                    <Text>
                                        <Text strong>Last Updated:</Text> {manga.latest_update}
                                    </Text>
                                    <Button 
                                        type={isInCollection(manga.id) ? 'primary' : 'default'}
                                        onClick={handleSaveToggle}
                                        icon={isInCollection(manga.id) ? <HeartFilled /> : <HeartOutlined />}
                                        className="collection-button"
                                    >
                                        {auth.currentUser 
                                            ? (isInCollection(manga.id) ? 'In Collection' : 'Add to Collection')
                                            : 'Login to Save'
                                        }
                                    </Button>
                                </Space>
                                <div className="manga-genres">
                                    {manga.genres.map((genre, index) => (
                                        <Tag key={index}>{genre}</Tag>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={`manga-description ${expanded ? 'expanded' : ''}`}>
                            <Title level={3}>Description</Title>
                            <Paragraph>
                                {expanded ? manga.description : truncateDescription(manga.description, 300)}
                            </Paragraph>
                            <Button onClick={toggleExpand} className="expand-button">
                                {expanded ? 'View Less' : 'View More'}
                            </Button>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Chapters" className="manga-chapters">
                        <List
                            dataSource={manga.chapters}
                            renderItem={(chapter) => (
                                <ChapterListItem chapter={chapter} />
                            )}
                        />
                    </Card>
                </Col>
            </Row>
            <Modal
                title="Login Required"
                open={isLoginModalVisible}
                onOk={() => {
                    handleLoginModalClose();
                    window.location.href = '/login';
                }}
                onCancel={handleLoginModalClose}
                okText="Login"
                cancelText="Cancel"
            >
                <p>You need to be logged in to add manga to your collection.</p>
            </Modal>
        </div>
    );
};

export default BodyMangaDetail;