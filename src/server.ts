import "module-alias/register";
import express, { ErrorRequestHandler } from "express";
import { rateLimit } from "express-rate-limit";

import env from "@/config/env";
import routes from "@/routes";

import { errorHandler } from "@/middleware/error-handler";
import { responseEnhancer } from "@/middleware/response-handler";
import { notFoundHandler } from "@/middleware/not-found";

const app = express();
const baseURL = "/api/v1";

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  })
);

app.use(express.json());

app.use(responseEnhancer);

app.use(baseURL, routes);

app.use(errorHandler as ErrorRequestHandler);

app.use(notFoundHandler);

app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});
