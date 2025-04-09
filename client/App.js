import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ProfileScreen from "./screens/profile/ProfileScreen";
import ChatsScreen from "./screens/chats/ChatsScreen";
import {StatusBar} from "react-native";
import CurrentChatScreen from "./screens/currentChat/CurrentChatScreen";
import LoginScreen from "./screens/LoginOrAuth/LoginScreen";
import AuthScreen from "./screens/LoginOrAuth/AuthScreen";
import CreateChat from "./screens/createChat/CreateChat";




const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar theme="dark" backgroundColor="#1C1C1E" />
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Chats" component={ChatsScreen} options={{ headerShown: false }}  />
                <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
                <Stack.Screen name="CurrentChat" component={CurrentChatScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
                <Stack.Screen name="CreateChat" component={CreateChat} options={{ headerShown: false }} />

            </Stack.Navigator>
        </NavigationContainer>


    );
}
