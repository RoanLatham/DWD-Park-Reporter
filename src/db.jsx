import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";

export const db = new Dexie("todo-photos");

db.version(1).stores({
  photos: "id", // Primary key, don't index photos
});

async function addPhoto(id, imgSrc) {
  console.log("addPhoto", imgSrc.length, id);
  try {
    // Add the new photo with id used as key for todo array in localStoarge
    // to avoid having a second pk for one todo item
    const i = await db.photos.add({
      id: id,
      imgSrc: imgSrc,
    });
    console.log(`Photo ${imgSrc.length} bytes successfully added. Got id ${i}`);
  } catch (error) {
    console.log(`Failed to add photo: ${error}`);
  }
  return (
    <>
      <p>
        {imgSrc.length} &nbsp; | &nbsp; {id}
      </p>
    </>
  );
}

function GetPhotoSrc(id) {
  try{
    console.log("getPhotoSrc", id);

    // Use useLiveQuery to query the database for the any photos with the specified ID
    const img = useLiveQuery(() => db.photos.where("id").equals(id).toArray());

    console.table(img);

    if (Array.isArray(img) && img.length > 0) {
      return img[0].imgSrc;
    } else {
      // Case for when no image exists in db yet
      console.error(`No image found for ID ${id}`);
      return null; 
    }
  } catch (error) {
    // Catch for when unexpected errors occur
    console.error(`Error fetching image for ID ${id}:`, error);
    return null; 
  }
}

export { addPhoto, GetPhotoSrc };
