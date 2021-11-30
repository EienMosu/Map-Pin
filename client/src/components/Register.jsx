import React, { useState } from "react";
// Material UI Icons
import { Cancel, Room } from "@material-ui/icons";
// Axios
import axios from "axios";
// CSS
import "./register.css";

const Register = ({ register }) => {
  const [success, setSuccess] = useState(null);
  const [failure, setFailure] = useState(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://map-pin-app.herokuapp.com/api/users/register",
        {
          username,
          email,
          password,
        }
      );

      console.log(response);
      setSuccess(true);
      setFailure(null);
    } catch (err) {
      console.log(err);
      setFailure(true);
      setSuccess(null);
    }
  };

  return (
    <div className="register">
      <div className="title">
        <Room style={{ color: "slateblue" }} />
        <h1 className="registerTitle">Ozkan's Pin App</h1>
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
        <button className="sendRegisterButton">Create an Account</button>
        {success && (
          <span className="success">Successfull! You can login now!</span>
        )}
        {failure && (
          <span className="failure">
            Something went wrong! Please try register again!
          </span>
        )}
      </form>
      <Cancel className="registerCancel" onClick={() => register(null)} />
    </div>
  );
};

export default Register;
