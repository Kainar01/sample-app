export interface SendEmailOptions {
  template: string;
  email: string;
  context: Record<string, unknown>;
}

export interface SMTPOptions {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
}

export interface EmailSender {
  sendEmail();
}
