import { Response, Request } from 'express';

export class TemplateController {

    async createTemplate(req: Request, res: Response): Promise<any> {
        return res.send({ createTemplate: 'ok' });
    }

    async getUserTemplates(req: Request, res: Response): Promise<any> {
        return res.send({ getUserTemplates: 'ok' });
    }
}
