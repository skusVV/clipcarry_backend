import mongoose from 'mongoose';

interface TemplateRecordField {
    value: string;
    field_id: string;
    fieldType: string;
    name: string;
}

interface TemplateRecordAttrs {
    template_id: string;
    fields: TemplateRecordField[];
    createdDate: Date;
    profileUrl: string;
}

export interface TemplateRecordDoc extends mongoose.Document{
    template_id: string;
    fields: TemplateRecordField[];
    createdDate: Date;
    profileUrl: string;
}

interface TemplateRecordModel extends mongoose.Model<TemplateRecordDoc> {
    build(attrs: TemplateRecordAttrs): TemplateRecordDoc;
}

const templateRecordSchema = new mongoose.Schema<TemplateRecordDoc>({
    template_id: String,
    fields: [{
        value: String,
        field_id: String,
        fieldType: String,
        name: String
    }],
    profileUrl: String,
    createdDate: {
        type: Date,
        default: new Date()
    }
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
