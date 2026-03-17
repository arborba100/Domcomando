import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "complexo.firebaseapp.com",
  databaseURL: "https://complexo-default-rtdb.firebaseio.com",
  projectId: "complexo",
  storageBucket: "complexo.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
