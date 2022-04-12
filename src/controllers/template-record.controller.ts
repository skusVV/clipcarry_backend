import { Response, Request } from 'express';
import { TemplateRecord } from '../models/template-record.model';

export class TemplateRecordController {

    async createRecord(req: Request, res: Response): Promise<any> {
        const { fields, template_id } = req.body;

        if (!template_id || !fields || !fields.length) {
        //     Throw an error
        }
        const record = new TemplateRecord({fields, template_id});

        await record.save()

        return res.send(record);
    }

    async getRecords(req: Request, res: Response): Promise<any> {
        return res.send({ok: 'get'});
    }

    async editRecord(req: Request, res: Response): Promise<any> {
        return res.send({ok: 'edit'});
    }

    async removeRecord(req: Request, res: Response): Promise<any> {
        return res.send({ok: 'remove'});
    }
}
