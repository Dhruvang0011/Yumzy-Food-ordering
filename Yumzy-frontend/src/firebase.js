import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAdjCJBznEbO8lkNkVdaRLLf-8FnRxRfDk",
  authDomain: "yumzy-food-ordering-app.firebaseapp.com",
  projectId: "yumzy-food-ordering-app",
  storageBucket: "yumzy-food-ordering-app.firebasestorage.app",
  messagingSenderId: "490269839011",
  appId: "1:490269839011:web:227864945686b950793916",
  measurementId: "G-26PJ7T8C7D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication
export const auth = getAuth(app);

// Google Provider
export const googleProvider = new GoogleAuthProvider();

export const githubProvider = new GithubAuthProvider();

export const facebookProvider = new FacebookAuthProvider();

export default app;