import mongoose from 'mongoose';

interface UserAttrs {
    email: string;
    password: string;
    token: string;
    registerData: Date;
    paymentDate: Date;
    paymentExpirationDate: Date;
    firstName: string;
    lastName: string;
    role: UserRoles;
    customerId: string;
    subscriptionId: string;
    createdDate: Date;
}

export interface UserDoc extends mongoose.Document{
    email: string;
    password: string;
    token: string;
    registerData: Date;
    paymentDate: Date;
    paymentExpirationDate: Date;
    firstName: string;
    lastName: string;
    role: UserRoles;
    customerId: string;
    subscriptionId: string;
    createdDate: Date;
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
    createdDate: {
        type: Date,
        default: new Date()
    },
    customerId: String,
    subscriptionId: String,
    registerData: Date,
    paymentDate: Date,
    paymentExpirationDate: Date
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
