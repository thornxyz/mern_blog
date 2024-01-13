import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, [setUserInfo]);

  async function logout() {
    try {
      await fetch("http://localhost:4000/logout", {
        credentials: "include",
        method: "POST",
      });
      setUserInfo(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        Blog
      </Link>
      <nav>
        {username && (
          <>
            <span className="name">Hello @{username}!</span>
            <Link className="create-button" to="/create">Create new post</Link>
            <Link className="logout-button" to = "/" onClick={logout}>Logout</Link>
          </>
        )}
        {!username && (
          <>
            <Link className="login-button" to="/login">Login</Link>
            <Link className="register-button" to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
