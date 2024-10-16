import client, { Channel, Connection } from "amqplib";
import { Logger } from "winston";
import { winstonLogger } from "@pradyumnar/ecommerce-shared-package";
import { config } from "@notifications/config";

const log: Logger = winstonLogger(
  `${config.ELASIC_SEARCH_URL}`,
  "notificationQueueConnection",
  "debug"
);

export async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(
      `${config.RABBITMQ_ENDPOINT}`
    );
    const channel: Channel = await connection.createChannel();
    log.info("NotificatioService server connected to queue successfully...");
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.error("NotificationService createConnection() method:", error);
    return undefined;
  }
}

function closeConnection(channel: Channel, connection: Connection) {
  process.on("SIGINT", async () => {
    await channel.close();
    await connection.close();
  });
}
