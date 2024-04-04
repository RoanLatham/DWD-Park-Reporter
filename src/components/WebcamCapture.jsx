import React, { useState, useEffect, useRef, useCallback } from 'react';
import Popup from 'reactjs-popup';
import Webcam from 'react-webcam';
import { addPhoto, GetPhotoSrc } from "../db.jsx"; // To read and write photos

export function WebcamCapture(props) {
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
        props.photoedPost(imgId);
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
          trigger={props.takePhotoButton}
          modal
          onClose={() => cancelPhoto()}
        >
          {(close) => (
            <div>
              {!imgSrc && (
                <Webcam className="pr-Webcam"
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ deviceId: selectedDeviceId }}
                />
              )}
              {imgSrc && <img src={imgSrc} />}
              <div className="btn-group btn-group-vertical">
                <div className="btn-group">
                  <select className="btn pr-select" value={selectedDeviceId} onChange={handleSelectChange}>
                    {webcams.map((device) => (
                      // List all avaible webcam deveices, adn facign modes for mobile, if the webcam has a label use that, if not construct a name using the camera id
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Camera ${webcams.indexOf(device) + 1}`} {device.facingMode}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="btn-group" style={{marginLeft: "0px"}}>
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
                    className="btn"
                    onClick={() => cancelPhoto(close)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </Popup>
      </>
    );
  }
  
  export const ViewPhoto = (props) => {
    const photoSrc = GetPhotoSrc(props.id);
    return (
      <>
        <div>
          <img className="pr-Webcam" src={photoSrc} alt={props.name} />
        </div>
      </>
    );
  };