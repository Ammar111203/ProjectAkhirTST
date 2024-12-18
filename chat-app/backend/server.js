const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Set up socket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', async (msg, sender) => {
    console.log(`Received message: "${msg}" from ${sender}`);
    let actionMessage = msg;

    if (!msg.trim()) {
      actionMessage = 'Message cannot be empty.';
    } else if (msg.startsWith('/')) {
      if (msg === '/help') {
        actionMessage = 'Available commands: /help, /quote [text], /image [url], /say [text], /play [song_name]';
      } else if (msg.startsWith('/quote ')) {
        const quote = msg.substring(7).trim();
        actionMessage = `Quote: "${quote}"`;
      } else if (msg.startsWith('/image ')) {
        const imageUrl = msg.substring(7).trim();
        actionMessage = `Here is your image: <img src="${imageUrl}" alt="Image" style="max-width: 300px;">`;
      } else if (msg.startsWith('/say ')) {
        const textToSay = msg.substring(5).trim();
        actionMessage = `Bot says: ${textToSay}`;
      } else if (msg.startsWith('/play ')) {
        const songName = msg.substring(6).trim();
        try {
          // Construct the SOAP XML body with the correct structure
          const soapBody = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mus="http://localhost:8088/music">
   <soapenv:Header/>
   <soapenv:Body>
      <mus:playMusicRequest>
         <songName>${songName}</songName>
      </mus:playMusicRequest>
   </soapenv:Body>
</soapenv:Envelope>`;

          // Send SOAP request using axios
          const response = await axios.post('http://localhost:8088/musicService', soapBody, {
            headers: {
              'Content-Type': 'text/xml;charset=UTF-8',
              'SOAPAction': 'http://localhost:8088/musicService/playMusic'
            }
          });

          actionMessage = `Now playing: ${songName}. ${response.data}`;
        } catch (error) {
          console.error('Error calling SOAP service:', error);
          actionMessage = `Error playing "${songName}". Please try again.`;
        }
      } else if (msg === '/musiclist') {
        try {
          const response = await axios.get('http://localhost:5000/api/music');
          const musicList = response.data;
  
          if (musicList.length > 0) {
            actionMessage = '🎵 Available Music List:\n' + musicList.map((music, index) => `${index + 1}. ${music.nama_lagu}`).join('\n');
          } else {
            actionMessage = 'No music available in the list. Add some music first.';
          }
        } catch (error) {
          console.error('Error fetching music list:', error);
          actionMessage = 'Error fetching music list. Please try again later.';
        }
      }
    }

    io.emit('chat message', actionMessage, sender);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Request status every 3 seconds and send it to clients
setInterval(async () => {
  try {
    const response = await axios.post('http://localhost:8089/statusService', `
      <?xml version="1.0" encoding="UTF-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://localhost:8089/status">
         <soapenv:Header/>
         <soapenv:Body>
            <web:getStatus/>
         </soapenv:Body>
      </soapenv:Envelope>
    `, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': 'http://localhost:8089/statusService/getStatus'
      }
    });

    // Cek jika status berisi 'nope'
    const status = response.data;
    if (status) {
      io.emit('chat message', `${status}`);
    }
  } catch (error) {
    console.error('Error fetching status:', error);
    io.emit('chat message', 'Error fetching server status.');
  }
}, 3000);  // 3 seconds interval

// Start the server
server.listen(3003, () => {
  console.log('Server running on http://localhost:3003');
});
