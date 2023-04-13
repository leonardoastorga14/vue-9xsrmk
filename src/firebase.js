import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  // Your Firebase configuration goes here
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.database();