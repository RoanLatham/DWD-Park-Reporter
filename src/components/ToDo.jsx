import { useEffect, useRef, useState, useCallback } from "react"; // Add useRef & useCallback
import Popup from "reactjs-popup"; // For our popups
import "reactjs-popup/dist/index.css"; // For the popups to look nicer.
import { WebcamCapture, ViewPhoto } from './WebcamCapture.jsx';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function Todo(props) {
  const [isEditing, setEditing] = useState(false);

  const [newTitle, setNewTitle] = useState("");

  const editTitleFieldRef = useRef(null);
  const editButtonRef = useRef(null);

  const wasEditing = usePrevious(isEditing);

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  useEffect(() => {
    if (!wasEditing && isEditing) {
      editTitleFieldRef.current.focus();
    } else if (wasEditing && !isEditing) {
      editButtonRef.current.focus();
    }
  }, [wasEditing, isEditing]);

  function handleChange(e) {
    setNewTitle(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.editTask(props.id, newTitle);
    setNewTitle("");
    setEditing(false);
  }

  const takePhotoButton = (
    <div className="btn-group">
      <button type="button" className="btn">
        {" "}
        Add Photo{" "}
      </button>
    </div>
  );

  const changePhotoButton = (
    <button type="button" className="btn, pr-change-photo-button">
      <ViewPhoto id={props.id} alt={props.title} />
      <div className="overlay">
        <div className="btn" >Change Photo</div>
        </div>
    </button>
  );

  const editingTemplate = (
    <div className="pr-post-container">
      <form className="stack-small" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            id={props.id}
            className="todo-text"
            type="text"
            value={newTitle}
            onChange={handleChange}
            ref={editTitleFieldRef}
            placeholder={`Change post title (${props.title})`}
          />
          {/* <input
            id={props.id}
            className="todo-text"
            type="text"
            value={newDescription}
            onChange={handleChange}
            ref={editDescriptionFieldRef}
            placeholder={`Change post description (${props.title})`}
          /> */}
        </div>
        {props.photo ? <WebcamCapture id={props.id} photoedTask={props.photoedTask} takePhotoButton={changePhotoButton} /> :
          <WebcamCapture id={props.id} photoedTask={props.photoedTask} takePhotoButton={takePhotoButton} />
        }
        <div className="btn-group">
          <button
            type="button"
            className="btn todo-cancel"
            onClick={() => setEditing(false)}
          >
            Cancel
            <span className="visually-hidden">editing {props.title}</span>
          </button>
          <button type="submit" className="btn btn__primary todo-edit">
            Save
            <span className="visually-hidden">edits to {props.title}</span>
          </button>
          <button
            type="button"
            className="btn btn__danger"
            onClick={() => props.deleteTask(props.id)}
          >
            Delete post<span className="visually-hidden">{props.title}</span>
          </button>
        </div>
      </form>
    </div>
  );

  const viewTemplate = (
    <div className="pr-post-container">
      <div className="stack-small">
          <h3 className="todo-label" htmlFor={props.id}>
            {props.title}
          </h3>

          <p>
          {props.description}
          </p>
        
        <ViewPhoto id={props.id} alt={props.title} />

        <p>
            {/* &nbsp;| la {props.latitude}
            &nbsp;| lo {props.longitude} */}
            <a href={props.location.mapURL}> (map)</a>
            &nbsp; | &nbsp;
            <a href={props.location.smsURL}>(sms)</a>
        </p>

        <div className="btn-group btn-group-vertical">
          <button
            type="button"
            className="btn"
            onClick={() => {
              setEditing(true); // Toggle isEditing state
              setNewTitle(props.title); // Set newTitle with props.title, so the input feield is pre-populated with the old title
            }}
            ref={editButtonRef}
          >
            Edit <span className="visually-hidden">{props.title}</span>
          </button>
          


        </div>
      </div>
    </div>
  );

  return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;
}

export default Todo;
