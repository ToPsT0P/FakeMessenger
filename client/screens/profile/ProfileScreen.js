import {Button, Text, TouchableOpacity, View} from "react-native";
import Navbar from "../../widgets/Navbar/Navbar";
import styled from "styled-components";
import React from "react";
import IconAwesome from "react-native-vector-icons/FontAwesome";

const Layout = styled.View`
    background-color: #1C1C1E;
    width: 100%;
    height: 100%;

`

const UserInfoView = styled.View`
    flex: 1;
`

const UserPersonalInfoView = styled.View`
    height: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 15px;
    
`

const UserImage = styled.Image`
    width: 66px;
    height: 66px;
    border-bottom-left-radius: 999px;
    border-bottom-right-radius: 999px;
    border-top-left-radius: 999px;
    border-top-right-radius: 999px;
`

const UserNamesView = styled.View`
   display: flex;
    flex-direction: column;
    gap: 2px;
`

const UserFullName = styled.Text`
    font-size: 22px;
    color: #fff; 
`

const UserActivityText = styled.Text`
    font-size: 15px;
    color: rgba(255, 255, 255, 0.5);
`

const UserBioView = styled.View`
    flex: 1;
    padding: 10px;
    gap: 12px;
    background-color: rgba(0, 0, 0, 0.5);
`

const UserBioHeadText = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: #61b4fa;
    margin-bottom: 10px;

`

const UserBioCaseView = styled.View`
    height: fit-content;
    padding-bottom: 15px;
    border-bottom-color: rgba(0, 0, 0, 0.15);
    border-bottom-width: 1px;
    border-bottom-style: solid;
    padding-top: 7px;
    
`

const UserBioCaseDataText = styled.Text`
    color: #fff;
    font-size: 16px;
`

const UserBioCaseNameText = styled.Text`
    color: rgba(255, 255, 255, 0.5);
    font-size: 13px;
`



const ProfileScreen = ({ navigation }) => {
    return (
        <Layout>
            <Navbar
                screenName={"Profile"}
                leftButton=
                    {<TouchableOpacity onPress={() => navigation.navigate('Chats')}>
                        <IconAwesome name="angle-left" size={24} color="#fff" />
                    </TouchableOpacity>}
                rightButton=
                    {<TouchableOpacity>
                        <IconAwesome name="pencil" size={24} color="#fff" />
                    </TouchableOpacity>}
                isSearchBar={false}
            />

            <UserInfoView>
                <UserPersonalInfoView>
                    <UserImage source={require("../../shared/ico/myAvatar.jpg")}/>

                    <UserNamesView>
                        <UserFullName>Alexander Pustovalov</UserFullName>
                        <UserActivityText>Online</UserActivityText>
                    </UserNamesView>
                </UserPersonalInfoView>

                <UserBioView>
                    <UserBioHeadText>Account</UserBioHeadText>

                    <UserBioCaseView>
                        <UserBioCaseDataText>
                            +7 (985) 691-01-45
                        </UserBioCaseDataText>
                        <UserBioCaseNameText>
                            tap to change phone number
                        </UserBioCaseNameText>
                    </UserBioCaseView>

                    <UserBioCaseView>
                        <UserBioCaseDataText>
                            @TaPsT0P
                        </UserBioCaseDataText>
                        <UserBioCaseNameText>
                            Username
                        </UserBioCaseNameText>
                    </UserBioCaseView>

                    <UserBioCaseView>
                        <UserBioCaseDataText>
                            Жалок тот, кто смерти ждет, не смея умереть
                        </UserBioCaseDataText>
                        <UserBioCaseNameText>
                            Bio
                        </UserBioCaseNameText>
                    </UserBioCaseView>


                </UserBioView>
            </UserInfoView>




            
        </Layout>
    );
};

export default ProfileScreen;