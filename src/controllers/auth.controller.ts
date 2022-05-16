import { Response, Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { TOKEN_KEY, EXPIRATION_TIME, DEFAULT_USER_EXPIRATION_TIME } from '../constants';
import { generateRandomString } from '../utils';

const GUEST_USER_PASSWORD = 'jhtu*4hns';

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
                    { user_id: user._id, email },
                    TOKEN_KEY,
                    {
                        expiresIn: EXPIRATION_TIME,
                    }
                );

                user.token = token;

                return res.status(200).json(user);
            }
            res.status(400).send("Invalid Credentials");
        } catch (err) {
            console.log(err);
        }

    }

    async register(req: Request, res: Response): Promise<any> {
        try {
            const { first_name, last_name, email, password } = req.body;

            if (!(email && password && first_name && last_name)) {
                res.status(400).send("All input is required");
            }

            const oldUser = await User.findOne({ email });

            if (oldUser) {
                return res.status(409).send("User Already Exist. Please Login");
            }

            const encryptedPassword = await bcrypt.hash(password, 10);

            // const user = await User.create({
            //     first_name,
            //     last_name,
            //     email: email.toLowerCase(),
            //     password: encryptedPassword,
            // });
            //
            // // Create token
            // const token = jwt.sign(
            //     { user_id: user._id, email, firstName: user.first_name, lastName: user.last_name },
            //     TOKEN_KEY,
            //     {
            //         expiresIn: EXPIRATION_TIME,
            //     }
            // );
            // user.token = token;

            return res.status(201).json({});
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

            const encryptedPassword = await bcrypt.hash(GUEST_USER_PASSWORD, 10);

            const user = await User.create({
                email: generateRandomString(),
                password: encryptedPassword,
                isGuest: true,
                isPaid: false
            });

            // Create token
            const token = jwt.sign(
                { user_id: user._id, isGuest: true, isPaid: false },
                TOKEN_KEY,
                {
                    expiresIn: DEFAULT_USER_EXPIRATION_TIME,
                }
            );
            user.token = token;

            return res.status(201).json({ token, userGuid: user._id });
        } catch (err) {
            console.log(err);
        }
    }
}
