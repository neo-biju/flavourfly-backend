import express, { NextFunction, Request, Response } from "express";
import validateRequest from "@/utils/validate-request";
import { googleValidation } from "@/validation/authentication";
import { verifyGoogleLogin } from "@/lib/verify-google";

const authRouter = express.Router();

authRouter.post(
  "/google",
  validateRequest(googleValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const googleLoginResponse = await verifyGoogleLogin(req.body.accessToken);
      console.log(googleLoginResponse);
      res.json({ message: "login with google completed" });
    } catch (error) {
      next(error);
    }
  }
);

export default authRouter;
