import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { Request } from "express";
import userRoute from "./src/routes/user.route";
import sessionRoute from "./src/routes/session.route";
import questionRoute from "./src/routes/question.route";
import tagRoute from "./src/routes/tag.route";
import answerRoute from "./src/routes/answer.route";
import commentRoute from "./src/routes/comment.route";

require("./src/schema/tag.schema");
require("./src/schema/comment.schema");
require("./src/schema/answer.schema");
require("./src/schema/user.schema");
require("./src/schema/question.schema");

const app = express();

app.use(cookieParser());
app.use(
  cors<Request>({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/fake_so").catch((err) => {
  console.error(err);
  process.exit(1);
});

app.use("/api/users", userRoute);
app.use("/api/session", sessionRoute);
app.use("/api/tags", tagRoute);
app.use("/api/questions", questionRoute);
app.use("/api/answers", answerRoute);
app.use("/api/comments", commentRoute);

export default app;
