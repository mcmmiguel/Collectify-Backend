import Like, { ILike } from "../model/Like";

class LikeController {
    static async getAllItemLikes(socket: any, itemId: string) {
        try {
            const likes = await Like.find({ item: itemId }).populate('author', 'name');
            socket.emit('loadLikes', { itemId, likes });
        } catch (error) {
            console.error(error);
        }
    }

    static async createLike(data: ILike) {
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

    static async deleteLike(data: ILike) {
        try {
            await Like.deleteOne({
                item: data.item,
                author: data.author,
            })
        } catch (error) {
            console.error(error);
            throw new Error('Error deleting like');
        }
    }
}

export default LikeController;
