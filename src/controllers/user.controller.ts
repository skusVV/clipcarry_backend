import { Response, Request } from 'express';

export class UserController {

    async getUser(req: Request, res: Response): Promise<any> {
        try {
            const { email, firstName, lastName } = (req as any).user;

            return res.send({ email, firstName, lastName });
        } catch (err) {
            console.log(err);
        }

    }
}
