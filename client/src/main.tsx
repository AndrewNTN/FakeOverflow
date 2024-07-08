import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import ErrorPage from "@/routes/ErrorPage.tsx";
import Welcome from "@/routes/Welcome.tsx";
import SignUp from "@/routes/users/SignUp.tsx";
import Login from "@/routes/users/Login.tsx";
import Questions from "@/routes/questions/Questions.tsx";
import Content from "@/Content.tsx";
import Tags from "@/routes/Tags.tsx";
import AskQuestion from "@/routes/questions/AskQuestion.tsx";
import Profile from "@/routes/users/Profile.tsx";
import Answers from "@/routes/questions/Answers.tsx";
import AuthRoute from "@/components/AuthRoute.tsx";
import AnswerQuestion from "@/routes/questions/AnswerQuestion.tsx";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import dotenv from "dotenv";

dotenv.config();

if (process.env.NODE_ENV === "production") disableReactDevTools();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Welcome /> },
      { path: "/users/signup", element: <SignUp /> },
      { path: "/users/login", element: <Login /> },
    ],
  },
  {
    path: "/",
    element: <Content />,
    children: [
      { path: "/questions", element: <Questions /> },
      { path: "/questions/search/:query", element: <Questions /> },
      {
        path: "/questions/ask",
        element: (
          <AuthRoute>
            <AskQuestion />
          </AuthRoute>
        ),
      },
      {
        path: "/questions/edit/:id",
        element: (
          <AuthRoute>
            <AskQuestion editing={true} />
          </AuthRoute>
        ),
      },
      { path: "/questions/:qid/:slug", element: <Answers /> },
      {
        path: "/questions/edit/:qid/answer/:uid",
        element: (
          <AuthRoute>
            <Answers fromProfile={true} />
          </AuthRoute>
        ),
      },
      {
        path: "/questions/:qid/answer",
        element: (
          <AuthRoute>
            <AnswerQuestion />
          </AuthRoute>
        ),
      },
      {
        path: "/questions/:qid/answer/:aid/edit",
        element: (
          <AuthRoute>
            <AnswerQuestion editing={true} />
          </AuthRoute>
        ),
      },
      { path: "/questions/tagged/:tag", element: <Questions /> },
      { path: "/tags", element: <Tags /> },
      { path: "/users/:id", element: <Profile /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
