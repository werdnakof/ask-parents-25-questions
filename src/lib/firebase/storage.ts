import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

// Upload parent photo
export async function uploadParentPhoto(
  userId: string,
  parentId: string,
  file: File
): Promise<string> {
  // Create a unique filename with timestamp
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const filename = `${timestamp}.${extension}`;

  // Create storage reference
  const photoRef = ref(storage, `users/${userId}/parents/${parentId}/${filename}`);

  // Upload the file
  await uploadBytes(photoRef, file);

  // Get and return the download URL
  const downloadURL = await getDownloadURL(photoRef);
  return downloadURL;
}

// Delete parent photo
export async function deleteParentPhoto(photoUrl: string): Promise<void> {
  try {
    // Create a reference from the URL
    const photoRef = ref(storage, photoUrl);
    await deleteObject(photoRef);
  } catch (error) {
    // If the file doesn't exist, ignore the error
    console.error('Error deleting photo:', error);
  }
}

// Get photo reference from URL (helper function)
export function getPhotoRefFromUrl(photoUrl: string) {
  return ref(storage, photoUrl);
}
