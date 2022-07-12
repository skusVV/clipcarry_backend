import {
  EmailData,
  EmailResponse,
  IResetPasswordEmailData,
  Templates,
  templateSubjects,
} from './mail.interface';

import Email from 'email-templates';
import { IMailClient } from './mail.client';
import path from 'path';

export interface IMailServiceProps {
  MailClient: IMailClient
}

export interface IMailService {
  sendResetPasswordEmail: (email: string, data: IResetPasswordEmailData) => EmailResponse;
}

export class MailService implements IMailService {
  private MailClient: IMailClient;

  constructor({ MailClient }: IMailServiceProps) {
    this.MailClient = MailClient;
  }

  public async sendResetPasswordEmail(email: string, data: IResetPasswordEmailData): EmailResponse {
    return this.sendEmail(Templates.reset_password, email, data);
  }

  private async sendEmail(template: Templates, email: string, data: EmailData): EmailResponse {
    const subject = templateSubjects.get(template) || '';
    const [resultTxt, resultHtml] = await this.generateTemplate(template, data);

    return this.MailClient.send({
      to: email,
      subject,
      html: resultHtml,
      text: resultTxt,
    });
  }

  private async generateTemplate(template: Templates, data: EmailData): Promise<[string, string]> {
    const templatesDir = path.join(__dirname, '/templates');
    const newsletter = new Email({ views: { options: { extension: 'ejs' }, root: path.join(templatesDir) } });

    return Promise.all([
      newsletter.render(template + '/text', data),
      newsletter.render(template + '/html', data),
    ]);
  }

}
