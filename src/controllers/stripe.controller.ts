import { Response, Request } from 'express';
import { configs } from '../config';
import { User } from '../models/user.model';
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
      try {
        const { user_id } = (req as any).user;

        const user = await User.findById(user_id);

        if (!user || !user.email) {
          return res.status(404).send('User not found');
        }

        if (user.subscriptionId) {
          const subscription = await this.getSubscription(user.subscriptionId);

          // needs to prove this concept
          if (subscription && subscription.status === 'active') {
            return res.status(200).send({ exist: true });
          }
        }

        const paymentLink = await stripe.paymentLinks.create({
          line_items: [
              { price: configs.stripeProductPrice, quantity: 1 }
          ],
          after_completion: { type: 'redirect', redirect: { url: `${configs.landingUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}` } },
        });

        res.send({
          paymentLink: {
            ...paymentLink,
            url: paymentLink.url + `?prefilled_email=${user.email}`
          }
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
      }

    }

  async getSession(sessionId: string) {
    return stripe.checkout.sessions.retrieve(
        sessionId
    );
  }

  async getSubscription(subId: string) {
    return stripe.subscriptions.retrieve(subId);
  }

  async getPortal(req: any, res: any) {
    const { user_id } = (req as any).user;

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const customerId = user.customerId;

    if (!customerId) {
      return res.status(400).send('User has no Customer Id');
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: configs.landingUrl,
    });

    res.send({
      portal
    });
  }
}


