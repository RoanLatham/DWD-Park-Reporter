import React, { useState } from "react";
import { WebcamCapture, ViewPhoto } from "./WebcamCapture.jsx";

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
  const [selectedSubcategory, setSelectedSubcategory] = useState(props.subcategory);

  // Handle category change
  function handleCategoryChange(e) {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory(""); //reset subcategory when main category is changed
  }

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
        props.Submit(
            props.id,
            newTitle,
            newDescription,
            selectedCategory,
            selectedSubcategory
            );
      setNewTitle("");
      setNewDescription("");
      setTitleError("");
      setDescriptionError("");
      props.handleSave()
    }
  }

  // Determine which subtags to display based on the selected category
  const subtags =
    selectedCategory === props.maintenanceCategory.name
      ? props.maintenanceCategory.subtags // If category is maintenanceCategory load maintenance subtags
      : props.wildlifeCategory.subtags; // If not, load wildlife sub category

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
      <ViewPhoto id={props.id} alt={props.title} />
      <div className="overlay">
        <div type="button" className="btn btn_overlay">
          Change Photo
        </div>
      </div>
    </button>
  );

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
          placeholder={`Change post title (${props.title})`}
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
          placeholder={`Change post description (${props.title})`}
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
            {subtags.map((subtag, index) => (
              <option key={index} value={subtag}>
                {subtag}
              </option>
            ))}
          </select>
        </div>
      </div>
      {props.photo ? (
        <WebcamCapture
          id={props.id}
          photoedPost={props.photoedPost}
          takePhotoButton={changePhotoButton}
        />
      ) : (
        <WebcamCapture
          id={props.id}
          photoedPost={props.photoedPost}
          takePhotoButton={takePhotoButton}
        />
      )}
      {props.buttonGroup}
    </form>
  );
}

export default PostForm;
