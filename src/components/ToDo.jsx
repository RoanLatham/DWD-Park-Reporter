import { useEffect, useRef, useState, useCallback } from "react"; // Add useRef & useCallback
import Popup from "reactjs-popup"; // For our popups
import "reactjs-popup/dist/index.css"; // For the popups to look nicer.
import Webcam from "react-webcam"; // For using react-webcam
import { addPhoto, GetPhotoSrc } from "../db.jsx"; // We will need this for futher steps

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function WebcamCapture(props) {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [imgId, setImgId] = useState(null);
  const [photoSave, setPhotoSave] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false); // Track whether a photo has been taken
  const [webcams, setWebcams] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  useEffect(() => {
    const getWebcams = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setWebcams(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Error getting webcams:', error);
      }
    };

    getWebcams();
  }, []);

  const handleSelectChange = (event) => {
    setSelectedDeviceId(event.target.value);
  };

  useEffect(() => {
    if (photoSave) {
      props.photoedTask(imgId);
      setPhotoTaken(true); // Set photoTaken to true after saving photo
      setPhotoSave(false);
    }
  }, [photoSave, props, imgId]);

  const capture = useCallback(
    (id) => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
      setPhotoTaken(true); // Set photoTaken to true after capturing a photo
    },
    [webcamRef, setImgSrc]
  );

  const savePhoto = (id, imgSrc, close) => {
    addPhoto(id, imgSrc);
    setImgId(id);
    setPhotoSave(true);
    close();
  };

  const cancelPhoto = (close) => {
    setImgSrc(null);
    setPhotoTaken(false); // Reset photoTaken state when canceling the photo
    close(); // Close the popup
  };

  const retakePhoto = (id) => {
    setImgSrc(null);
    setPhotoTaken(false); // Reset photoTaken state when retaking the photo
    capture(id)
  };

  return (
    <>
      {/* Take Photo popup */}
      <Popup
        trigger={
          <button type="button" className="btn">
            {" "}
            Take Photo{" "}
          </button>
        }
        modal
        onClose={() => cancelPhoto()}
      >
        {(close) => (
          <div>
            <select value={selectedDeviceId} onChange={handleSelectChange}>
              {webcams.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${webcams.indexOf(device) + 1}`}
                </option>
              ))}
            </select>
            {!imgSrc && (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ deviceId: selectedDeviceId }}
              />
            )}
            {imgSrc && <img src={imgSrc} />}
            <div className="btn-group">
              {!photoTaken && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => capture(props.id)}
                >
                  Capture photo
                </button>
              )}
              {photoTaken && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => retakePhoto(props.id)}
                >
                  Retake Photo
                </button>
              )}
              {photoTaken && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => savePhoto(props.id, imgSrc, close)}
                >
                  Save Photo
                </button>
              )}
              <button
                type="button"
                className="btn todo-cancel"
                onClick={() => cancelPhoto(close)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Popup>
    </>
  );
}

const ViewPhoto = (props) => {
  const photoSrc = GetPhotoSrc(props.id);
  return (
    <>
      <div>
        <img src={photoSrc} alt={props.name} />
      </div>
    </>
  );
};

function Todo(props) {
  const [isEditing, setEditing] = useState(false);

  const [newName, setNewName] = useState("");

  const editFieldRef = useRef(null);
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
      editFieldRef.current.focus();
    } else if (wasEditing && !isEditing) {
      editButtonRef.current.focus();
    }
  }, [wasEditing, isEditing]);

  function handleChange(e) {
    setNewName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.editTask(props.id, newName);
    setNewName("");
    setEditing(false);
  }

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={props.id}>
          New name for {props.name}
        </label>
        <input
          id={props.id}
          className="todo-text"
          type="text"
          value={newName}
          onChange={handleChange}
          ref={editFieldRef}
        />
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => setEditing(false)}
        >
          Cancel
          <span className="visually-hidden">renaming {props.name}</span>
        </button>
        <button type="submit" className="btn btn__primary todo-edit">
          Save
          <span className="visually-hidden">new name for {props.name}</span>
        </button>
      </div>
    </form>
  );

  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompleted(props.id)}
        />
        <label className="todo-label" htmlFor={props.id}>
          {props.name}
          {/* &nbsp;| la {props.latitude}
          &nbsp;| lo {props.longitude} */}
          <a href={props.location.mapURL}> (map)</a>
          &nbsp; | &nbsp;
          <a href={props.location.smsURL}>(sms)</a>
        </label>
      </div>

      <div className="btn-group">
        <button
          type="button"
          className="btn"
          onClick={() => setEditing(true)}
          ref={editButtonRef}
        >
          Edit <span className="visually-hidden">{props.name}</span>
        </button>

        <WebcamCapture id={props.id} photoedTask={props.photoedTask} />

        {/* View Photo popup */}
        <Popup
          trigger={
            <button type="button" className="btn">
              {" "}
              View Photo{" "}
            </button>
          }
          modal
        >
          <div>
            <ViewPhoto id={props.id} alt={props.name} />
          </div>
        </Popup>

        <button
          type="button"
          className="btn btn__danger"
          onClick={() => props.deleteTask(props.id)}
        >
          Delete <span className="visually-hidden">{props.name}</span>
        </button>
      </div>
    </div>
  );

  return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;
}

export default Todo;
