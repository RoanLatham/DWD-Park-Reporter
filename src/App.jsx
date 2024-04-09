
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import PrPost from "./components/PrPost.jsx";
import AddForm from "./components/AddForm.jsx";
import FilterButton from "./components/FilterButton";
import { addPhoto, deletePhoto } from "./db.jsx"; // To read and write photos


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
  // If position recived run locationSuccess()
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
    locatePost(lastInsertedId, {
      latitude: latitude,
      longitude: longitude,
      error: "",
      mapURL: `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`,
      //smsURL: `sms://00447700900xxxx?body=https://maps.google.com/?q=${latitude},${longitude}`,
    });
  };

  const geoLocateError = () => {
    console.log("Unable to retrieve post location");
  };

  // Persistant storage using broswers local storage
  function usePersistedState(key, defaultValue) {
    const [state, setState] = useState(() =>
      JSON.parse(localStorage.getItem(key) || defaultValue)
    );

    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
  }

  // Filter buttons:
  // Define categories and their subtags as objects
  const wildlifeCategory = {
    name: "Wildlife",
    subtags: ["Birds", "Mammals", "Insects"],
  };

  const maintenanceCategory = {
    name: "Maintenance",
    subtags: ["Cleaning", "Repairs", "Landscaping"],
  };

  // Main category filter
  const mainFilterMap = {
    All: () => true,
    Wildlife: (post) => post.category === wildlifeCategory.name,
    Maintenance: (post) => post.category === maintenanceCategory.name,
  };

  // Use state to keep track of applied filters
  const [mainFilter, setMainFilter] = useState("All");
  const [subFilter, setSubFilter] = useState("All");

  // Initialise subFilterMap within the state to allow re-rendering/updating
  const [subFilterMap, setSubFilterMap] = useState({
    All: () => true,
  });

  // Function to update subFilterMap with subtags of the selected main category
  const updateSubFilterMap = (subtags) => {
    const newSubFilterMap = { All: () => true };
    subtags.forEach((subtag) => {
      newSubFilterMap[subtag] = (post) => post.subcategory === subtag;
    });
    setSubFilterMap(newSubFilterMap); // Update the state to re-render the subfilter buttons
  };

  // Generate buttons for main filters
  const mainFilterList = (
    // construct a React fragment
    <>
      <h5>Categories:</h5>
      <div className="btn-group pr-filter-container">
        {Object.keys(mainFilterMap).map((name) => (
          <FilterButton
            key={name}
            name={name}
            className="btn btn__primary toggle-btn-primary"
            isPressed={name === mainFilter}
            setFilter={() => {
              setMainFilter(name);
              setSubFilter("All"); // Reset subfilter when changing main filter
              // Determine the appropriate subtags based on the main category selected
              const subtags = name === wildlifeCategory.name ? wildlifeCategory.subtags
                            : name === maintenanceCategory.name ? maintenanceCategory.subtags
                            : [];
              // Call updateSubFilterMap with the appropriate subtags
              updateSubFilterMap(subtags);
            }}
          />
        ))}
      </div>
    </>
  );

  // Generate buttons for subfilters based on selected main filter
  const subFilterList =
    mainFilter === "All" ? null : ( // Return null if main category is "All"
      // construct a React fragment
      <>
        <h5>Subcategories:</h5>
        <div className="btn-group pr-filter-container">
          {Object.keys(subFilterMap).map((name) => (
            <FilterButton
              key={name}
              name={name}
              className="btn toggle-btn"
              isPressed={name === subFilter}
              setFilter={() => setSubFilter(name)}
            />
          ))}
        </div>
      </>
    );

  // Posts CRUD
  // constuct new post and add to postslist
  function addPost(title, description, category, subcategory) {
    const id = "post-" + nanoid();

    const newPost = {
      id: id,
      title: title,
      description: description,
      category: category,
      subcategory: subcategory,
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
    const formattedDateTime = currentDateTime.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return formattedDateTime;
  }

  //Delete a post by deleteing its attached photo from indexed db and using filter,
  //save every post that does not have the given ID,
  //resulting in the post with the given id being removed from the posts list
  function deletePost(id) {
    deletePhoto(id);
    const remainingPosts = posts.filter((post) => id !== post.id);
    setPosts(remainingPosts);
  }

  // Edit details for a given post ID in postslist
  function editPost(id, title, description, category, subcategory) {
    // Map over every post, edit the given post and leave the rest untouched
    const editedPostList = posts.map((post) => {
      if (id === post.id) {
        // If this post has the same ID as the edited post copy the post and update its name
        return {
          ...post,
          title: title,
          description: description,
          category: category,
          subcategory: subcategory,
        };
      }
      // Return the original post to the postlist if it's not the edited post
      return post;
    });
    setPosts(editedPostList);
  }

  // Add location to post attributes, update and save postlist with new location
  function locatePost(id, location) {
    // console.log("locate Post", id, " before");
    // console.log(location, posts);
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
  const [posts, setPosts] = usePersistedState("posts", []);

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
    //apply set category and subcategory filters to postlist
    .filter(mainFilterMap[mainFilter])
    .filter(subFilterMap[subFilter])
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
        maintenanceCategory={maintenanceCategory}
        wildlifeCategory={wildlifeCategory}
      />
    ));

  return (
    <div>
      <div className="park-reporter-app">
        <div className="pr-title-container pr-container">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="./park.svg"
              alt="Park"
              style={{ marginRight: "10px", height: "3em" }}
            />
            <h1 style={{ marginRight: "1em" }}>Park Reporter</h1>
          </div>
        </div>
        <AddForm
          addPost={addPost}
          geoLocatePost={geoLocatePost}
          photoedPost={photoedPost}
          maintenanceCategory={maintenanceCategory}
          wildlifeCategory={wildlifeCategory}
        />
        <div className="pr-title-container pr-container">
          <h2 id="list-heading" aria-hidden="true">
            Posts
          </h2>
        </div>
        <div className="filters btn-group-vertical stack-exception pr-container">
          {mainFilterList}
          {subFilterList}
        </div>

        {/* Conditonal rendering, if no post are present load a containter with text stating there are no posts */}
        {posts.length > 0 ? (
          <ul
            role="list"
            className="stack-large stack-exception"
            aria-labelledby="list-heading"
          >
            {filteredPostsList}
          </ul>
        ) : (
          <div className="pr-title-container pr-container">
            <h2>No Posts, Create one above!</h2>
          </div>
        )}

        <button
          id="Export-Button"
          type="button"
          className="btn"
          onClick={() => props.exportToJSON(posts, "Park-Reporter-Posts.json")}
        >
          Export Posts
        </button>
      </div>
    </div>
  );
}

export default App;
