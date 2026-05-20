import { app } from "./firebase";
import { ToastAndroid } from 'react-native';

var nevDMY = []
var amountDMY = 0
var averageDMY = 0
var dateObKey
var Bool
export default function FireReadDMY(Date, Month, Year) {
    var newDate = Date + '/' + Month + '/' + Year;
    if (nevDMY.length != 0) {
        nevDMY.splice(0, nevDMY.length);
    }
    amountDMY = 0
    averageDMY = 0
    Bool = true
    const UserUID = app.auth().currentUser.uid

    app.database().ref('Users/' + UserUID + '/' + Year + '/' + Month).once('value').then(async function (snapshot) {
        try {
            dateObKey = Object.keys(snapshot.val())
            snapshot.forEach((userSnapshot) => {
                if (userSnapshot.val().Date == newDate) {
                    const username = userSnapshot.val()
                    nevDMY.push(username)
                    amountDMY = amountDMY + Number(username.Amount)
                }
            })
        }
        catch (error) {
            (error) ? ToastAndroid.show("Submitted value doesn't exist", ToastAndroid.LONG) : null
            Bool = false
        }

        if (nevDMY.length == 0) {
            Bool = false
            ToastAndroid.show("Submitted value doesn't exist", ToastAndroid.SHORT)
        }
    })
}
export { nevDMY, amountDMY, averageDMY, dateObKey, Bool }