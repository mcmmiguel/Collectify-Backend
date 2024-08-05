import { Server, Socket } from 'socket.io';
import CommentController from '../controllers/CommentController';

export const setupSocketEvents = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('A user connected');

        // Llama a los métodos del controlador
        CommentController.getAllItemComments(socket);

        socket.on('createComment', async (data) => {
            const comment = await CommentController.createComment(data);
            io.emit('comment', comment);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};
