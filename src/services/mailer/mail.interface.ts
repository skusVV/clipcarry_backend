import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

// ------ Common types ------ //

export type EmailResponse = Promise<SMTPTransport.SentMessageInfo>;

export enum Templates {
  reset_password = 'reset_password',
}

export const templateSubjects: Map<string, string> = new Map([
  [ Templates.reset_password, 'Reset password' ],
]);

// ------- Mail Client types ------ //

export interface IMailInputData {
  from?: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}

// ------- Email templates input data types ------- //

export interface IResetPasswordEmailData {
  link: string;
}

export type EmailData = IResetPasswordEmailData;
