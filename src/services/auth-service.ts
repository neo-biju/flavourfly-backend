import env from "@/config/env";
import { db } from "@/db";
import { sessions, users } from "@/db/schema/user";
import { verifyGoogleLogin } from "@/lib/verify-google";
import ApiError from "@/utils/api-error";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export class AuthService {
  async authenticateWithGoogle(
    credential: string,
    userAgent?: string,
    ipAddress?: string
  ) {
    try {
      const googleLoginResponse = await verifyGoogleLogin(credential);
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, googleLoginResponse.email))
        .limit(1);

      let user = existingUser[0];

      if (!user) {
        const [newUser] = await db
          .insert(users)
          .values({
            email: googleLoginResponse.email,
            name: googleLoginResponse.name,
            googleId: googleLoginResponse.sub,
            picture: googleLoginResponse.picture,
            firstName: googleLoginResponse.given_name,
            lastName: googleLoginResponse.family_name,
            emailVerified: googleLoginResponse.email_verified,
          })
          .returning();
        user = newUser;
      }

      const accessToken = jwt.sign(
        { email: user.email, name: user.name },
        env.JWT_SECRET,
        { expiresIn: "2d" }
      );
      const refreshToken = jwt.sign(
        { email: user.email, name: user.name },
        env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      const sessionId = uuidv4();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48);

      const [session] = await db
        .insert(sessions)
        .values({
          id: sessionId,
          userId: user.id,
          accessToken,
          refreshToken,
          expiresAt,
          userAgent,
          ipAddress,
          isValid: true,
        })
        .returning();

      return {
        user,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      };
    } catch (error: any) {
      throw new ApiError(error.message || "Authentication failed");
    }
  }

  static async authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Access token required" });
      return;
    }

    try {
      jwt.verify(token, env.JWT_SECRET) as { userId: number };

      const session = await db
        .select()
        .from(sessions)
        .where(eq(sessions.accessToken, token));

      if (!session[0] || !session[0].isValid) {
        res.status(401).json({ error: "Invalid session" });
        return;
      }

      await db
        .update(sessions)
        .set({ lastActive: new Date() })
        .where(eq(sessions.id, session[0].id));
      req.body.userId = session[0].userId;

      next();
    } catch (error) {
      res.status(403).json({ error: "Invalid token" });
      return;
    }
  }

  static async logout(accessToken: string) {
    await db
      .update(sessions)
      .set({ isValid: false })
      .where(eq(sessions.accessToken, accessToken));
  }
}
