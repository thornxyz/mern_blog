import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../components/Editor";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function createNewPost(ev) {

    ev.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", file);

    try {
      const response = await fetch("http://localhost:4000/post", {
        method: "POST",
        body: data,
        credentials: 'include',
      });

      if (response.ok) {
        setRedirect(true);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <form onSubmit={createNewPost}>
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
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <input type="file" onChange={(ev) => setFile(ev.target.files[0])} />
      <Editor value={content} onChange={setContent} />
      <button type="submit" style={{ marginTop: "5px" }} disabled={isSubmitting}>{isSubmitting? 'Creating Post...':'Create Post'}</button>
    </form>
  );
}
