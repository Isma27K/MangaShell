const express = require('express');
const router = express.Router();
const axios = require('axios');

// ... (keep your existing routes)

router.get('/proxy-image', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).send('URL parameter is required');
    }

    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://manganato.com/'
            }
        });

        res.set('Content-Type', response.headers['content-type']);
        res.send(response.data);
    } catch (error) {
        console.error('Error proxying image:', error);
        res.status(500).send('Error fetching image');
    }
});

router.get('/:mangaId/:chapterId', async (req, res) => {
    const { mangaId, chapterId } = req.params;

    try {
        const imageUrls = await getChapterImages(mangaId, chapterId);

        if (imageUrls.length === 0) {
            return res.status(404).send('Chapter not found');
        }

        // Generate proxy URLs
        const proxyUrls = imageUrls.map((url, index) => ({
            index,
            proxyUrl: `/proxy/${mangaId}/${chapterId}/${index}/${Buffer.from(url).toString('base64')}`
        }));

        console.log('Sending proxy URLs:', proxyUrls); // Add this line

        res.json(proxyUrls);
    } catch (error) {
        console.error('Error fetching chapter images:', error);
        res.status(500).json({ error: 'Failed to fetch chapter images' });
    }
});

const getChapterImages = async (mangaId, chapterId) => {
    const manga = await chapterImage(mangaId, chapterId);
    console.log('Manga data:', manga); // Add this line
    if (manga && manga._id == mangaId) {
        const chapter = manga.chapters.find(ch => ch._id == chapterId);
        console.log('Chapter data:', chapter); // Add this line
        return chapter ? chapter.image_urls : [];
    }
    return [];
};

module.exports = router;