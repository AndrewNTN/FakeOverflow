import UserSchema from "../schema/user.schema";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { handleError } from "../utils";
import { AuthRequest } from "../../types/express";
import { isSelfOrStaff } from "../utils/auth";
import TagSchema from "../schema/tag.schema";
import QuestionSchema from "../schema/question.schema";
import AnswerSchema from "../schema/answer.schema";
import CommentSchema from "../schema/comment.schema";
import { findOrphanTags } from "../utils/tag";

// GET /api/users/
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await UserSchema.find({}, { password: 0 });
    res.json(users);
  } catch (err) {
    handleError(err, res);
  }
};

// GET /api/users/:id
export const getUser = async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  try {
    const user = await UserSchema.findById(id, { password: 0 });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    handleError(err, res);
  }
};

// GET /api/users/:id/questions
export const getQuestionsOfUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const id = req.params.id;
  try {
    const questions = await QuestionSchema.find({ author: id })
      .populate("comments")
      .sort({ creationTime: -1 });
    res.json(questions);
  } catch (err) {
    handleError(err, res);
  }
};

// GET /api/users/:id/questions/answered
export const getQuestionsAnsweredOfUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const id = req.params.id;

  try {
    const author = await UserSchema.findById(id);
    if (!author) return res.status(404).json({ message: "User not found" });

    const questions = await QuestionSchema.find()
      .populate("answers")
      .populate("author", "username reputation creationTime")
      .populate("tags", "name");
    const filteredQuestions = questions.filter((question) =>
      question.answers.some(
        (answer) => answer.author.toString() === author._id.toString(),
      ),
    );

    res.json(filteredQuestions);
  } catch (err) {
    handleError(err, res);
  }
};

// GET /api/users/:id/tags
export const getTagsOfUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const id = req.params.id;
  try {
    const answers = await TagSchema.find({ author: id });
    res.json(answers);
  } catch (err) {
    handleError(err, res);
  }
};

// POST /api/users
export const createUser = async (
  req: Request<
    NonNullable<unknown>,
    NonNullable<unknown>,
    { email: string; username: string; password: string }
  >,
  res: Response,
) => {
  const { email, username } = req.body;
  try {
    const user = await UserSchema.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ message: "A user with this email already exists!" });
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const resUser = await UserSchema.create({
      email: email,
      username: username,
      password: hashedPassword,
    });
    res.status(201).json(resUser);
  } catch (err) {
    handleError(err, res);
  }
};

// PUT /api/users/:id
export const updateUser = async (
  req: AuthRequest<
    { id: string },
    NonNullable<unknown>,
    {
      email?: string;
      username?: string;
      password?: string;
      reputation?: number;
      isStaff?: boolean;
    }
  >,
  res: Response,
) => {
  const { email, username, password, reputation, isStaff } = req.body;
  const { id } = req.params;
  try {
    const user = await UserSchema.findById(id);
    if (!user) return res.status(400).json({ message: "User doesn't exist" });
    const isAllowed = await isSelfOrStaff(req, user.id);
    if (!isAllowed) return res.status(401).json({ message: "Forbidden" });

    const updatedUser = await UserSchema.findByIdAndUpdate(
      id,
      {
        email: email ?? user.email,
        username: username ?? user.username,
        password: password ? await bcrypt.hash(password, 10) : user.password,
        reputation: reputation ?? user.reputation,
        isStaff: isStaff ?? user.isStaff,
      },
      { projection: { password: 0 }, returnOriginal: false },
    );

    res.status(201).json(updatedUser);
  } catch (err) {
    handleError(err, res);
  }
};

// DELETE /api/users/:id
export const deleteUser = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
) => {
  const userId = req.userId;
  const id = req.params.id;
  try {
    const user = await UserSchema.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const deleter = await UserSchema.findById(userId);
    if (!deleter || !deleter.isStaff)
      return res.status(401).json({ message: "Forbidden" });
    const deletedUser = await UserSchema.findByIdAndDelete(id);
    if (!deletedUser) return res.status(400).json({ message: "Forbidden" });

    const deletedQuestions = await QuestionSchema.find({
      author: deletedUser,
    });

    for (const question of deletedQuestions) {
      await AnswerSchema.deleteMany({ _id: { $in: question.answers } });
      await CommentSchema.deleteMany({ _id: { $in: question.comments } });
    }

    await CommentSchema.deleteMany({
      answer: {
        $in: await AnswerSchema.find({ author: deletedUser }, { _id: 1 }),
      },
    });

    await QuestionSchema.deleteMany({ author: deletedUser });

    const tagsToDelete = await findOrphanTags();

    await TagSchema.deleteMany({
      _id: { $in: tagsToDelete.map((tag) => tag._id) },
    });

    await AnswerSchema.deleteMany({ author: deletedUser });
    await CommentSchema.deleteMany({ author: deletedUser });

    res.status(204).json({ message: "User successfully deleted" });
  } catch (err) {
    handleError(err, res);
  }
};
