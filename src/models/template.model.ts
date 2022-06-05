import mongoose from 'mongoose';
import { SampleTemplates } from '../constants';

interface TemplateField {
    name: string;
    fieldType: string;
    xPath: string;
}

interface TemplateAttrs {
    user_id: string;
    template_name: string;
    isSample: boolean;
    fields: TemplateField[];
    created_date: string;
    icon: string;
    primaryField: string;
    secondaryField: string;
    entryLogo: string;
    shareCode: string;
    isSampleDraft: boolean;
}

export interface TemplateDoc extends mongoose.Document{
    user_id: string;
    template_name: string;
    isSample: boolean;
    fields: TemplateField[];
    created_date: string;
    icon: string;
    primaryField: string;
    secondaryField: string;
    entryLogo: string;
    shareCode: string;
    isSampleDraft: boolean;
}

interface TemplateModel extends mongoose.Model<TemplateDoc> {
    build(attrs: TemplateAttrs): TemplateDoc;
}

const templateSchema = new mongoose.Schema<TemplateDoc>({
    user_id: String,
    template_name: String,
    isSample: {
        type: Boolean,
        default: false
    },
    fields: [{
        name: String,
        fieldType: String,
        xPath: String
    }],
    created_date: String,
    icon: String,
    primaryField: String,
    secondaryField: String,
    entryLogo: String,
    shareCode: String,
    isSampleDraft: Boolean
}, {
    toJSON: {
        transform(doc, ret) {
            // To do for transformation
        },
        versionKey: false
    }
});

templateSchema.statics.build = (attrs: TemplateAttrs) => {
    return new Template(attrs);
}

const Template = mongoose.model<TemplateDoc, TemplateModel>('templates', templateSchema);

export const initSampleTemplates = async () => {
    const sampleDrafts = await Template.find({ isSampleDraft: true });

    if (!sampleDrafts || !sampleDrafts.length) {
        for (const template of SampleTemplates) {
            await Template.create(template);
        }
    }
};

export { Template };
