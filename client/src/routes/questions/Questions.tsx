import ContentHeader from "@/components/ContentHeader.tsx";
import QuestionList from "@/components/questions/QuestionList.tsx";
import Question from "@server/types/question";

const tempQuestions: Question[] = [
  {
    title:
      "This is a Titleasdfahujioasdhuisdhuisdfhuisdfhuhuisdhuisdhuisdhuisfhuisdfhuhuisdhuisdhuisdhuisdhuisdhuisdhuisdhuisdfhuisdfhuisdfhuisdfhusdfhu",
    summary:
      "This is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summaryThis is a summary",
    askDateTime: new Date(),
    askedBy: "MIGUEL ANGEL HERNANDEZ CAMACHO",
    views: 2,
    votes: 3,
    numAnswers: 0,
    id: 1,
    tags: [{ name: "wolfie", id: 1 }],
  },
  {
    title: "This is a Title2",
    summary: "This is a summary2",
    askDateTime: new Date(),
    askedBy:
      "me!!!asdasdasdasdsadadfgyuiasghbuisdfghsdfhusdfhudsaabjjbdsdfhusdfhusdfhusdfhusdfhusdfhusdfhusdfhufsdhusdfhuisdfhuisdsdfhuio",
    views: 0,
    votes: 3453,
    numAnswers: 9999,
    id: 2,
    tags: [{ name: "wolfie", id: 1 }],
  },
];

export default function Questions() {
  return (
    <section className="w-full">
      <ContentHeader
        name={"All Questions"}
        questionCount={tempQuestions.length}
      />
      <QuestionList questions={tempQuestions} />
    </section>
  );
}
