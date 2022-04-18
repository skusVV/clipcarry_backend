import { Response, Request } from 'express';
import { TemplateRecordController } from '../controllers/template-record.controller';
import { auth } from '../middleware/auth';

const templateRecordController = new TemplateRecordController();

export const templateRecordsRoutes = (app: any) => {
    app.post('/api/template-records', auth, (req: Request, res: Response) => {
        return templateRecordController.createRecord(req, res)
    });

    app.get('/api/template-records/:templateId', auth, (req: Request, res: Response) => {
        return templateRecordController.getRecords(req, res)
    });

    app.patch('/api/template-records/:id', auth, (req: Request, res: Response) => {
        return templateRecordController.editRecord(req, res)
    });

    app.delete('/api/template-records/:id', auth, (req: Request, res: Response) => {
        return templateRecordController.removeRecord(req, res)
    });

}
