import { useEffect, useRef, useState, useCallback } from "react"; // Add useRef & useCallback
import Popup from "reactjs-popup"; // For our popups
import "reactjs-popup/dist/index.css"; // For the popups to look nicer.
import { WebcamCapture, ViewPhoto } from './WebcamCapture.jsx';
import PostForm from './PostForm.jsx'
import { addPhoto, GetPhotoSrc } from "../db.jsx"; // To read and write photos

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

  // Referance to edit template title input for keyboard focus
  const editTitleFieldRef = useRef(null);
  // Referance to View template edit button for keyboard focus
  const editButtonRef = useRef(null);
  const wasEditing = usePrevious(isEditing);

  //use previous with use efect to focus on edit button on view template and focus on title feild on edit template
  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  // useEffect(() => {
  //   if (!wasEditing && isEditing) {
  //     editTitleFieldRef.current.focus();
  //   } else if (wasEditing && !isEditing) {
  //     editButtonRef.current.focus();
  //   }
  // }, [wasEditing, isEditing]);

  function handleCancel() {
    setEditing(false);
  }

  //recive details form form and add ID for edit Post funtion
  function handleSubmit(title, description, category, subcategory) {
    props.editPost(props.id, title, description, category, subcategory)
    setEditing(false);
  }

  //define aditional buttons to render inside PostForm
  const ButtonGroup = (props) => (
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
  );

  const editingTemplate = (
    <div className="pr-post-container">
      <PostForm
        {...props}
        submit={handleSubmit}
        titlePlaceholderText = {`Change post title (${props.title})`}
        descriptionPlaceholderText = {`Change post description (${props.title})`}
        buttonGroup={
          <ButtonGroup
            {...props}
            editTitleFieldRef={editTitleFieldRef}
            handleCancel={handleCancel}
          />
        }
      ></PostForm>
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

        <p>
        {props.category}
        <br />
        -{props.subcategory}
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
