import mongoose from 'mongoose';

interface UserAttrs {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    token: string;
}

export interface UserDoc extends mongoose.Document{
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    token: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema<UserDoc>({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    token: {
        type: String
    },
}, {
    toJSON: {
        transform(doc, ret) {
            // To do for transformation
        },
        versionKey: false
    }
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('users', userSchema);

export { User };
