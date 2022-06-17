import { Response, Request } from 'express';
import { StripeController } from '../controllers/stripe.controller';
import { auth } from '../middleware/auth';

const stripeController = new StripeController();

export const stripeRoutes = (app: any) => {
    app.post('/api/create-payment-intent', auth, (req: Request, res: Response) => {
        return stripeController.createPaymentIntent(req, res)
    });
}
