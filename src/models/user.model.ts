import mongoose from 'mongoose';

interface UserAttrs {
    email: string;
    password: string;
    token: string;
    isGuest: boolean;
    isPaid: boolean;
    registerData: string;
    paidDate: string;
}

export interface UserDoc extends mongoose.Document{
    email: string;
    password: string;
    token: string;
    isGuest: boolean;
    isPaid: boolean;
    registerData: string;
    paidDate: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema<UserDoc>({
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
    isGuest: {
        type: Boolean
    },
    isPaid: {
        type: Boolean
    },
    registerData: String,
    paidDate: String
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
