import express, { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const router: Router = express.Router();

router.get("/notification-helath", (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).send("Notification service is healthy and ok");
});
