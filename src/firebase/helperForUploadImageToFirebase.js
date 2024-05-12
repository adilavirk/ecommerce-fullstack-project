import { app, firebaseStorageUrl } from "./firebaseConfig";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const storage = getStorage(app, firebaseStorageUrl);
const createUniqueFileName = (getFile) => {
  const timeStamp = Date.now();
  const randomStringValue = Math.random().toString(36).substring(2, 12);
  return `${getFile}-${timeStamp}-${randomStringValue}`;
};

export const helperForUploadingImageToFirebase = async (file) => {
  const getFileName = createUniqueFileName(file);
  const createStorageReference = ref(storage, `ecommerce/${getFileName}`);
  const uploadImage = uploadBytesResumable(createStorageReference, file);

  return new Promise((resolve, reject) => {
    uploadImage.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref)
          .then((downloadUrl) => resolve(downloadUrl))
          .catch((error) => reject(error));
      }
    );
  });
};
