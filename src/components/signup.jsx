import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';

const logo1 = require('../assets/images/google.png');
const logo2 = require('../assets/images/facebook.png');
const logo3 = require('../assets/images/play.png');

export default function Signup(props) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = () => {
    if (!email || !password || !confirmPassword) {
      setError(t('fill_all_fields'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('passwords_do_not_match'));
      return;
    }
   
    props.navigation.navigate('Login');
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
