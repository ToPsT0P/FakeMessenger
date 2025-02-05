import {FlatList, ImageBackground, RefreshControl, TouchableOpacity} from "react-native";
import React from "react";
import styled from "styled-components";


import IconAwesome from "react-native-vector-icons/FontAwesome";


import ChatListItem from "../../entities/chatListItem/ChatListItem";
import Navbar from "../../widgets/Navbar/Navbar";
import {testArray} from "./testArray";

// TODO Styles


const Layout = styled.View`
    background-color: #1C1C1E;
    width: 100%;
    flex: 1; 
`;

const ChatsScreen = ({ navigation }) => {


    const [isLoading, setIsLoading] = React.useState(true)


// TODO Data Logic in future

    const chatsFetch = () => {
        setTimeout(() => {setIsLoading(false)}, 300)

    }

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
                    {<TouchableOpacity>
                        <IconAwesome name="plus-square-o" size={30} color="#fff" />
                    </TouchableOpacity>}
                isSearchBar={true}
            />


            <FlatList
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => chatsFetch()} />}
                data={testArray}
                renderItem={({item}) => (
                    <TouchableOpacity  onPress={() => navigation.navigate('CurrentChat')}>
                        <ChatListItem props={item}/>
                    </TouchableOpacity>
                )}

            />
        </Layout>


    );
};

export default ChatsScreen;