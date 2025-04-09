// init.db.js
const db = require('./db');

db.serialize(() => {
    // Таблица пользователей
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      ID TEXT PRIMARY KEY,
      userName TEXT,
      login TEXT,
      password TEXT,
      chats TEXT
    )
  `);

    // Таблица чатов
    db.run(`
    CREATE TABLE IF NOT EXISTS chats (
      chatID TEXT PRIMARY KEY,
      messages TEXT,
      lastMessage TEXT,
      joinedUsers TEXT
    )
  `);

    // Таблица сообщений
    db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      messageID TEXT PRIMARY KEY,
      chatID TEXT,
      text TEXT,
      userSend TEXT,
      createdTime DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    console.log('Таблицы успешно созданы (или уже существуют).');
});

db.close((err) => {
    if (err) {
        console.error('Ошибка при закрытии базы данных:', err.message);
    } else {
        console.log('Соединение с базой данных закрыто после инициализации.');
    }
});
