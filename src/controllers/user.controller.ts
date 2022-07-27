import { Response, Request } from 'express';
import { ConfirmCodeTypes, User, UserRoles } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { configs } from '../config';
import moment from 'moment';
import bcrypt from 'bcryptjs';
import { StripeController } from './stripe.controller';
import { UserCodeService } from '../services/user-code.service';
import { MailClient } from '../services/mailer/mail.client';
import { MailService } from '../services/mailer/mail.service';
import { PROMO_USER_SUB_ID } from '../constants';

const userCodeService = new UserCodeService();
const stripeController = new StripeController();
const mailService = new MailService({ MailClient: new MailClient({ configs })});

export class UserController {

    async getUser(req: Request, res: Response): Promise<any> {
        try {
            const { user_id } = (req as any).user;

            const user = await User.findById(user_id);

            if (!user) {
                return res.status(404);
            }
            return res.send({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                userGuid: user_id,
                paymentExpirationDate: user.paymentExpirationDate || '',
                customerId: user.customerId || '',
                isInvitedUser: user.subscriptionId === PROMO_USER_SUB_ID
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }

    }

    async promoteUser(req: Request, res: Response): Promise<any> {
        try {
            const { user_id } = (req as any).user;
            const { session_id } = req.body;

            if (!session_id) {
                return res.status(400).send('Payment session_id is required');
            }
            const user = await User.findById(user_id);

            if (!user) {
                return res.status(404).send('Not found');
            }

            if (user.role === UserRoles.PAID_USER) {
                return res.status(400).send('User already promoted');
            }

            const session = await stripeController.getSession(session_id);

            if (!session) {
                return res.status(400).send('Bad session token');
            }

            user.role = UserRoles.PAID_USER;
            user.customerId = session.customer;
            user.subscriptionId = session.subscription;

            const subscription = await stripeController.getSubscription(session.subscription);

            if (!user.paymentDate) {
                user.paymentDate = new Date();
            }

            // Stripe is using UNIX timestamp notation which means setting time in SECONDS
            // thats why we need to multiply it on 1000
            user.paymentExpirationDate = moment(subscription.current_period_end * 1000).toDate();

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
            return res.status(500).send(error);
        }
    }

    async getResetPasswordLink(req: Request, res: Response): Promise<any> {
        try {
            const email = req.body.email || '';

            if (!email) {
                return res.status(400).send('Email is required.');
            }

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).send('User not found.');
            }

            const confirmCode = await userCodeService.generateCode(user, ConfirmCodeTypes.RESET_PASSWORD);

            if (!confirmCode) {
                return res.status(500).send('Something went wrong');
            }

            const resetLink = `${configs.landingUrl}/forgot-password?reset_password_key=${confirmCode.value}`;

            console.log('Reset link: ', resetLink);

            await mailService.sendResetPasswordEmail(user.email, {
                link: resetLink
            });

            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }

    async resetUserPassword(req: Request, res: Response): Promise<any> {
        try {
            const code = req.params.code
            const password = req.body.password;

            if (!code) {
                return res.status(400).send('Reset password code is required.');
            }

            if (!password) {
                return res.status(400).send('New password is required.');
            }

            const user = await userCodeService.getUserByCode(code, ConfirmCodeTypes.RESET_PASSWORD);

            if (!user) {
                return res.status(404).send('User not found.');
            }

            const isCodeExpired = await userCodeService.isExpiredCode(user, ConfirmCodeTypes.RESET_PASSWORD);

            if (isCodeExpired) {
                return res.status(400).send('Reset password code is already expired.');
            }

            const encryptedPassword = await bcrypt.hash(password, 10);

            user.password = encryptedPassword;

            await user.save();

            await userCodeService.removeCode(user, ConfirmCodeTypes.RESET_PASSWORD);

            return res.status(200).send({});
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }

    async changeUserPassword(req: Request, res: Response): Promise<any> {
        try {
            const { old_password, new_password } = req.body;
            const { user_id } = (req as any).user;

            const user = await User.findById(user_id);

            if (!old_password || !new_password) {
                return res.status(400).send('All fields are required');
            }

            if (!user) {
                return res.status(404).send('User not found');
            }

            if (!(await bcrypt.compare(old_password, user.password))) {
                return res.status(400).send('Invalid password');
            }

            const encryptedNewPassword = await bcrypt.hash(new_password, 10);

            user.password = encryptedNewPassword;

            await user.save();

            return res.status(200).send({});
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
}
