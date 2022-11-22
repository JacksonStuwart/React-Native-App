import React, { useState } from 'react'
import { Text, View, ScrollView, Pressable, ToastAndroid } from 'react-native'
import { styles } from './styles'
import { app } from './firebase'
import { FireSecret } from './FireSecret'
import { decryptPASS, decryptUID, keyPair } from './FireSecret'
import { GKey } from './Secret'
import { ShowState } from './Secret'


export function ScrollerSecret() {
  var i = 0
  const [refresh, staterefresh] = useState(true)
  const [showkey, stateShow] = useState(false)
  const UserUID = app.auth().currentUser.uid

  return (
    (refresh) ?
      <ScrollView style={styles.ScrollViewKey}>
        <Pressable style={styles.buttonAdd} onPress={() => stateShow(!showkey)}>
          <Text style={styles.buttonSText}>Add Keys</Text>
        </Pressable>
        {(showkey) ?
          <ShowState /> :
          decryptUID.map(function findd() {
            i = i + 1
            var count = i - 1
            return (
              <View style={styles.Secret} key={i}>
                <Text style={styles.keypair} >{i}. {keyPair[count]} </Text>
                <Text selectable={true} style={styles.DecryptUID}  >UID : {decryptUID[count]} </Text>
                <Text selectable={true} style={styles.DecryptPASS} >PASS : {decryptPASS[count]} </Text>
                <Pressable style={styles.DeleteImgPress} onPress={() => {
                  app.database().ref('Users/' + UserUID + '/keys/' + keyPair[count]).remove()
                  FireSecret(GKey)
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
      </ScrollView > : null
  )
}