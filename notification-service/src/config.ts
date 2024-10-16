import dotenv from "dotenv";

dotenv.config();

class Config {
  public NODE_ENV: string | undefined;
  public CLIENT_URI: string | undefined;
  public SENDER_EMAIL: string | undefined;
  public SENDER_EMAIL_PASSWORD: string | undefined;
  public RABBITMQ_ENDPOINT: string | undefined;
  public ELASIC_SEARCH_URL: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || "";
    this.CLIENT_URI = process.env.CLIENT_URI || "";
    this.SENDER_EMAIL = process.env.SENDER_EMAIL || "";
    this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || "";
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || "";
    this.ELASIC_SEARCH_URL = process.env.ELASIC_SEARCH_URL || "";
  }
}

export const config: Config = new Config();
