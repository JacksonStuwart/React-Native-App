import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Pressable, Text, ToastAndroid, View, TextInput, Keyboard } from 'react-native'
import FireWrite from './FireWrite'
import { styles } from './styles'
import ToDoFirebase from './ToDoFirebase'
import { app } from './firebase'


export default function Home({ navigation }) {

    const UserUID = app.auth().currentUser.uid;
    var [User, funname] = useState('')
    const username = app.database().ref('Users/' + UserUID + '/UserName')
    username.on('value', (snap) => setInterval(() => funname('Welcome, ' + snap.val())))
    const [submitDetails, subf1] = useState('')
    const [submitAmt, subf2] = useState('')
    return (
        <View style={styles.kcontainer}>
            <Text style={styles.textTitle}>Type your Allowance</Text>
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
                <Pressable style={styles.PressDetail1} onPress={() => navigation.navigate('Details')}>
                    <Text style={styles.buttonDetail}>Details</Text>
                </Pressable>
                <Pressable style={styles.PressDetail2} onPress={() => {
                    ToDoFirebase()
                    navigation.navigate('ToDoList')
                }}>
                    <Text style={styles.buttonDetail}>To-do-list</Text>
                </Pressable>
            </View>
            <View style={styles.inputSubmition}>
                <Text style={styles.WelcomeUser}>{User}</Text>
                <TextInput
                    style={styles.inputDetails}
                    placeholder='Spent On'
                    placeholderTextColor={'#5c5c8a'}
                    onChangeText={input => subf1(input)}
                    maxLength={16}
                    value={submitDetails}
                     />
                <TextInput
                    style={styles.inputAmt}
                    placeholder="Amount spent"
                    placeholderTextColor={'#5c5c8a'}
                    value={submitAmt}
                    maxLength={9}
                    onChangeText={input => subf2(input)}
                    keyboardType="numeric"
                    onSubmit
                />
                <Pressable style={styles.buttonSubmit} onPress={
                    function fireSubmit() {
                        if (submitDetails && submitAmt != null) {
                            FireWrite(submitDetails, submitAmt)
                            Keyboard.dismiss()
                            ToastAndroid.show('Submitted successfully ..!', ToastAndroid.SHORT)
                            subf1(null)
                            subf2(null)
                        }
                        else { ToastAndroid.show(" Don't Leave Empty Feilds ...", ToastAndroid.SHORT) }
                    }
                }>
                    <Text style={styles.buttonSubmitText}>SUBMIT</Text>
                </Pressable>
                <Pressable style={styles.NavCalc} onPress={() => navigation.navigate('Ccal')}>
                    <Text style={styles.buttonDetail}>CAL-C$</Text>
                </Pressable>
            </View>
            
            <StatusBar style="auto" />
        </View>
    )
}


