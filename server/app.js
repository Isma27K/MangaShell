const express = require('express');
const cors = require('cors');
const mangaRoutes = require('./routes/manga');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/data', mangaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));