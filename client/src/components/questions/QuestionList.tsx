import QuestionComponent from "@/components/questions/QuestionComponent.tsx";
import Question from "@server/types/question";

export default function QuestionList({ questions }: { questions: Question[] }) {
  if (questions.length === 0) return <h1>No Questions Found</h1>;

  return (
    <ul id="question-list">
      {questions.map((question, index) => (
        <div key={index}>
          <QuestionComponent question={question} />
        </div>
      ))}
    </ul>
  );
}
