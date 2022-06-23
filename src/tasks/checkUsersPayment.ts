import { User, UserRoles } from '../models/user.model';
import moment from 'moment';
import cron from 'node-cron';

(async () => {
  // Every day an midnight
  cron.schedule('0 0 * * *', async () =>  {
    try {
      const today = moment();

      const usersToUpdate = await User.find({
        role: UserRoles.PAID_USER,
        paymentExpirationDate: { $exists: true, $lt: today }
      });

      while (usersToUpdate.length > 0) {
        const chunk = usersToUpdate.splice(0, 1000);

        const bulkWrite = chunk.map(i => ({
          updateOne: {
            filter: { _id: i._id },
            update: {
              $set: {
                role: UserRoles.USER
              }
            }
          }
        }));

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
