import Tag from "@server/types/tag";
import { useEffect, useState } from "react";
import axios from "axios";
import Question from "@server/types/question";
import TagComponent from "@/components/TagComponent.tsx";

type TagQuestionsMap = { [key: string]: Question[] };

export default function TagList({
  initTags,
  viewEdit,
}: {
  initTags: Tag[];
  viewEdit?: boolean;
}) {
  const [tagQuestions, setTagQuestions] = useState<TagQuestionsMap>();
  const [tags, setTags] = useState<Tag[]>([]);
  const [deleteTag, setDeleteTag] = useState<Tag>();

  useEffect(() => {
    setTags(initTags);
  }, [initTags]);

  useEffect(() => {
    const fetchTagQuestions = async () => {
      const tagQuestionsData: TagQuestionsMap = {};
      for (const tag of tags) {
        const res = await axios.get(
          `http://localhost:8000/api/tags/${tag.name}/questions`,
        );
        tagQuestionsData[tag.name] = res.data;
      }
      setTagQuestions(tagQuestionsData);
      console.log(tagQuestionsData);
    };
    fetchTagQuestions().then();
  }, [tags]);

  const handleTagEditSubmit = (
    editName: string,
    editTag: Tag,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      axios
        .put(
          `http://localhost:8000/api/tags/${editTag?._id}`,
          { name: editName },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          resolve("");
        })
        .catch((err) => {
          console.error(err);
          const errorMessage = err.response.data.message;
          reject(errorMessage);
        });
    });
  };

  const handleTagDelete = (t: Tag): Promise<string> => {
    return new Promise((resolve, reject) => {
      setDeleteTag(t);
      axios
        .delete(`http://localhost:8000/api/tags/${t._id}`, {
          withCredentials: true,
        })
        .then(() => {
          setTags((prevTags) => prevTags.filter((tag) => tag !== t));
          resolve("");
        })
        .catch((err) => {
          console.error(err);
          const errorMessage = err.response.data.message;
          reject(errorMessage);
        });
    });
  };

  if (tags && tags.length === 0)
    return <h3 className="m-5 ml-9 text-xl">No Tags Found</h3>;
  if (!tagQuestions) return <p>Page Loading...</p>;

  return (
    <ul className="flex flex-wrap gap-6 m-5">
      {tags.map((t, index) => (
        <TagComponent
          key={index}
          t={t}
          questionLength={tagQuestions[t.name]?.length}
          deleting={deleteTag === t}
          viewEdit={viewEdit}
          deleteCallback={handleTagDelete}
          editCallback={handleTagEditSubmit}
        />
      ))}
    </ul>
  );
}
