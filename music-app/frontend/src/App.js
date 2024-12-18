import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [musics, setMusics] = useState([]);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [audioPlayer] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState({ nama_lagu: '', file_mp3: null });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    fetchMusics();
  }, []);

  // Fetch music data from API (database) - Port 5000
  const fetchMusics = () => {
    axios
      .get('http://localhost:5000/api/music') // Tetap gunakan port 5000 untuk API musik
      .then((response) => setMusics(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nama_lagu', formData.nama_lagu);
    data.append('file_mp3', formData.file_mp3);

    axios
      .post('http://localhost:5000/api/music', data) // Tetap gunakan port 5000 untuk mengirim musik ke database
      .then(() => {
        fetchMusics();
        setFormData({ nama_lagu: '', file_mp3: null });
      })
      .catch((error) => console.error('Error adding music:', error));
  };

  const handlePlayMusic = (music, index) => {
    setCurrentIndex(index);
    setCurrentMusic(music);
    audioPlayer.src = `http://localhost:5000/uploads/${music.file_mp3}`; // Menggunakan port 5000 untuk audio file
    audioPlayer.play();
    setIsPlaying(true);
    updateStatus(`Now playing: ${music.nama_lagu}`);
  };

  const handlePauseMusic = () => {
    audioPlayer.pause();
    setIsPlaying(false);
    updateStatus('Paused');
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      handlePauseMusic();
      updateStatus(`Now pause: ${currentMusic.nama_lagu}`);
    } else {
      audioPlayer.play();
      setIsPlaying(true);
      updateStatus(`Now playing: ${currentMusic.nama_lagu}`);
    }
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % musics.length;
    handlePlayMusic(musics[nextIndex], nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + musics.length) % musics.length;
    handlePlayMusic(musics[prevIndex], prevIndex);
  };

  // Handle time update and sync with progress bar
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(audioPlayer.currentTime);
      setDuration(audioPlayer.duration);
    };

    audioPlayer.addEventListener('timeupdate', updateTime);
    return () => {
      audioPlayer.removeEventListener('timeupdate', updateTime);
    };
  }, []);

  // Handle seek when user interacts with the progress bar
  const handleSeek = (e) => {
    const newTime = e.target.value;
    audioPlayer.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Update status on the server (Port 8089 for status update)
  const updateStatus = (status) => {
    const xmlData = `
      <?xml version="1.0" encoding="UTF-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                        xmlns:web="http://localhost:8089/status">
         <soapenv:Header/>
         <soapenv:Body>
            <web:updateStatus>
               <status>${status}</status>  <!-- Use dynamic status -->
            </web:updateStatus>
         </soapenv:Body>
      </soapenv:Envelope>
    `;
  
    axios.post('/statusService', xmlData, {  // Tetap gunakan port 8089 untuk update status
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          'SOAPAction': 'http://localhost:8089/statusService/updateStatus',
        },
      })
      .then((response) => {
        console.log('Status updated successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error updating status:', error);
      });
  };

  return (
    <div className="app">
      <div className="container">
        {/* Kolom Form */}
        <div className="form-container">
          <h1>🎵 Tambah Lagu</h1>
          <form onSubmit={handleSubmit} className="form-add-music">
            <label htmlFor="nama_lagu">Nama Lagu</label>
            <input
              type="text"
              name="nama_lagu"
              id="nama_lagu"
              placeholder="Nama Lagu"
              value={formData.nama_lagu}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="file_mp3">File MP3</label>
            <input
              type="file"
              name="file_mp3"
              id="file_mp3"
              accept="audio/mp3"
              onChange={handleInputChange}
              required
            />
            <button type="submit">+ Tambah Lagu</button>
          </form>
        </div>

        {/* Kolom List Lagu */}
        <div className="music-list-container">
          <h1>📃 Daftar Lagu</h1>
          <div className="music-list">
            {musics.length > 0 ? (
              musics.map((music, index) => (
                <div
                  key={music.id}
                  className={`music-item ${currentMusic?.id === music.id ? 'active' : ''}`}
                  onClick={() => handlePlayMusic(music, index)}
                >
                  <span>{index + 1}. {music.nama_lagu}</span>
                </div>
              ))
            ) : (
              <p>Belum ada lagu. Tambahkan sekarang!</p>
            )}
          </div>
        </div>
      </div>

      {/* Player Kontrol */}
      {currentMusic && (
        <div className="music-player">
          <h3>{currentMusic.nama_lagu}</h3>

          {/* Progress Bar */}
          <div className="progress-bar-container">
            <input
              type="range"
              className="progress-bar"
              min="0"
              max={duration || 0}
              value={currentTime || 0}
              onChange={handleSeek}
            />
          </div>

          {/* Player Kontrol */}
          <div className="player-controls">
            <button onClick={handlePrevious} className="control-btn">
              <p>Prev</p>
            </button>
            <button onClick={handlePlayPause} className="control-btn play-pause">
              {isPlaying ? <p>Pause</p> : <p>Play</p>}
            </button>
            <button onClick={handleNext} className="control-btn">
              <p>Next</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
