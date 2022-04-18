import { Response, Request } from 'express';
import { TemplateRecord } from '../models/template-record.model';

export class TemplateRecordController {

    async createRecord(req: Request, res: Response): Promise<any> {
        const { fields, template_id, include_url = '', include_data = '' } = req.body;

        if (!template_id || !fields || !fields.length) {
        //     Throw an error
            return  res.status(400).send('Something went wrong');
        }
        const record = new TemplateRecord({fields, template_id, include_url, include_data });

        await record.save()

        return res.send(record);
    }

    async getRecords(req: Request, res: Response): Promise<any> {
        const { templateId } = req.params;
        const result = await TemplateRecord.find({ template_id : templateId });

        return res.send(result || []);
    }

    async editRecord(req: Request, res: Response): Promise<any> {
        return res.send({ok: 'edit'});
    }

    async removeRecord(req: Request, res: Response): Promise<any> {
        return res.send({ok: 'remove'});
    }
}
