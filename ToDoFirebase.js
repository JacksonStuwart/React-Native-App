import { app } from "./firebase"

var TODO

export default function ToDoFirebase() {
    const UserUID = app.auth().currentUser.uid

    app.database().ref('Users/' + UserUID + '/ToDoDetails').once('value').then(async function (snapshot) {
        try {
            TODO = Object.keys(await snapshot.val())
        }
        catch (err) { TODO = null }
    })

}
export { TODO }