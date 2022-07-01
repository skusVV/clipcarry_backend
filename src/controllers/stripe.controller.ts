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
        },
        description: 'Clipcarry'
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    }

    async createPayment(req: any, res: any) {
      const paymentLink = await stripe.paymentLinks.create({
        line_items: [
            {price: 'price_1LGl8QGc8jl8Z4Cc7tHGq6ec', quantity: 1}
        ],
        after_completion: {type: 'redirect', redirect: {url: 'http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}'}},
      });

      res.send({
        paymentLink: {
          ...paymentLink,
          url: paymentLink.url + '?prefilled_email=skus000@gmail.com'
        }
      });
    }

  async getUser(req: any, res: any) {
      const sessionId = 'cs_test_a174htDOMUffd6JnVKMt9mMw8MDuTQkXcjzCgxmshNLLvKvB76wxjiMGY0';

    const session = await stripe.checkout.sessions.retrieve(
        sessionId
    );
    //     "customer": "cus_LyitSYfO5mXTja",
    res.send({
      session
    });
  }

  async getPortal(req: any, res: any) {
    const portal = await stripe.billingPortal.sessions.create({
      customer: 'cus_LyjCvgNL33pffr',
      return_url: 'http://localhost:3000/',
    });

    res.send({
      portal
    });
  }
}


