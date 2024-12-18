const socket = io(); // Koneksi ke server Socket.IO

let userName = ''; // Variabel untuk menyimpan nama pengguna

// Fungsi untuk menampilkan pesan di chat
function displayMessage(msg, sender) {
  const chatDiv = document.getElementById('chat');
  const newMessage = document.createElement('div');
  
  const isSender = sender === userName;
  newMessage.classList.add('message');
  
  if (isSender) {
    newMessage.classList.add('sent');
  } else {
    newMessage.classList.add('received');
  }

  // Tambahkan nama pengirim hanya sekali
  newMessage.innerHTML = `<strong>${sender}</strong>: ${msg}`;
  chatDiv.appendChild(newMessage);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

// Menangani pesan chat yang diterima dari server
socket.on('chat message', (msg, sender) => {
  displayMessage(msg, sender); // Tampilkan pesan yang diterima dari server
});

// Fungsi untuk mengirim pesan
function sendMessage() {
  const input = document.getElementById('messageInput');
  const msg = input.value.trim();

  if (msg) {
    socket.emit('chat message', msg, userName); // Kirim pesan ke server
    displayMessage(msg, userName); // Tampilkan pesan yang dikirimkan di chat sendiri
    input.value = ''; // Bersihkan input setelah pengiriman
  }
}

// Fungsi untuk mengatur nama pengguna
function setName() {
  const nameInput = document.getElementById('nameInput');
  userName = nameInput.value.trim();
  
  if (userName) {
    document.getElementById('nameInputContainer').style.display = 'none';
    document.getElementById('chatContainer').style.display = 'block';
    socket.emit('set name', userName); // Mengirim nama pengguna ke server
  }
}
