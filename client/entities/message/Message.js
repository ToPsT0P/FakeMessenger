import React, { useState, useEffect } from "react";
import styled from "styled-components/native"; // или "styled-components", если это RN
import AsyncStorage from "@react-native-async-storage/async-storage";

const MessageWrapperViewMy = styled.View`
    width: 100%;
    padding: 5px;
    margin-bottom: 10px;
    display: flex;
    align-items: flex-end;
`;

const MessageWrapperViewOtherUser = styled.View`
    width: 100%;
    margin-bottom: 10px;
    display: flex;
`;

const MessageViewMy = styled.View`
    width: fit-content;
    max-width: 80%;
    padding: 10px;
    min-height: 55px;
    background-color: #7a42d1;
`;

const MessageViewOther = styled.View`
    width: fit-content;
    max-width: 80%;
    padding: 10px;
    min-height: 55px;
    background-color: #262628;
`;

const UserText = styled.Text`
    color: white;
`;

const Message = ({ messageData }) => {
    const [currentUserId, setCurrentUserId] = useState(null);

    // Загружаем userId из AsyncStorage при монтировании компонента
    useEffect(() => {
        AsyncStorage.getItem("userId")
            .then((id) => {
                setCurrentUserId(id);
            })
            .catch((err) => console.error("Error loading userId", err));
    }, []);

    // Пока идентификатор пользователя ещё не загружен – ничего не рендерим (или можно сделать лоадер)
    if (currentUserId === null) {
        return null;
    }

    return (
        <>
            {messageData.userSend === currentUserId ? (
                <MessageWrapperViewMy>
                    <MessageViewMy>
                        <UserText>{messageData.text}</UserText>
                    </MessageViewMy>
                </MessageWrapperViewMy>
            ) : (
                <MessageWrapperViewOtherUser>
                    <MessageViewOther>
                        <UserText>{messageData.text}</UserText>
                    </MessageViewOther>
                </MessageWrapperViewOtherUser>
            )}
        </>
    );
};

export default Message;
