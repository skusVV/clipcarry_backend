import { User, UserRoles } from '../models/user.model';
import { Template } from '../models/template.model';
import { TemplateRecord } from '../models/template-record.model';
import moment from 'moment';
import cron from 'node-cron';

(async () => {
  // Every day an midnight
  cron.schedule('0 0 * * *', async () =>  {
    try {
      const expireTime = moment().subtract('90', 'days');

      const guestsToRemove = await User.find({
        role: UserRoles.GUEST,
        createdDate: { $exists: true, $lt: expireTime }
      });
      if (guestsToRemove.length) {
        const templatesToRemove = await Template.find({ user_id: { $in: guestsToRemove.map(item => item._id) }});

        const removedRecords = await TemplateRecord.deleteMany({ template_id: { $in: templatesToRemove.map(template => template._id) } });
        console.log(`${removedRecords.deletedCount} Template Records were deleted`);

        const removedTemplates = await Template.deleteMany({ _id: { $in: templatesToRemove.map(template => template._id) }});
        console.log(`${removedTemplates.deletedCount} Templates were deleted`);

        const removedGuests = await User.deleteMany({ _id: { $in: guestsToRemove.map(item => item._id) } });
        console.log(`${removedGuests.deletedCount} Guest Users were deleted`);
      }

    } catch (error) {
      console.error(error);
    }

  });
})();
