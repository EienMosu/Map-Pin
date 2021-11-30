import React, { useState } from "react";
// Material UI Icons
import { Cancel, Room } from "@material-ui/icons";
// Axios
import axios from "axios";
// CSS
import "./login.css";

const Login = ({ login, myStorage, setCurrentUser }) => {
  const [success, setSuccess] = useState(null);
  const [failure, setFailure] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://map-pin-app.herokuapp.com/api/users/login",
        {
          username,
          password,
        }
      );

      myStorage.setItem("user", response.data.username);
      setCurrentUser(response.data.username);
      login(null);
      setSuccess(true);
      setFailure(null);
    } catch (err) {
      console.log(err);
      setSuccess(null);
      setFailure(true);
    }
  };

  return (
    <div className="login">
      <div className="title">
        <Room style={{ color: "teal" }} />
        <h1>OzkanPin</h1>
      </div>
      <form onSubmit={handleLoginSubmit}>
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
      {success && (
        <span className="successfull">
          Successfull! You can add your pins now!
        </span>
      )}
      {failure && <span className="failed">Wrong Cridentials!</span>}

      <Cancel className="loginCancel" onClick={() => login(null)} />
    </div>
  );
};

export default Login;
