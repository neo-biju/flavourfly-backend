import express, { NextFunction, Request, Response } from "express";
import validateRequest from "@/utils/validate-request";
import { googleValidation } from "@/validation/authentication";
import { verifyGoogleLogin } from "@/lib/verify-google";
import { AuthService } from "@/services/auth-service";

const authRouter = express.Router();

authRouter.post(
  "/google",
  validateRequest(googleValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authService = new AuthService();
      const result = await authService.authenticateWithGoogle(
        req.body.accessToken,
        req.headers["user-agent"],
        req.ip
      );
      if (result) {
        res.json(result);
        return
      }
      res.notFound('User not found');
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      await AuthService.logout(token);
    }
    res.json({ message: "Logged out successfully" });
  }
);

export default authRouter;
