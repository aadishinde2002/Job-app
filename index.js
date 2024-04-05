/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { PaperProvider } from 'react-native-paper';
import messaging from '@react-native-firebase/messaging'

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  }
)

messaging().getInitialNotification(async remoteMessage => {
  console.log('Message handled in Kill Mode!', remoteMessage);
}
)


export default function Main() {
    return (
      <PaperProvider>
        <App />
      </PaperProvider>
    );
  }

AppRegistry.registerComponent(appName, () => Main);
