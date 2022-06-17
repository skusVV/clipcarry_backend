import { Response, Request } from 'express';
const stripe = require("stripe")('{{ Paste your secret }}');

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
