// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcOGscKfeWaEBGCYx7aVHnZDW_NcK5_6Y",
  authDomain: "nextjs-fullstack-ecommer-a3751.firebaseapp.com",
  projectId: "nextjs-fullstack-ecommer-a3751",
  storageBucket: "nextjs-fullstack-ecommer-a3751.appspot.com",
  messagingSenderId: "109469062545",
  appId: "1:109469062545:web:cb4d3933dc74c3fc68f630",
  measurementId: "G-BGVX1P02WZ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firebaseStorageUrl =
  "gs://nextjs-fullstack-ecommer-a3751.appspot.com";
// const analytics = getAnalytics(app);
