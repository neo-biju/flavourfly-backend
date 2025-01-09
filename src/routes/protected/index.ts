import { AuthService } from "@/services/auth-service";
import express from "express";
import cartRoutes from "./cart";
import addressRoute from "./address";

const protectedRoutes = express.Router();

protectedRoutes.use(AuthService.authenticateToken);

protectedRoutes.use("/cart", cartRoutes);

protectedRoutes.use("/address", addressRoute);


export default protectedRoutes;
