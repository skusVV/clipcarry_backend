import { Response, Request } from 'express';
import { UserController } from '../controllers/user.controller';
import { auth } from '../middleware/auth';

const userController = new UserController();

export const userRoutes = (app: any) => {
    app.get('/api/user', auth, (req: Request, res: Response) => {
        return userController.getUser(req, res)
    });
}
