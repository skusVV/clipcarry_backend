import mongoose from 'mongoose';

interface TemplateField {
    label: string;
    fieldType: string;
    xpath: string;
}

interface TemplateAttrs {
    user_id: string;
    template_name: string;
    include_date: boolean;
    include_url: boolean;
    isSample: boolean;
    fields: TemplateField[];
}

export interface TemplateDoc extends mongoose.Document{
    user_id: string;
    template_name: string;
    include_date: boolean;
    include_url: boolean;
    isSample: boolean;
    fields: TemplateField[];
}

interface TemplateModel extends mongoose.Model<TemplateDoc> {
    build(attrs: TemplateAttrs): TemplateDoc;
}

const templateSchema = new mongoose.Schema<TemplateDoc>({
    user_id: String,
    template_name: String,
    include_date: Boolean,
    include_url: Boolean,
    isSample: {
        type: Boolean,
        default: false
    },
    fields: [{
        label: String,
        fieldType: String,
        xpath: String
    }]
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
