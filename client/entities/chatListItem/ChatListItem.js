import styled from "styled-components/native"
import defaultAvatar from "../../shared/ico/defaultAvatart.svg"

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
    border-bottom-left-radius: 999px;
    border-bottom-right-radius: 999px;
    border-top-left-radius: 999px;
    border-top-right-radius: 999px;
    
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
    width: 77.5%;
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




const ChatListItem = ({props}) => {

    return (
        <Chat>
            <ChatImage source={defaultAvatar} />
            <ChatInfo>
                <ChatNameAndTime>
                    <ChatName>{props.chatID}</ChatName>
                </ChatNameAndTime>
                <LastMessage>{props.lastMessage}</LastMessage>
            </ChatInfo>
        </Chat>
    );
};

export default ChatListItem;