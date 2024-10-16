import { Client } from "@elastic/elasticsearch";
import { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types";
import { config } from "@notifications/config";
import { winstonLogger } from "@pradyumnar/ecommerce-shared-package";
import { error, Logger } from "winston";

const log: Logger = winstonLogger(
  `${config.ELASIC_SEARCH_URL}`,
  "notificationElasticSearchServer",
  "debug"
);

const elasticSearchClient = new Client({
  node: `${config.ELASIC_SEARCH_URL}`,
});

export async function checkConnection(): Promise<void> {
  let isConnected = false;

  while (!isConnected) {
    try {
      const health: ClusterHealthResponse =
        await elasticSearchClient.cluster.health({});

      log.info(
        `NotificationService Elasticsearch health status - ${health.status}`
      );

      isConnected = true;
    } catch {
      log.error("Connection to ElasticSearch failed. Retrying...");
      log.log("error", "NotificationService checkConnection() method:", error);
    }
  }
}
