import { config } from "@notifications/config";
import { emailTemplates } from "@notifications/helpers";
import {
  winstonLogger,
  EmailLocalsType,
} from "@pradyumnar/ecommerce-shared-package";
import { Logger } from "winston";

const log: Logger = winstonLogger(
  `${config.ELASIC_SEARCH_URL}`,
  "mailTransport",
  "debug"
);

export async function sendEmail(
  template: string,
  receiverEmail: string,
  locals: EmailLocalsType
): Promise<void> {
  try {
    await emailTemplates(template, receiverEmail, locals);
    log.info("Email sent successfully");
  } catch (error) {
    log.error(
      "NotificationService MailTransport sendEmail() method error:",
      error
    );
  }
}
