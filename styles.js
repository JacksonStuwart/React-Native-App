import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  container: {
    width: '100%',
    height: '100%',
    marginTop: 60,
    alignItems: 'center',
  },
  kcontainer: {
    width: '100%',
    height: '100%',
    marginTop: 60,
  },
  textTitle: {
    marginTop: 0,
    marginBottom: 100,
    backgroundColor: '#5c5c8a',
    width: '100%',
    height: 100,
    textAlign: 'center',
    color: '#DCDADA',
    padding: 27,
    fontSize: 27,
    letterSpacing: 2,
    fontFamily: 'sans-serif-condensed'
  },
  textTitle2: {
    marginTop: 0,
    marginBottom: 100,
    backgroundColor: '#5c5c8a',
    width: '100%',
    height: 100,
    color: '#DCDADA',
    textAlign: 'center',
    padding: 30,
    fontSize: 25,
    letterSpacing: 2,
    fontFamily: 'sans-serif-condensed'
  },
  inputSubmition: {
    borderTopWidth: 3,
    width: '100%',
    alignItems: 'center',
    height: '100%',
  },
  inputDetails: {
    marginBottom: 20,
    marginTop: 50,
    backgroundColor: '#d1d1e0',
    letterSpacing: 2,
    color: 'black',
    width: '80%',
    height: 60,
    borderRadius: 10,
    padding: 18,
    fontSize: 20,
    fontFamily: 'serif'
  },
  inputEmail: {
    marginBottom: 6,
    marginTop: 40,
    backgroundColor: '#d1d1e0',
    letterSpacing: 1,
    color: 'black',
    width: '80%',
    height: 60,
    borderRadius: 10,
    padding: 18,
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'serif'
  },
  inputUsername: {
    marginTop: 10,
    marginBottom: -22,
    backgroundColor: '#d1d1e0',
    letterSpacing: 2,
    color: 'black',
    width: '80%',
    height: 60,
    borderRadius: 10,
    padding: 18,
    fontSize: 20,
    fontFamily: 'serif'
  },
  inputAmt: {
    marginTop: 10,
    backgroundColor: '#d1d1e0',
    letterSpacing: 2,
    color: 'black',
    width: '80%',
    height: 60,
    borderRadius: 10,
    padding: 18,
    fontSize: 20,
    fontFamily: 'serif'
  },
  inputToDo: {
    marginTop: 10,
    marginBottom: 40,
    marginLeft: -80,
    textAlign: 'center',
    borderBottomWidth: 1.5,
    letterSpacing: 1,
    color: 'black',
    width: '70%',
    height: 60,
    borderRadius: 10,
    padding: 18,
    fontSize: 20,
  },
  buttonClear: {
    width: 90,
    alignItems: 'center',
    height: 33,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#bfbfbf',
    marginTop: 30,
    marginLeft: 130,
  },
  buttonGetDetails: {
    width: 90,
    alignItems: 'center',
    height: 33,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#bfbfbf',
    marginTop: -32,
    marginLeft: -120,
    marginBottom: 20
  },
  buttonCText: {
    color: '#5c5c8a',
    fontWeight: 'bold',
    fontFamily: 'serif',
    letterSpacing: 2,
    fontSize: 16,
  },
  inputDate: {
    width: 90,
    height: 33,
    textAlign: 'center',
    marginLeft: -200,
    borderWidth: 1,
    letterSpacing: 2,
    fontSize: 16,
    marginTop: 2,
    borderRadius: 5,
    color: 'green',
    borderColor: 'green',
    fontFamily: 'serif'
  },
  inputMonth: {
    width: 90,
    height: 33,
    letterSpacing: 2,
    fontSize: 16,
    textAlign: 'center',
    marginLeft: 12,
    marginTop: -33,
    borderWidth: 1,
    borderRadius: 5,
    color: 'green',
    borderColor: 'green',
    fontFamily: 'serif'
  },
  inputYear: {
    width: 90,
    height: 33,
    letterSpacing: 2,
    fontSize: 16,
    textAlign: 'center',
    borderRadius: 5,
    marginLeft: 220,
    marginTop: -33,
    borderWidth: 1,
    color: 'green',
    borderColor: 'green',
    fontFamily: 'monospace'
  },
  buttonSubmit: {
    marginTop: 60,
    width: 130,
    borderRadius: 10,
    backgroundColor: '#d1d1e0',
    alignItems: 'center',
    height: 48,
    padding: 10,
  },
  buttonSubmitText: {
    letterSpacing: 5,
    fontFamily: 'serif',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#5c5c8a'
  },
  buttonView2: {
    marginTop: 30,
  },
  ScrollViewDetails: {
    width: '100%',
    marginTop: 10,
    marginBottom: 60
  },
  ScrollViewKey: {
    width: '100%',
    marginTop: 10,
    marginBottom: 60
  },
  ViewDetails: {
    alignItems: 'baseline',
    width: '85%',
    marginLeft: 30,
    borderRadius: 8,
    marginBottom: 10,
    height: 120,
    backgroundColor: '#d9d9d9'
  },
  ViewDetailsMonth: {
    alignItems: 'center',
    width: '33%',
    marginLeft: 30,
    borderRadius: 8,
    marginBottom: 10,
    height: 40,
    padding: 8,
    backgroundColor: '#e6e6e6'
  },
  ViewDetailsMonthText: {
    letterSpacing: 2,
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004d1a'
  },
  Detailsid: {
    color: 'red',
    marginLeft: 15,
    position: 'absolute',
    fontFamily: 'serif',
    marginTop: 15,
    fontSize: 16,
  },
  DetailsAmount: {
    color: '#5c5c8a',
    position: 'absolute',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'serif',
    letterSpacing: 1,
    marginLeft: 50,
    marginTop: 82
  },
  DetailsSpentOn: {
    color: '#5c5c8a',
    fontWeight: 'bold',
    position: 'absolute',
    fontFamily: 'serif',
    fontSize: 15,
    letterSpacing: 1,
    marginLeft: 50,
    marginTop: 50
  },
  DetailsDate: {
    color: 'red',
    position: 'absolute',
    marginLeft: 100,
    fontFamily: 'serif',
    marginTop: 10,
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 3
  },
  DetailsDay: {
    color: 'red',
    position: 'absolute',
    fontFamily: 'serif',
    marginLeft: 286,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: 17,
    marginTop: 68,
  },
  PressHome: {
    position: 'absolute',
    marginTop: 140,
    marginLeft: 25,
    borderBottomWidth: 2,
    borderColor: 'red'
  },
  ViewNav: {
    width: '100%',
    height: 50,
    marginTop: -45,
  },
  PressDetail1: {
    position: 'absolute',
    marginLeft: 80,
  },
  PressDetail2: {
    position: 'absolute',
    marginLeft: 218,
  },
  WelcomeUser: {
    letterSpacing: 3,
    marginTop: 30,
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FC7659'
  },
  buttonDetail: {
    letterSpacing: 3,
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5c5c8a'
  },
  PressAddToDo: {
    position: 'relative',
    marginTop: -86,
    marginLeft: 300,
    borderRadius: 6,
    backgroundColor: '#d1d1e0',
    width: 75,
    height: 40,

  },
  TextAddTODO: {
    padding: 5,
    textAlign: 'center',
    letterSpacing: 2,
    fontWeight: 'bold',
    fontFamily: 'serif',
    fontSize: 18.6,
    color: '#5c5c8a',

  },
  TextTotal: {
    textAlign: 'justify',
    fontSize: 16,
    width: '56%',
    marginLeft: 150,
    fontFamily: 'serif',
    marginTop: 8,
    borderRadius: 8,
    marginBottom: 10,
    color: '#5c5c8a',
    fontWeight: 'bold',
    height: 50,
    padding: 12,
    backgroundColor: '#bfbfbf',
  },
  Secret: {
    width: '85%',
    marginLeft: 30,
    borderRadius: 8,
    marginBottom: 10,
    height: 120,
    backgroundColor: '#e0e0eb'
  },
  keypair: {
    fontSize: 16,
    borderBottomWidth: 1,
    margin: 10,
    fontFamily: 'serif',
    width: 120,
    color: 'red',
    textAlign: 'left'

  },
  TDList: {
    fontSize: 18,
    borderBottomWidth: 1,
    margin: 10,
    color: '#ff471a',
    letterSpacing: 2,
    textAlign: 'center',
    fontFamily: 'serif'

  },
  TextnoToDo: {
    letterSpacing: 3,
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40
  },
  TextnoHeader: {
    letterSpacing: 3,
    fontWeight: 'bold',
    fontSize: 15,
    padding: 5,
    borderBottomWidth: 1,
    textAlign: 'center',
    marginTop: 40
  },
  PTDList: {
    marginBottom: 10,
    width: '60%',
    marginLeft: 68,
  },
  VTDList: {
    width: '100%',
    marginTop: 40,
    marginBottom: 60
  },
  DecryptPASS: {
    marginLeft: 30,
    fontSize: 14,
    fontFamily: 'serif',
    color: '#5c5c8a',
    fontWeight: 'bold'

  },
  DecryptUID: {
    marginBottom: 10,
    marginLeft: 30,
    fontFamily: 'serif',
    color: '#5c5c8a',
    fontSize: 14,
    fontWeight: 'bold'
  },
  buttonGetKey: {
    width: 90,
    alignItems: 'center',
    height: 33,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#bfbfbf',
    marginTop: -32,
    marginLeft: 90,

  },
  buttonGetKeyReset: {
    width: 90,
    alignItems: 'center',
    height: 33,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#bfbfbf',
    marginTop: 40,
    marginLeft: 220,
  },
  buttonSText: {
    color: '#5c5c8a',
    fontFamily: 'serif',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  KeyInput: {
    fontSize: 20,
    width: 300,
    height: 60,
    textAlign: 'center',
    fontFamily: 'serif',
    color: 'black',
    marginLeft: 50,
    letterSpacing: 3,
    borderBottomWidth: 5,
    borderTopWidth: 3,
    borderBottomColor: '#b3b3cc',
    borderRadius: 10,
  },
  buttonGenerator: {
    width: 120,
    alignItems: 'center',
    height: 27,
    padding: 3,
    position: 'absolute',
    marginTop: 66,
    marginLeft: 135,
  },
  KeyInputAdd: {
    fontSize: 16,
    marginTop: 35,
    width: 350,
    height: 40,
    textAlign: 'center',
    color: 'black',
    marginLeft: 20,
    letterSpacing: 3,
    fontFamily: 'serif',
    borderColor: 'green',
    borderRadius: 10,
    borderBottomWidth: 2
  },
  DeleteImgY: {
    marginTop: 3,
    textAlign: 'center',
    fontSize: 16,
    width: 120,
    fontFamily: 'serif',
    color: 'red',

  },
  DeleteImgPressY: {
    position: 'absolute',
    marginTop: 10,
    width: 120,
    borderBottomWidth: 1,
    height: 27,
    marginLeft: 240
  },
  DeleteImg: {
    marginTop: 3,
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 1,
    fontFamily: 'serif',
    color: 'red',

  },
  DeleteImgPress: {
    position: 'absolute',
    marginTop: 10,
    width: 68,
    borderBottomWidth: 1,
    height: 27,
    marginLeft: 260
  },
  buttonAdd: {
    marginLeft: 160,
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: '#bfbfbf',
    width: 100,
    alignItems: 'center',
    height: 35,
    padding: 5,
    borderRadius: 5
  },
  textAddKeys: {
    marginTop: 20,
    marginBottom: 10,
    marginLeft: '25%',
    textAlign: 'center',
    letterSpacing: 3,
    fontSize: 27,
    color: 'black',
    fontFamily: 'sans-serif-condensed',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    width: '50%',
    height: 40
  },
  buttonAddKey: {
    marginLeft: 160,
    marginTop: 33,
    marginBottom: 10,
    backgroundColor: '#bfbfbf',
    width: 100,
    alignItems: 'center',
    height: 36,
    padding: 5,
    borderRadius: 5
  },
  AddView: {
    marginTop: 15,
    borderColor: 'grey',
    borderTopWidth: 10,
    marginBottom: 10
  },
  exDate: {
    marginLeft: -200,
    marginTop: 5,
    fontFamily: 'serif',
    color: '#5c5c8a'
  },
  exMonth: {
    marginTop: -20,
    marginLeft: 10,
    fontFamily: 'serif',
    color: '#5c5c8a'
  },
  exYear: {
    marginLeft: 210,
    marginTop: -20,
    fontFamily: 'serif',
    color: '#5c5c8a'
  },
  calContainer: {
    marginTop:20,
    marginLeft: 20,
    width: '90%',
    height: '100%',
    alignItems: 'flex-start'
  },
  inputcal: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    letterSpacing: 2,
    color: 'black',
    width: '55%',
    height: 60,
    borderRadius: 10,
    marginBottom: 10,
    padding: 16,
    fontSize: 15,
    fontFamily: 'serif'
  },
  inputcal2: {
    marginTop:10,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    letterSpacing: 2,
    color: 'black',
    width: '55%',
    height: 60,
    borderRadius: 10,
    padding: 16,
    fontSize: 15,
    fontFamily: 'serif'
  },

  i: {
    width: 120,
    height: 45,
    backgroundColor: '#d1d1e0',
    borderRadius:3,
    position: 'absolute',
    marginLeft: 240,
    marginTop: 10

  },
  textMaxPrice: {
    marginTop: 280,
    letterSpacing: 1,
    color: '#5c5c8a',
    width: '100%',
    position: 'absolute',
    borderRadius: 10,
    padding: 18,
    fontSize: 16.5,
    fontWeight: 'bold',
    fontFamily: 'serif'

  },
  ButCal: {
    marginTop: 200,
    marginLeft: 50,
    width: 120,
    position: 'absolute',
    borderRadius: 10,
    backgroundColor: '#d1d1e0',
    alignItems: 'center',
    height: 40,
    padding: 8,
  },
  butTxtCal: {
    letterSpacing: 2,
    fontFamily: 'serif',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#5c5c8a'
  },
  ButReset: {
    marginTop: 200,
    marginLeft: 200,
    width: 120,
    position: 'absolute',
    borderRadius: 10,
    backgroundColor: '#d1d1e0',
    alignItems: 'center',
    height: 40,
    padding: 8,
  },
  NavCalc:{
    position:'absolute',
    marginTop:400,
  }
});

export { styles }