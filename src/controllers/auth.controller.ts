import { Response, Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserRoles, UserDoc} from '../models/user.model';
import { generateRandomString } from '../utils';
import { Template } from '../models/template.model';
import { configs } from '../config';
import moment from 'moment';
import { PROMO_USER_SUB_ID } from '../constants';

export class AuthController {

    async login(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body;

            if (!(email && password)) {
                res.status(400).send("All input is required");
            }

            const user = await User.findOne({ email });

            if (user && (await bcrypt.compare(password, user.password))) {
                const token = jwt.sign(
                    { user_id: user._id, role: user.role },
                    configs.token.key,
                    {
                        expiresIn: configs.token.expTime,
                    }
                );

                user.token = token;

                return res.status(200).json({ token, userGuid: user._id, role: user.role });
            }
            res.status(400).send("Wrong password"); // A bit tricky, but it was Client requirement, so DILLIGAF
        } catch (err) {
            console.log(err);
        }

    }

    async register(req: Request, res: Response): Promise<any> {
        try {
            const { firstName, lastName, email, password, userGuid, promoCode } = req.body;

            if (!(email && password && firstName && lastName)) {
                res.status(400).send("All input is required");
            }

            const oldUser = await User.findOne({ email });

            if (oldUser) {
                return res.status(409).send("User Already Exist. Please Login");
            }

            const encryptedPassword = await bcrypt.hash(password, 10);

            let user = await User.findOne({ _id: userGuid });
            if (user) {
                user.firstName = firstName;
                user.lastName = lastName;
                user.email = email.toLowerCase();
                user.password = encryptedPassword;
                user.role = UserRoles.USER;
                user.registerData = new Date();

                await user.save();
            } else {
                user = new User({
                    firstName,
                    lastName,
                    email: email.toLowerCase(),
                    password: encryptedPassword,
                    role: UserRoles.USER,
                    registerData: new Date()
                });

                await user.save();

                await this.createSampleTemplate(user._id);
            }

            if (promoCode) {
                await this.applyPromoCode(user, promoCode);
            }

            // Create token
            const token = jwt.sign(
                { user_id: user._id, role: user.role },
                configs.token.key,
                {
                    expiresIn: configs.token.expTime,
                }
            );
            user.token = token;

            return res.status(201).json({ token, userGuid: user._id, role: user.role });
        } catch (err) {
            console.log(err);
        }
    }

    async registerAsGuest(req: Request, res: Response): Promise<any> {
        try {
            const { checkWord } = req.body;

            if (!checkWord || checkWord !== 'Clipcarry_check_symbol') {
                res.status(400).send("Can't register as guest");
            }

            const encryptedPassword = await bcrypt.hash(configs.guestUserPassword, 10);

            const user = await User.create({
                email: generateRandomString(),
                password: encryptedPassword,
                role: UserRoles.GUEST
            });

            // Create token
            const token = jwt.sign(
                { user_id: user._id, role: user.role },
                configs.token.key,
                {
                    expiresIn: configs.token.defaultExpTime,
                }
            );
            user.token = token;

            await this.createSampleTemplate(user._id);

            return res.status(201).json({ token, userGuid: user._id, role: user.role });
        } catch (err) {
            console.log(err);
        }
    }

    async createSampleTemplate(userId: any): Promise<void> {
        const sampleDrafts = await Template.find({ isSampleDraft: true }, {
            _id: 0,
            isSampleDraft: 0,
            __v: 0
        });

        if (sampleDrafts && sampleDrafts.length > 0) {
            for (const sample of sampleDrafts) {
                const template = new Template({
                    template_name: sample.template_name,
                    user_id: userId,
                    fields: sample.fields,
                    created_date: new Date().toLocaleDateString(),
                    icon: sample.icon,
                    primaryField: sample.primaryField,
                    secondaryField: sample.secondaryField,
                    entryLogo: sample.entryLogo,
                    isSample: true
                });

                await template.save();
            }
        }
    }

    async applyPromoCode(user: UserDoc, promoCode = '') {
        if (configs.registrationPromoCode && promoCode === configs.registrationPromoCode) {
            user.role = UserRoles.PAID_USER;
            user.paymentDate = new Date();
            user.paymentExpirationDate = moment().add(1, 'years').toDate();
            user.subscriptionId = PROMO_USER_SUB_ID;

            await user.save();
        }
    }

    async getUserRole(req: Request, res: Response): Promise<any> {
        try {
            const user = (req as any).user;

            return res.status(201).send({role: user.role});
        } catch (err) {
            console.log(err);
        }
    }

    async refreshUserToken(req: Request, res: Response): Promise<any> {
        try {
            const { user_id } = (req as any).user;

            const user = await User.findById(user_id);

            if (!user) {
                return res.status(404).send("Not found");
            }

            const token = jwt.sign(
                { user_id: user._id, role: user.role },
                configs.token.key,
                {
                    expiresIn: configs.token.defaultExpTime,
                }
            );
            user.token = token;

            res.status(200).send(user);
        } catch (err) {
            console.log(err);
        }
    }
}
