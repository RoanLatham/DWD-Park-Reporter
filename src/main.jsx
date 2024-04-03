import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './base.css'
import './park-reporter-dark.css';
import defaultDATA from './default-data.json';


// const DATA = [
//   { id: "todo-0", name: "Data Test", completed: true, location: { latitude: "##", longitude: "##", error: "##" },},
//   // { id: "todo-1", name: "Sleep", completed: false },
//   // { id: "todo-2", name: "Repeat", completed: false,},
// ];
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

// Funtion to Export list of posts in JSON and download the json file from browser
function exportToJSON(data, filename) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  // Clean up by revoking the object URL
  URL.revokeObjectURL(url);
}

function PopulateWithDefaultData(){
  localStorage.setItem('tasks', JSON.parse(defaultDATA))
  return JSON.parse(defaultDATA)
}

// Attemtp to load data from local storage, if none exists populate the browsers local storage with default data
const DATA = JSON.parse(localStorage.getItem('tasks')) || PopulateWithDefaultData();


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App tasks={DATA} exportToJSON={exportToJSON}/>
  </React.StrictMode>,
)
