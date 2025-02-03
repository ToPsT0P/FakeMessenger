import styled from 'styled-components/native';
import Navbar from "./widgets/Navbar/Navbar";
import ChatsTab from "./tabs/chats/ChatsTab";

const Layout = styled.ScrollView`
    background-color: #1C1C1E;
    width: 100%;
    height: 100%;
`;


export default function App() {
    return (
        <Layout>
            <Navbar/>
            <ChatsTab/>

        </Layout>
    );
}