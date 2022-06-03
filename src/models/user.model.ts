import mongoose from 'mongoose';

interface UserAttrs {
    email: string;
    password: string;
    token: string;
    registerData: string;
    paidDate: string;
    firstName: string;
    lastName: string;
    role: UserRoles;
}

export interface UserDoc extends mongoose.Document{
    email: string;
    password: string;
    token: string;
    registerData: string;
    paidDate: string;
    firstName: string;
    lastName: string;
    role: UserRoles;
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

export enum UserRoles {
    GUEST = 'guest',
    USER = 'user',
    PAID_USER = 'paid_user'
}

const userSchema = new mongoose.Schema<UserDoc>({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
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
    role: {
        type: String,
        enum: UserRoles
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
