import { Socket } from "socket.io";
import Comment, { IComment } from "../model/Comment";


class CommentController {
    static getAllItemComments = async (socket: Socket, itemId: string) => {
        try {
            const comments = await Comment.find({ item: itemId }).populate('author', 'name');
            socket.emit('loadComments', comments);
        } catch (error) {
            console.error(error);
        }
    }

    static createComment = async (data: IComment) => {
        try {
            const comment = new Comment(data);
            await comment.save();
            const populatedComment = await comment.populate('author', 'name');
            return populatedComment;
        } catch (error) {
            console.error(error);
            throw new Error('Error creating comment');
        }
    }
}

export default CommentController;