import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// const DATA = [
//   { id: "todo-0", name: "Eat", completed: true },
//   { id: "todo-1", name: "Sleep", completed: false },
//   { id: "todo-2", name: "Repeat", completed: false },
// ];

//{id: "todo-0", name: "Example", completed: true}

// localStorage.setItem('tasks', JSON.stringify(DATA));

if ("serviceWorker" in navigator) {
 window.addEventListener("load", () => {
 navigator.serviceWorker
 .register("./service-worker.js")
 .then((registration) => {
 console.log("Service Worker registered! Scope: ", registration.scope);
 })
 .catch((err) => {
 console.log("Service Worker registration failed: ", err);
 });
 });
}

const geoFindMe = () => {
  if (!navigator.geolocation) {
    console.log("Geolocation is not supported by your browser");
  } else {
    console.log("Locating…");
    navigator.geolocation.getCurrentPosition(success, error);
  }
};

const success = (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  console.log(latitude, longitude);
  console.log(`Latitude: ${latitude}°, Longitude: ${longitude}°`);
  console.log(
    `Try here: https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
  );
  locateTask(lastInsertedId, {
    latitude: latitude,
    longitude: longitude,
    error: "",
  });
};

const error = () => {
  console.log("Unable to retrieve your location");
};

const DATA = JSON.parse(localStorage.getItem('tasks')) || [];

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App tasks={DATA} />
  </React.StrictMode>,
)
