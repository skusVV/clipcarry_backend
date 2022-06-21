import { Response, Request, NextFunction } from 'express';
import { configs } from '../config';
const jwt = require("jsonwebtoken");

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, configs.token.key);
        (req as any).user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};
