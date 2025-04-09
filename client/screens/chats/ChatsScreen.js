import {FlatList, ImageBackground, RefreshControl, TouchableOpacity} from "react-native";
import React, {useState} from "react";
import styled from "styled-components";
import {testArray} from "./testArray";

import IconAwesome from "react-native-vector-icons/FontAwesome";


import ChatListItem from "../../entities/chatListItem/ChatListItem";
import Navbar from "../../widgets/Navbar/Navbar";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO Styles


const Layout = styled.View`
    background-color: #1C1C1E;
    width: 100%;
    flex: 1; 
`;

const ChatsScreen = ({ navigation }) => {


    const [isLoading, setIsLoading] = React.useState(true)
    const [chats, setChats] = useState()

    const chatsFetch = async () => {
        const userId = await AsyncStorage.getItem("userId");

        try {
            const response = await axios.get(`http://${process.env.EXPO_PUBLIC_IPV4}/api/chats/user/${userId}`);
            setChats(response.data.chats);

            setIsLoading(false);
        } catch (error) {
            if (error.response) {
                // Сервер ответил с кодом состояния, отличным от 2xx
                console.error('Ошибка ответа сервера:', error.response.status, error.response.data);
            } else if (error.request) {
                // Запрос был сделан, но ответ не получен
                console.error('Сервер не отвечает:', error.request);
            } else {
                // Произошла ошибка при настройке запроса
                console.error('Ошибка настройки запроса:', error.message);
            }
            setIsLoading(false);
        }
    };


    React.useEffect(() => {
        chatsFetch()
    }, []);

    return (
        <Layout>
            <Navbar
                screenName={"Chats"}
                leftButton=
                    {<TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <IconAwesome name="user-o" size={24} color="#fff" />
                    </TouchableOpacity>}
                    rightButton=
                    {<TouchableOpacity onPress={() => navigation.navigate('CreateChat')}>
                        <IconAwesome name="plus-square-o" size={30} color="#fff" />
                    </TouchableOpacity>}
                isSearchBar={false}
            />


            <FlatList
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={chatsFetch} />}
                data={chats}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('CurrentChat', { chatID: item.chatID })}>
                        <ChatListItem props={item} />
                    </TouchableOpacity>
                )}
            />
        </Layout>


    );
};

export default ChatsScreen;