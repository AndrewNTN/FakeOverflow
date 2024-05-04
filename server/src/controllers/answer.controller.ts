import { Request, Response } from "express";
import { handleError } from "../utils";
import AnswerSchema from "../schema/answer.schema";
import { AuthRequest } from "../../types/express";
import { isAuthorOrStaff } from "../utils/auth";
import CommentSchema from "../schema/comment.schema";
import UserSchema from "../schema/user.schema";

// GET /api/answers
export const getAnswers = async (req: Request, res: Response) => {
  try {
    const answers = await AnswerSchema.find({}).populate("author");
    return res.status(200).json(answers);
  } catch (err) {
    handleError(err, res);
  }
};

// DELETE /api/answers/:id
export const deleteAnswer = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
) => {
  try {
    const answers = await AnswerSchema.findById(req.params.id);
    if (!answers) return res.status(404).json({ message: "No such answer" });
    if (!(await isAuthorOrStaff(req, answers._id, AnswerSchema)))
      return res.status(403).json({ message: "Forbidden" });

    const deletedAnswer = await AnswerSchema.findByIdAndDelete(req.params.id);
    await CommentSchema.deleteMany({ _id: { $in: deletedAnswer!.comments } });

    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    handleError(err, res);
  }
};

// POST /api/answers/:id/comments
export const postCommentToAnswer = async (
  req: AuthRequest<{ id: string }, {}, { text: string }>,
  res: Response,
) => {
  try {
    const answerId = req.params.id;
    const { text } = req.body;
    const authorId = req.userId;
    const author = await UserSchema.findById(authorId);

    const comment = new CommentSchema({ text: text, author: author!._id });
    const answer = await AnswerSchema.findById(answerId);
    if (!answer) return res.status(404).json({ error: "Answer not found" });

    answer.comments.push(comment);
    const savedComment = await comment.save();
    await answer.save();

    res.status(201).json(savedComment);
  } catch (err) {
    handleError(err, res);
  }
};

// POST /api/answers/:id/votes
export const voteAnswer = async (
  req: AuthRequest<{ id: string }, {}, { vote: 1 | -1 }>,
  res: Response,
) => {
  try {
    const answerId = req.params.id;
    const { vote } = req.body;
    const voterId = req.userId;
    const voter = await UserSchema.findById(voterId);
    if (!voter) return res.status(404).json({ message: "No such voter" });
    if (voter.reputation < 50)
      return res.status(400).json({ message: "Not enough reputation" });
    const answer = await AnswerSchema.findById(answerId);
    if (!answer) return res.status(404).json({ error: "Answer not found" });
    const authorId = answer.author._id;
    const author = await UserSchema.findById(authorId);
    if (!author) return res.status(404).json({ error: "Author not found" });
    answer.votes += vote;
    author.reputation += vote * (vote > 0 ? 5 : 10);
    answer.save();
    author.save();
  } catch (err) {
    handleError(err, res);
  }
};
