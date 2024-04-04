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

function PrPost(props) {
  // Editing state for switichg to editiing template
  const [isEditing, setEditing] = useState(false);

  // States for new desctiptiion and title for edit template
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Referance to edit template title input for keyboard focus
  const editTitleFieldRef = useRef(null);
  // Referance to View template edit button for keyboard focus
  const editButtonRef = useRef(null);

  const wasEditing = usePrevious(isEditing);

  //States for Input validation on edit template
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

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

  function handleTitleChange(e) {
    setNewTitle(e.target.value);
  }
  function handleDescriptionChange(e) {
    setNewDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
      
    //input validaiton
    let titleErrorText = "";
    let descriptionErrorText = "";
  
    if (!newTitle.trim()) {
      titleErrorText = "You must enter a title";
    }
  
    if (!newDescription.trim()) {
      descriptionErrorText = "You must enter a description";
    }
    
    setTitleError(titleErrorText);
    setDescriptionError(descriptionErrorText);
  
    if (!titleErrorText && !descriptionErrorText) {
      // If both fields are not empty, proceed with editing the post
      props.editPost(props.id, newTitle, newDescription);
      setNewTitle("");
      setNewDescription("");
      setTitleError("");
      setDescriptionError("");
      setEditing(false);
    }
  }

  function handleCancel(){
    // Reset all used variables so when the user edits again nothing is left over
    setEditing(false);
    setNewTitle("");
    setNewDescription("");
    setTitleError("");
    setDescriptionError("");
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
        <div type = "button" className="btn btn_overlay" >Change Photo</div>
        </div>
    </button>
  );

  const editingTemplate = (
    <div className="pr-post-container">
      <form className="stack-small" onSubmit={handleSubmit}>
        <div className="form-group">
          {/* Title Input */}
          <input
            id={props.id}
            className="pr-text"
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
            ref={editTitleFieldRef}
            placeholder={`Change post title (${props.title})`}
          />
          {/* If titleError is true / does exits, displayt input vlaidaion message */}
          {titleError && <p className="pr-vallidation-message">{titleError}</p>}

          {/* Description Input */}
          <textarea
            id={props.id}
            className="pr-text"
            type="text"
            value={newDescription}
            onChange={handleDescriptionChange}
            placeholder={`Change post description (${props.title})`}
          />
          {/* If descriptionError is true / does exits, displayt input vlaidaion message */}
          {descriptionError && <p className="pr-vallidation-message">{descriptionError}</p>}

        </div>
        {props.photo ? <WebcamCapture id={props.id} photoedPost={props.photoedPost} takePhotoButton={changePhotoButton} /> :
          <WebcamCapture id={props.id} photoedPost={props.photoedPost} takePhotoButton={takePhotoButton} />
        }
        <div className="btn-group">
          <button
            type="button"
            className="btn"
            onClick={handleCancel}
          >
            Cancel
            <span className="visually-hidden">editing {props.title}</span>
          </button>
          <button type="submit" className="btn btn__primary">
            Save
            <span className="visually-hidden">edits to {props.title}</span>
          </button>
          <button
            type="button"
            className="btn btn__danger"
            onClick={() => props.deletePost(props.id)}
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
          <h3 htmlFor={props.id}>
            {props.title}
          </h3>

          <p>
          {props.description}
          </p>
        
        <ViewPhoto id={props.id} alt={props.title} />

        <p>
            <a href={props.location.mapURL}> Lat: {props.location.latitude}°N | Lon: {props.location.longitude}°W | (View map)</a>
            <br />
            <br />
            <a href={props.location.smsURL}>(sms)</a>
            <br />
            <br />
            posted on {props.date}
        </p>

        <div className="btn-group btn-group-vertical">
          <button
            type="button"
            className="btn"
            onClick={() => {
              setEditing(true); // Toggle isEditing state
              setNewTitle(props.title); // Set newTitle with props.title, so the input feield is pre-populated with the old title
              setNewDescription(props.description); // Set newDescription with props.desciption, so the input feield is pre-populated with the old title
            }}
            ref={editButtonRef}
          >
            Edit <span className="visually-hidden">{props.title}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return <li className="pr-post-list-item">{isEditing ? editingTemplate : viewTemplate}</li>;
}

export default PrPost;
