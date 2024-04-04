import Home from './src/components/home'
import Login from './src/components/login'
import Signup from './src/components/signup'
import Addjob from './src/screens/Addjob';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNav from './src/navigations/BottomNav';
import UpdateJob from './src/screens/Udjob';
import Jobreport from './src/screens/jobreport';
import Subreport from './src/screens/subreport';
const Stack = createNativeStackNavigator();






function App() {

  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen   name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen  name="Signup" component={Signup} />
        <Stack.Screen name="BottomNav" component={BottomNav}/>
        <Stack.Screen name="Addjob" component={Addjob}/>
        <Stack.Screen name="UdJob" component={UpdateJob}/>
        <Stack.Screen name="jobreport" component={Jobreport}/>
        <Stack.Screen name="subreport" component={Subreport}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;