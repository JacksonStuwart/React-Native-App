import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Text, View, TextInput, Pressable, ToastAndroid } from 'react-native'
import { styles } from './styles'
import { FireSecret } from './FireSecret'
import { ScrollerSecret } from './ScrollerSecret'
import { app } from './firebase'
import CryptoJS from "react-native-crypto-js"
import { StatusBar } from 'expo-status-bar'

var GKey = ''

export function ShowState() {

    const [kName, addname] = useState()
    const [uId, addUID] = useState()
    const [pass, addPASS] = useState()

    return (
        <View style={styles.AddView}>
            <Text style={styles.textAddKeys}> ADD KEYS</Text>
            <Pressable style={styles.buttonGenerator} onPress={
                function setKeys() {
                    var result=''
                    var characters       = 'ABCD.EFGH!IJ@KL#MN$O%PQ^RST&UVWX*YZabc(d)efg_hi-jkl+mno=pqt/u}v,w{xy[z01]23~456789';
                    var charactersLength = characters.length;
                    for ( var i = 0; i < 24; i++ ) {
                      result += characters.charAt(Math.floor(Math.random() * charactersLength));
                   }
                   addPASS(result)
                }}>
                <Text style={styles.buttonSText}>GENERATE</Text>
            </Pressable>
            <TextInput
                style={styles.KeyInputAdd}
                placeholder="Enter Source Name"
                value={kName}
                onChangeText={input => addname(input)}
            />
            <TextInput
                style={styles.KeyInputAdd}
                placeholder="Enter the UID"
                value={uId}
                onChangeText={input => addUID(input)}
            />
            <TextInput
                style={styles.KeyInputAdd}
                placeholder="Enter the Password"
                value={pass}
                onChangeText={input => addPASS(input)}
            />
            <Pressable style={styles.buttonAddKey} onPress={
                function addKeys() {
                    if (kName && uId && pass != null) {
                        const UserUID = app.auth().currentUser.uid
                        app.database().ref('Users/' + UserUID + '/keys/' + kName).set({
                            userId: CryptoJS.AES.encrypt(uId, GKey).toString(),
                            password: CryptoJS.AES.encrypt(pass, GKey).toString(),
                        })
                        addname(null)
                        addUID(null)
                        addPASS(null)
                        ToastAndroid.show('Key Added', ToastAndroid.SHORT)
                    }
                    else { ToastAndroid.show("Don't leave empty feilds", ToastAndroid.SHORT) }
                }}>
                <Text style={styles.buttonSText}>Add Key</Text>
            </Pressable>
        </View>
    )

}

export default function Secret({ navigation }) {

    const [key, funKey] = useState('')
    const [checkSecret, stateSecret] = useState()

    return (
        <KeyboardAvoidingView style={styles.kcontainer}>
            <Text style={styles.textTitle}>Get Your Keys ...</Text>
            <Pressable style={{
                width: 80, marginTop: 105, position: 'absolute', marginLeft: 300,
                borderBottomWidth: 1, alignItems: 'center'
            }}
                onPress={() => {
                    app.auth().signOut()
                    navigation.navigate('Login')
                    ToastAndroid.show(' Logged Out . . ! ', ToastAndroid.SHORT)
                }}>
                <Text style={{ color: '#FF370C', letterSpacing: 2, fontWeight: 'bold', fontSize: 16 }}>LOGOUT</Text>
            </Pressable>
            <View style={styles.ViewNav}>
                <Pressable style={styles.PressDetail1} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.buttonDetail}>Home</Text>
                </Pressable>
                <Pressable style={styles.PressDetail2} onPress={() => navigation.navigate('Details')}>
                    <Text style={styles.buttonDetail}>Details</Text>
                </Pressable>
            </View>
            <TextInput
                style={styles.KeyInput}
                secureTextEntry={true}
                placeholder="Enter the Key"
                placeholderTextColor={'#5c5c8a'}
                value={key}
                onChangeText={input => funKey(input)}
            />
            <Pressable style={styles.buttonGetKeyReset} onPress={
                function Clear() {
                    funKey('')
                    stateSecret(false)
                    GKey = ''
                }}>
                <Text style={styles.buttonSText}>Reset</Text>
            </Pressable>
            <Pressable style={styles.buttonGetKey} onPress={
                function findKeys() {
                    if (key.length < 14) {
                        ToastAndroid.show("Wrong Input", ToastAndroid.SHORT)
                        Keyboard.dismiss()
                        funKey('')
                    }
                    else {
                        FireSecret(key)
                        GKey = key
                        funKey('')
                        Keyboard.dismiss()
                        stateSecret(false)
                        ToastAndroid.show(" L o a d i n g . . . ", ToastAndroid.SHORT)
                        setTimeout(() => stateSecret(true), 800)
                    }
                }}>
                <Text style={styles.buttonSText}>GetKeys</Text>
            </Pressable>
            {checkSecret ? <ScrollerSecret /> : null}
            <StatusBar style="auto" />
        </KeyboardAvoidingView >
    )
}

export { GKey }