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
// Components
import Register from "./components/Register";
import Login from "./components/Login";

import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const App = () => {
  const myStorage = window.localStorage;

  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("https://map-pin-app.herokuapp.com/api/pins", {
        username: currentUser,
        title,
        desc,
        rating,
        lat: newPlace.lat,
        long: newPlace.long,
      });

      setPins([...pins, response.data]);
      setNewPlace(null);
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

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  useEffect(() => {
    const getPins = async () => {
      try {
        const response = await axios.get("https://map-pin-app.herokuapp.com/api/pins");

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
        mapboxApiAccessToken="pk.eyJ1IjoiYnVja2V0bGVzIiwiYSI6ImNrd2k1cnU4NTBtMTIycHBreGZsNjhhY28ifQ.NWvkzo7NoS-r3uLQj9Izug"
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapStyle="mapbox://styles/bucketles/ckwjmvbo73dmr14lhpjccwjfh"
        onDblClick={currentUser && handleAddClick}
        onClick={handleClose}
      >
        <span>After Login, Double Click to Add a Pin!</span>
        {currentUser ? (
          <button className="logoutButton" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <>
            <button
              className="loginButton"
              onClick={handleLoginClick}
              // handleloginsubmit={handleLoginSubmit}
            >
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
              offsetLeft={-viewport.zoom * 3.5}
              offsetTop={-viewport.zoom * 7}
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
                  <div className="stars">
                    {Array(pin.rating).fill(<Star className="star" />)}
                  </div>
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
        {register && <Register register={setRegister} />}
        {login && (
          <Login
            login={setLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
      </ReactMapGL>
    </div>
  );
};

export default App;
