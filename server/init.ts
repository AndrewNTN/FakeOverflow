import mongoose from "mongoose";
import bcrypt from "bcrypt";
import UserSchema from "./src/schema/user.schema";
import TagSchema from "./src/schema/tag.schema";
import QuestionSchema from "./src/schema/question.schema";
import AnswerSchema from "./src/schema/answer.schema";
import CommentSchema from "./src/schema/comment.schema";

require("dotenv").config();

const userArgs = process.argv.slice(2);
const [adminUsername, adminPassword] = userArgs;
const mongoURI = process.env.MONGO_URI || "";

async function initDatabase() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    // Create initial data
    await createInitialData(adminUsername, adminPassword);

    console.log("Initialization completed");
  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    await mongoose.connection.close();
  }
}

async function createInitialData(adminUsername: string, adminPassword: string) {
  // Create initial users
  const user1 = new UserSchema({
    email: "user1@example.com",
    username: "user1",
    password: await bcrypt.hash("password", 10),
  });
  await user1.save();

  const adminUser = new UserSchema({
    email: "admin@example.com",
    username: adminUsername,
    reputation: 1000,
    password: await bcrypt.hash(adminPassword, 10),
    isStaff: true,
  });
  await adminUser.save();

  // Create initial tags
  const tag1 = new TagSchema({
    name: "javascript",
    author: user1._id,
  });
  await tag1.save();

  // Create initial question
  const question = new QuestionSchema({
    title: "How to reverse a string in JavaScript?",
    text: "I need help reversing a string in JavaScript. What is the best way to do it?",
    summary: "Reverse a string in JavaScript",
    author: user1._id,
    tags: [tag1._id],
  });

  // Create initial answer
  const answer = new AnswerSchema({
    text: "You can use the split(), reverse(), and join() methods to reverse a string in JavaScript...",
    author: adminUser._id,
  });
  await answer.save();

  question.answers.push(answer._id);
  await question.save();

  // Create initial comments
  const comment1 = new CommentSchema({
    text: "Thanks for the answer!",
    author: user1._id,
  });
  await comment1.save();

  const comment2 = new CommentSchema({
    text: "Not sure what this question means.",
    author: adminUser._id,
  });
  await comment2.save();

  question.comments.push(comment2._id);
  await question.save();
  answer.comments.push(comment1._id);
  await answer.save();
}

if (adminUsername && adminPassword) {
  initDatabase().then(() => process.exit(0));
} else {
  console.error(
    "Please provide an admin username and password as command-line arguments.",
  );
  process.exit(1);
}
