import { useAuthentication } from "@/helper.ts";
import Comment from "@server/types/comment";
import { FormEvent, useEffect, useState } from "react";
import FormError from "@/components/FormError.tsx";
import axiosInstance from "../../../api.config.ts";
import CommentComponent from "@/components/questions/CommentComponent.tsx";

export default function Comments({
  initComments,
  from,
  id,
  voteCallback,
  newCommentCallback,
}: {
  initComments: Comment[];
  from?: string;
  id?: string;
  voteCallback?: (comment: Comment) => void;
  newCommentCallback?: (comment: Comment) => void;
}) {
  const { loggedIn } = useAuthentication();

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");
  const [page, setPage] = useState(1);

  const numPerPage = 3;
  const lastPage = Math.ceil(comments.length / numPerPage);

  useEffect(() => {
    setComments(initComments);
  }, [initComments]);

  const incrementPage = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const decrementPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    let valid = true;

    setCommentError("");

    if (commentText.trim() === "") {
      valid = false;
      setCommentError("New comment cannot be empty");
    }

    if (valid) {
      const newComment = {
        text: commentText,
      };
      if (from && id) {
        axiosInstance
          .post(`/api/${from}/${id}/comments`, newComment, {
            withCredentials: true,
          })
          .then((res) => {
            setComments((prevComments) => [...prevComments, res.data]);
            if (newCommentCallback) newCommentCallback(res.data);
          })
          .catch((err) => {
            console.error(err);
            setCommentError(err.response.data.message);
          });
      }
    }
  };

  const handleUpvote = (comment: Comment) => {
    axiosInstance
      .post(`/api/comments/${comment._id}/votes`, {}, { withCredentials: true })
      .then(() => {})
      .catch((err) => setCommentError(err.response.data.message));
    if (voteCallback) voteCallback(comment);
  };

  return (
    <ol className="col-[2] border-t">
      {(() => {
        const renderedComments = [];
        for (
          let i = (page - 1) * numPerPage;
          i < (page - 1) * numPerPage + numPerPage;
          i++
        ) {
          const comment = comments[i];
          if (comment) {
            renderedComments.push(
              <CommentComponent
                key={i}
                comment={comment}
                voteCallback={() => handleUpvote(comment)}
              />,
            );
          }
        }
        return renderedComments;
      })()}
      {loggedIn && (
        <form className="inline-block w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col pt-2 bg-gray-50 gap-6">
            <textarea
              name="new-answer"
              placeholder="Comment here..."
              cols={30}
              rows={1}
              className="rounded p-2 border text-xs"
              onChange={(e) => setCommentText(e.target.value)}
            />
          </div>
          <FormError message={commentError} />
          <button className=" text-blue-500 text-nowrap ml-3 text-xs">
            Post comment
          </button>
        </form>
      )}
      <ol className="flex gap-2 text-sm p-8 items-center justify-center">
        <li>
          <button
            className={`border p-2 rounded ${page > 1 ? "hover:bg-gray-200" : "bg-gray-100"}`}
            onClick={decrementPage}
            disabled={page <= 1}
          >
            Prev
          </button>
        </li>
        {page}
        <li>
          <button
            className={`border p-2 rounded ${page < lastPage ? "hover:bg-gray-200" : "bg-gray-100"}`}
            onClick={incrementPage}
            disabled={page >= lastPage}
          >
            Next
          </button>
        </li>
      </ol>
    </ol>
  );
}
