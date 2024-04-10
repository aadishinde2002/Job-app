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
import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging'
import { Alert } from 'react-native';
import PushNotification from 'react-native-push-notification';
// import { initializeDatabase } from './src/database/database';
import { database } from './src/database/database';
import i18n from './src/components/i18n';

const Stack = createNativeStackNavigator();

PushNotification.configure({
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
  },

  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);
  },

  onRegistrationError: function(err) {
    console.error(err.message, err);
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,
  requestPermissions: true,
});


function App() {
  useEffect(()=>{
    tokencall() 
    getdata() 
    
  })

  // useEffect(()=> {
  //   initializeDatabase()
  //   .then(() => {
  //     console.log('initialized succcsessfully')
  //   })
  //   .catch(error => {
  //     console.log('Error initializing database:', error);
  //   });
  // })
  const getdata=async()=>{
    const databasecall = await database.collections.get('profiledata')
    
    const final = await databasecall.table
    console.log(final)
   }

  const tokencall = async()=>{
    let token = await messaging().getToken();
    console.log(token) 
  }
  
    useEffect(() => {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      });
  
      return unsubscribe;
    }, []);
  

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