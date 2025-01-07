import { AuthService } from "@/services/auth-service";
import express from "express";

const protectedRoutes = express.Router();

protectedRoutes.use(AuthService.authenticateToken);

protectedRoutes.use("/protected", (req, res) => {
  res.send("Protected route accessed");
});

export default protectedRoutes;
