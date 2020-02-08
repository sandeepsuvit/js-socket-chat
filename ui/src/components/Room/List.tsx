import React from 'react';
import RoomDto from './Room.dto';
import { useChat } from '../../ChatContext';
import config from "../../config";

interface Props {
  rooms: RoomDto[];
}

export default function List({ rooms }: Props) {
  const chatContext = useChat();

  const onRoomChange = (roomId: string) => {
    chatContext.socket.emit('changeRoom', {
      roomId,
      userId: localStorage.getItem(config.user)
    });
  };

  return (
    <div>
      <div>Rooms list:</div>
      <ul>{rooms && rooms.map((room: RoomDto) => <li onClick={() => onRoomChange(room.id)}>{room.name}</li>)}</ul>
    </div>
  );
}
