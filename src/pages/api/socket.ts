import type { NextApiRequest, NextApiResponse  } from 'next'
import { initSocket } from '@/app/lib/socket'
import type { Server as HTTPServer } from 'http';
import type { Socket } from 'net';
import type { Server as IOServer } from 'socket.io';

export const config = {
    api: {
        bodyParser:false,
    },
};

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

interface SocketWithServer extends Socket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithServer;
}

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket){
    if(!res.socket.server.io) {
        console.log('socket is initializing');
        initSocket(res.socket.server)
    }
    res.end()
}