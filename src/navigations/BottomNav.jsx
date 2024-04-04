import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../screens/Home'
import Jobs from '../screens/Jobs'
import Reports from '../screens/Reports'
import Profile from '../screens/Profile'
import { KeyboardAvoidingView ,Platform} from 'react-native';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
const Tab = createBottomTabNavigator();



export default function BottomNav() {
  const { t } = useTranslation();

  return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown:false,
          tabBarActiveTintColor: '#345192',
          tabBarInactiveTintColor: '#345192',
          tabBarActiveBackgroundColor:'#9aa8c9',
          tabBarLabelStyle:{paddingBottom:10,fontSize:15,fontWeight:'bold'},
          tabBarStyle:{backgroundColor:'#c2cbde',height:'09%'}

        }}
        
      > 
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: `${t("Home")}`,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name='home' color={'#345192'} size={33} />
            )
          }}
        />
        <Tab.Screen
          name="Jobs"
          component={Jobs}
          options={{
            tabBarLabel: `${t("Jobs")}`,
            tabBarIcon: ({color, size }) => (
              <MaterialCommunityIcons name='briefcase' size={30} color={'#345192'} />
            )
          }}
        />
        <Tab.Screen
          name="Reports"
          component={Reports}
          options={{
            tabBarLabel:`${t("Reports")}`,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name='newspaper-variant' color={'#345192'} size={30} />
            )
            
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: `${t("Profile")}`,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name='account' color={'#345192'} size={30} />
            )
          }}
        />
      </Tab.Navigator>
      
    
  );
}