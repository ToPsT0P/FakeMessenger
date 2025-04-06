import React from "react";
import styled from "styled-components/native";

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


const LoginFunction = () => {

}

const LoginScreen = ({ navigation }) => {
    return (
        <Layout>
            <Title>Вход</Title>
            <Input
                placeholder="Login"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
            />
            <Input
                placeholder="Password"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                secureTextEntry
            />
            <ButtonContainer>
                <AuthButton onPress={() => navigation.navigate("RegisterScreen")}>
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
