import { app } from "./firebase";
import { months, year } from "./dateSystem";
import { ToastAndroid } from 'react-native';

var nevY = []
var amountY = 0
var Fmonth = 0
var Reordered = new Array(12)
var clearedArray
var Bool
export default function FireReadY(Year) {
    if (nevY.length != 0) {
        nevY.splice(0, nevY.length)
    }
    amountY = 0
    Bool = true
    const UserUID = app.auth().currentUser.uid

    app.database().ref('Users/' + UserUID + '/' + Year).once('value').then(async function (snapshot) {
        try {
            var len = Object.keys(snapshot.val()).length
            Fmonth = Object.keys(snapshot.val())
            Fmonth.forEach((element) => {
                for (var j = 0; j < months.length; j++) {
                    if (element == months[j]) {
                        Reordered[j] = element
                    }
                }
            })
            clearedArray = Reordered.filter(Boolean)
            for (var i = 0; i < len; i++) {
                app.database().ref('Users/'  + UserUID + '/' + Year + '/' + clearedArray[i]).once('value').then(function (shot) {
                    shot.forEach((userSnapshot) => {
                        const username = userSnapshot.val()
                        nevY.push(username)
                        amountY = amountY + Number(username.Amount)
                    })
                })
            }
        }
        catch (error) {
            (error) ? ToastAndroid.show("Submitted value doesn't exist", ToastAndroid.SHORT) : null
            Bool = false
        }
    })
}
export { nevY, amountY, clearedArray, Bool }