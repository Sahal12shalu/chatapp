import type { NextApiRequest } from 'next'
import { initSocket } from '@/app/lib/socket'

export const config = {
    api: {
        bodyParser:false,
    },
};

export default function handler(req: NextApiRequest, res: any){
    if(!res.socket.server.io) {
        console.log('socket is initializing');
        initSocket(res.socket.server)
    }
    res.end()
}