import styled from "styled-components";
import {Text} from "react-native";

const MessageWrapperViewMy = styled.View`
    width: 100%;
    padding: 5px;
    height: fit-content;
    margin-bottom: 10px;
    display: flex;
    align-items: flex-end;

`

const MessageWrapperViewOtherUser = styled.View`
    width: 100%;
    height: fit-content;
    margin-bottom: 10px;
    display: flex;
`

const MessageViewMy = styled.View`
    width: fit-content;
    max-width: 80%;
    height: fit-content;
    padding: 10px;
    min-height: 55px;
    display: flex;
    background: #7a42d1;
`

const MessageViewOther = styled.View`
    width: fit-content;
    max-width: 80%;
    padding: 10px;
    height: fit-content;
    min-height: 55px;
    display: flex;
    background: #262628;
`

const UserText = styled.Text`
    color: white;
`

const Message = ({messageData}) => {

    const myUserID = "1"
    return (
        <>
            {messageData.userID == myUserID
                ?
                <MessageWrapperViewMy>
                    <MessageViewMy>
                        <UserText>{messageData.text}</UserText>
                    </MessageViewMy>
                </MessageWrapperViewMy>
                :
                <MessageWrapperViewOtherUser>
                    <MessageViewOther>
                        <UserText>{messageData.text}</UserText>
                    </MessageViewOther>
                </MessageWrapperViewOtherUser>

            }
        </>



    );
};

export default Message;