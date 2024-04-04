
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import PrPost from "./components/PrPost.jsx";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import { deletePhoto } from "./db.jsx"; // To read and write photos


function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function App(props) {

  // Get Locataion funtions:
  // Get current Position from broswer
  // If locatiing successful run locationSuccess()
  const geoLocatePost = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
    } else {
      console.log("Locating…");
      navigator.geolocation.getCurrentPosition(locationSuccess, geoLocateError);
    }
  };
  
  // If geolocation was successfull  run locatePost, which saves location data to given post ID
  const locationSuccess = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude, longitude);
    console.log(`Latitude: ${latitude}°, Longitude: ${longitude}°`);
    console.log(
      `Try here: https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
    );
    locatePost(lastInsertedId, {
      latitude: latitude,
      longitude: longitude,
      error: "",
      mapURL: `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`,
      smsURL: `sms://00447700900xxxx?body=https://maps.google.com/?q=${latitude},${longitude}`,
    });
  };
  
  const geoLocateError = () => {
    console.log("Unable to retrieve post location");
  };

  // Persistant storage using broswers local storage
  function usePersistedState(key, defaultValue){
    const [state, setState] = useState(() => JSON.parse(localStorage.getItem((key)) || defaultValue));

    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state))
    }, [key, state]);

    return [state, setState];
  }

  // Filter buttons:
  // Defining categories and their subtags as objects
  const wildlifeCategory = {
    name: 'Wildlife',
    subtags: ['Birds', 'Mammals', 'Insects'],
  };

  const maintenanceCategory = {
    name: 'Maintenance',
    subtags: ['Cleaning', 'Repairs', 'Landscaping'],
  };

    // Construct filter options
    const FILTER_MAP = {
      All: () => true,
      Wildlife: (post) => post.category == "Wildlife",
      Maintenance: (post) => post.category == "Maintenance",
    };
    
    // generate list of filter name usign only keys from filter map
    const FILTER_NAMES = Object.keys(FILTER_MAP);
  
    // Use state to keep track of applied filter
    const [filter, setFilter] = useState("All");
  
    // Automatically generate buttons for each filter 
    const filterList = FILTER_NAMES.map((name) => (
      <FilterButton
        key={name}
        name={name}
        isPressed={name === filter}
        setFilter={setFilter}
      />
    ));

  // Posts CRUD
  // constuct new post and add to postslist
  function addPost(title, description) {
    const id = "post-" + nanoid();

    const newPost = {
      id: id,
      title: title,
      description: description,
      date: getDate(),
      location: { latitude: "##", longitude: "##", error: "##" },
    };

    setLastInsertedId(id);
    setPosts([...posts, newPost]);
  }

  function getDate() {
    // Create a new date object for the current date and time
    const currentDateTime = new Date();
  
    // Format the date and time in a human-readable way e.g., "March 15, 2024, 10:30:00 AM"
    const formattedDateTime = currentDateTime.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  
    return formattedDateTime;
  }
  
  //Delete a post by deleteign its attached photo from indexed db and using filter, save every post that does not have the given ID, resulting in teh given id beign removed from the posts list
  function deletePost(id) {
    deletePhoto(id)
    const remainingPosts = posts.filter((post) => id !== post.id);
    setPosts(remainingPosts);
  }

  // Edit details for a given post ID in postslist
  function editPost(id, newName, newDescription, newCategory, newSubcategory) {
    // Map over every post, edit the given post and leave the rest untouched 
    const editedPostList = posts.map((post) => {
      if (id === post.id) {
        // If this post has the same ID as the edited post copy the post and update its name
        return { ...post, title: newName, description: newDescription, category: newCategory, subcategory: newSubcategory};
      }
      // Return the original post to the postlist if it's not the edited post
      return post;
    });
    setPosts(editedPostList);
  }

  // Add location to post attributes, update and save postlist with new location
  function locatePost(id, location) {
    console.log("locate Post", id, " before");
    console.log(location, posts);
    // Map over every post, add location data to the given post and leave the rest untouched 
    const locatedPostList = posts.map((post) => {
      // If this post  has the same ID as the located post add the location data to this post
      if (id === post.id) {
        // If this post has the same ID as the located post copy the post and update its location
        return { ...post, location: location };
      }
      // Return the post unchanged to the postlist if it's not the located post
      return post;
    });
    console.log(locatedPostList);
    setPosts(locatedPostList);
  }
   
  // Store and edit or delete posts in bowsers local storage
  const [posts, setPosts] = usePersistedState('posts', []);

  //keep track of last post added to preform async operations on it like geo locating 
  const [lastInsertedId, setLastInsertedId] = useState("");

  // Add photoed attribute to given post, update and save postlist
  function photoedPost(id) {
    console.log("photoedPost", id);
    // Map over every post, add photo attibued to the given post and leave the rest untouched 
    const photoedPostList = posts.map((post) => {
      // If this post  has the same ID as the located post set the photo attribute to true
      if (id === post.id) {
        // If this post has the same ID as the photoed post copy the post and update its photo attribute to true
        return { ...post, photo: true };
      }
      // Return the post unchanged to the postlist if it's not the photoed post
      return post;
    });
    console.log(photoedPostList);
    setPosts(photoedPostList);
  }

  const filteredPostsList = posts
  //apply set filter to postlist
  .filter(FILTER_MAP[filter])
  .map((post) => (
    <PrPost
      // Post details
      id={post.id}
      title={post.title}
      description={post.description}
      category={post.category}
      subcategory={post.subcategory}
      photo={post.photo}
      key={post.id}
      location={post.location} 
      date={post.date}

      // Functions past to posts
      photoedPost={photoedPost}
      deletePost={deletePost}
      editPost={editPost}

      // Pass categorties to posts for editing the post category in the edit template
      maintenanceCategory = {maintenanceCategory}
      wildlifeCategory = {wildlifeCategory}
    />
  ));


  return (
    <div>
      <div className="park-reporter-app">
        <div className="pr-title-container pr-container">
          <h1>Park Reporter 🌳</h1>
        </div>
        <Form addTask={addPost} geoFindMe={geoLocatePost}/>
        <div className="pr-title-container pr-container"> <h2 id="list-heading" aria-hidden="true" >Posts</h2></div>
        <div className="filters btn-group stack-exception pr-container">
        {filterList}
        </div>

        {/* Conditonal rendering, if no post are present load a containter with text stating there are no posts */}
        {posts.length > 0 ? 
        <ul
          role="list"
          className="stack-large stack-exception"
          aria-labelledby="list-heading">
          {filteredPostsList}
        </ul>
        : 
        <div className="pr-title-container pr-container"> <h2>No Posts, Create one above!</h2></div>}

        <button id="Export-Button"type="button" className="btn" onClick={() => props.exportToJSON(posts, 'Park-Reporter-Posts.json')}> Export Posts</button>
      </div>
    </div>
  );
}

export default App;
