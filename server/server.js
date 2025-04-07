const express = require('express');
const db = require('./db');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// ===============
//  CREATE USER
// ===============
app.post('/api/users', (req, res) => {
    const { userName, login, password } = req.body;

    const userID = uuidv4();
    const chats = JSON.stringify([]);

    const sql = `
        INSERT INTO users (ID, userName, login, password, chats)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.run(sql, [userID, userName, login, password, chats], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Ошибка при создании пользователя' });
        }
        return res.status(201).json({
            message: 'Пользователь создан',
            user: {
                ID: userID,
                userName,
                login,
                password,
                chats: []
            }
        });
    });
});

// ===============
//  GET ALL USERS
// ===============
app.get('/api/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Ошибка при получении пользователей' });
        }
        const users = rows.map(row => {
            let chatsArray = [];
            try {
                chatsArray = JSON.parse(row.chats);
            } catch (e) {
                chatsArray = [];
            }
            return {
                ID: row.ID,
                userName: row.userName,
                login: row.login,
                password: row.password,
                chats: chatsArray
            };
        });
        res.json({ users });
    });
});

// ===============
//  GET USER BY ID
// ===============
app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM users WHERE ID = ?';
    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Ошибка при получении пользователя' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        let chatsArray = [];
        try {
            chatsArray = JSON.parse(row.chats);
        } catch (e) {
            chatsArray = [];
        }
        res.json({
            ID: row.ID,
            userName: row.userName,
            login: row.login,
            chats: chatsArray
        });
    });
});

// ===============
//  LOGIN (AUTHENTICATION)
// ===============
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
        // Простая проверка пароля без шифрования
        if (row.password !== password) {
            return res.status(401).json({ error: 'Неверный пароль' });
        }
        let chatsArray = [];
        try {
            chatsArray = JSON.parse(row.chats);
        } catch (e) {
            chatsArray = [];
        }
        res.json({
            message: 'Авторизация успешна',
            user: {
                ID: row.ID,
                userName: row.userName,
                login: row.login,
                chats: chatsArray
            }
        });
    });
});

// ===============
//  CREATE CHAT
// ===============
app.post('/api/chats', (req, res) => {
    const { chatID, joinedUsers } = req.body;
    const newChatID = chatID || uuidv4();
    const usersJSON = JSON.stringify(joinedUsers || []);
    const messagesJSON = JSON.stringify([]);
    const lastMessage = '';

    const sql = `
        INSERT INTO chats (chatID, messages, lastMessage, joinedUsers)
        VALUES (?, ?, ?, ?)
    `;
    db.run(sql, [newChatID, messagesJSON, lastMessage, usersJSON], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Ошибка при создании чата' });
        }
        return res.status(201).json({
            message: 'Чат создан',
            chat: {
                chatID: newChatID,
                messages: [],
                lastMessage: '',
                joinedUsers: joinedUsers || []
            }
        });
    });
});

// ===============
//  CREATE MESSAGE
// ===============
app.post('/api/messages', (req, res) => {
    const { chatID, text, userSend } = req.body;
    if (!chatID || !text || !userSend) {
        return res.status(400).json({ error: 'Не хватает параметров (chatID, text, userSend)' });
    }

    const newMessageID = uuidv4();
    const sql = `
        INSERT INTO messages (messageID, chatID, text, userSend)
        VALUES (?, ?, ?, ?)
    `;
    db.run(sql, [newMessageID, chatID, text, userSend], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Ошибка при создании сообщения' });
        }

        // Обновление чата: добавляем новое сообщение в массив messages и обновляем lastMessage
        const selectChat = 'SELECT * FROM chats WHERE chatID = ?';
        db.get(selectChat, [chatID], (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Ошибка при получении чата' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Чат не найден' });
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

            const updateChat = `
                UPDATE chats
                SET messages = ?, lastMessage = ?
                WHERE chatID = ?
            `;
            db.run(updateChat, [updatedMessages, updatedLastMessage, chatID], function(err) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Ошибка при обновлении чата' });
                }

                return res.status(201).json({
                    message: 'Сообщение создано и чат обновлён',
                    newMessage: {
                        messageID: newMessageID,
                        chatID,
                        text,
                        userSend
                    }
                });
            });
        });
    });
});

// ===============
//  GET CHAT BY ID
// ===============
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

        const placeholders = messagesArray.map(() => '?').join(',');
        if (!placeholders) {
            return res.json({
                chatID: row.chatID,
                messages: [],
                lastMessage: row.lastMessage,
                joinedUsers: joinedUsersArray
            });
        }

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
            return res.json({
                chatID: row.chatID,
                messages: messagesRows,
                lastMessage: row.lastMessage,
                joinedUsers: joinedUsersArray
            });
        });
    });
});

// Запуск сервера
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
