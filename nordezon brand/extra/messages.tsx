import BackgroundContainer from '@/components/common/BackgroundContainer';
import MessagesContainer from '@/components/messages/ChatListContainer';
import React from 'react';

const messages = () => {
  return (
    <BackgroundContainer>
        <MessagesContainer></MessagesContainer>
    </BackgroundContainer>
  )
}

export default messages