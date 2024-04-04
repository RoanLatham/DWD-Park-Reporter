import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";

export const db = new Dexie("park-reporter-photos");

db.version(1).stores({
  photos: "id", // Primary key, don't index photos
});

async function addPhoto(id, imgSrc) {
  console.log("addPhoto", imgSrc.length, id);
  try {
    // Add the new photo with the same id used as a key for posts array in localStoarge to avoid having a second pk for one post item
    const i = await db.photos.put({
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

export async function deletePhoto(id) {
  console.log("deletePhoto", id);
  try {
    await db.photos.delete(id);
    console.log(`Photo with ID ${id} successfully deleted.`);
  } catch (error) {
    console.log(`Failed to delete photo with ID ${id}: ${error}`);
  }
}

function GetPhotoSrc(id) {
  try{
    // console.log("getPhotoSrc", id);

    // Use useLiveQuery to query the database for the any photos with the specified ID
    const img = useLiveQuery(() => db.photos.where("id").equals(id).toArray());

    console.table(img);

    if (Array.isArray(img) && img.length > 0) {
      return img[0].imgSrc;
    } else {
      // Case for when no image exists in db yet
      // console.warn(`No image found for ID ${id}`);
      return null; 
    }
  } catch (error) {
    // Catch for when unexpected errors occur
    console.error(`Error fetching image for ID ${id}:`, error);
    return null; 
  }
}

export { addPhoto, GetPhotoSrc };
