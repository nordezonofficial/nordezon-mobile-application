import BackgroundContainer from '@/components/common/BackgroundContainer';
import ChatListContainer from '@/components/messages/ChatListContainer';
import React from 'react';

const chatlist = () => {
    return (
        <BackgroundContainer>
            <ChatListContainer></ChatListContainer>
        </BackgroundContainer>
    )
}

export default chatlist