import React, { useState, useEffect, useRef } from "react";
import { ImageBackground, TouchableOpacity, Alert } from "react-native";
import styled from "styled-components/native";
import IconAwesome from "react-native-vector-icons/FontAwesome";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Navbar from "../../widgets/Navbar/Navbar";
import Message from "../../entities/message/Message";
import wallpaper from "../../shared/wallpapers/ChatWallpaper.jpg";
import { useRoute } from "@react-navigation/native";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Layout = styled.View`
    background-color: #1c1c1e;
    flex: 1;
    width: 100%;
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
    padding: 0 20px;
    background: #262628;
    flex-direction: row;
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
    console.log("ChatID:", chatID);

    const [userId, setUserId] = useState(null);
    const [inputHeight, setInputHeight] = useState(35);
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState([]);

    const socketRef = useRef(null);

    // Загрузка идентификатора пользователя
    useEffect(() => {
        AsyncStorage.getItem("userId")
            .then((id) => {
                setUserId(id);
                console.log("Loaded userId:", id);
            })
            .catch((err) => console.error("Error loading userId", err));
    }, []);

    // Получаем историю чата через REST API (без изменений)
    useEffect(() => {
        fetch(`http://${process.env.EXPO_PUBLIC_IPV4}/api/chats/${chatID}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Chat history:", data);
                if (data && data.messages) {
                    setMessages(data.messages);
                }
            })
            .catch((err) => {
                console.error("Error fetching chat:", err);
                Alert.alert("Ошибка", "Не удалось получить историю чата");
            });
    }, [chatID]);

    // Инициализация Socket.IO и подписка на события
    useEffect(() => {
        socketRef.current = io(`http://${process.env.EXPO_PUBLIC_IPV4}`, {
            transports: ["websocket"],
        });

        socketRef.current.on("connect", () => {
            socketRef.current.emit("joinChat", chatID);
        });

        socketRef.current.on("newMessage", (message) => {
            if (message.chatID === chatID) {
                setMessages((prev) => [...prev, message]);
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.off("newMessage");
                socketRef.current.disconnect();
            }
        };
    }, [chatID]);

    const handleContentSizeChange = (event) => {
        const newHeight = event.nativeEvent.contentSize.height + 12;
        setInputHeight(Math.min(Math.max(newHeight, 35), 120));
    };

    const sendMessage = () => {
        if (!inputText.trim()) return;
        const senderID = userId || "defaultUserID";
        const messageData = {
            chatID,
            text: inputText,
            userSend: senderID,
        };

        socketRef.current.emit("sendMessage", messageData);
        setInputText("");
    };


    return (
        <Layout>
            <Navbar
                screenName={"Чат"}
                leftButton={
                    <TouchableOpacity onPress={() => navigation.navigate("Chats")}>
                        <IconAwesome name="long-arrow-left" size={24} color="#fff" />
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
                <ChatTextInput
                    multiline
                    onContentSizeChange={handleContentSizeChange}
                    style={{ height: inputHeight }}
                    placeholder="Введите сообщение..."
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
