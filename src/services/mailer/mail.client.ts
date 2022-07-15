import {
  EmailResponse,
  IMailInputData
} from './mail.interface';

import { IConfigs } from '../../config/config.interface';
import { configs } from '../../config';
const sgMail = require('@sendgrid/mail')

export interface IMailClientProps {
  configs: IConfigs;
}

export interface IMailClient {
  send: (data: IMailInputData) => EmailResponse;
}

export class MailClient implements IMailClient {

  constructor({ configs }: IMailClientProps) {
    sgMail.setApiKey(configs.sendgrid.secret);
  }

  public async send({
    from = configs.sendgrid.email,
    to = '',
    subject = '',
    html = '',
    text = '',
  }: IMailInputData): EmailResponse {
    try {
      const sentMailInfo = await sgMail.send({ from, to, subject, html, text });

      return sentMailInfo;
    } catch (error) {
      console.log('Cannot send email: ', error);
      throw new Error('Cannot send email');
    }
  }

}