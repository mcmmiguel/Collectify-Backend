import { Router } from "express";
import UserController from "../controllers/UserController";
import { param } from "express-validator";
import { authenticate, isAdmin, verifyStatus } from '../middleware/auth';
import { userExists } from "../middleware/user";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.use(authenticate, verifyStatus, isAdmin);

router.get('/',
    UserController.getUsers,
);

router.param('userId', userExists);

router.patch('/block-user/:userId',
    param('userId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    UserController.blockUser,
);

router.patch('/unlock-user/:userId',
    param('userId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    UserController.unlockUser,
);

router.patch('/assign-admin/:userId',
    param('userId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    UserController.assignAdmin,
);

router.patch('/remove-admin/:userId',
    param('userId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    UserController.removeAdmin,
);

router.delete('/:userId',
    param('userId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    UserController.deleteUser,
)

export default router;