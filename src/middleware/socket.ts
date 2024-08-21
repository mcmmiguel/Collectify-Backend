import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import User from '../model/User';
import i18n from '../config/i18n';

const authenticateSocket = async (socket: Socket, next: (err?: any) => void) => {
    try {
        const authHeader = socket.handshake.auth.headers.Authorization;
        if (!authHeader) {
            return next(new Error(i18n.t("Error_Unauthorized")));
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return next(new Error(i18n.t("Error_Unauthorized")));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        if (!decoded || !decoded.id) {
            return next(new Error(i18n.t("Error_InvalidToken")));
        }

        const user = await User.findById(decoded.id).select('_id name email isAdmin isBlocked');
        if (!user) {
            return next(new Error(i18n.t("Error_InvalidToken")));
        }

        (socket as any).user = user;
        next();
    } catch (error) {
        next(new Error(i18n.t("Error_InvalidToken")));
    }
};

export default authenticateSocket;
