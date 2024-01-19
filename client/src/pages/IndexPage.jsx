import { useEffect, useState } from "react";
import Post from "../components/Post";
import serverUrl from "../config";
import { BarLoader } from "react-spinners";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${serverUrl}/post`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch posts: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((fetchedPosts) => {
        setPosts(fetchedPosts);
      })
      .catch((error) => {
        console.log("Error loading posts: ", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <BarLoader color="rgb(91, 89, 89)" loading={loading} size={80} />
      </div>
    );
  }

  return (
    <>
      {posts.length > 0 &&
        posts.map((post) => <Post key={post._id} {...post} />)}
    </>
  );
}
