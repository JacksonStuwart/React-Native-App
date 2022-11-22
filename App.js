import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Details from './Details';
import Home from './Home';
import Login from './Login';
import Secret from './Secret';
import SignUp from './SignUp';
import ToDoList from './ToDoList';
import Ccal from './Ccal';

const Stack = createNativeStackNavigator()

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
        <Stack.Screen options={{ headerShown: false }} name="SignUp" component={SignUp} />
        <Stack.Screen options={{ headerShown: false }} name="Home" component={Home} />
        <Stack.Screen options={{ headerShown: false }} name="Details" component={Details} />
        <Stack.Screen options={{ headerShown: false }} name="Ccal" component={Ccal} />
        <Stack.Screen options={{ headerShown: false }} name="ToDoList" component={ToDoList} />
        <Stack.Screen options={{ headerShown: false }} name="Secret" component={Secret} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

