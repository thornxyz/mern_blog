import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "../components/UserContext";
import serverUrl from "../config";
import { BarLoader } from "react-spinners";

const svgpath =
  "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${serverUrl}/post/${id}`)
      .then((response) => response.json())
      .then((postInfo) => {
        setPostInfo(postInfo);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="loading">
        <BarLoader color="rgb(91, 89, 89)" loading={loading} size={80} />
      </div>
    );
  }

  if (!postInfo) return "";

  return (
    <div className="post-page">
      <div className="heading">{postInfo.title}</div>
      <div className="author-info">
        <time>{format(new Date(postInfo.createdAt), "MMM d, yyyy HH:mm")}</time>
        <div className="author">by @{postInfo.author.username}</div>
      </div>
      <div className="image">
        <img src={postInfo.cover} alt="" />
      </div>
      <br />
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
      <br />
      <div className="edit-container">
        {userInfo && postInfo.author && userInfo.id === postInfo.author._id && (
          <div className="edit-row">
            <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={svgpath}
                />
              </svg>
              Edit this post
            </Link>
          </div>
        )}
      </div>
      <br />
    </div>
  );
}
