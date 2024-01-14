import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function register(ev) {
    ev.preventDefault();
    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      alert("registration successful");
    } else {
      alert("registration failed");
    }
  }
  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
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
        <button>Register</button>
      </div>
    </form>
  );
}
