import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ProfileScreen from "./screens/profile/ProfileScreen";
import ChatsScreen from "./screens/chats/ChatsScreen";
import {StatusBar} from "react-native";
import CurrentChatScreen from "./screens/currentChat/CurrentChatScreen";




const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar theme="dark" backgroundColor="#1C1C1E" />
            <Stack.Navigator initialRouteName="Chats">
                <Stack.Screen name="Chats" component={ChatsScreen} options={{ headerShown: false }}  />
                <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
                <Stack.Screen name="CurrentChat" component={CurrentChatScreen} options={{ headerShown: false }} />

            </Stack.Navigator>
        </NavigationContainer>


    );
}
