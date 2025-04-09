// db.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db.sqlite3', (err) => {
    if (err) {
        console.error('Не удалось подключиться к базе данных:', err);
    } else {
        console.log('Подключение к базе данных успешно.');
    }
});

module.exports = db;
