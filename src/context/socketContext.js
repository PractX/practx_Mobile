import { createContext } from 'react';
import socketio from 'socket.io-client';
// import { SOCKET_URL } from "config";

// export const socket = socketio.connect(`https://practx-backend.com/`);
export const getSocket = token => {
  console.log('SOCKET TOKEN______', token);
  return socketio.connect('https://practx-backend.com/', {
    extraHeaders: {
      token: token.key,
    },
  });
};
export const SocketContext = createContext(null);
