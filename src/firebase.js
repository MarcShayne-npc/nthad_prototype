import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import {getAuth} from "firebase/auth";
/*
const firebaseConfig = {

    apiKey: "AIzaSyCQYQHXopOe8xPdm87GgjJW8kHVN5Z8tfI",
  
    authDomain: "test-c0303.firebaseapp.com",
  
    projectId: "test-c0303",
  
    storageBucket: "test-c0303.appspot.com",
  
    messagingSenderId: "201633053334",
  
    appId: "1:201633053334:web:187187add226ced6f560b7",
  
    measurementId: "G-18GQ2NQG6P"
  
  };
  
  
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
*/


const app =firebase.initializeApp({
    apiKey: "AIzaSyCQYQHXopOe8xPdm87GgjJW8kHVN5Z8tfI",
  
    authDomain: "test-c0303.firebaseapp.com",
  
    projectId: "test-c0303",
  
    storageBucket: "test-c0303.appspot.com",
  
    messagingSenderId: "201633053334",
  
    appId: "1:201633053334:web:187187add226ced6f560b7",
  
    measurementId: "G-18GQ2NQG6P"

})
export const auth = app.auth()
export default app
