import type { Response } from "express";

export const handleError = (err: unknown, res: Response) => {
  if (err instanceof Error) res.status(500).json({ message: err.message });
  else res.status(500).json({ message: "Something went wrong" });
};

export const removeUndefinedKeys = <T extends object>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
};
