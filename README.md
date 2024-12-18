# ProjectAkhirTST
- menggunakan 3 teknologi utama yaitu node js, express js, dan reac js.
- terdiri dari 2 aplikasi dan 2 API server
- lebih rincinya terdiri dari 1 client react, 3 server backend API, dan 1 server backend + frontend
- Aplikasi pertama yaitu chat-app: aplikasi chat privat dengan fitur command sederhana
- Aplikasi kedua yaitu music-app: aplikasi managemen musik sekaligus pemutar musik

Tujuan dari projek ini adalah untuk membuat integrasi antara chat-app dan music-app
Usecase yang kami ambil ada 3 yaitu
1. Memutar lagu lewat aplikasi chat dengan SOAP API
2. Memberikan update status pemutaran lagu pada chat-app, jika user menjalankan musik lewat music-app
3. Menampilkan list musik pada music-app dengan command di chat-app

#Intalasi
1. Siapkan 5 terminal CLI
2. Masuk ke direktori project
3. Pada terminal pertama ubah ke direktori music-app/backend lalu jalankan app.js dengan sintaks
cd music-app/backend
node src/app.js
5. Pada terminal kedua ubah ke irektori music-app/frontend lalu jalankan npm start untuk masuk ke mode developing
cd music-app/frontend
npm start
7. Pada terminal ketiga ubah ke direktori chat-app/backend lalu jalankan servernya
cd chat-app/backend
node server.js
9. Pada terminal ke empat ubah direktori ke SOAP1 lalu jalankan servernya
cd SOAP1
node server.js
11. Pada terminal ke lima ubah direktori ke SOAP2 lalu jalankan servernya
cd SOAP2
node server.js

nb: pastikan sudah menginstall node js sebelumnya
gunakan  node -v pada terminal untuk cek apakah node js sudah terinstall
