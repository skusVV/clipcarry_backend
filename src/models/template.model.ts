import mongoose from 'mongoose';

interface TemplateField {
    name: string;
    fieldType: string;
    xpath: string;
}

interface TemplateAttrs {
    user_id: string;
    template_name: string;
    isSample: boolean;
    fields: TemplateField[];
    created_date: string;
}

export interface TemplateDoc extends mongoose.Document{
    user_id: string;
    template_name: string;
    isSample: boolean;
    fields: TemplateField[];
    created_date: string;
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
        xpath: String
    }],
    created_date: String,
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

export { Template };
