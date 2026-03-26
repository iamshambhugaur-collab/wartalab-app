import { io } from 'socket.io-client';

let socket;

export const connectSocket = (baseURL, userId) => {
  if (!socket) {
    socket = io(baseURL.replace('/api', ''), {
      transports: ['websocket']
    });

    socket.on('connect', () => {
      socket.emit('presence:online', { userId });
    });
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
