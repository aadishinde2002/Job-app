import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';

const logo1 = require('../assets/images/google.png');
const logo2 = require('../assets/images/facebook.png');
const logo3 = require('../assets/images/play.png');

export default function Login(props) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email) {
      setError(t('enter_email'));
      return;
    }else if(!email.includes('@')){
      setError(t('valid_email'));
      return;
    }else if(!password){
      setError(t('enter_password'));
      return;
    }else if(password.length < 4){
      setError(t('password_length'));
      return
    }
   
    props.navigation.replace('BottomNav');
  };

  return (
    <View>
      <ImageBackground style={{ height: 1000 }} source={require('../assets/images/bg.jpg')}>
        <Text style={styles.maintxt}>{t('login_here')}</Text>
        <Text style={styles.sectxt}>{t('welcome_back')}</Text>
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
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={{ marginEnd: 20, marginTop: 10 }}>
          <Text style={{ color: '#345192', textAlign: 'right', fontWeight: 500 }}>{t('forgot_password')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnlog} onPress={handleLogin}>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{t('login')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('Signup')}>
          <Text style={{ color: 'black', textAlign: 'center', fontWeight: 500, fontSize: 17, marginTop: 20 }}>{t('create_account')}</Text>
        </TouchableOpacity>

        <Text style={{ color: '#345192', textAlign: 'center', fontWeight: 500, fontSize: 15, marginTop: 70 }}>{t('continue_with')}</Text>

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
    fontSize: 18,
    marginTop: 25,
    paddingHorizontal: 90,
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
