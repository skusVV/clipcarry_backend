import { Response, Request } from 'express';
import { TemplateController } from '../controllers/template.controller';
import { auth } from '../middleware/auth';

const templateController = new TemplateController();

export const templateRoutes = (app: any) => {
    app.get('/api/templates', auth, (req: Request, res: Response) => {
        return templateController.getUserTemplates(req, res)
    });

    app.get('/api/templates/:id', auth, (req: Request, res: Response) => {
        return templateController.getUserTemplateWithRecords(req, res)
    });

    app.post('/api/templates', auth, (req: Request, res: Response) => {
        return templateController.createTemplate(req, res)
    });

    app.delete('/api/templates/:id', auth, (req: Request, res: Response) => {
        return templateController.deleteTemplate(req, res)
    });

    app.patch('/api/templates/:id', auth, (req: Request, res: Response) => {
        return templateController.editTemplate(req, res)
    });

}
