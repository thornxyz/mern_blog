import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({ _id, title, summary, cover, content, createdAt, author }) {
  return (
    <div className="post">
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <div className="post-summary" >
          <p className="summary">{summary}</p>
        </div>
        <p className="info">
          <a className="author">{'@' + author.username}</a>
          <time>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
        </p>
      </div>
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={cover} alt="" />
        </Link>
      </div>
    </div>
  );
}