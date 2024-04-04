import { useEffect, useState } from "react";
import PostForm from "./PostForm";

function AddForm(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [addition, setAddition] = useState(false);

  useEffect(() => {
    if (addition) {
      console.log("useEffect detected addition");
      props.geoLocatePost();
      setAddition(false);
    }
  }, [addition, props]);

  // function handleSubmit(event) {
  //   event.preventDefault();
    
  //   //input validaiton
  //   let titleErrorText = "";
  //   let descriptionErrorText = "";
  
  //   if (!title.trim()) {
  //     titleErrorText = "You must enter a title";
  //   }
  
  //   if (!description.trim()) {
  //     descriptionErrorText = "You must enter a description";
  //   }
  
  //   setTitleError(titleErrorText);
  //   setDescriptionError(descriptionErrorText);
  
  //   if (!titleErrorText && !descriptionErrorText) {
  //     // If both fields are not empty, proceed with adding the task
  //     setAddition(true);
  //     props.addTask(title, description);
  //     setTitle("");
  //     setDescription("");
  //   }
  // }
  // function handleTitleChange(event) {
  //   setTitle(event.target.value);
  // }

  // function handleDescriptionChange(event) {
  //   setDescription(event.target.value);
  // }

  const ButtonGroup = () => (
    <button type="submit" className="btn btn__primary btn__lg">
      Add
    </button>
  )

  function handleSave(){
    setAddition(true);
  }


  return (
    <div className="pr-container">
      <h3>Create a new post:</h3>
      <PostForm {...props} 
      submit = {props.addPost} 
      titlePlaceholderText = 'Enter title'
      descriptionPlaceholderText = 'Enter description'
      handleSave  = {handleSave}
      buttonGroup={<ButtonGroup/>}>
        tite = {title}
        description = {description}
        id ={''}
      </PostForm>
 
    </div>
  );
}

export default AddForm;