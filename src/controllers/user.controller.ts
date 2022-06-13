import { Response, Request } from 'express';

export class UserController {

    async getUser(req: Request, res: Response): Promise<any> {
        try {
            const { email, firstName, lastName, role, user_id } = (req as any).user;

            return res.send({ email, firstName, lastName, role, userGuid: user_id });
        } catch (err) {
            console.log(err);
        }

    }
}
