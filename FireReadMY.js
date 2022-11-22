import { app } from "./firebase";
import { ToastAndroid } from 'react-native';


var nevMY = []
var amountMY = 0
var averageMY = 0
var monObKey
var Bool
export default function FireReadMY(Month, Year) {
    if (nevMY.length != 0) {
        nevMY.splice(0, nevMY.length)
    }
    amountMY = 0
    averageMY = 0
    Bool = true
    const UserUID = app.auth().currentUser.uid
    app.database().ref('Users/' + UserUID + '/' + Year + '/' + Month).once('value').then(async function (snapshot) {

        try {
            monObKey = Object.keys(snapshot.val())
            snapshot.forEach((userSnapshot) => {
                const username = userSnapshot.val()
                nevMY.push(username)
                amountMY = amountMY + Number(username.Amount)
            })
            if (monObKey.lengzth % 2 != 0) {
                averageMY = amountMY / 31
            } else {
                if (Month == 'Feb') {
                    (Year % 4 == 0) ? averageMY = amountMY / 29 : averageMY = amountMY / 28
                }
                else if (Month == 'Aug') { averageMY = amountMY / 30 }
                else { averageMY = amountMY / 30 }
            }
            averageMY = averageMY.toFixed(2)
        }
        catch (error) {
            (error) ? ToastAndroid.show("Submitted value doesn't exist", ToastAndroid.SHORT) : null
            Bool = false
        }
    })
}
export { nevMY, amountMY, averageMY, monObKey, Bool }