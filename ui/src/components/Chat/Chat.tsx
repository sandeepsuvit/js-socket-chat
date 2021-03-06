import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import UsersList from '../UsersList';
import Room from '../Room';
import MessageInput from './MessageInput';
import MessagesList from './MessagesList';
import MessageDto from '../../models/MessageDto';
import RoomDto from '../../models/RoomDto';
import { useChat } from '../../utils/SocketService';

interface Props {
  onAddNewRoom: () => void;
  handleLogout: () => void;
  messages: MessageDto[];
  rooms: RoomDto[];
  user: null | string;
}

export default function Chat({ user, onAddNewRoom, handleLogout, messages, rooms }: Props) {
  const chatContext = useChat();
  const [room, setRoom] = useState();
  const initalMessagesState: MessageDto[] = [];
  const [newMessages, setMessages] = useState(initalMessagesState);

  const handleMessage = (message: string) => {
    if (user) {
      chatContext.socket.emit('addMessage', { message, userId: user });
    }
  };

  useEffect(() => {
    chatContext.socket.on('messageReceived', (newMessage: MessageDto) => {
      newMessages.push(newMessage);
      setMessages([...newMessages]);
    });

    chatContext.socket.on('incomingNotification', (newMessage: MessageDto) => {
      if (newMessage.userId !== localStorage.getItem('user')) {
        newMessages.push(newMessage);
        setMessages([...newMessages]);
      }
    });

    chatContext.socket.on('roomChanged', (changedRoom: RoomDto) => {
      setMessages([]);
      setRoom(changedRoom);
      chatContext.socket.emit('getUsers', { roomId: changedRoom.id });
    });
  }, [messages]);

  return (
    <Container id="chat" className="Login" component="main" fixed>
      <Grid container>
        <Grid item xs={12} lg={3}>
          <UsersList handleLogout={handleLogout} />
        </Grid>
        <Grid item xs={12} lg={6} id="messages-box">
          <MessagesList room={room} initialMessages={[...messages, ...newMessages]} />
          <MessageInput room={room} handleMessage={handleMessage} />
        </Grid>
        <Grid item xs={12} lg={3}>
          <Room user={user} onAddNewRoom={onAddNewRoom} rooms={rooms} />
        </Grid>
      </Grid>
    </Container>
  );
}
