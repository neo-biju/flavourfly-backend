import env from "@/config/env";
import { db } from "@/db";
import { sessions } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    jwt.verify(token, env.JWT_SECRET) as { userId: number };

    // Check if session exists and is valid
    const session = await db
      .select()
      .from(sessions)
      .where(eq(sessions.accessToken, token));

    if (!session[0] || !session[0].isValid) {
      return res.status(401).json({ error: "Invalid session" });
    }

    // Update last active timestamp
    await db
      .update(sessions)
      .set({ lastActive: new Date() })
      .where(eq(sessions.id, session[0].id));

    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
