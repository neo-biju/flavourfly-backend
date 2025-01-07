import express from "express";
import publicRoutes from "./public";
import protectedRoutes from "./protected";

const routes = express.Router();

routes.use(publicRoutes);
routes.use(protectedRoutes);

export default routes;
