import "module-alias/register";
import express from "express";
import { errorHandler } from "@/middleware/error-handler";
import env from "@/config/env";
import routes from "@/routes";

const app = express();
const baseURL = "/api/v1";

app.use(express.json());

app.use(baseURL, routes);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});
