import { Response, Request } from 'express';
import { configs } from '../config';
const stripe = require("stripe")(configs.stripeSecret);

export class StripeController {

    async createPaymentIntent(req: Request, res: Response): Promise<any> {
      const { price } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: price,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        }
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    }

}
