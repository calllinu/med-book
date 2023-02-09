import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDKtN93gf2Txm44_Ar92qnX_T_GHe4lIAM',
  authDomain: 'medbook-d5415.firebaseapp.com',
  projectId: 'medbook-d5415',
  storageBucket: 'medbook-d5415.appspot.com',
  messagingSenderId: '222339781480',
  appId: '1:222339781480:web:29ab9b1b6f3c2963fb7cdd',
  measurementId: 'G-1W18RSRX9P',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
