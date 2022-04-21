import { Response, Request } from 'express';
import { Template } from '../models/template.model';

export class TemplateController {

    async createTemplate(req: Request, res: Response): Promise<any> {
        const { templateName, includeDate, includeUrl, fields } = req.body;
        const template = new Template({
            template_name: templateName,
            include_date: includeDate,
            include_url: includeUrl,
            user_id: (req as any).user.user_id,
            fields });

        await template.save()

        return res.send(template);
    }

    async getUserTemplates(req: Request, res: Response): Promise<any> {
        const templates = await Template.find({user_id: (req as any).user.user_id});

        return res.send(templates || []);
    }

    async deleteTemplate(req: Request, res: Response): Promise<any> {
        // TODO should also remove all related records
        const { id } = req.params;

        await Template.deleteOne({ _id: id});

        return res.send();
    }
}
