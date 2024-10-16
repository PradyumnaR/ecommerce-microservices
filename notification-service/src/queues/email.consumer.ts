import { Channel, ConsumeMessage } from "amqplib";
import { Logger } from "winston";
import {
  EmailLocalsType,
  winstonLogger,
} from "@pradyumnar/ecommerce-shared-package";
import { config } from "@notifications/config";
import { createConnection } from "@notifications/queues/connection";
import { sendEmail } from "@notifications/queues/mail.transport";

const emailNotificationExchangeName = "ex-email-notification";
const authEmailRoutingKey = "rk-auth-email";
const authEmailqueueName = "q-auth-email";

const orderEmailRoutingKey = "rk-order-email";
const orderEmailQueueName = "q-order-email";

const log: Logger = winstonLogger(
  `${config.ELASIC_SEARCH_URL}`,
  "emailConsumer",
  "debug"
);

export async function consumeAuthEmailMessages(
  channel: Channel
): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }

    await channel.assertExchange(emailNotificationExchangeName, "direct");
    const { queue } = await channel.assertQueue(authEmailqueueName, {
      durable: true,
      autoDelete: false,
    });

    await channel.bindQueue(
      queue,
      emailNotificationExchangeName,
      authEmailRoutingKey
    );

    channel.consume(queue, async (msg: ConsumeMessage | null) => {
      const { receiverEmail, username, verifyLink, resetLink, template } =
        JSON.parse(msg!.content.toString());

      const locals: EmailLocalsType = {
        appLink: `${config.CLIENT_URI}`,
        appIcon: "",
        username,
        verifyLink,
        resetLink,
      };

      await sendEmail(template, receiverEmail, locals);
      channel.ack(msg!);
    });
  } catch (error) {
    log.error(
      "NotificationService consumeAuthEmailMessage() method error:",
      error
    );
  }
}

export async function consumeOrderEmailMessages(
  channel: Channel
): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }

    await channel.assertExchange(emailNotificationExchangeName, "direct");
    const { queue } = await channel.assertQueue(orderEmailQueueName, {
      durable: true,
      autoDelete: false,
    });

    await channel.bindQueue(
      queue,
      emailNotificationExchangeName,
      orderEmailRoutingKey
    );

    channel.consume(queue, async (msg: ConsumeMessage | null) => {
      const {
        receiverEmail,
        username,
        template,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total,
      } = JSON.parse(msg!.content.toString());
      const locals: EmailLocalsType = {
        appLink: `${config.CLIENT_URI}`,
        appIcon: "https://i.ibb.co/Kyp2m0t/cover.png",
        username,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total,
      };

      if (template == "orderPlaced") {
        await sendEmail("orderPlaced", receiverEmail, locals);
        await sendEmail("orderReceipt", receiverEmail, locals);
      } else {
        await sendEmail(template, receiverEmail, locals);
      }

      channel.ack(msg!);
    });
  } catch (error) {
    log.error(
      "NotificationService consumeOrderEmailMessage() method error:",
      error
    );
  }
}
