import { Response, Request } from 'express';
import { StripeController } from '../controllers/stripe.controller';
import { auth } from '../middleware/auth';

const stripeController = new StripeController();

export const stripeRoutes = (app: any) => {
    app.post('/api/create-payment-intent', auth, (req: Request, res: Response) => {
        return stripeController.createPaymentIntent(req, res)
    });

    app.get('/api/create-payment', (req: Request, res: Response) => {
        return stripeController.createPayment(req, res)
    });

    app.get('/api/getUser', (req: Request, res: Response) => {
        return stripeController.getUser(req, res)
    });

    app.get('/api/getPortal', (req: Request, res: Response) => {
        return stripeController.getPortal(req, res)
    });
}
