import { useEffect, useState } from "react";
import PostForm from "./PostForm";
import { addPhoto, deletePhoto } from "../db.jsx"; // To read and write photos

function AddForm(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [addition, setAddition] = useState(false);

  //TODO after refactiong the success funtion for post form category should be acessible here to change sms contact
  useEffect(() => {
    if (addition) {
      console.log("useEffect detected addition");
      props.geoLocatePost();
      setAddition(false);
    }
  }, [addition, props]);

  //recive details form form and use them to call addPost 
  function handleSubmit(title, description, category, subcategory, photo) {
    props.addPost( title, description, category, subcategory)
    if (photo){
      console.log("with photo called")
      props.addPost( title, description, category, subcategory, photo)
    } else {
      console.log("without photo called")
      props.addPost( title, description, category, subcategory)
    }
    setAddition(true);
  }

  const ButtonGroup = () => (
    <button type="submit" className="btn btn__primary btn__lg">
      Add
    </button>
  );

  return (
    <div className="pr-container">
      <h3>Create a new post:</h3>
      <PostForm
        {...props}
        submit={handleSubmit}
        titlePlaceholderText="Enter title"
        descriptionPlaceholderText="Enter description"
        buttonGroup={<ButtonGroup />}
      >
        tite = {title}
        description = {description}
        id ={""}
      </PostForm>
    </div>
  );
}

export default AddForm;