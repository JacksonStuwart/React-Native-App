import React, { useState } from 'react'
import { Text, View, ScrollView, Pressable, ToastAndroid } from 'react-native'
import { styles } from './styles'
import { nevY, amountY, clearedArray, Bool } from './FireReadY'
import { app } from './firebase'
import FireReadY from './FireReadY'
import {Yearr } from './Details'


export function ScrollerY() {
    var KEY = 0
    var count = 0
    const [refresh, staterefresh] = useState(true)
    const UserUID = app.auth().currentUser.uid

    return (
        (refresh) ?
            <ScrollView style={styles.ScrollViewDetails}>
                {
                    (nevY.length != 0) ? <Pressable style={styles.DeleteImgPressY} onPress={() => {
                        app.database().ref('Users/' + UserUID + '/' + Yearr).remove()
                        FireReadY(Yearr)
                        staterefresh(false)
                        ToastAndroid.show(" D E L E T E D ", ToastAndroid.SHORT)
                        setTimeout(() => staterefresh(true), 500)
                    }
                    }>
                        <Text style={styles.DeleteImgY}>{'DELETE-' + Yearr}</Text></Pressable> : null
                }
                {
                    nevY.map(function findd(neew) {
                        var key = neew.id
                        if (key == 0) {
                            count = count + 1
                            KEY = count - 1
                        }
                        return (
                            (key == 0) ?
                                <View key={Math.random() * 953 * 99}>
                                    <View style={styles.ViewDetailsMonth}  >
                                        <Text style={styles.ViewDetailsMonthText}>{clearedArray[KEY]}</Text>
                                    </View>
                                    <View style={styles.ViewDetails} >
                                        <Text style={styles.Detailsid} >{key + 1} )</Text>
                                        <Text style={styles.DetailsSpentOn} >Purpose : {neew.SpentOn} </Text>
                                        <Text style={styles.DetailsAmount} >Amount : {neew.Amount} Rs</Text>
                                        <Text style={styles.DetailsDate}  >{neew.Date}</Text>
                                        <Text style={styles.DetailsDay}  >{neew.Day}</Text>
                                    </View>
                                </View>
                                :
                                <View style={styles.ViewDetails} key={Math.random() * 953 * 99} >
                                    <Text style={styles.Detailsid} >{key + 1} )</Text>
                                    <Text style={styles.DetailsSpentOn} >Purpose : {neew.SpentOn} </Text>
                                    <Text style={styles.DetailsAmount} >Amount : {neew.Amount} Rs</Text>
                                    <Text style={styles.DetailsDate}  >{neew.Date}</Text>
                                    <Text style={styles.DetailsDay}  >{neew.Day}</Text>
                                </View>
                        )
                    })
                }
                {(Bool) ? <Text style={styles.TextTotal}>{'Total : ' + amountY + ' Rs'}</Text> : null}
                {(Bool) ? <Text style={styles.TextTotal}>{'Average : ' + (amountY / 365).toFixed(3) + ' Rs'}</Text> : null}
            </ScrollView> : null
    )

}
