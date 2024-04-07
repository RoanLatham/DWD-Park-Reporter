import React, { useState, useEffect } from "react";
import { WebcamCapture, ViewPhoto } from "./WebcamCapture.jsx";
import { addPhoto, GetPhotoSrc } from "../db.jsx"; // To read and write photos

function PostForm(props) {
  // States for new desctiptiion and title for edit template
  const [newTitle, setNewTitle] = useState(props.title);
  const [newDescription, setNewDescription] = useState(props.description);

  // States for Input validation on edit template
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  // State for the selected category
  const [selectedCategory, setSelectedCategory] = useState(props.category);

  // State for the selected subcategory
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    props.subcategory
  );

  // Handle category change
  function handleCategoryChange(e) {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory(""); //reset subcategory when main category is changed
  }

  //   //state to store photo before submission
  //   // Get the photo source if a post ID exists, otherwise set to null
  //     const initialPhotoSrc = props.id && props.photo ? GetPhotoSrc(props.id) : null;

  //   // Set the initial state
  //   const [photo, setPhoto] = useState(initialPhotoSrc);

  //   //re-render once photo is recived from db
  //   useEffect(() => {
  //     if (props.id && props.photo) {
  //       const newPhotoSrc = GetPhotoSrc(props.id);
  //       setPhoto(newPhotoSrc);
  //     }
  //   }, [props.id, props.photo]);
  //   screw react let me get the photo from db gawd

  // Set the initial state
  const [tempPhoto, setTempPhoto] = useState(null);

  // Handle subcategory change
  function handleSubcategoryChange(e) {
    setSelectedSubcategory(e.target.value);
  }

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
        props.submit(
          newTitle,
          newDescription,
          selectedCategory,
          selectedSubcategory
        );
        //save photo to indexed db on submit, or do nothing if no photo was taken
        if (props.id &&tempPhoto) {
          addPhoto(props.id, tempPhoto);
        }
      setNewTitle("");
      setNewDescription("");
      setTitleError("");
      setDescriptionError("");
    }
  }

  // Determine which subtags to display based on the selected category
  const subtags =
    selectedCategory === props.maintenanceCategory.name
      ? props.maintenanceCategory.subtags // If category is maintenanceCategory load maintenance subtags
      : props.wildlifeCategory.subtags; // If not, load wildlife subtags

  function handleTitleChange(e) {
    setNewTitle(e.target.value);
  }
  function handleDescriptionChange(e) {
    setNewDescription(e.target.value);
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
      {/* Conditional rendering in a temp photo exists show that, if not show the save photo */}
      {tempPhoto ? (
        <div>
          <img className="pr-Webcam" src={tempPhoto} alt={props.title} />
        </div>
      ) : (
        <ViewPhoto id={props.id} alt={props.title} />
      )}

      <div className="overlay">
        <div type="button" className="btn btn_overlay">
          Change Photo
        </div>
      </div>
    </button>
  );

  const handlePhotoTaken = (imgSrc) => {
    // Save imgSrc in the state or somewhere to use it when submitting
    setTempPhoto(imgSrc);
  };

  return (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        {/* Title Input */}
        <input
          id={props.id}
          className="input pr-text pr-post-input"
          type="text"
          value={newTitle}
          onChange={handleTitleChange}
          ref={props.editTitleFieldRef}
          placeholder={props.titlePlaceholderText}
        />
        {/* If titleError is true / does exits, display input vlaidaion message */}
        {titleError && <p className="pr-vallidation-message">{titleError}</p>}

        {/* Description Input */}
        <textarea
          id={props.id}
          className="input pr-text pr-post-input"
          type="text"
          value={newDescription}
          onChange={handleDescriptionChange}
          placeholder={props.descriptionPlaceholderText}
        />
        {/* If descriptionError is true / does exits, display input vlaidaion message */}
        {descriptionError && (
          <p className="pr-vallidation-message">{descriptionError}</p>
        )}

        <div className="btn-group">
          <select
            className="btn pr-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option key="0" value="">
              {" "}
              none{" "}
            </option>
            <option value={props.maintenanceCategory.name}>
              {" "}
              {props.maintenanceCategory.name}
            </option>
            <option value={props.wildlifeCategory.name}>
              {" "}
              {props.wildlifeCategory.name}
            </option>
          </select>
          <select
            className="btn pr-select"
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
          >
            <option key="0" value="">
              {" "}
              none{" "}
            </option>
            {/* Conditinal rendering only show subcategoriews in main category is not null, sub categorires are reset elsewhere everytime a main category selection chagnges*/}
            {selectedCategory &&
              selectedCategory !== "" &&
              subtags.map((subtag, index) => (
                <option key={index} value={subtag}>
                  {subtag}
                </option>
              ))}
          </select>
        </div>
      </div>
      <WebcamCapture
        id={props.id}
        photoedPost={props.photoedPost}
        returnPhoto={handlePhotoTaken}
        takePhotoButton={
          tempPhoto || props.photo ? changePhotoButton : takePhotoButton
        } //show exisiting photo if theer is a photo in the database or an unsaved "tempphoto"
      />
      {props.buttonGroup}
    </form>
  );
}

export default PostForm;
