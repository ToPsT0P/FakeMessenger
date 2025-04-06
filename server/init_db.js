const db = require('./db');

db.serialize(() => {
    // Создаём таблицу пользователей (User)
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      ID TEXT PRIMARY KEY,
      userName TEXT,
      login TEXT,
      password TEXT,
      chats TEXT
    )
  `);

    // Создаём таблицу чатов (Chat)
    db.run(`
    CREATE TABLE IF NOT EXISTS chats (
      chatID TEXT PRIMARY KEY,
      messages TEXT,
      lastMessage TEXT,
      joinedUsers TEXT
    )
  `);

    // Создаём таблицу сообщений (Message)
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
        return console.error('Ошибка при закрытии базы:', err.message);
    }
    console.log('Закрыли соединение с базой после инициализации.');
});
