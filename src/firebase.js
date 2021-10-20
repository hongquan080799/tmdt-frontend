import firebase from 'firebase'

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyD2GZztxgKr8HAUxDQxODRokeDAd33X2TY",
  authDomain: "tmdt-17064.firebaseapp.com",
  projectId: "tmdt-17064",
  storageBucket: "tmdt-17064.appspot.com",
  messagingSenderId: "38030940951",
  appId: "1:38030940951:web:ae9ad80cb7fe493e3c3552"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
  //firebase.analytics();
  export const store =  firebase.storage()
  export const auth = firebase.auth();
  export const db = firebase.firestore();
  export default firebase
  