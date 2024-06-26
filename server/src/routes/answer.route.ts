import express from "express";
import {
  deleteAnswer,
  getAnswerById,
  getAnswers,
  postCommentToAnswer,
  updateAnswer,
  voteAnswer,
} from "../controllers/answer.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { verifyId } from "../middleware/id.middleware";

const router = express.Router();

router.get("/", getAnswers);
router.get("/:id", getAnswerById);
router.delete("/:id", verifyToken, verifyId, deleteAnswer);
router.post("/:id/comments", verifyToken, verifyId, postCommentToAnswer);
router.post("/:id/votes", verifyToken, verifyId, voteAnswer);
router.put("/:id", verifyToken, verifyId, updateAnswer);

export default router;
