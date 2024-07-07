import { Response, NextFunction } from "express";
import { jwtVerify } from "jose";
import { UserIdJWTPayload } from "../../types/jose";
import { AuthRequest } from "../../types/express";

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.DEV_SECRET),
    );
    req.userId = (<UserIdJWTPayload>payload).userId;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
