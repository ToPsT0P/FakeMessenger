import styled from "styled-components/native"


const Chat = styled.View`
    display: flex;
    align-items: center;
    flex-direction: row;
    padding: 6px;
    gap: 15px;
    height: 78px;
`;


const ChatImage = styled.Image`
    width: 60px;
    height: 60px;
`;

const ChatName = styled.Text`
    color: white;
    font-size: 16px;
`;

const LastMessage = styled.Text`
    color: #8E8E93;
    font-size: 15px;
    width: 220px;
`;

const ChatInfo = styled.View`
    display: flex;
    height: 100%;
    width: 75%;
    border-bottom-width: 1px;
    border-bottom-color: #545458;
    border-bottom-style: solid;
`;

const ChatNameAndTime = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: center;
    align-items: center;
`;

const ChatTime = styled.Text`
    color: #fff;
    display: flex;
    align-content: center;
    align-items: center;
    font-size: 13px;
`;



const ChatListItem = () => {
    return (
        <Chat>
            <ChatImage source={require('../../shared/ico/user.png')} />
            <ChatInfo>
                <ChatNameAndTime>
                    <ChatName>Ро-Ро-Рома</ChatName>
                    <ChatTime>9/29</ChatTime>
                </ChatNameAndTime>
                <LastMessage>Саня, я сегодня никуда не иду, я спать ;)</LastMessage>
            </ChatInfo>
        </Chat>
    );
};

export default ChatListItem;