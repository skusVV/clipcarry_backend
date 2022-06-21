import { Response, Request } from 'express';
import { User, UserRoles } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { configs } from '../config';

export class UserController {

    async getUser(req: Request, res: Response): Promise<any> {
        try {
            const { email, firstName, lastName, role, user_id } = (req as any).user;

            return res.send({ email, firstName, lastName, role, userGuid: user_id });
        } catch (err) {
            console.log(err);
        }

    }

    async promoteUser(req: Request, res: Response): Promise<any> {
        try {
            const { user_id } = (req as any).user;
            const user = await User.findById(user_id);

            if (!user) {
                return res.status(404).send('Not found');
            }

            if (user.role === UserRoles.PAID_USER) {
                return res.status(400).send('User already promoted');
            }

            user.role = UserRoles.PAID_USER;
            user.paidDate = new Date();

            await user.save();

            const token = jwt.sign(
                { user_id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
                configs.token.key,
                {
                    expiresIn: configs.token.expTime,
                }
            );
            user.token = token;

            return res.status(200).send(user);
        } catch (error) {
            console.log(error);
        }
    }
}
