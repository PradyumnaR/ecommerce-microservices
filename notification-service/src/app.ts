import { Logger } from "winston";
import { winstonLogger } from "@pradyumnar/ecommerce-shared-package";
import { config } from "@notifications/config";
import express, { Express } from "express";
import { start } from "@notifications/server";

const log: Logger = winstonLogger(
  `${config.ELASIC_SEARCH_URL}`,
  "notificationService app",
  "debug"
);

function init(): void {
  const app: Express = express();
  start(app);
  log.info("Notification service initialized");
}

init();
