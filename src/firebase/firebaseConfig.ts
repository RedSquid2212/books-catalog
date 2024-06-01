import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD6IyZnMvQcrDIrFONVH8RY8KZNfdt1wE0",
    authDomain: "books-catalog-2adf3.firebaseapp.com",
    projectId: "books-catalog-2adf3",
    storageBucket: "books-catalog-2adf3.appspot.com",
    messagingSenderId: "860636692994",
    appId: "1:860636692994:web:7f80e9325e500ff5ea1d1b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
