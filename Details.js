import { StatusBar } from 'expo-status-bar'
import React, { useRef, useState } from 'react'
import { Keyboard, Text, View, ToastAndroid, TextInput, Pressable } from 'react-native'
import { styles } from './styles'
import FireReadMY from './FireReadMY'
import FireReadDMY from './FireReadDMY'
import FireReadY from './FireReadY'
import { ScrollerDMY } from './ScrollerDMY'
import { ScrollerMY } from './ScrollerMY'
import { ScrollerY } from './ScrollerY'
import { year } from './dateSystem'
import ToDoFirebase from './ToDoFirebase';

var Datee = ''
var Monthh = ''
var Yearr = ''

export default function Details({ navigation }) {

  const [Date, funDate] = useState()
  const [Year, funYear] = useState()
  const [Month, funMon] = useState()
  const [checkScrollMY, checkScrollerMY] = useState()
  const [checkScrollDMY, checkScrollerDMY] = useState()
  const [checkScrollY, checkScrollerY] = useState()
  const [checkExample, funExample] = useState(false)
  const inputElement = useRef()
  const inputElement1 = useRef()
  const focusInputf = () => inputElement.current.focus()
  const focusInputf1 = ({ nativeEvent: { key: keyValue } }) =>
    (keyValue == 'Backspace' && Date == 12) ? funMon('45') : null


  return (
    <View style={styles.container}>
      <Text style={styles.textTitle2}>Select Allowance Period</Text>
      <View style={styles.ViewNav}>
        <Pressable style={styles.PressDetail1} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonDetail}>Home</Text>
        </Pressable>
        <Pressable style={styles.PressDetail2} onPress={() => {
          ToDoFirebase()
          navigation.navigate('ToDoList')
        }}>
          <Text style={styles.buttonDetail}>To-do-list</Text>
        </Pressable>
      </View>
      <TextInput
        style={styles.inputDate}
        placeholder="Date"
        onChangeText={input => funDate(input)}
        value={Date}
        maxLength={2}
        onKeyPress={focusInputf}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.inputMonth}
        placeholder="Month"
        value={Month}
        ref={inputElement1}
        maxLength={3}
        onChangeText={input => funMon(input)}
      />
      <TextInput
        style={styles.inputYear}
        placeholder="Year"
        value={Year}
        ref={inputElement}
        onKeyPress={focusInputf1}
        maxLength={4}
        onChangeText={input => funYear(input)}
        keyboardType="numeric"
      />
      <Text style={styles.exDate}> 1 - 31</Text>
      <Text style={styles.exMonth}> Jan - Dec</Text>
      <Text style={styles.exYear}> {year}</Text>
      <Pressable style={styles.buttonClear} onPress={
        function Clear() {
          funDate(null)
          funMon(null)
          funYear(null)
          checkScrollerMY(false)
          checkScrollerDMY(false)
          checkScrollerY(false)
        }}>
        <Text style={styles.buttonCText}>Reset</Text>
      </Pressable>
      <Pressable style={styles.buttonGetDetails} onPress={
        (Date == 12 && Month == 45 && Year == 2000) ? setTimeout(() => navigation.navigate('Secret'), 300)
          :
          function () {
            checkScrollerMY(false)
            checkScrollerDMY(false)
            checkScrollerY(false)
            funExample(false)
            Keyboard.dismiss()

            if (Date == null && Month == null && Year == null) {
              ToastAndroid.show(" Don't Leave Empty Feilds", ToastAndroid.SHORT)
              funExample(true)
            }
            else if (Date != null && Month != null && Year != null) {
              FireReadDMY(Date, Month, Year)
              Datee = Date
              Monthh = Month
              Yearr = Year
              funDate(null); funMon(null); funYear(null)
              ToastAndroid.show(' L o a d i n g . . . ', ToastAndroid.SHORT)
              setTimeout(() => checkScrollerDMY(true), 1000)
            }
            else if (Month && Year != null) {
              FireReadMY(Month, Year)
              Monthh = Month
              Yearr = Year
              funMon(null); funYear(null)
              ToastAndroid.show(' L o a d i n g . . . ', ToastAndroid.SHORT)
              setTimeout(() => checkScrollerMY(true), 1000)
            } else if (Year != null) {
              FireReadY(Year)
              Yearr = Year
              funYear(null)
              ToastAndroid.show(' L o a d i n g . . . ', ToastAndroid.SHORT)
              setTimeout(() => checkScrollerY(true), 1500)
            } else {
              ToastAndroid.show(' Enter Some Correct Value Pair ', ToastAndroid.SHORT)
              funExample(true)
            }
          }
      } >
        <Text style={styles.buttonCText}>Search</Text>
      </Pressable>
      {checkScrollMY ? <ScrollerMY /> : null}
      {checkScrollDMY ? <ScrollerDMY /> : null}
      {checkScrollY ? <ScrollerY /> : null}
      {checkExample ?
        <View>
          <Text style={styles.TextnoHeader}>Search Input's</Text>
          <Text style={styles.TextnoToDo}>example -1 : Search, 1 Jan {year} </Text>
          <Text style={styles.TextnoToDo}>example -2 :  Jan {year}</Text>
          <Text style={styles.TextnoToDo}>example -2 : {year}</Text>
        </View> : null}
      <StatusBar style="auto" />
    </View >
  )
}
export { Datee, Monthh, Yearr }