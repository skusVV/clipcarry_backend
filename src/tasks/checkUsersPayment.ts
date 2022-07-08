import { User, UserRoles } from '../models/user.model';
import moment from 'moment';
import cron from 'node-cron';
import { StripeController } from '../controllers/stripe.controller';
import { PROMO_USER_SUB_ID } from '../constants';
const stripeController = new StripeController();

(async () => {
  // Every day an midnight
  cron.schedule('0 0 * * *', async () =>  {
    try {

      const usersToUpdate = await User.find({
        subscriptionId: { $exists: true },
        role: UserRoles.PAID_USER
      });

      while (usersToUpdate.length > 0) {
        const chunk = usersToUpdate.splice(0, 1000);
        const bulkWrite: any[] = [];

        for (const i of chunk) {
          if (i.subscriptionId === PROMO_USER_SUB_ID && moment().isAfter(i.paymentExpirationDate)) {
            bulkWrite.push({
              updateOne: {
                filter: { _id: i._id },
                update: {
                  $set: {
                    role: UserRoles.USER
                  },
                  $unset: {
                    subscriptionId: ''
                  }
                }
              }
            });
          } else {
            const subscription = await stripeController.getSubscription(i.subscriptionId);

            if (subscription.status === 'active') {
              bulkWrite.push({
                updateOne: {
                  filter: { _id: i._id },
                  update: {
                    $set: {
                      paymentExpirationDate: moment(subscription.current_period_end * 1000).toDate()
                    }
                  }
                }
              });
            } else {
              bulkWrite.push({
                updateOne: {
                  filter: { _id: i._id },
                  update: {
                    $set: {
                      role: UserRoles.USER
                    }
                  }
                }
              });
            }
          }
        }

        const bulkWriteResult = await User.bulkWrite(bulkWrite);
        if (bulkWriteResult) {
          console.log(`Update users payment status. count update documents: ${bulkWriteResult.nModified}`);
        }
      }
    } catch (error) {
      console.error(error);
    }

  });
})();
