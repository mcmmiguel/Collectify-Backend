import { Socket } from "socket.io";
import Comment, { IComment } from "../model/Comment";


class CommentController {
    static getAllItemComments = (socket: Socket) => {
        const comments = Comment.find({});
        socket.emit('comments', comments);
    }

    static createComment = async (data: IComment) => {
        try {
            const comment = new Comment(data);
            const savedComment = await comment.save();
            return savedComment;
        } catch (error) {
            console.error('Error saving comment:', error);
        }
    }
}

export default CommentController;