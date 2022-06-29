import { Response, Request } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { auth } from '../middleware/auth';

const authController = new AuthController();

export const authRoutes = (app: any) => {
    app.post('/api/login', (req: Request, res: Response) => {
        return authController.login(req, res)
    });

    app.post('/api/register', (req: Request, res: Response) => {
        return authController.register(req, res)
    });

    app.post('/api/register-as-guest', (req: Request, res: Response) => {
        return authController.registerAsGuest(req, res)
    });

    app.get('/api/user-role', auth, (req: Request, res: Response) => {
        return authController.getUserRole(req, res);
    });

    app.post('/api/refresh-token', auth, (req: Request, res: Response) => {
        return authController.refreshUserToken(req, res);
    })
}
