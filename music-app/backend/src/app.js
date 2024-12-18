const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const musicRoutes = require('./routes/musicRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); 
app.use('/api/music', musicRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
