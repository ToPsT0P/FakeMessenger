import React, { useState, useEffect } from 'react'
import styled from "styled-components/native";
import axios from "axios";
import {Alert} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Layout = styled.View`
  flex: 1;
  background-color: #1c1c1e;
  padding: 20px;
  justify-content: center;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #61b4fa;
  text-align: center;
  margin-bottom: 40px;
`;

const Input = styled.TextInput`
    height: 50px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 12px;
    padding: 10px;
    font-size: 17px;
    color: #fff;
    margin-bottom: 20px;
`;

const ButtonContainer = styled.View`
    flex-direction: row;
    justify-content: space-around;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 30px;

`;

const AuthButton = styled.TouchableOpacity`
  background-color: #61b4fa;
  padding: 12px 20px;
  border-radius: 10px;
`;

const ButtonText = styled.Text`
    font-size: 16px;
    color: #1c1c1e;
    font-weight: bold;
`;



const LoginScreen = ({ navigation }) => {

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const LoginLogic = async () => {

        try {
            const response = await axios.post(`http://${process.env.EXPO_PUBLIC_IPV4}/api/login`, {

                login: login,
                password: password
            });
            await AsyncStorage.setItem("userId", response.data.user.ID);

            navigation.navigate("Chats")
        } catch (error) {
            console.log("Ошибка при создании пользователя:", error.message);
            Alert.alert("Ошибка", "Не удалось создать пользователя");
        }
    };


    return (
        <Layout>
            <Title>Вход</Title>

            <Input
                placeholder="Login"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={login}
                onChangeText={setLogin}
            />
            <Input
                placeholder="Password"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <ButtonContainer>
                <AuthButton onPress={() => LoginLogic()}>
                    <ButtonText>Войти в систему</ButtonText>
                </AuthButton>
                <AuthButton onPress={() => navigation.navigate("Auth")}>
                    <ButtonText>Нет аккунта</ButtonText>
                </AuthButton>

            </ButtonContainer>
        </Layout>
    );
};

export default LoginScreen;
