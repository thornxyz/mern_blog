import { useEffect, useState } from "react";
import Post from "../components/Post";
import serverUrl from "../config";

export default function IndexPage() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        fetch(`${serverUrl}/post`).then(response => {
            response.json().then(posts => {
                setPosts(posts);
            })
        })
    }, []);
    return (
        <>
            {posts.length > 0 && posts.map(post => (
                <Post key={post._id} {...post} />
            ))}
        </>
    );
}