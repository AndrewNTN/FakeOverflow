import FormError from "@/components/FormError.tsx";
import { FormEvent, useState, useEffect } from "react";
import { sluggify, validateHyperlinks } from "@/helper";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../api.config.ts";
import axios from "axios";
import Question from "@server/types/question";

export default function AnswerQuestion({ editing }: { editing?: boolean }) {
  const [question, setQuestion] = useState<Question>();
  const [text, setText] = useState("");
  const [textError, setTextError] = useState("");
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();
  const { aid, qid } = useParams();

  useEffect(() => {
    axiosInstance.get(`/api/questions/${qid}`).then((res) => {
      setQuestion(res.data);
    });
  }, [qid]);

  // if editing an answer, load in data
  useEffect(() => {
    if (editing) {
      axiosInstance.get(`/api/answers/${aid}`).then((res) => {
        setText(res.data.text);
      });
    }
  }, [editing, aid]);

  if (question === undefined)
    return <h3 className="m-2 ml-5 text-xl">Question to answer not found</h3>;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    let valid = true;

    setTextError("");
    setFormError("");

    if (!validateHyperlinks(text)) {
      setTextError("Invalid hyperlink");
      valid = false;
    }

    if (text.trim() === "") {
      setTextError("Answer text cannot be empty");
      valid = false;
    }

    if (valid) {
      const newAnswer = {
        text: text,
      };

      if (editing) {
        try {
          await axiosInstance.put(`/api/answers/${aid}`, newAnswer, {
            withCredentials: true,
          });
          navigate(`/questions/${qid}/${sluggify(question.title)}`);
        } catch (err) {
          if (axios.isAxiosError(err) && err.response)
            setFormError(err.response.data.message);
        }
      } else {
        axiosInstance
          .post(`/api/questions/${qid}/answers`, newAnswer, {
            withCredentials: true,
          })
          .then((res) => {
            console.log(res.data);
            navigate(`/questions/${qid}/${sluggify(question.title)}`);
          })
          .catch((err) => {
            console.log(err);
            setFormError(err.response.request.statusText);
          });
      }
    }
  };

  return (
    <section className="w-full p-8">
      <h1 className="text-2xl font-bold mb-4">Answer Question</h1>
      <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col border rounded p-2 bg-gray-50 gap-2">
          <label htmlFor="body" className="font-bold text-gray-900">
            Answer Text
          </label>
          <textarea
            name="body"
            cols={30}
            rows={10}
            value={text}
            className="rounded border p-2"
            placeholder="Enter answer text here..."
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <FormError message={textError} />
        </div>
        <FormError message={formError} />
        <div className="inline-block">
          <button className="bg-blue-600 p-2 rounded text-white hover:bg-blue-700">
            Submit
          </button>
        </div>
      </form>
    </section>
  );
}
