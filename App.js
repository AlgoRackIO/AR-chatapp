import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './android/screens/LoginScreen';
import SIgnUpScreen from './android/screens/SIgnUpScreen';
import ChatApp from './android/screens/ChatApp'

const Stack = createStackNavigator();

const app = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
        />
           <Stack.Screen
          name="SignUpScreen"
          component={SIgnUpScreen}
        />
         <Stack.Screen
          name="ChatApp"
          component={ChatApp}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
  }
  export default app;