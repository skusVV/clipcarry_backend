import { Response, Request } from 'express';
import { AuthController } from '../controllers/auth.controller';

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
}
