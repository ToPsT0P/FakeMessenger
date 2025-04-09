// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require("socket.io");
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

/* ===============================================
   Ручки REST API
=============================================== */

// 1. Регистрация пользователя
app.post('/api/users', (req, res) => {
    const { userName, login, password } = req.body;
    if (!userName || !login || !password) {
        return res.status(400).json({ error: 'Необходимо указать userName, login и password' });
    }
    const userID = uuidv4();
    const chats = JSON.stringify([]);
    const sql = `INSERT INTO users (ID, userName, login, password, chats) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [userID, userName, login, password, chats], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Ошибка при создании пользователя' });
        }
        return res.status(201).json({
            message: 'Пользователь создан',
            user: { ID: userID, userName, login, chats: [] }
        });
    });
});

// 2. Логин (авторизация)
app.post('/api/login', (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) {
        return res.status(400).json({ error: 'Необходимо указать логин и пароль' });
    }
    const sql = 'SELECT * FROM users WHERE login = ?';
    db.get(sql, [login], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Ошибка при поиске пользователя' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        if (row.password !== password) {
            return res.status(401).json({ error: 'Неверный пароль' });
        }
        let chatsArray = [];
        try {
            chatsArray = JSON.parse(row.chats);
        } catch (e) {
            chatsArray = [];
        }
        res.json({ message: 'Авторизация успешна', user: { ID: row.ID, userName: row.userName, login: row.login, chats: chatsArray } });
    });
});

// 3. Получение всех пользователей (без пароля)
app.get('/api/users', (req, res) => {
    const sql = 'SELECT ID, userName, login FROM users';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Ошибка получения пользователей' });
        }
        res.json({ users: rows });
    });
});

// 4. Получение чатов, в которых состоит пользователь
app.get('/api/chats/user/:userID', (req, res) => {
    const { userID } = req.params;
    const sql = 'SELECT * FROM chats';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Ошибка получения чатов' });
        }
        // Фильтруем чаты, где joinedUsers содержит userID
        const userChats = rows.filter(row => {
            try {
                const joinedUsers = JSON.parse(row.joinedUsers);
                return Array.isArray(joinedUsers) && joinedUsers.includes(userID);
            } catch (e) {
                return false;
            }
        });
        res.json({ chats: userChats });
    });
});

// 5. Создание нового чата
app.post('/api/chats', (req, res) => {
    // Ожидаем:
    // joinedUsers: массив с идентификаторами участников чата
    // initialMessage: (опционально) объект { text, userSend }
    const { joinedUsers, initialMessage } = req.body;
    if (!joinedUsers || !Array.isArray(joinedUsers) || joinedUsers.length === 0) {
        return res.status(400).json({ error: 'Нужно указать хотя бы одного участника чата' });
    }
    const chatID = uuidv4();
    const messages = [];
    if (initialMessage) {
        const messageID = uuidv4();
        const createdTime = new Date().toISOString();
        messages.push(messageID);
        const sqlMsg = `
      INSERT INTO messages (messageID, chatID, text, userSend, createdTime)
      VALUES (?, ?, ?, ?, ?)
    `;
        db.run(sqlMsg, [messageID, chatID, initialMessage.text || '', initialMessage.userSend || 'system', createdTime], function(err) {
            if (err) console.error("Ошибка сохранения начального сообщения:", err);
        });
    }
    const messagesJSON = JSON.stringify(messages);
    const lastMessage = initialMessage ? (initialMessage.text || '') : '';
    const joinedUsersJSON = JSON.stringify(joinedUsers);
    const chatSql = `
    INSERT INTO chats (chatID, messages, lastMessage, joinedUsers)
    VALUES (?, ?, ?, ?)
  `;
    db.run(chatSql, [chatID, messagesJSON, lastMessage, joinedUsersJSON], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Ошибка создания чата' });
        }
        // Обновляем список чатов для каждого пользователя
        joinedUsers.forEach(userID => {
            const sqlSelect = 'SELECT chats FROM users WHERE ID = ?';
            db.get(sqlSelect, [userID], (err, row) => {
                if (err || !row) {
                    console.error(`Ошибка обновления чатов пользователя ${userID}: `, err);
                    return;
                }
                let userChats = [];
                try {
                    userChats = JSON.parse(row.chats) || [];
                } catch (e) {
                    userChats = [];
                }
                if (!userChats.includes(chatID)) {
                    userChats.push(chatID);
                    const sqlUpdate = 'UPDATE users SET chats = ? WHERE ID = ?';
                    db.run(sqlUpdate, [JSON.stringify(userChats), userID], function(err) {
                        if (err) {
                            console.error(`Ошибка обновления чатов пользователя ${userID}: `, err);
                        }
                    });
                }
            });
        });
        res.status(201).json({ message: 'Чат создан', chat: { chatID, messages: [], lastMessage, joinedUsers } });
    });
});

// 6. Получение истории чата (как было у вас)
app.get('/api/chats/:chatID', (req, res) => {
    const { chatID } = req.params;
    const sql = 'SELECT * FROM chats WHERE chatID = ?';
    db.get(sql, [chatID], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Ошибка при получении чата' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Чат не найден' });
        }
        let messagesArray = [];
        let joinedUsersArray = [];
        try {
            messagesArray = JSON.parse(row.messages) || [];
            joinedUsersArray = JSON.parse(row.joinedUsers) || [];
        } catch (e) {
            messagesArray = [];
            joinedUsersArray = [];
        }
        if (messagesArray.length === 0) {
            return res.json({ chatID: row.chatID, messages: [], lastMessage: row.lastMessage, joinedUsers: joinedUsersArray });
        }
        const placeholders = messagesArray.map(() => '?').join(',');
        const sqlMessages = `
      SELECT *
      FROM messages
      WHERE messageID IN (${placeholders})
      ORDER BY createdTime ASC
    `;
        db.all(sqlMessages, messagesArray, (err, messagesRows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Ошибка при получении сообщений' });
            }
            return res.json({ chatID: row.chatID, messages: messagesRows, lastMessage: row.lastMessage, joinedUsers: joinedUsersArray });
        });
    });
});

/* ===============================================
   Socket.IO – реалтайм обмен сообщениями
=============================================== */

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on("connection", (socket) => {
    console.log("Новый клиент подключился:", socket.id);

    // Присоединение к комнате чата
    socket.on("joinChat", (chatID) => {
        socket.join(chatID);
        console.log(`Socket ${socket.id} присоединился к чату ${chatID}`);
    });

    // Отправка сообщения
    socket.on("sendMessage", (data) => {
        const { chatID, text, userSend } = data;
        if (!chatID || !text || !userSend) {
            console.warn("Неполные данные для сообщения:", data);
            return;
        }
        const newMessageID = uuidv4();
        const createdTime = new Date().toISOString();

        const sqlInsert = `
      INSERT INTO messages (messageID, chatID, text, userSend, createdTime)
      VALUES (?, ?, ?, ?, ?)
    `;
        db.run(sqlInsert, [newMessageID, chatID, text, userSend, createdTime], function(err) {
            if (err) {
                console.error("Ошибка при сохранении сообщения:", err);
                return;
            }
            const sqlSelectChat = 'SELECT * FROM chats WHERE chatID = ?';
            db.get(sqlSelectChat, [chatID], (err, row) => {
                if (err || !row) {
                    console.error("Ошибка при обновлении чата", err);
                    return;
                }
                let currentMessages = [];
                try {
                    currentMessages = JSON.parse(row.messages);
                } catch (e) {
                    currentMessages = [];
                }
                currentMessages.push(newMessageID);
                const updatedMessages = JSON.stringify(currentMessages);
                const updatedLastMessage = text;

                const sqlUpdateChat = `
          UPDATE chats
          SET messages = ?, lastMessage = ?
          WHERE chatID = ?
        `;
                db.run(sqlUpdateChat, [updatedMessages, updatedLastMessage, chatID], function(err) {
                    if (err) {
                        console.error("Ошибка при обновлении чата", err);
                        return;
                    }
                    const newMessage = { messageID: newMessageID, chatID, text, userSend, createdTime };
                    io.to(chatID).emit("newMessage", newMessage);
                    console.log("Новое сообщение отправлено:", newMessage);
                });
            });
        });
    });

    socket.on("disconnect", () => {
        console.log("Клиент отключился:", socket.id);
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
