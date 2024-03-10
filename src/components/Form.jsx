import { useEffect, useState } from "react";

function Form(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [addition, setAddition] = useState(false);

  useEffect(() => {
    if (addition) {
      console.log("useEffect detected addition");
      props.geoFindMe();
      setAddition(false);
    }
  }, [addition, props]);

  function handleSubmit(event) {
    event.preventDefault();
    
    let titleErrorText = "";
    let descriptionErrorText = "";
  
    if (!title.trim()) {
      titleErrorText = "You must enter a title";
    }
  
    if (!description.trim()) {
      descriptionErrorText = "You must enter a description";
    }
  
    setTitleError(titleErrorText);
    setDescriptionError(descriptionErrorText);
  
    if (!titleErrorText && !descriptionErrorText) {
      // If both fields are not empty, proceed with adding the task
      setAddition(true);
      props.addTask(title, description);
      setTitle("");
      setDescription("");
    }
  }
  function handleTitleChange(event) {
    setTitle(event.target.value);
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }

  return (
    <div className="pr-post-container">
      <form onSubmit={handleSubmit}>
        <h3>Create a new post:</h3>
        <input
          type="text"
          id="park-watch-title-input"
          className="input input__lg"
          name="title"
          placeholder="Enter Title"
          autoComplete="off"
          value={title}
          onChange={handleTitleChange}
        />
        {titleError && <p className="pr-vallidation-message">{titleError}</p>}

        <input
          type="text"
          id="park-watch-description-input"
          className="input input__lg"
          name="description"
          placeholder="Enter description"
          autoComplete="off"
          value={description}
          onChange={handleDescriptionChange}
        />
        {descriptionError && <p className="pr-vallidation-message">{descriptionError}</p>}

        <button type="submit" className="btn btn__primary btn__lg">
          Add
        </button>
      </form>
    </div>
  );
}

export default Form;