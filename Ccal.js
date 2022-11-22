import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Pressable, Text, ToastAndroid, View, TextInput, Keyboard } from 'react-native'
import RNPickerSelect from "react-native-picker-select"
import { styles } from './styles'




export default function Ccal({ navigation }) {

    const [supplyRatio, funSR] = useState('')
    const [Bitvalue, funval2] = useState('')
    const BitSupply = 19100000
    const [numVal, funnum] = useState('1')
    const [MaxPrice, funMax] = useState(0)
    const selection = (val) => funnum(val)
    return (
        <View style={styles.kcontainer}>
            <Text style={styles.textTitle}>Crypto Calculator</Text>
            <View style={styles.ViewNav}>
                <Pressable style={styles.PressDetail1} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.buttonDetail}>Home</Text>
                </Pressable>
                <Pressable style={styles.PressDetail2} onPress={() => {
                    navigation.navigate('Details')
                }}>
                    <Text style={styles.buttonDetail}>Details</Text>
                </Pressable>
            </View>
            <View style={styles.calContainer}>
                <TextInput
                    style={styles.inputcal}
                    placeholder="supply of coin"
                    onChangeText={input => funSR(input)}
                    value={supplyRatio}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.inputcal2}
                    placeholder="Value of bitcoin"
                    onChangeText={input => funval2(input)}
                    value={Bitvalue}
                    keyboardType="numeric"
                />
                <View style={styles.i}>
                    <RNPickerSelect
                        onValueChange={(val) => selection(val)}
                        placeholder={{}}
                        items={[
                            { label: "None", value: "1" },
                            { label: "Billion", value: "1000000000" },
                            { label: "Million", value: "1000000" },
                        ]}
                    />
                </View>
                <Pressable style={styles.ButCal} onPress={() => {
                    var SR = Number(supplyRatio)
                    var BV = Number(Bitvalue)
                    var NV = Number(numVal)
                    if (SR != 0 && BV != 0) {
                        var ratioValue = (SR * NV) / BitSupply
                        funMax(BV / ratioValue)
                        Keyboard.dismiss()
                    } else ToastAndroid.show('Enter the Values', ToastAndroid.SHORT)
                }}>
                    <Text style={styles.butTxtCal}>Calculate</Text>
                </Pressable>
                <Pressable style={styles.ButReset} onPress={() => {
                    funSR(null)
                    funval2(null)
                    funnum(null)
                    funMax(null)
                }}>
                    <Text style={styles.butTxtCal}>Reset</Text>
                </Pressable>
                <Text style={styles.textMaxPrice}>Max Price of the Coin : {Math.floor(MaxPrice) + ' USD'}</Text>
            </View>
            <StatusBar style="auto" />
        </View>
    )

}
