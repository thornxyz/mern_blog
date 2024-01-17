import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import serverUrl from "../config";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  async function login(ev) {
    ev.preventDefault();
    const response = await fetch(`${serverUrl}/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
      setRedirect(true);
    } else {
      alert("wrong credentials");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <div className="form-heading">Username</div>
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <div className="form-heading">Password</div>
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <div className="button">
        <button>Login</button>
      </div>
    </form>
  );
}
