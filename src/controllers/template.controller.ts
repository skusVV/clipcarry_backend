import { Response, Request } from 'express';
import { Template } from '../models/template.model';
import { TemplateRecord } from '../models/template-record.model';

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
        // TODO should also remove all related records
        const { id } = req.params;

        await Template.deleteOne({ _id: id});

        return res.send();
    }

    async editTemplate(req: Request, res: Response): Promise<any> {
        // TODO should also edit all related records
        const { id } = req.params;

        const result = await Template.updateOne({ _id: id},this.getUpdatedFields(req.body)); // req.body not the best choise

        return res.send(result);
    }

    private getUpdatedFields(data:any): any {
        return {
            template_name: data.templateName,
            fields: data.fields.map((field: any) => ({name: field.name, fieldType: field.fieldType, xPath: field.xpath}))
        }
    }
}
