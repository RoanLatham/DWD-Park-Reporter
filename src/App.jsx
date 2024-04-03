
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import Todo from "./components/ToDo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import { deletePhoto } from "./db.jsx"; // To read and write photos


function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {

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
      mapURL: `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`,
      smsURL: `sms://00447700900xxxx?body=https://maps.google.com/?q=${latitude},${longitude}`,
    });
  };
  
  const error = () => {
    console.log("Unable to retrieve your location");
  };

  function usePersistedState(key, defaultValue){
    const [state, setState] = useState(() => JSON.parse(localStorage.getItem((key)) || defaultValue));

    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state))
    }, [key, state]);

    return [state, setState];
  }

  const [filter, setFilter] = useState("All");

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  function addTask(title, description) {
    const id = "todo-" + nanoid();
    const newTask = {
      id: id,
      title: title,
      description: description,
      completed: false,
      location: { latitude: "##", longitude: "##", error: "##" },
    };
    setLastInsertedId(id);
    setTasks([...tasks, newTask]);
  }

  // function toggleTaskCompleted(id) {
  //   const updatedTasks = tasks.map((task) => {
  //     // if this task has the same ID as the edited task
  //     if (id === task.id) {
  //       // use object spread to make a new object
  //       // whose `completed` prop has been inverted
  //       return { ...task, completed: !task.completed };
  //     }
  //     return task;
  //   });
  //   setTasks(updatedTasks);
  //   //localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  // }

  function deleteTask(id) {
    deletePhoto(id)
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
    //localStorage.setItem("tasks", JSON.stringify(remainingTasks));
  }

  function editTask(id, newName, newDescription) {
    const editedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // Copy the task and update its name
        return { ...task, title: newName, description: newDescription};
      }
      // Return the original task if it's not the edited task
      return task;
    });
    setTasks(editedTaskList);
    //localStorage.setItem("tasks", JSON.stringify(editedTaskList));
  }

  function locateTask(id, location) {
    console.log("locate Task", id, " before");
    console.log(location, tasks);
    const locatedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        //
        return { ...task, location: location };
      }
      return task;
    });
    console.log(locatedTaskList);
    setTasks(locatedTaskList);
  }
   

  const [tasks, setTasks] = usePersistedState('tasks', []);
  //const [tasks, setTasks] = useState(props.tasks);

  const [lastInsertedId, setLastInsertedId] = useState("");

  function photoedTask(id) {
    console.log("photoedTask", id);
    const photoedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        //
        return { ...task, photo: true };
      }
      return task;
    });
    console.log(photoedTaskList);
    setTasks(photoedTaskList);
  }

  // function photoedTask(id) {
  //   console.log("photoedTask", id);
  
  //   // Find the index of the task with the matching ID
  //   const taskIndex = tasks.findIndex((task) => task.id === id);
  
  //   if (taskIndex !== -1) {
  //     // Create a shallow copy of the tasks array
  //     const updatedTasks = [...tasks];
  
  //     // Update the specific task's photo property
  //     updatedTasks[taskIndex].photo = true;
  
  //     // Update the state with the new tasks list
  //     setTasks(updatedTasks);
  //   } else {
  //     console.warn(`Task with ID ${id} not found.`);
  //   }
  // }
  

  const taskList = tasks
  .filter(FILTER_MAP[filter])
  .map((task) => (
    <Todo
      id={task.id}
      title={task.title}
      description={task.description}
      completed={task.completed}
      key={task.id}
      // latitude={task.location.latitude}
      // longitude={task.location.longitude}
      location={task.location} 
      // toggleTaskCompleted={toggleTaskCompleted}
      photoedTask={photoedTask}
      photo={task.photo}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));

  return (
    <div className="park-reporter-app">
      <div className="pr-title-container pr-container">
        {/* <h1 style={{ color: "var(--pr-primary-color)" }}>Park </h1> <h1 style={{ color: "var(--pr-accent-color)" }}> Reporter</h1> */}
        <h1>Park Reporter</h1>
      </div>
      <Form addTask={addTask} geoFindMe={geoFindMe}/>
      <div className="filters btn-group stack-exception pr-container">
       {filterList}
      </div>
      <div className="pr-title-container pr-container"> <h2>Posts</h2></div>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
      {/* <button type="button" className="btn" onClick={props.exportToJSON(tasks, 'Park-Reporter-Posts.json')}> Export Posts</button> */}
    </div>
  );
}

export default App;
