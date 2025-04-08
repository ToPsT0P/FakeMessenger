import React, { useState, useEffect } from "react";
import { ImageBackground, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import IconAwesome from "react-native-vector-icons/FontAwesome";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Navbar from "../../widgets/Navbar/Navbar";
import Message from "../../entities/message/Message";
import wallpaper from "../../shared/wallpapers/ChatWallpaper.jpg";
import { useRoute } from "@react-navigation/native";
import io from "socket.io-client";

// Замените YOUR_SERVER_URL на фактический адрес сервера
const SERVER_URL = "http://YOUR_SERVER_URL:8080";
const socket = io(SERVER_URL);

const Layout = styled.View`
    background-color: #1c1c1e;
    width: 100%;
    flex: 1;
`;
const ChatFlatList = styled.FlatList`
    flex: 1;
    padding: 10px;
`;
const BackgroundImage = styled(ImageBackground)`
    flex: 1;
    resize-mode: cover;
`;
const ChatTextInputView = styled.View`
    min-height: 35px;
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    background: #262628;
    flex-direction: row;
    gap: 10px;
    align-items: center;
`;
const ChatTextInput = styled.TextInput`
    flex: 1;
    color: #fff;
    font-size: 17px;
    max-height: 120px;
`;

const CurrentChatScreen = ({ navigation }) => {
    const route = useRoute();
    const { chatID } = route.params;
    console.log("Чат: ", chatID);

    const [inputHeight, setInputHeight] = useState(35);
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState([]);

    const handleContentSizeChange = (event) => {
        const newHeight = event.nativeEvent.contentSize.height + 12;
        setInputHeight(Math.min(Math.max(newHeight, 35), 120));
    };

    useEffect(() => {
        // Лог подключения сокета
        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
        });

        // Присоединяемся к комнате чата
        socket.emit("joinChat", chatID);
        console.log("Emit joinChat:", chatID);

        // Получаем историю сообщений через API
        fetch(`${SERVER_URL}/api/chats/${chatID}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("История сообщений:", data);
                if (data && data.messages) {
                    setMessages(data.messages);
                }
            })
            .catch((err) => console.error("Ошибка получения чата:", err));

        // Обработка нового сообщения
        socket.on("newMessage", (message) => {
            console.log("Получено новое сообщение:", message);
            if (message.chatID === chatID) {
                setMessages((prev) => [...prev, message]);
            }
        });

        return () => {
            socket.off("newMessage");
        };
    }, [chatID]);

    const sendMessage = () => {
        if (!inputText.trim()) return;
        const userSend = "currentUserID";
        console.log("Отправка сообщения:", { chatID, text: inputText, userSend });
        socket.emit("sendMessage", { chatID, text: inputText, userSend });
        setInputText("");
    };

    return (
        <Layout>
            <Navbar
                screenName={"Ро-Ро-Рома"}
                leftButton={
                    <TouchableOpacity onPress={() => navigation.navigate("Chats")}>
                        <IconAwesome name="long-arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                }
                rightButton={
                    <TouchableOpacity>
                        <IconEntypo name="dots-three-horizontal" size={24} color="#fff" />
                    </TouchableOpacity>
                }
                isSearchBar={false}
            />

            <BackgroundImage source={wallpaper}>
                <ChatFlatList
                    data={messages}
                    keyExtractor={(item) => item.messageID}
                    renderItem={({ item }) => <Message messageData={item} />}
                    contentContainerStyle={{ padding: 10 }}
                />
            </BackgroundImage>

            <ChatTextInputView style={{ height: inputHeight }}>
                <IconMaterialCommunityIcons name="sticker-emoji" size={30} color="#fff" />
                <ChatTextInput
                    multiline
                    onContentSizeChange={handleContentSizeChange}
                    style={{ height: inputHeight }}
                    placeholder="Message..."
                    placeholderTextColor="#888"
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity onPress={sendMessage}>
                    <IconAwesome name="send-o" size={24} color="#fff" />
                </TouchableOpacity>
            </ChatTextInputView>
        </Layout>
    );
};

export default CurrentChatScreen;
