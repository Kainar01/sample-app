import { compile } from 'handlebars';
import { htmlToText } from 'html-to-text';

import {
  EmailOptions,
  EmailGenerator,
  TemplateVariables,
} from './email.interface';

export class HandlebarsEmailGenerator implements EmailGenerator {
  public generate(
    subject: string,
    body: string,
    templateVars: TemplateVariables,
  ): Pick<EmailOptions, 'html' | 'text' | 'subject'> {
    const compiledSubject = compile(subject)(templateVars);
    const compiledHtml = compile(body)(templateVars);
    const text = htmlToText(compiledHtml);

    return {
      subject: compiledSubject,
      html: compiledHtml,
      text,
    };
  }
}
