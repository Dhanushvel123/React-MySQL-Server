const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002; // Server port

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306, // MySQL default port
    ssl: { rejectUnauthorized: true } // Fix SSL issue for cloud databases
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        return;
    }
    console.log('✅ DB is Connected...');
});

// APIs

// Create Table
app.get("/createtable", (req, res) => {
    let sql = 'CREATE TABLE IF NOT EXISTS post (id INT AUTO_INCREMENT, name VARCHAR(200) NOT NULL, content TEXT, PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if (err) {
            console.error("❌ Error creating table:", err);
            res.status(500).send('Error creating table');
            return;
        }
        res.send('✅ Post table created...');
    });
});

// Insert Data
app.post("/addpost", (req, res) => {
    let post = { name: req.body.name, content: req.body.content };
    let sql = 'INSERT INTO post SET ?';
    db.query(sql, post, (err, result) => {
        if (err) {
            console.error("❌ Error adding post:", err);
            res.status(500).send('Error adding post');
            return;
        }
        res.send('✅ Post added...');
        console.log(result);
    });
});

// Get All Posts
app.get("/getpost", (req, res) => {
    let sql = 'SELECT * FROM post';
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching posts:", err);
            res.status(500).send('Error fetching posts');
            return;
        }
        console.log('✅ Posts fetched...');
        res.json(results);
    });
});

// Get Post by ID
app.get("/getpost/:id", (req, res) => {
    let sql = `SELECT * FROM post WHERE id=?`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("❌ Error fetching post:", err);
            res.status(500).send('Error fetching post');
            return;
        }
        console.log('✅ Post fetched...');
        res.json(result);
    });
});

// Update Post
app.put('/updatepost/:id', (req, res) => {
    const { id } = req.params;
    const { name, content } = req.body;
    let sql = `UPDATE post SET name=?, content=? WHERE id=?`;
    db.query(sql, [name, content, id], (err, result) => {
        if (err) {
            console.error("❌ Error updating post:", err);
            res.status(500).send('Error updating post');
            return;
        }
        console.log('✅ Post updated...');
        res.send(result);
    });
});

// Delete Post
app.delete('/deletepost/:id', (req, res) => {
    const { id } = req.params;
    let sql = `DELETE FROM post WHERE id=?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("❌ Error deleting post:", err);
            res.status(500).send('Error deleting post');
            return;
        }
        res.send(result);
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
