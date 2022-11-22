import { app } from "./firebase"
import CryptoJS from "react-native-crypto-js"

var decryptUID = []
var decryptPASS = []
var keyPair;

export function FireSecret(key) {

    if (decryptUID.length != 0) {
        decryptUID.splice(0, decryptUID.length);
    }
    if (decryptPASS.length != 0) {
        decryptPASS.splice(0, decryptPASS.length);
    }
    const UserUID = app.auth().currentUser.uid

    app.database().ref('Users/' + UserUID + '/' + 'keys').once('value').then(function (snapshot) {
        keyPair = Object.keys(snapshot.val())
        snapshot.forEach((userSnapshot) => {
            const username = userSnapshot.val()
            var userID = CryptoJS.AES.decrypt(username.userId, key)
            var Password = CryptoJS.AES.decrypt(username.password, key)
            var dUID = userID.toString(CryptoJS.enc.Utf8)
            var dPASS = Password.toString(CryptoJS.enc.Utf8)
            decryptUID.push(dUID)
            decryptPASS.push(dPASS)

        })

    })
}
export { decryptPASS, decryptUID, keyPair }