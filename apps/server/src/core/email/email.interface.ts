export type TemplateVariables = Record<string, any>;

export interface EmailModuleOptions {
  transportOptions: TransportOptions;
}

export type DefaultEmailOptions = Pick<
  Partial<EmailOptions>,
  'replyTo' | 'from'
>;

export type TransportOptions =
  | SMTPOptions
  | SendmailTransportOptions
  | NoopTransportOptions
  | FileTransportOptions;

export interface EmailOptions {
  from?: string;
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  attachments?: EmailAttachment[];
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string | string[];
}

export interface SendEmailOptions extends Omit<EmailOptions, 'html' | 'text'> {
  template: string;
  templateVars: TemplateVariables;
}

export interface EmailSender {
  sendEmail(
    email: EmailOptions,
    transportOptions: TransportOptions,
  ): Promise<void>;
}

export interface EmailGenerator {
  generate(
    subject: string,
    body: string,
    templateVars: TemplateVariables,
  ): Pick<EmailOptions, 'html' | 'text' | 'subject'>;
}

export interface EmailAttachment {
  name: string;
  content: Buffer;
}

/**
 * @description
 * Uses the local Sendmail program to send the email.
 *
 * @docsCategory EmailPlugin
 * @docsPage Transport Options
 */
export interface SendmailTransportOptions extends DefaultEmailOptions {
  type: 'sendmail';
  /** path to the sendmail command (defaults to ‘sendmail’) */
  path?: string;
  /** either ‘windows’ or ‘unix’ (default). Forces all newlines in the output to either use Windows syntax <CR><LF> or Unix syntax <LF> */
  newline?: string;
}

/**
 * @description
 * Outputs the email as an HTML file for development purposes.
 *
 * @docsCategory EmailModule
 * @docsPage Transport Options
 */
export interface FileTransportOptions extends DefaultEmailOptions {
  type: 'file';
  /** The directory in which the emails will be saved */
  outputPath: string;
  /** When set to true, a raw text file will be output rather than an HTML file */
  raw?: boolean;
}

/**
 * @description
 * Does nothing with the generated email. Intended for use in testing where we don't care about the email transport,
 * or when using a custom {@link EmailSender} which does not require transport options.
 *
 * @docsCategory EmailModule
 * @docsPage Transport Options
 */
export interface NoopTransportOptions extends DefaultEmailOptions {
  type: 'none';
}

/**
 * @description
 * SMTP transport options
 *
 * @docsCategory EmailModule
 * @docsPage Transport Options
 */
export interface SMTPOptions extends DefaultEmailOptions {
  type: 'smtp';
  /** the hostname or IP address to connect to */
  host: string;
  /** the port to connect to */
  port: number;
  /** defines if the connection should use SSL (if true) or not (if false) */
  secure: boolean;
  /** authentication username */
  username: string;
  /** authentication password */
  password: string;
}
