import { Response, Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

const TOKEN_KEY = 'here_is_my_token';

export class AuthController {

    async login(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body;

            // Validate user input
            if (!(email && password)) {
                res.status(400).send("All input is required");
            }
            // Validate if user exist in our database
            const user = await User.findOne({ email });

            if (user && (await bcrypt.compare(password, user.password))) {
                // Create token
                const token = jwt.sign(
                    { user_id: user._id, email },
                    TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );

                // save user token
                user.token = token;

                // user
                res.status(200).json(user);
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

            //Encrypt user password
            const encryptedPassword = await bcrypt.hash(password, 10);

            // Create user in our database
            const user = await User.create({
                first_name,
                last_name,
                email: email.toLowerCase(), // sanitize: convert email to lowercase
                password: encryptedPassword,
            });

            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            // save user token
            user.token = token;

            // return new user
            res.status(201).json(user);
        } catch (err) {
            console.log(err);
        }
    }
}
