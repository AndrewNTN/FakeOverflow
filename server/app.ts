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
require("dotenv").config();

const allowedOrigins = ["https://fake-overflow-site.onrender.com"];

const app = express();
const path = require("path");

app.use(cookieParser());
app.use(
  cors<Request>({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
console.log(__dirname);
const clientBuildPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

const mongoURI = process.env.MONGO_URI || "";

mongoose.connect(mongoURI).catch((err) => {
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
