import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import serverUrl from "../config";

const hamburgerPath = "M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [showNav, setShowNav] = useState(false);

  const handleButtonClick = () => {
    setShowNav(true);
  };

  useEffect(() => {
    fetch(`${serverUrl}/profile`, {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
    handleButtonClick();
  }, [setUserInfo]);

  async function logout() {
    try {
      await fetch(`${serverUrl}/logout`, {
        credentials: "include",
        method: "POST",
      });
      setUserInfo(null);
      handleButtonClick();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  const username = userInfo?.username;

  return (
    <div className="header-container">
      <div className="sm-header">
        <div className="sm-header-top">
          <a className="hamburger" onClick={() => setShowNav(!showNav)}>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50" className="hamburger-icon">
              <path d={hamburgerPath}></path>
            </svg>
          </a>
          <Link to="/" className="logo">
            Blog
          </Link>
          {username && (<span className="name">Hello @{username}!</span>)}
        </div>
        <div className={`hamburger-expanded ${showNav ? 'responsive_nav' : ''}`}>
          {username && (
            <>
              <Link className="create-button" to="/create" onClick={handleButtonClick}>Create new post</Link>
              <Link className="logout-button" to="/" onClick={logout}>Logout</Link>
            </>
          )}
          {!username && (
            <>
              <Link className="login-button" to="/login" onClick={handleButtonClick}>Login</Link>
              <Link className="register-button" to="/register" onClick={handleButtonClick}>Register</Link>
            </>
          )}
        </div>
      </div>
      <header>
        <Link to="/" className="logo">
          Blog
        </Link>
        <nav>
          {username && (
            <>
              <span className="name">Hello @{username}!</span>
              <Link className="create-button" to="/create">Create new post</Link>
              <Link className="logout-button" to="/" onClick={logout}>Logout</Link>
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
    </div>
  );
}
