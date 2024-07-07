import QuestionComponent from "@/components/questions/QuestionComponent.tsx";
import Question from "@server/types/question";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function QuestionList({
  questions,
  userId,
}: {
  questions: Question[];
  userId?: string;
}) {
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();

  const numPerPage = 5;

  useEffect(() => {
    if (searchParams.get("page")) {
      const pageParam = searchParams.get("page");
      if (pageParam) {
        const newPage = parseInt(pageParam);
        setPage(newPage);
      }
    }
  }, [searchParams]);

  if (questions.length === 0)
    return <h3 className="m-5 ml-9 text-xl">No Questions Found</h3>;

  return (
    <ul className="max-h-[800px]">
      {(() => {
        const renderedQuestions = [];
        for (
          let i = (page - 1) * numPerPage;
          i < (page - 1) * numPerPage + numPerPage;
          i++
        ) {
          const question = questions[i];
          if (question) {
            renderedQuestions.push(
              <div key={i}>
                <QuestionComponent
                  key={i}
                  question={question}
                  userId={userId}
                />
              </div>,
            );
          }
        }
        return renderedQuestions;
      })()}
    </ul>
  );
}
