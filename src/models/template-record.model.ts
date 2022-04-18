import mongoose from 'mongoose';

interface TemplateRecordField {
    value: string;
    field_id: string;
    field_type: string;
}

interface TemplateRecordAttrs {
    template_id: string;
    fields: TemplateRecordField[];
    include_url: string;
    include_data: string;
}

export interface TemplateRecordDoc extends mongoose.Document{
    template_id: string;
    fields: TemplateRecordField[];
    include_url: string;
    include_data: string;
}

interface TemplateRecordModel extends mongoose.Model<TemplateRecordDoc> {
    build(attrs: TemplateRecordAttrs): TemplateRecordDoc;
}

const templateRecordSchema = new mongoose.Schema<TemplateRecordDoc>({
    template_id: String,
    fields: [{
        value: String,
        field_id: String,
        field_type: String
    }],
    include_url: String,
    include_data: String
}, {
    toJSON: {
        transform(doc, ret) {
            // To do for transformation
        },
        versionKey: false
    }
});

templateRecordSchema.statics.build = (attrs: TemplateRecordAttrs) => {
    return new TemplateRecord(attrs);
}

const TemplateRecord = mongoose.model<TemplateRecordDoc, TemplateRecordModel>('template-records', templateRecordSchema);

export { TemplateRecord };
