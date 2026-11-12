const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT || 4000,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }

   
});

// Tes koneksi saat aplikasi berjalan
pool.getConnection()
    .then((conn) => {
        console.log('Database VPS berhasil terhubung!');
        conn.release();
    })
    .catch((err) => {
        console.error('Gagal koneksi ke database VPS:', err.message);
    });

module.exports = pool;