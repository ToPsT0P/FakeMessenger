import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import styled from "styled-components/native";
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Container = styled.View`
  flex: 1;
  background-color: #1C1C1E;
  padding: 20px;
  justify-content: center;
`;

const TitleText = styled.Text`
  font-size: 20px;
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
`;

const CreateButton = styled.TouchableOpacity`
  background-color: ${props => (props.disabled ? '#555' : '#61b4fa')};
  padding: 12px;
  border-radius: 6px;
  margin-top: 20px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
`;

const CreateChatScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState("");


    const getUserData = async () => {
        try {
            const userID = await AsyncStorage.getItem("userId");
            if (!userID) {
                console.error("User ID не найден");
                return;
            }
            const response = await axios.get(`http://${process.env.EXPO_PUBLIC_IPV4}/api/users/${userID}`);
            setUserData(response.data.user);
            console.log(userData)
        } catch (error) {
            console.error("Ошибка получения данных пользователя:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://${process.env.EXPO_PUBLIC_IPV4}/api/users`);
            if (response.data && response.data.users) {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            Alert.alert("Ошибка", "Не удалось загрузить список пользователей");
        }
    };





    useEffect(() => {
        fetchUsers();
        getUserData();

    }, []);

    const createChat = async () => {
        if (!selectedUser) return;

        try {
            setLoading(true);
            const response = await axios.post(`http://${process.env.EXPO_PUBLIC_IPV4}/api/chats`, {
                joinedUsers: [selectedUser, userData.ID],
                initialMessage: {
                    text: "Привет, чат создан!",
                    userSend: `${userData.ID}`
                }
            });
            if (response.data && response.data.chat) {
                Alert.alert("Успех", "Чат создан");
                navigation.navigate("Chats");
            }
        } catch (error) {
            console.error("Error creating chat:", error);
            Alert.alert("Ошибка", "Не удалось создать чат");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <TitleText>Выберите юзера</TitleText>
            <Picker
                selectedValue={selectedUser}
                style={{ height: 50, color: '#fff', backgroundColor: '#333' }}
                onValueChange={(itemValue) => setSelectedUser(itemValue)}
            >
                <Picker.Item label="--Выберите юзера--" value="" />
                {users.map(user => (
                    <Picker.item key={user.ID} label={user.userName} value={user.ID} />
                ))}
            </Picker>
            <CreateButton disabled={!selectedUser || loading} onPress={createChat}>
                <ButtonText>{loading ? "Создается..." : "Создать"}</ButtonText>
            </CreateButton>
        </Container>
    );
};

export default CreateChatScreen;
