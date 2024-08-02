import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC7hAZ4m4CQg3DaUs41m-2wxcRDKoZvMIM",
  authDomain: "myproject-2f867.firebaseapp.com",
  projectId: "myproject-2f867",
  storageBucket: "myproject-2f867.appspot.com",
  messagingSenderId: "354831718057",
  appId: "1:354831718057:web:1e09c87a577d81cb1abbb8",
  measurementId: "G-5LELSRMSCS"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref, uploadBytes, getDownloadURL };
