import "module-alias/register";
import express, { NextFunction, Request, Response } from "express";
import authRouter from "@/routes/authentication";
import { errorHandler } from "@/middleware/error-handler";
import env from "@/config/env";

const app = express();
const baseURL = "/api/v1";

app.use(express.json());

app.use(`${baseURL}/auth`, authRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});
