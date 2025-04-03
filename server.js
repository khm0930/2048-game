const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 데이터베이스 연결 설정
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'game_db',  // 데이터베이스 이름을 game_db로 변경
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 데이터베이스 연결 테스트
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Successfully connected to database');
    connection.release();
});

// 랭킹 등록 API
app.post('/api/rankings', (req, res) => {
    const { nickname, score } = req.body;
    
    if (!nickname || !score) {
        return res.status(400).json({ error: '닉네임과 점수는 필수입니다.' });
    }

    const query = 'INSERT INTO rankings (nickname, score) VALUES (?, ?)';
    pool.query(query, [nickname, score], (error, results) => {
        if (error) {
            console.error('Error saving ranking:', error);
            return res.status(500).json({ error: '랭킹 저장 중 오류가 발생했습니다.' });
        }
        res.json({ message: '랭킹이 저장되었습니다.' });
    });
});

// 상위 10개 랭킹 조회 API
app.get('/api/rankings', (req, res) => {
    const query = 'SELECT nickname, score, created_at FROM rankings ORDER BY score DESC LIMIT 10';
    pool.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching rankings:', error);
            return res.status(500).json({ error: '랭킹 조회 중 오류가 발생했습니다.' });
        }
        res.json(results);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 