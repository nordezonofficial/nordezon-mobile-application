// store/chat.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    chatList: [],
    chatMessages: [] as any,
    roomHeader: {},
}

const chatSLice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        /* --- chat Data --- */
        setChatList: (state, action) => {
            state.chatList = action.payload;
        },

        setChatMessages: (state, action) => {
            state.chatMessages = action.payload;
        },
        setNewChatMessage: (state, action) => {
            state.chatMessages = [...state.chatMessages, ...action.payload];
          },
          
        setRoomHeader: (state, action) => {
            state.roomHeader = action.payload
        }
    },
})

export const { setChatList, setChatMessages, setRoomHeader, setNewChatMessage } = chatSLice.actions
export default chatSLice.reducer
