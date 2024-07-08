import { Link, useParams } from "react-router-dom";
import { sluggify, timeSinceDate, useAuthentication } from "@/helper.ts";
import TagList from "@/components/TagList.tsx";
import QuestionList from "@/components/questions/QuestionList.tsx";
import { IconEdit, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../api.config.ts";
import User from "@server/types/user";
import Question from "@server/types/question";
import Tag from "@server/types/tag";
import FormError from "@/components/FormError.tsx";

export default function Profile() {
  const { user } = useAuthentication();
  const [profileUser, setProfileUser] = useState<User>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [deleteUserWarning, setDeleteUserWarning] = useState("");
  const [userToBeDeleted, setUserToBeDeleted] = useState<User>();
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);
  const [userTags, setUserTags] = useState<Tag[]>([]);

  const { id } = useParams();

  useEffect(() => {
    // Get profile user
    axiosInstance
      .get(`/api/users/${id}`)
      .then((res) => {
        setProfileUser(res.data);
      })
      .catch((err) => {
        console.log("Error fetching user:", err);
      });

    // Get all users
    axiosInstance
      .get("/api/users/")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log("Error fetching users:", err);
      });

    // Get questions posted by user
    axiosInstance
      .get(`/api/users/${id}/questions`)
      .then((res) => {
        setQuestions(res.data);
      })
      .catch((err) => {
        console.log("Error fetching questions posted by user", err);
      });

    // Get tags created by user
    axiosInstance
      .get(`/api/users/${id}/tags`)
      .then((res) => {
        setUserTags(res.data);
      })
      .catch((err) => {
        console.log("Error fetching tags created by user", err);
      });

    // Get questions answered by user
    axiosInstance
      .get(`/api/users/${id}/questions/answered`)
      .then((res) => {
        setAnsweredQuestions(res.data);
      })
      .catch((err) => {
        console.log("Error fetching questions answered by user", err);
      });
  }, [id]);

  const handleQuestionDelete = (qid: string) => {
    axiosInstance
      .delete(`/api/questions/${qid}`)
      .then(() => {
        setQuestions((prevQuestions) =>
          prevQuestions.filter((q) => q._id !== qid),
        );
      })
      .catch((err) => console.log(err));
  };

  const handleUserDelete = (u: User) => {
    if (userToBeDeleted !== u) {
      setUserToBeDeleted(u);
      setDeleteUserWarning(`Are you sure you want to delete ${u.username}?`);
    } else {
      axiosInstance
        .delete(`/api/users/${u._id}`)
        .then(() => {
          setUsers((prevUsers) => prevUsers.filter((pUser) => pUser !== u));
        })
        .catch((err) => {
          setDeleteUserWarning(err.response.data.message);
        });
    }
  };

  if (profileUser === undefined) return <p>User Not Found...</p>;

  return (
    <div className="flex flex-col gap-5 m-10 ml-10 w-full">
      <div className="flex justify-between mb-2">
        <div className="flex flex-col gap-3">
          <h2 className="text-4xl">{profileUser.username}</h2>
          <p className="text-gray-500">
            Member since {timeSinceDate(profileUser.creationTime)}
          </p>
        </div>
        <div className="">
          <h3 className="text-gray-400 text-sm font-bold">REPUTATION</h3>
          <p className="text-3xl">{profileUser.reputation}</p>
        </div>
      </div>
      <div>
        <h2 className="text-2xl mb-5">Questions</h2>
        <ul className="flex flex-col gap-2 ml-3">
          {questions.length !== 0 ? (
            questions.map((q, index) => (
              <div className="flex flex-col" key={index}>
                <div className="flex flex-row justify-between border p-4 rounded-md">
                  <h3 className="text-blue-600 hover:text-blue-900 break-all mb-0.5 self-center">
                    <Link to={`/questions/${q.id}/${sluggify(q.title)}`}>
                      {q.title}
                    </Link>
                  </h3>
                  {(user?._id === id || user?.isStaff) && (
                    <div className="flex flex-row gap-2">
                      <Link
                        to={`/questions/edit/${q.id}`}
                        className="rounded-full border w-7 h-7 flex justify-center items-center hover:bg-[#fbdbc0]"
                      >
                        <IconEdit width={16} height={16} />
                      </Link>
                      <button
                        className="rounded-full border w-7 h-7 flex justify-center items-center hover:bg-red-200"
                        onClick={() => handleQuestionDelete(q.id)}
                      >
                        <IconX width={16} height={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <h3 className="m-2 ml-5 text-xl">No Questions Found</h3>
          )}
        </ul>
      </div>
      <div>
        <h2 className="text-2xl mb-5">Created Tags</h2>
        <TagList
          initTags={userTags}
          viewEdit={user?._id === id || user?.isStaff}
        />
      </div>
      <div>
        <h2 className="text-2xl mb-5">Answered Questions</h2>
        <QuestionList questions={answeredQuestions} userId={id} />
      </div>
      {user?.isStaff && profileUser.isStaff && (
        <div>
          <h2 className="text-2xl mb-5">Users</h2>
          <ul className="flex flex-col gap-2 ml-3">
            {users.length !== 0 ? (
              users.map((u, index) => (
                <div className="flex flex-col" key={index}>
                  <div className="flex flex-row justify-between border p-4 rounded-md">
                    <h3 className="text-blue-600 hover:text-blue-900 break-all mb-0.5 self-center">
                      <Link to={`/users/${u._id}`}>{u.username}</Link>
                    </h3>
                    {u === userToBeDeleted && (
                      <FormError message={deleteUserWarning} />
                    )}
                    <div className="flex flex-row gap-2">
                      <button
                        className="rounded-full border w-7 h-7 flex justify-center items-center hover:bg-red-200"
                        onClick={() => handleUserDelete(u)}
                      >
                        <IconX width={16} height={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h3 className="m-2 ml-5 text-xl">No Users Found</h3>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
