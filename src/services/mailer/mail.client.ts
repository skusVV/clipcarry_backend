import {
  EmailResponse,
  IMailInputData,
  ITransportConfig,
  TransportResponse,
} from './mail.interface';

import nodemailer from 'nodemailer';
import { IConfigs } from '../../config/config.interface';
import { configs } from '../../config';

export interface IMailClientProps {
  configs: IConfigs;
}

export interface IMailClient {
  send: (data: IMailInputData) => EmailResponse;
}

export class MailClient implements IMailClient {
  private transportConfig: ITransportConfig;

  constructor({ configs }: IMailClientProps) {
    this.transportConfig = {
      service: configs.nodemailer.service,
      auth: {
        user: configs.nodemailer.email,
        pass: configs.nodemailer.pass
      }
    };
  }

  public async send({
    from = configs.nodemailer.email,
    to = '',
    subject = '',
    html = '',
    text = '',
  }: IMailInputData): EmailResponse {
    try {
      const transport = await this.createSMTPTransport();
      const sentMailInfo = await transport.sendMail({ from, to, subject, html, text });

      return sentMailInfo;
    } catch (error) {
      console.log('Cannot send email: ', error);
      throw new Error('Cannot send email');
    }
  }

  private async createSMTPTransport(): TransportResponse {
    try {
      const transports = nodemailer.createTransport(this.transportConfig);
      await transports.verify();

      return transports;
    } catch (error) {
      console.log('Cannot create SMTP transport: ', error);
      throw new Error('Cannot create SMTP transport');
    }
  }

}