import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyBwa0KdREJJ951WMn8oOTLJnWjR9EUjHEQ", // 환경 변수를 통해 API 키 불러오기
  authDomain: "applygo-35e08.firebaseapp.com",
  projectId: "applygo-35e08",
  storageBucket: "applygo-35e08.appspot.com",
  messagingSenderId: "738019926266",
  appId: "1:738019926266:web:052d5f43e74ebae0f6a943",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export default auth;
