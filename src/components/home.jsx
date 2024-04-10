import { View, Text, Image, SafeAreaView, ScrollView, ImageBackground, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { RadioButton } from 'react-native-paper';
import { getLocales } from 'react-native-localize';
const logo = require('../assets/images/logo.png')

const Home = (props) => {
  const {t, i18n} = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(getLocales()[0].languageCode);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const homechangeLanguage = async (lng) => {
    try {
      i18n.changeLanguage(lng);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  return (

<ImageBackground style={{height:1000}} source={require('../assets/images/bg.jpg')}> 
<Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}>
        <View style={styles.modallangContainer}>
          <View style={styles.modallangContent}>
            <Text style={styles.languageButton}>{t('Select Language')}</Text>
            <RadioButton.Group
              onValueChange={value => {
                homechangeLanguage(value);
                setSelectedLanguage(value);
                setLanguageModalVisible(false);
              }}
              value={selectedLanguage}>
              <RadioButton.Item label={t('English')} value="en" />
              <RadioButton.Item label={t('Hindi')} value="hi" />
              <RadioButton.Item label={t('Marathi')} value="mar" />
            </RadioButton.Group>
          </View>
        </View>
      </Modal> 
      <TouchableOpacity
          style={{
           borderColor:'#345192',
           borderWidth:2,
           borderRadius:20,
           marginTop: 15,
           marginVertical:'1.2%',
           marginStart:'75%',
           marginEnd:'3%',
           paddingHorizontal:'1.5%',
           alignItems: 'center',
           justifyContent: 'center',

          }}
          onPress={() => setLanguageModalVisible(true)}>
          <Text style={{color: '#345192', fontSize: 18}}>
            {t('Lang')}
          </Text>
        </TouchableOpacity>
    
      <Image style={styles.banner}source={logo}/>
        {/* <View style={{marginTop:365}}>
        <Text style={{textAlign:'center' , paddingHorizontal:50, fontSize:18 ,color:'' }}>we work for your dreams and your goals all you need is to start with us </Text>
        </View> */}
    
      <Text style={styles.maintxt}>
        {t('discover_job')}
      </Text>
      <View style={{alignItems:'center', marginTop:20}}>
        <TouchableOpacity
         style={styles.btnlog}
         onPress={()=> props.navigation.navigate('Login')}>
          <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>
            {t('login')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnup} onPress={()=> props.navigation.navigate('Signup')}>
          <Text style={{color:'black',fontSize:20,fontWeight:'bold'}}>
            {t('register')}
          </Text>
        </TouchableOpacity >
      </View>
      <Text style={{textAlign:'center',paddingHorizontal:20,marginTop:30}}>{t('professional_journey')}</Text>
   
</ImageBackground>
  )
}

const styles = StyleSheet.create({
  banner:{
    width:'100%',
    height:430,
    marginTop:0,
  },
  maintxt:{
    fontSize:30,
    marginTop:0,
    marginStart:10,
    marginEnd:10,
    textAlign:'center',
    color:'#0b2e59',
    fontWeight:'bold'
  },
  btnlog:{
    marginTop:30,
    backgroundColor:'#345192',
    alignItems:'center',
    paddingHorizontal:120,
    paddingVertical:15,
    borderRadius:50
  },  
  btnup:{
    marginTop:15,
    marginBottom:30,
    backgroundColor:'#D8E4E9',
    alignItems:'center',
    paddingHorizontal:109,
    paddingVertical:15,
    borderRadius:50
  },
  languageButton: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  modallangContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modallangContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  }
})

export default Home
