import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/auth'
import {APIKEY,AUTHDOMAIN,DATABASEURL,PROJECTID,STORAGEBUCKET,MESSAGINGSENDERID,APPID} from '@env'

const firebaseConfig = {

    apiKey: APIKEY,
    authDomain: AUTHDOMAIN,
    databaseURL: DATABASEURL,
    projectId: PROJECTID,
    storageBucket: STORAGEBUCKET,
    messagingSenderId: MESSAGINGSENDERID,
    appId:APPID

};

let app;

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig)
} else {
    app = firebase.app();
}


export { app }