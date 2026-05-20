import { app } from "./firebase";
import { date, month, year, day } from './dateSystem';



export default function FireWrite(submitDetails, submitAmt) {
    const uid = Date.now().toString(36) + Math.floor(Math.random() * 98735) + Math.random().toString(36).substr(2) + Math.floor(Math.random() * 10000);
    const fullDate = date + '/' + month + '/' + year
    const UserUID = app.auth().currentUser.uid
    app.database().ref('Users/' + UserUID + '/' + year + '/' + month).once('value').then(function (snapshot) {
        if (snapshot.val() != null)
            var len = Object.keys(snapshot.val()).length;
        else
            var len = 0;
        app.database().ref('Users/' + UserUID + '/' + year + "/" + month + '/' + uid).set({
            id: len,
            Date: fullDate,
            Day: day,
            SpentOn: submitDetails,
            Amount: submitAmt
        });
    });
}
