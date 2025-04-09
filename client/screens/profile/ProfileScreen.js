import { Button, Text, TouchableOpacity, View } from "react-native";
import Navbar from "../../widgets/Navbar/Navbar";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import IconAwesome from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import defAv from "../../shared/ico/defAv.png"

const Layout = styled.View`
    background-color: #1C1C1E;
    width: 100%;
    height: 100%;
`;

const UserInfoView = styled.View`
    flex: 1;
`;

const UserPersonalInfoView = styled.View`
    height: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 15px;
`;

const UserImage = styled.Image`
    width: 66px;
    height: 66px;
    border-radius: 33px;
`;

const UserNamesView = styled.View`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const UserFullName = styled.Text`
    font-size: 22px;
    color: #fff;
`;

const UserActivityText = styled.Text`
    font-size: 15px;
    color: rgba(255, 255, 255, 0.5);
`;

const UserBioView = styled.View`
    flex: 1;
    padding: 10px;
    gap: 12px;
    background-color: rgba(0, 0, 0, 0.5);
`;

const UserBioHeadText = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: #61b4fa;
    margin-bottom: 10px;
`;

const UserBioCaseView = styled.View`
    padding: 7px 0 15px;
    border-bottom-color: rgba(0, 0, 0, 0.15);
    border-bottom-width: 1px;
    border-bottom-style: solid;
`;

const UserBioCaseDataText = styled.Text`
    color: #fff;
    font-size: 16px;
`;

const UserBioCaseNameText = styled.Text`
    color: rgba(255, 255, 255, 0.5);
    font-size: 13px;
`;

const ProfileScreen = ({ navigation }) => {
    const [userData, setUserData] = useState(null);

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

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <Layout>
            <Navbar
                screenName={"Profile"}
                leftButton={
                    <View style={{ width: "42px" }}>
                        <TouchableOpacity onPress={() => navigation.navigate("Chats")}>
                            <IconAwesome name="angle-left" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>
                }

                isSearchBar={false}
            />

            <UserInfoView>
                <UserPersonalInfoView>
                    <UserImage source={userData?.ID === "36d6be9e-c84e-4d70-9441-135100882b6d" ? require("../../shared/ico/myAvatar.jpg") : require("../../shared/ico/defAv.png")} />
                    <UserNamesView>
                        <UserFullName>{userData ? userData.userName : "Loading..."}</UserFullName>
                        <UserActivityText>Online</UserActivityText>
                    </UserNamesView>
                </UserPersonalInfoView>

                <UserBioView>
                    <UserBioHeadText>Account</UserBioHeadText>

                    <UserBioCaseView>
                        <UserBioCaseDataText>+7 (985) 691-01-45</UserBioCaseDataText>
                        <UserBioCaseNameText>tap to change phone number</UserBioCaseNameText>
                    </UserBioCaseView>

                    <UserBioCaseView>
                        <UserBioCaseDataText>@TaPsT0P</UserBioCaseDataText>
                        <UserBioCaseNameText>Username</UserBioCaseNameText>
                    </UserBioCaseView>

                    <UserBioCaseView>
                        <UserBioCaseDataText>
                            Жалок тот, кто смерти ждет, не смея умереть
                        </UserBioCaseDataText>
                        <UserBioCaseNameText>Bio</UserBioCaseNameText>
                    </UserBioCaseView>
                </UserBioView>
            </UserInfoView>
        </Layout>
    );
};

export default ProfileScreen;
