import React, { useState } from 'react'
import { Text, View, ScrollView, Pressable, ToastAndroid } from 'react-native'
import { styles } from './styles'
import { nevDMY, amountDMY, dateObKey, Bool } from './FireReadDMY'
import { app } from './firebase'
import { Datee, Monthh, Yearr } from './Details'
import FireReadDMY from './FireReadDMY'


export function ScrollerDMY() {
    var key = 0
    const [refresh, staterefresh] = useState(true)
    const UserUID = app.auth().currentUser.uid
    return (
        (refresh) ?
            <ScrollView style={styles.ScrollViewDetails}>
                {
                    nevDMY.map(function findd(neew) {
                        key = key + 1
                        return (
                            <View style={styles.ViewDetails} key={key}>
                                <Text style={styles.Detailsid}  >{key} )</Text>
                                <Text style={styles.DetailsSpentOn} >Purpose : {neew.SpentOn} </Text>
                                <Text style={styles.DetailsAmount} >Amount : {neew.Amount} Rs</Text>
                                <Text style={styles.DetailsDate}  >{neew.Date}</Text>
                                <Text style={styles.DetailsDay}  >{neew.Day}</Text>
                                <Pressable style={styles.DeleteImgPress} onPress={() => {
                                    app.database().ref('Users/' + UserUID + '/' + Yearr
                                        + '/' + Monthh + '/' + dateObKey[key - 1]).remove()
                                    FireReadDMY(Datee, Monthh, Yearr)
                                    staterefresh(false)
                                    ToastAndroid.show(" D E L E T E D ", ToastAndroid.SHORT)
                                    setTimeout(() => staterefresh(true), 500)
                                }
                                }>
                                    <Text style={styles.DeleteImg}>DELETE</Text></Pressable>
                            </View>
                        )
                    })
                }
                {(Bool) ? <Text style={styles.TextTotal}>{'Total : ' + amountDMY + ' Rs'}</Text> : null}
            </ScrollView> : null
    )
}
