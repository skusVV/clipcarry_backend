import { Response, Request } from 'express';
import { TemplateRecord } from '../models/template-record.model';

export class TemplateRecordController {

    async createRecord(req: Request, res: Response): Promise<any> {
        const { fields, template_id, profileUrl } = req.body;

        if (!template_id || !fields || !fields.length) {
        //     Throw an error
            return  res.status(400).send('Something went wrong');
        }
        const record = new TemplateRecord({ fields, template_id, profileUrl, createdDate: new Date() });

        await record.save();

        return res.send(record);
    }

    async getRecords(req: Request, res: Response): Promise<any> {
        const { templateId } = req.params;
        const result = await TemplateRecord.find({ template_id : templateId });

        return res.send(result || []);
    }

    async editRecord(req: Request, res: Response): Promise<any> {
        const { fields } = req.body;
        const { id } = req.params;

        await TemplateRecord.updateOne({_id: id}, { fields });

        return res.send({ok: 'Edited'});
    }

    async removeRecord(req: Request, res: Response): Promise<any> {
        const { id } = req.params;

        await TemplateRecord.deleteOne({ _id: id });

        return res.send({ok: 'removed'});
    }
}
