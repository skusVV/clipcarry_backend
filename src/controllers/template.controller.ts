import { Response, Request } from 'express';
import { Template } from '../models/template.model';
import { TemplateRecord } from '../models/template-record.model';
import { generateRandomString } from '../utils';

const SHARE_CODE_LENGTH = 8;

export class TemplateController {

    async createTemplate(req: Request, res: Response): Promise<any> {
        const { templateName, fields, icon } = req.body;
        const textFields = fields.filter((item: any) => item.fieldType !== 'Image');
        const imgFields = fields.filter((item: any) => item.fieldType === 'Image');
        const primaryField = textFields && textFields[0] && textFields[0].name; // Should be at least one field
        const secondaryField = textFields && textFields[1] && textFields[1].name || '';
        const entryLogo = imgFields && imgFields[0] && imgFields[0].name || '';
        const template = new Template({
            template_name: templateName,
            user_id: (req as any).user.user_id,
            fields,
            created_date: new Date().toLocaleDateString(),
            icon,
            primaryField,
            secondaryField,
            entryLogo
        });

        await template.save()

        return res.send(template);
    }

    async getUserTemplates(req: Request, res: Response): Promise<any> {
        const templates = await Template.find({user_id: (req as any).user.user_id});

        return res.send(templates || []);
    }

    async getUserTemplateWithRecords(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const template = await Template.findOne({ _id: id });
        const records = await TemplateRecord.find({ template_id: id });

        return res.send({...(template as any)._doc, records});
    }

    async deleteTemplate(req: Request, res: Response): Promise<any> {
        const { id } = req.params;

        await Template.deleteOne({ _id: id});

        await TemplateRecord.deleteMany({ template_id: id });

        return res.send();
    }

    async editTemplate(req: Request, res: Response): Promise<any> {
        // TODO should also edit all related records
        const { id } = req.params;

        const result = await Template.updateOne({ _id: id }, this.getUpdatedFields(req.body)); // req.body not the best choise

        return res.send(result);
    }

    async getTemplateShareCode(req: Request, res: Response): Promise<any> {
        const { id } = req.params;

        const template = await Template.findOne({ _id: id });

        if (template && !template.shareCode) {
            template.shareCode = generateRandomString(SHARE_CODE_LENGTH, true);
            await template.save();
        }

        return res.send(template);
    }

    async importTemplateByShareCode(req: Request, res: Response): Promise<any> {
        const { shareCode } = req.body;

        if (!shareCode) {
            return  res.status(400).send('Share code must be provided');
        }

        if (shareCode.length < SHARE_CODE_LENGTH) {
            return  res.status(400).send('Please enter the correct code');
        }

        const template = await Template.findOne({ shareCode });

        if (!template) {
            return  res.status(400).send('Please enter the correct code');
        }

        const newTemplate = new Template({
            template_name: template.template_name,
            user_id: (req as any).user.user_id,
            fields: template.fields,
            created_date: new Date().toLocaleDateString(),
            icon: template.icon,
            primaryField: template.primaryField,
            secondaryField: template.secondaryField,
            entryLogo: template.entryLogo
        });

        await newTemplate.save();

        return res.status(200).send(newTemplate);
    }

    private getUpdatedFields(data: any): any {
        return {
            ...data, // not the best approach, but for now, should be fine
            template_name: data.templateName,
            fields: data.fields.map((field: any) => ({name: field.name, fieldType: field.fieldType, xPath: field.xPath}))
        }
    }
}
