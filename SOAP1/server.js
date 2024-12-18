const http = require('http');
const fs = require('fs');
const soap = require('strong-soap').soap;
const axios = require('axios'); // Import axios untuk HTTP request

// Membaca file WSDL
const wsdlFile = './musicService.wsdl';
const wsdl = fs.readFileSync(wsdlFile, 'utf8');

// Definisi service
const service = {
  MusicService: {
    MusicServicePort: {
      playMusic: async (args) => {
        const { songName } = args;
        console.log(`Playing song: ${songName}`);

        try {
          // Mengirim request ke rute Express /play/:nama_lagu
          const response = await axios.post(`http://localhost:5000/api/music/play/${encodeURIComponent(songName)}`);
          
          // Mengembalikan pesan berdasarkan respons dari server Express
          return { message: `Successfully played "${songName}". Response from Express: ${response.data.message}` };
        } catch (err) {
          console.error('Error calling Express route:', err);
          return { message: `Failed to play "${songName}". Error: ${err.message}` };
        }
      },
    },
  },
};

// Membuat server HTTP
const server = http.createServer((req, res) => res.end('SOAP Server is running.'));
server.listen(8088, () => {
  console.log('SOAP server is running on http://localhost:8088/musicService');
});

// Membuat SOAP service dengan WSDL
soap.listen(server, '/musicService', service, wsdl);
