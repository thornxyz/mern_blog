import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import TextEditor from "../components/TextEditor";
import serverUrl from "../config";

const MAX_SUMMARY_CHARACTERS = 300;

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  const setSummaryWithLimit = (input) => {
    const truncatedSummary = input.slice(0, MAX_SUMMARY_CHARACTERS);
    setSummary(truncatedSummary);
  };

  useEffect(() => {
    fetch(`${serverUrl}/post/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch post: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((postInfo) => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      })
      .catch((error) => {
        console.error("Error fetching post: ", error);
      });
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    setRedirect(true);
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    if (files?.[0]) {
      data.set("file", files?.[0]);
    }
    try {
      const response = await fetch(`${serverUrl}/post/${id}`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });
      if (!response.ok) {
        console.error(
          `Failed to update post: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error updating post: ", error);
    }
  }

  if (redirect) {
    return <Navigate to={"/post/" + id} />;
  }

  return (
    <form className="edit-post-form" onSubmit={updatePost}>
      <input
        type="title"
        placeholder={"Title"}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="summary"
        placeholder={"Summary"}
        value={summary}
        onChange={(ev) => setSummaryWithLimit(ev.target.value)}
      />
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <TextEditor onChange={setContent} value={content} />
      <div className="edit-form-button">
        <button style={{ marginTop: "5px" }}>Update Post</button>
      </div>
    </form>
  );
}
