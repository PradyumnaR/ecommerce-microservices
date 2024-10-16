import { winstonLogger } from "@pradyumnar/ecommerce-shared-package";
import "express-async-errors";
import { Logger } from "winston";
import { config } from "@notifications/config";
import { Application } from "express";
import http from "http";
import { router } from "@notifications/routes";
import { checkConnection } from "@notifications/elasticsearch";
import { createConnection } from "@notifications/queues/connection";
import { Channel } from "amqplib";
import {
  consumeAuthEmailMessages,
  consumeOrderEmailMessages,
} from "@notifications/queues/email.consumer";

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(
  `${config.ELASIC_SEARCH_URL}`,
  "notificationServer",
  "debug"
);

export function start(app: Application): void {
  startServer(app);
  app.use(router);

  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {
  const emailChannel: Channel = (await createConnection()) as Channel;
  await consumeAuthEmailMessages(emailChannel);
  await consumeOrderEmailMessages(emailChannel);
}

function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(
      `Worker with process id of ${process.pid} on notification server has started `
    );

    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`);
    });

    process.on("SIGINT", () => {
      console.log("SIGINT signal received: closing server gracefully");

      httpServer.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  } catch (err) {
    log.log("error", "NotificationService  startServer() method:", err);
  }
}
