import { Response, Request } from 'express';
import { TemplateController } from '../controllers/template.controller';
import { auth } from '../middleware/auth';

const templateController = new TemplateController();

export const templateRoutes = (app: any) => {
    app.get('/api/templates', auth, (req: Request, res: Response) => {
        return templateController.getUserTemplates(req, res)
    });

    app.post('/api/templates', auth, (req: Request, res: Response) => {
        return templateController.createTemplate(req, res)
    });
}
