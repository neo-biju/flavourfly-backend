import express from "express";
import authRouter from "./authentication";

const publicRoutes = express.Router();

publicRoutes.use("/auth", authRouter);

export default publicRoutes;
