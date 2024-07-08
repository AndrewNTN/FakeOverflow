import "jest";
import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import UserSchema from "../src/schema/user.schema";
import bcrypt from "bcrypt";
import QuestionSchema from "../src/schema/question.schema";
import { SignJWT } from "jose";
import AnswerSchema from "../src/schema/answer.schema";
import CommentSchema from "../src/schema/comment.schema";

const TEST_DB_URI = "mongodb://localhost:27017/fake_so";

const createTestUser = async () => {
  const user = new UserSchema({
    email: "test@example.com",
    username: "testuser",
    password: await bcrypt.hash("password", 10),
  });
  await user.save();
  return user;
};

describe("User Routes", () => {
  beforeAll(async () => {
    await mongoose.connect(TEST_DB_URI);
    await UserSchema.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await UserSchema.deleteMany({});
  });

  describe("GET /api/users", () => {
    it("should return all users", async () => {
      await createTestUser();

      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].email).toBe("test@example.com");
      expect(response.body[0].username).toBe("testuser");
      expect(response.body[0]).not.toHaveProperty("password");
    });
  });
  describe("GET /api/users/:id", () => {
    it("should return a specific user", async () => {
      const savedUser = await createTestUser();

      const response = await request(app).get(`/api/users/${savedUser._id}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe("test@example.com");
      expect(response.body.username).toBe("testuser");
      expect(response.body).not.toHaveProperty("password");
    });

    it("should return 400 if id is not proper format", async () => {
      const response = await request(app).get("/api/users/invalidid");

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid id");
    });

    it("should return 404 if user not found", async () => {
      const response = await request(app).get(
        "/api/users/aaaaaaaaaaaaaaaaaaaaaaaa",
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });
  });

  describe("POST /api/users", () => {
    it("should create a new user", async () => {
      const response = await request(app)
        .post("/api/users")
        .send({
          email: "test@example.com",
          username: "testuser",
          password: "testpassword",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      const documentCount = await UserSchema.countDocuments();

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("email", "test@example.com");
      expect(response.body).toHaveProperty("username", "testuser");
      expect(documentCount).toBe(1);
    });

    it("should return 400 on a duplicate email", async () => {
      await createTestUser();

      const response = await request(app)
        .post("/api/users")
        .send({
          email: "test@example.com",
          username: "testuser",
          password: "testpassword",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      const documentCount = await UserSchema.countDocuments();

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "A user with this email already exists!",
      );
      expect(documentCount).toBe(1);
    });
  });

  describe("DELETE /api/users/:id", () => {
    let token: string; // JWT token for an authenticated staff user
    let userId: string; // ID of a regular user to be deleted
    let questionId: string; // ID of a question authored by the user to be deleted

    beforeAll(async () => {
      // Create a staff user and generate a JWT token
      const staffUser = await UserSchema.create({
        email: "staff@example.com",
        username: "staff",
        password: "password",
        isStaff: true,
      });

      const secret = new TextEncoder().encode(process.env.DEV_SECRET);
      const jwt = await new SignJWT({ userId: staffUser._id })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secret);
      token = jwt;

      // Create a regular user and a question authored by that user
      const regularUser = await UserSchema.create({
        email: "regular@example.com",
        username: "regular",
        password: "password",
        isStaff: false,
      });
      userId = regularUser._id;
      const question = await QuestionSchema.create({
        title: "Test Question",
        summary: "text",
        text: "text",
        author: regularUser,
      });
      questionId = question._id;
    });

    afterAll(async () => {
      // Clean up the test data
      await UserSchema.deleteMany({});
      await QuestionSchema.deleteMany({});
      await AnswerSchema.deleteMany({});
      await CommentSchema.deleteMany({});
    });

    it("should delete the user and associated data", async () => {
      await request(app)
        .delete(`/api/users/${userId}`)
        .set("Cookie", `access_token=${token}`)
        .expect(204);

      // Check if the user was deleted
      const deletedUser = await UserSchema.findById(userId);
      expect(deletedUser).toBeNull();

      // Check if the user's questions were deleted
      const deletedQuestion = await QuestionSchema.findById(questionId);
      expect(deletedQuestion).toBeNull();

      // Check if the user's answers and comments were deleted
      const deletedAnswers = await AnswerSchema.find({ author: userId });
      const deletedComments = await CommentSchema.find({ author: userId });
      expect(deletedAnswers).toHaveLength(0);
      expect(deletedComments).toHaveLength(0);
    });

    it("should return 401 if the user is not a staff member", async () => {
      const regularUser = await UserSchema.create({
        email: "regular2@example.com",
        username: "regular",
        password: "password",
        isStaff: false,
      });
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const jwt = await new SignJWT({ userId: regularUser._id })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secret);
      const token = jwt;

      await request(app)
        .delete(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(401);

      await UserSchema.findByIdAndDelete(regularUser._id);
    });

    it("should return 404 if the user to be deleted does not exist", async () => {
      const nonExistentUserId = "aaaaaaaaaaaaaaaaaaaaaaaa";

      await request(app)
        .delete(`/api/users/${nonExistentUserId}`)
        .set("Cookie", `access_token=${token}`)
        .expect(404);
    });
  });
});
