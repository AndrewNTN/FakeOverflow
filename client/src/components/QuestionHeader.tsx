import Question from "@server/types/question";
import { Link } from "react-router-dom";
import { timeSinceDate, useAuthentication } from "@/helper.ts";

export default function QuestionHeader({ question }: { question: Question }) {
  const { loggedIn } = useAuthentication();

  return (
    <div className="border-b">
      <div className="flex justify-between items-start gap-4 mb-2">
        <h1 className="text-2xl break-all hyphens-auto">{question.title}</h1>
        {loggedIn && (
          <Link
            to="/questions/ask"
            className="bg-blue-500 p-2 text-white rounded hover:bg-blue-600 text-nowrap"
          >
            Ask Question
          </Link>
        )}
      </div>
      <div className="flex justify-start items-center gap-4 mb-2">
        <div className="text-gray-600">
          Asked{" "}
          <span className="text-black">
            {timeSinceDate(question.creationTime)}
          </span>
        </div>
        <div className="text-gray-600">
          Viewed <span className="text-black">{question.views} times</span>
        </div>
      </div>
    </div>
  );
}
