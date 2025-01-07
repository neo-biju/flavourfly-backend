import { AuthService } from "@/services/auth-service";
import express from "express";
import cartRoutes from "./cart";

const protectedRoutes = express.Router();

protectedRoutes.use(AuthService.authenticateToken);

protectedRoutes.use("/cart", cartRoutes);

export default protectedRoutes;
