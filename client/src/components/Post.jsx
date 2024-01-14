import { format } from "date-fns";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function Post({
  _id,
  title,
  summary,
  cover,
  createdAt,
  author,
}) {
  return (
    <div className="post">
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <div className="post-summary">
          <p className="summary">{summary}</p>
        </div>
        <p className="info">
          <a href="/#" className="author">
            {"@" + author.username}
          </a>
          <time>{format(new Date(createdAt), "MMM d, yyyy HH:mm")}</time>
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

Post.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  author: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
};
