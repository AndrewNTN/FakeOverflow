import Tag from "@server/types/tag";
import { useEffect, useState } from "react";
import axiosInstance from "../../api.config.ts";
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
        const res = await axiosInstance.get(`/api/tags/${tag.name}/questions`);
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
      axiosInstance
        .put(`/api/tags/${editTag?._id}`, { name: editName })
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
      axiosInstance
        .delete(`/api/tags/${t._id}`)
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
