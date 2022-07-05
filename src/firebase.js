import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCtyQGyPpC5_NtJJq8WuBhG-Wm16XjgiDM",
  authDomain: "extended-hsl-picker.firebaseapp.com",
  databaseURL: "https://extended-hsl-picker-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "extended-hsl-picker",
  storageBucket: "extended-hsl-picker.appspot.com",
  messagingSenderId: "450804736945",
  appId: "1:450804736945:web:d7779f6fae638c80cc5390"
};


firebase.initializeApp(firebaseConfig)

export default firebase