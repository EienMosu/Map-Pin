import { Room } from "@material-ui/icons";
import axios from "axios";
import React, { useState } from "react";
import "./login.css";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    props.handleloginsubmit(username, password);
  };

  return (
    <div className="login">
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
          type="password"
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
        <button className="sendButton">Login</button>
      </form>
    </div>
  );
};

export default Login;
