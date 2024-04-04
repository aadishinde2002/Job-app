import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
// import PushNotification from 'react-native-push-notification';

const logo1 = require('../assets/images/google.png');
const logo2 = require('../assets/images/facebook.png');
const logo3 = require('../assets/images/play.png');
import notifee from '@notifee/react-native';

export default function Signup(props) {

  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  async function onDisplayNotification() {
  
    await notifee.requestPermission()

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: 'JOB APP',
      body: 'Registered Successfully',
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  
  // PushNotification.configure({
  //   // (optional) Called when Token is generated (iOS and Android)
  //   onRegister: function (token) {
  //     console.log("TOKEN:", token);
  //   },
  
  //   // (required) Called when a remote is received or opened, or local notification is opened
  //   onNotification: function (notification) {
  //     console.log("NOTIFICATION:", notification);
  
  //     // process the notification
  
  //     // (required) Called when a remote is received or opened, or local notification is opened
  //     //notification.finish(PushNotificationIOS.FetchResult.NoData);
  //   },
  
  //   // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  //   onAction: function (notification) {
  //     console.log("ACTION:", notification.action);
  //     console.log("NOTIFICATION:", notification);
  
  //     // process the action
  //   },
  
  //   // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  //   onRegistrationError: function(err) {
  //     console.error(err.message, err);
  //   },
  
  //   // IOS ONLY (optional): default: all - Permissions to register.
  //   permissions: {
  //     alert: true,
  //     badge: true,
  //     sound: true,
  //   },
  //   popInitialNotification: true,
  
  // /**
  //  * (optional) default: true
  //  * - Specified if permissions (ios) and token (android and ios) will requested or not,
  //  * - if not, you must call PushNotificationsHandler.requestPermissions() later
  //  * - if you are not using remote notification or do not have Firebase installed, use this:
  //  *     requestPermissions: Platform.OS === 'ios'
  //  */
  // requestPermissions: Platform.OS === 'ios',
  // requestPermissions: true,
  // });


  const handleSignup = () => {
    if (!email || !password || !confirmPassword) {
      setError(t('fill_all_fields'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('passwords_do_not_match'));
      return;
    }

    onDisplayNotification()

    props.navigation.navigate('Login');

    // PushNotification.localNotification({
    //   title: 'My Notification',
    //   message: 'This is a notification message',
    //   // Additional options
    // });

  };

   
  return (
    <View>
      <ImageBackground style={{ height: 1000 }} source={require('../assets/images/bg.jpg')}>
        <Text style={styles.maintxt}>{t('create_account')}</Text>
        <Text style={styles.sectxt}>{t('explore_jobs')}</Text>
        <TextInput
          placeholder={t('email')}
          style={styles.placeholder}
          onChangeText={text => setEmail(text)}
          value={email}
        />
        <TextInput
          secureTextEntry
          placeholder={t('password')}
          style={styles.placeholder}
          onChangeText={text => setPassword(text)}
          value={password}
        />
        <TextInput
          secureTextEntry
          placeholder={t('confirm_password')}
          style={styles.placeholder}
          onChangeText={text => setConfirmPassword(text)}
          value={confirmPassword}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.btnlog} onPress={handleSignup}>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{t('register')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
          <Text style={{ color: 'black', textAlign: 'center', fontWeight: '500', fontSize: 17, marginTop: 20 }}>{t('already_have_account')}</Text>
        </TouchableOpacity>
        <Text style={{ color: '#345192', textAlign: 'center', fontWeight: '500', fontSize: 15, marginTop: 70 }}>{t('register_with')}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
          <TouchableOpacity><Image style={{ height: 50, width: 60, marginEnd: 5 }} source={logo1} /></TouchableOpacity>
          <TouchableOpacity><Image style={{ height: 40, width: 50, marginEnd: 15 }} source={logo2} /></TouchableOpacity>
          <TouchableOpacity><Image style={{ height: 40, width: 42 }} source={logo3} /></TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  maintxt: {
    fontSize: 32,
    marginTop: 110,
    marginStart: 10,
    marginEnd: 10,
    textAlign: 'center',
    color: '#345192',
    fontWeight: 'bold'
  },
  btnlog: {
    marginTop: 20,
    backgroundColor: '#345192',
    alignItems: 'center',
    marginHorizontal: 18,
    paddingVertical: 15,
    borderRadius: 10
  },
  sectxt: {
    fontSize: 17,
    marginTop: 25,
    paddingHorizontal: 60,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 50
  },
  placeholder: {
    fontSize: 15,
    marginTop: 10,
    backgroundColor: '#D8E4E9',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 10
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10
  }
});
