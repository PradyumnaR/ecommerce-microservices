import { Logger } from "winston";
import {
  EmailLocalsType,
  winstonLogger,
} from "@pradyumnar/ecommerce-shared-package";
import { config } from "@notifications/config";
import nodemailer, { Transporter } from "nodemailer";
import Email from "email-templates";
import path from "path";

const log: Logger = winstonLogger(
  `${config.ELASIC_SEARCH_URL}`,
  "mailTransportHelper",
  "debug"
);

export async function emailTemplates(
  template: string,
  receiver: string,
  locals: EmailLocalsType
): Promise<void> {
  try {
    const smtpTransport: Transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD,
      },
    });

    const email: Email = new Email({
      message: {
        from: `Job App <${config.SENDER_EMAIL}>`,
      },
      send: true,
      preview: false,
      transport: smtpTransport,
      views: {
        options: {
          extension: "ejs",
        },
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, "../build"),
        },
      },
    });

    await email.send({
      template: path.join(__dirname, "..", "src/emails", template),
      message: {
        to: receiver,
      },
      locals,
    });
  } catch (error) {
    log.error(error);
  }
}
