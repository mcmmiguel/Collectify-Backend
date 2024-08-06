import { Server, Socket } from 'socket.io';
import CommentController from '../controllers/CommentController';
import LikeController from '../controllers/LikeController';
import { IComment } from '../model/Comment';
import { I_Item } from '../model/Item';

export const setupSocketEvents = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('A user connected');

        socket.on('joinItemRoom', (itemId: I_Item['id']) => {
            socket.join(itemId);
            CommentController.getAllItemComments(socket, itemId);
            LikeController.getAllItemLikes(socket, itemId);
        });

        socket.on('createComment', async (data: IComment) => {
            try {
                const comment = await CommentController.createComment(data);
                io.to(data.item.toString()).emit('comment', comment);
            } catch (error) {
                console.error('Error creating comment:', error);
            }
        });

        socket.on('createLike', async (data) => {
            try {
                const like = await LikeController.createLike(data);
                io.to(data.item).emit('like', like);
            } catch (error) {
                console.error('Error creating like:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};
