// Firebase Configuration for CoffeeCounter

const firebaseConfig = {
    apiKey: "AIzaSyBgvipOFjPBu6PHgRNqx7cSy36TObm_KuQ",
    authDomain: "coffeecounter-1a0d4.firebaseapp.com",
    projectId: "coffeecounter-1a0d4",
    storageBucket: "coffeecounter-1a0d4.firebasestorage.app",
    messagingSenderId: "195626137893",
    appId: "1:195626137893:web:3596b27f14e15d2693c2cc"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Configure Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});
