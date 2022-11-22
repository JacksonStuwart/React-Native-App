import { app } from './firebase'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { styles } from './styles'
import { Pressable, Text, ToastAndroid, View, TextInput, Keyboard } from 'react-native'

export default function SignUp({ navigation }) {

    const [email, funemail] = useState('')
    const [password, funPass] = useState('')
    const [userName, funUser] = useState('')

    return (
        <View style={styles.container}>
            <Text style={styles.textTitle}>SIGN UP</Text>
            <View style={styles.ViewNav}>
                <Pressable style={styles.PressDetail1} onPress={() =>
                    navigation.navigate('Login')}>
                    <Text style={styles.buttonDetail}>SIGN IN</Text>
                </Pressable>
                <Pressable style={styles.PressDetail2} onPress={
                    () =>
                        navigation.navigate('SignUp')
                }>
                    <Text style={styles.buttonDetail}>SIGN UP</Text>
                </Pressable>
            </View>
            <TextInput
                style={styles.inputUsername}
                placeholder='User_Name'
                autoCapitalize="none"
                placeholderTextColor={'#5c5c8a'}
                onChangeText={input => funUser(input)}
                maxLength={10}
                value={userName} />
            <TextInput
                style={styles.inputEmail}
                placeholder='E - Mail'
                placeholderTextColor={'#5c5c8a'}
                autoCapitalize="none"
                onChangeText={input => funemail(input)}
                maxLength={30}
                value={email} />
            <TextInput
                style={styles.inputAmt}
                placeholder='Password'
                autoCapitalize="none"
                placeholderTextColor={'#5c5c8a'}
                onChangeText={input => funPass(input)}
                maxLength={30}
                value={password} />
            <Pressable style={styles.buttonSubmit} onPress={
                function () {
                    if (email && password != null) {
                        var signUp = app.auth().createUserWithEmailAndPassword(email, password)
                            .then(() => {
                                const UserUID = app.auth().currentUser.uid
                                app.database().ref('Users/' + UserUID).set({
                                    UserName: userName
                                })
                                Keyboard.dismiss()
                                ToastAndroid.show(' Successfully Registered ', ToastAndroid.LONG)
                                navigation.navigate('Home')
                                funemail(null)
                                funPass(null)
                            })
                        signUp.catch((error) => {
                            var errorMessage = error.message;
                            ToastAndroid.show(errorMessage, ToastAndroid.LONG)
                        })
                    }
                    else { ToastAndroid.show(" Don't Leave Empty Feilds ...", ToastAndroid.SHORT) }
                }
            }>
                <Text style={styles.buttonSubmitText}>SUBMIT</Text>
            </Pressable>
            <StatusBar style="auto" />
        </View>
    )

}