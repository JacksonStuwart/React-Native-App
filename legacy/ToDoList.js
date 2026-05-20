import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, ScrollView, ToastAndroid, View, TextInput, Keyboard } from 'react-native';
import { app } from './firebase';
import { styles } from './styles';
import ToDoFirebase, { TODO } from './ToDoFirebase';

export default function ToDoList({ navigation }) {

    const [ShowState, funShow] = useState(false)
    const [inputToDO, SubmitTODO] = useState()
    const UserUID = app.auth().currentUser.uid
    var i = 0
    setTimeout(() => funShow(true), 800)
    return (
        <View style={styles.container}>
            <Text style={styles.textTitle2}>To-Do-List</Text>
            <View style={styles.ViewNav}>
                <Pressable style={styles.PressDetail1} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.buttonDetail}>Home</Text>
                </Pressable>
                <Pressable style={styles.PressDetail2} onPress={() => navigation.navigate('Details')}>
                    <Text style={styles.buttonDetail}>Details</Text>
                </Pressable>
            </View>
            <TextInput
                style={styles.inputToDo}
                placeholder="What's the Plan?"
                value={inputToDO}
                maxLength={20}
                onChangeText={input => SubmitTODO(input)}
                onSubmit
            />
            <Pressable style={styles.PressAddToDo} onPress={async function () {
                if (inputToDO != null) {
                    app.database().ref('Users/' + UserUID + '/ToDoDetails/' + inputToDO).set(Math.floor(Math.random() * 9.999))
                    ToDoFirebase()
                    Keyboard.dismiss()
                    SubmitTODO(null)
                    funShow(false)
                    setTimeout(() => funShow(true), 1000)
                    ToastAndroid.show(inputToDO + " , Task Added", ToastAndroid.SHORT)
                } else ToastAndroid.show('  Dont Leave Empty Feilds ... ', ToastAndroid.SHORT)
            }}>
                <Text style={styles.TextAddTODO} >Add</Text>
            </Pressable>
            <ScrollView style={styles.VTDList}>
                {
                    (TODO != null) ?
                        (ShowState) ?
                            TODO.map(function findd(neww) {
                                i = i + 1;
                                return (
                                    <Pressable style={styles.PTDList} key={i} onLongPress={async function () {
                                        app.database().ref('Users/' + UserUID + '/ToDoDetails/' + neww).remove()
                                        ToDoFirebase()
                                        funShow(false)
                                        setTimeout(() => funShow(true), 1000)
                                        ToastAndroid.show(neww + " , Task Deleted", ToastAndroid.SHORT)
                                    }}>
                                        <Text style={styles.TDList} > {neww} </Text>
                                    </Pressable>
                                );

                            })
                            :null

                        : <Text style={styles.TextnoToDo}>Enter Some Task To Perform ...</Text>
                }
            </ScrollView>
            <StatusBar style="auto" />
        </View >
    )
}
