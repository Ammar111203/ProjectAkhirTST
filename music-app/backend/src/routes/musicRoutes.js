const express = require('express');
const multer = require('multer');
const Music = require('../models/musicModel');
const path = require('path');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Get all music
router.get('/', (req, res) => {
  Music.getAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Get single music
router.get('/:id', (req, res) => {
  Music.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

// Add new music
router.post('/', upload.single('file_mp3'), (req, res) => {
  const data = {
    nama_lagu: req.body.nama_lagu,
    file_mp3: req.file.filename,
  };
  Music.add(data, (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: results.insertId, ...data });
  });
});

// Update music
router.put('/:id', upload.single('file_mp3'), (req, res) => {
  const data = {
    nama_lagu: req.body.nama_lagu,
    file_mp3: req.file ? req.file.filename : req.body.file_mp3,
  };
  Music.update(req.params.id, data, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Updated successfully!' });
  });
});

// Delete music
router.delete('/:id', (req, res) => {
  Music.delete(req.params.id, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Deleted successfully!' });
  });
});



const player = require('play-sound')();

router.post('/play/:nama_lagu', (req, res) => {
  const nama_lagu = req.params.nama_lagu;

  Music.getByName(nama_lagu, (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Music not found' });
    }

    const song = results[0];
    const filePath = `./uploads/${song.file_mp3}`;

    // Memutar musik
    player.play(filePath, (err) => {
      if (err) {
        console.error(`Error playing music: ${err}`);
        return res.status(500).json({ message: 'Error playing music' });
      }
    });

    res.json({ message: `Playing "${song.nama_lagu}"` });
  });
});


// Get music by name
router.get('/name/:nama_lagu', (req, res) => {
  const nama_lagu = req.params.nama_lagu;
  Music.getByName(nama_lagu, (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Music not found' });
    }
    res.json(results[0]);
  });
});





module.exports = router;
