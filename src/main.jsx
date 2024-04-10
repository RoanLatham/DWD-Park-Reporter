import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './base.css'
import './park-reporter.css'
import { importPhotos } from "./db.jsx"; // To read and write photos

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

  // Is this really how people do this?
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}


// Attempt to load data from local storage, if none exists populate the browsers local storage with default data
// const DATA = JSON.parse(localStorage.getItem('posts')) || PopulateWithDefaultData();

//load default dat json, save it to local sotage and also return it for use when the apps first loads
async function PopulateWithDefaultData() {
  const response = await fetch('/DWD-Park-Reporter/default-data.json');
  if (!response.ok) {
    throw new Error(`Error fetching default data!: ${response.status}`);
  }
  const defaultDATA = await response.json();
  localStorage.setItem('posts', JSON.stringify(defaultDATA));

  fetchAndImportPhotos() 

  return defaultDATA;
  
}

async function fetchAndImportPhotos() {
  const response = await fetch('/DWD-Park-Reporter/default-photos.json');
  if (!response.ok) {
    throw new Error(`Error fetching default photos!: ${response.status}`);
  }
  const photosJson = await response.json(); // Await the resolution of the json() promise
  importPhotos(photosJson); // Pass the parsed JSON object to the importPhotos function
}


// Attempt to load data from local storage, if none exists load default data instead and save default data to local storage
async function loadData() {
  let data;
  const tasks = localStorage.getItem('posts');
  // If data is found in local sotrage load it, if not run the funtion to fetch and use default-data.json
  if (tasks) {
    data = JSON.parse(tasks);
  } else {
    data = await PopulateWithDefaultData();
  }
  return data;
}

// Since fetching the dafualt data is async, wait until data is loaded, either default or local storage, before loading the rest of the page
loadData().then((DATA) => {
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App exportToJSON={exportToJSON}/>
  </React.StrictMode>,
)
}).catch((error) => {
  console.error("Failed to load data: ", error);
});