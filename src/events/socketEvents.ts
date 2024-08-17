import { Server, Socket } from 'socket.io';
import CommentController from '../controllers/CommentController';
import LikeController from '../controllers/LikeController';
import { IComment } from '../model/Comment';
import { I_Item } from '../model/Item';
import authenticateSocket from '../middleware/socket';

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
                await new Promise((resolve, reject) => {
                    authenticateSocket(socket, (err) => {
                        if (err) reject(err);
                        else resolve(null);
                    });
                });

                const comment = await CommentController.createComment(data);
                io.to(data.item.toString()).emit('comment', comment);
            } catch (error) {
                console.error('Error al crear comentario o autenticación fallida:', error);
                socket.emit('error', { message: 'No se pudo crear el comentario.' });
            }
        });

        socket.on('createLike', async (data) => {
            try {
                await new Promise((resolve, reject) => {
                    authenticateSocket(socket, (err) => {
                        if (err) reject(err);
                        else resolve(null);
                    });
                });

                const like = await LikeController.createLike(data);
                console.log(like);
                io.to(data.item).emit('like', like);
            } catch (error) {
                console.error('Error al crear like o autenticación fallida:', error);
                socket.emit('error', { message: 'No se pudo crear el like.' });
            }
        });

        socket.on('deleteLike', async (data) => {
            try {
                await new Promise((resolve, reject) => {
                    authenticateSocket(socket, (err) => {
                        if (err) reject(err);
                        else resolve(null);
                    });
                });

                await LikeController.deleteLike(data);
                io.to(data.item).emit('likeDeleted');
            } catch (error) {
                console.error('Error al crear like o autenticación fallida:', error);
                socket.emit('error', { message: 'No se pudo crear el like.' });
            }
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};
