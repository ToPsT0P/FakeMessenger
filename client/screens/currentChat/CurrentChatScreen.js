import React, { useState } from "react"; // Добавляем useState
import { ImageBackground, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

import IconAwesome from "react-native-vector-icons/FontAwesome";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Navbar from "../../widgets/Navbar/Navbar";
import Message from "../../entities/message/Message";

import { testArrayMessages } from "./testArrayMessages";
import wallpaper from "../../shared/wallpapers/ChatWallpaper.jpg";

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
    const [inputHeight, setInputHeight] = useState(35);

    const handleContentSizeChange = (event) => {
        const newHeight = event.nativeEvent.contentSize.height + 12;
        setInputHeight(Math.min(Math.max(newHeight, 35), 120));
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

            <BackgroundImage source={wallpaper} resizeMode="cover">
                <ChatFlatList
                    data={testArrayMessages}
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
                />
                <IconAwesome name="send-o" size={24} color="#fff" />

            </ChatTextInputView>
        </Layout>
    );
};

export default CurrentChatScreen;