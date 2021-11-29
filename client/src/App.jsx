import React, { useEffect, useState } from "react";
// MapBox
import ReactMapGL, { Marker, Popup } from "react-map-gl";
// Material UI Icons
import { Room, Star } from "@material-ui/icons";
// Axios
import axios from "axios";
// Timeago
import * as timeago from "timeago.js";
// Css
import "./app.css";
import Register from "./components/Register";
import Login from "./components/Login";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [newPlace, setNewPlace] = useState(null);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);

  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [rating, setRating] = useState(0);

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.7577,
    longitude: 35.4376,
    zoom: 5,
  });

  const handleAddClick = (event) => {
    const [long, lat] = event.lngLat;

    setNewPlace({
      lat: lat,
      long: long,
    });
  };

  const handleClose = () => {
    setCurrentPlaceId(null);
    setNewPlace(null);
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/pins", {
        username: currentUser,
        title,
        desc,
        rating,
        lat: newPlace.lat,
        long: newPlace.long,
      });

      window.location.reload(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleMakerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleLoginClick = () => {
    setRegister(false);
    setLogin(!login);
  };

  const handleRegisterClick = () => {
    setRegister(!register);
    setLogin(false);
  };

  const handleLoginSubmit = async (username,password) => {
    try {
      const response = await axios.post("/users/login", {
        username,
        password,
      });

      console.log(response);
      window.location.reload(false);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const getPins = async () => {
      try {
        const response = await axios.get("/pins");

        setPins(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getPins();
  }, []);

  return (
    <div className="app">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapStyle="mapbox://styles/bucketles/ckwjmvbo73dmr14lhpjccwjfh"
        onDblClick={handleAddClick}
        onClick={handleClose}
      >
        {currentUser ? (
          <button onClick={() => setCurrentUser(null)}>Logout</button>
        ) : (
          <>
            <button className="loginButton" onClick={handleLoginClick} handleloginsubmit={handleLoginSubmit}>
              Login
            </button>
            <button className="registerButton" onClick={handleRegisterClick}>
              Register
            </button>
          </>
        )}

        {pins.map((pin) => (
          <React.Fragment key={pin._id}>
            <Marker
              latitude={pin.lat}
              longitude={pin.long}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <Room
                style={{
                  fontSize: viewport.zoom * 7,
                  color: pin.username === currentUser ? "slateblue" : "crimson",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleMakerClick(pin._id, pin.lat, pin.long);
                }}
              />
            </Marker>
            {currentPlaceId === pin._id && (
              <Popup
                latitude={pin.lat}
                longitude={pin.long}
                closeButton={true}
                closeOnClick={false}
                anchor="right"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{pin.title}</h4>
                  <label>Review</label>
                  <p className="desc">{pin.desc}</p>
                  <label>Rating</label>
                  <div className="stars">{pin.rating}</div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{pin.username}</b>
                  </span>
                  <span className="date">{timeago.format(pin.createdAt)}</span>
                </div>
              </Popup>
            )}
          </React.Fragment>
        ))}
        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            anchor="right"
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form className="card" onSubmit={handleSubmit}>
                <label>Place</label>
                <input
                  type="text"
                  name="title"
                  minLength="3"
                  maxLength="100"
                  placeholder="Name of Place"
                  onChange={(event) => setTitle(event.target.value)}
                  value={title}
                />
                <label>Review</label>
                <input
                  type="text"
                  name="desc"
                  minLength="5"
                  maxLength="300"
                  placeholder="Your Experience"
                  onChange={(event) => setDesc(event.target.value)}
                  value={desc}
                />
                <label>Rating</label>
                <select
                  name="rating"
                  onChange={(event) => setRating(event.target.value)}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="createButton">Add Pin</button>
              </form>
            </div>
          </Popup>
        )}
        {register && <Register />}
        {login && <Login />}
      </ReactMapGL>
    </div>
  );
};

export default App;
