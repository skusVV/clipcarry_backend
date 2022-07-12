import { Response, Request } from 'express';
import { UserController } from '../controllers/user.controller';
import { auth } from '../middleware/auth';

const userController = new UserController();

export const userRoutes = (app: any) => {
    app.get('/api/user', auth, (req: Request, res: Response) => {
        return userController.getUser(req, res)
    });

    app.patch('/api/user/promote', auth, (req: Request, res: Response) => {
        return userController.promoteUser(req, res);
    });

    app.post('/api/reset-password', (req: Request, res: Response) => {
        return userController.getResetPasswordLink(req, res);
    });

    app.patch('/api/password/:code', (req: Request, res: Response) => {
        return userController.resetUserPassword(req, res);
    });
}
