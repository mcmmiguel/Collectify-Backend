import { IComment } from "../model/Comment";
import Like from "../model/Like";

class LikeController {
    static async getAllItemLikes(socket: any, itemId: string) {
        try {
            const likes = await Like.find({ item: itemId }).populate('author', 'name');
            socket.emit('loadLikes', likes);
        } catch (error) {
            console.error(error);
        }
    }

    static async createLike(data: IComment) {
        try {
            const like = new Like(data);
            await like.save();
            const populatedLike = await Like.findById(like._id).populate('author', 'name');
            return populatedLike;
        } catch (error) {
            console.error(error);
            throw new Error('Error creating like');
        }
    }
}

export default LikeController;
