import {Text, TouchableOpacity} from "react-native";
import Navbar from "../../widgets/Navbar/Navbar";
import styled from "styled-components";
import React from "react";
import IconAwesome from "react-native-vector-icons/FontAwesome";

const Layout = styled.View`
    background-color: #1C1C1E;
    width: 100%;
    height: 100%;
`

const ProfileScreen = ({ navigation }) => {
    return (
        <Layout>
            <Navbar
                screenName={"Profile"}
                leftButton=
                    {<TouchableOpacity onPress={() => navigation.navigate('Chats')}>
                        <IconAwesome name="angle-left" size={26} color="#fff" />
                    </TouchableOpacity>}
                rightButton=
                    {<TouchableOpacity>
                        <IconAwesome name="floppy-o" size={26} color="#fff" />
                    </TouchableOpacity>}
                isSearchBar={false}
            />
            
        </Layout>
    );
};

export default ProfileScreen;