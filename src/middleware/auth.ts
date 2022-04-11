import { Response, Request, NextFunction } from 'express';
const jwt = require("jsonwebtoken");
import { TOKEN_KEY } from '../constants';

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, TOKEN_KEY);
        (req as any).user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};
