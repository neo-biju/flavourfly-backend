import express from "express";
import publicRoutes from "./public";

const routes = express.Router();

routes.use(publicRoutes);
routes.use(publicRoutes);

export default routes;
