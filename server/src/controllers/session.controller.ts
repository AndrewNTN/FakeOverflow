import type { Request, Response } from "express";
import UserSchema from "../schema/user.schema";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { handleError } from "../utils";
import { AuthRequest } from "../../types/express";

/**
 * Despite the use of the word "session" this controller uses JWT for authentication
 * POST /api/session
 */
export const createSession = async (
  req: Request<
    NonNullable<unknown>,
    NonNullable<unknown>,
    { email: string; password: string }
  >,
  res: Response,
) => {
  const { email, password } = req.body;
  try {
    const user = await UserSchema.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = await new SignJWT({ userId: user._id })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(new TextEncoder().encode(process.env.DEV_SECRET));

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ message: "Login Successful" });
  } catch (err) {
    handleError(err, res);
  }
};

export const getSession = async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserSchema.findById(req.userId, { password: 0 });
    res.status(200).json(user);
  } catch (err) {
    handleError(err, res);
  }
};

export const deleteSession = async (_req: AuthRequest, res: Response) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.json({ message: "Logout successful" });
};
