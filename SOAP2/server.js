const express = require('express');
const http = require('http');
const soap = require('soap');
const fs = require('fs');
const app = express();
const server = http.createServer(app);

// Variabel untuk menyimpan status
let status = false;

// Fungsi untuk menghapus status setelah 3 detik
const deleteStatusAfterTimeout = () => {
  setTimeout(() => {
    console.log('Status has been deleted after timeout.');
    status = false;  // Hapus status
  }, 3000);  // Hapus setelah 3 detik
};

// SOAP Service Implementation
const statusService = {
  StatusService: {
    StatusServicePort: {
      // Endpoint untuk memperbarui status
      updateStatus: (args, callback) => {
        status = args.status;  // Update status
        console.log(`Status updated to: ${status}`);

        // Set timeout untuk menghapus status setelah 3 detik
        deleteStatusAfterTimeout();

        // Return SOAP response
        callback({
          response: `Status updated to: ${status}`,
        });
      },

      // Endpoint untuk mengambil status
      getStatus: (args, callback) => {
        if (status) {
          console.log(`Status sent: ${status}`);

          // Set timeout untuk menghapus status setelah diambil
          deleteStatusAfterTimeout();

          // Kembalikan status
          callback({
            response: status,
          });
        } else {
          console.log('No status available.');

        }
      },
    },
  },
};

// Membaca file WSDL menggunakan fs dengan penanganan error
const wsdlFile = './service.wsdl';
let wsdl;
try {
  wsdl = fs.readFileSync(wsdlFile, 'utf8');  // Membaca WSDL dari file
  console.log('WSDL file loaded successfully');
} catch (err) {
  console.error('Error reading WSDL file:', err);
  process.exit(1); // Jika tidak ada WSDL, hentikan aplikasi
}

// Menjalankan server pada port 8089
server.listen(8089, () => {
  console.log('SOAP Server running at http://localhost:8089');
});

// Serve WSDL for SOAP service
app.get('/statusService.wsdl', (req, res) => {
  console.log('Sending WSDL file');
  res.set('Content-Type', 'text/xml');
  res.send(wsdl);
});

// Create SOAP Server
soap.listen(server, '/statusService', statusService, wsdl, (err) => {
  if (err) {
    console.error('Error setting up SOAP server:', err);
  } else {
    console.log('SOAP server listening on http://localhost:8089/statusService');
  }
});
