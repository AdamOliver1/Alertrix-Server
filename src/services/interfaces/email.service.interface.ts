import { EmailOptions } from "../email.service";

export interface IEmailService {
    sendEmail(options: EmailOptions): Promise<void>;
}