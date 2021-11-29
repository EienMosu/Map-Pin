import { Room } from "@material-ui/icons";
import axios from "axios";
import React, { useState } from "react";
import "./register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/users/register", {
        username,
        email,
        password,
      });

      console.log(response);
      window.location.reload(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="register">
      <div className="title">
        <Room style={{ color: "slateblue" }} />
        <h1>Ozkan's Pin App</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          onChange={(event) => setUsername(event.target.value)}
          value={username}
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(event) => setEmail(event.target.value)}
          value={email}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
        <button className="sendButton">Create an Account</button>
      </form>
    </div>
  );
};

export default Register;
