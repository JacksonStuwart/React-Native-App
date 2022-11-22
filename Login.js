import { app } from './firebase'
import { StatusBar } from 'expo-status-bar'
import React, { useState  } from 'react'
import { styles } from './styles'
import { Pressable, Text, ToastAndroid, View, TextInput, Keyboard } from 'react-native'
import { LogBox } from 'react-native'
LogBox.ignoreLogs(['Require cycle'])

export default function Login({ navigation }) {

  const [email, funemail] = useState('')
  const [password, funPass] = useState('')

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>SIGN IN</Text>
      <View style={styles.ViewNav}>
        <Pressable style={styles.PressDetail1} onPress={() =>
          navigation.navigate('Login')}>
          <Text style={styles.buttonDetail}>SIGN IN</Text>
        </Pressable>
        <Pressable style={styles.PressDetail2} onPress={
          () => navigation.navigate('SignUp')
        }>
          <Text style={styles.buttonDetail}>SIGN UP</Text>
        </Pressable>
      </View>
      <TextInput
        style={styles.inputEmail}
        placeholder='E - Mail'
        autoCapitalize="none"
        placeholderTextColor={'#5c5c8a'}
        onChangeText={input => funemail(input)}
        maxLength={40}
        value={email} />
      <TextInput
        style={styles.inputAmt}
        autoCapitalize="none"
        secureTextEntry={true}
        placeholder='Password'
        placeholderTextColor={'#5c5c8a'}
        onChangeText={input => funPass(input)}
        maxLength={30}
        value={password} />
      <Pressable style={{ position: 'absolute', marginTop: 400, width: '100%', height: 20 }} onPress={
        function () {
          funPass(null)
          Keyboard.dismiss()
          if (email) {
            var forgotPassword = app.auth().sendPasswordResetEmail(email)
              .then(() => {
                ToastAndroid.show(' Password Reset Email Has Been Sent ', ToastAndroid.LONG)
              })
            forgotPassword.catch((error) => {
              var errorMessage = error.message
              ToastAndroid.show(errorMessage, ToastAndroid.LONG)
            })
          }
          else funemail('Type Your Email Click Forgot Pass')

        }
      }>
        <Text style={{
          color: '#FF370C', letterSpacing: 2, marginLeft: 200, fontWeight: 'bold',
          fontSize: 16
        }}> Forgot Password ? </Text>
      </Pressable>
      <Pressable style={styles.buttonSubmit} onPress={
        function () {
          if (email && password != null) {
            var signIn = app.auth().signInWithEmailAndPassword(email, password)
              .then(() => {
                Keyboard.dismiss()
                ToastAndroid.show(' LOGIN Successfull . . ! ', ToastAndroid.LONG)
                funemail(null)
                funPass(null)
                navigation.navigate('Home')

              })
            signIn.catch((error) => {
              var errorMessage = error.message
              Keyboard.dismiss()
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