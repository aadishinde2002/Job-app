import React, { useState } from 'react';
import { StyleSheet, Text, KeyboardAvoidingView, TextInput, TouchableOpacity, View, Image, ImageBackground, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { geocode_api_key, maps_url } from '../../api';

export default function Addjob(props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: t('kolhapur'), value: 'Kolhapur' },
    { label: t('sangli'), value: 'Sangli' },
    { label: t('pune'), value: 'Pune' },
  ]);
  const [openo, setOpeno] = useState(false);
  const [valueo, setValueo] = useState(null);
  const [itemso, setItemso] = useState([
    { label: t('bca'), value: 'Bca' },
    { label: t('be'), value: 'BE' },
    { label: t('btech'), value: 'Btech' },
  ]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const submit = async() => {
    if (!title || !description || !value || !valueo) {
      Alert.alert('Error', t('fill_all_fields'));
      return;
    }

    const coordinates = await geocodeCity(value);

    const jobData = {
      title: title,
      description: description,
      city: value,
      coordinates: coordinates,
      occupations: valueo
    };

    fetch('http://10.0.2.2:3000/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add job');
      }
      return response.json();
    })
    .then(() => {
      props.navigation.goBack();
    })
    .catch(error => {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to add job');
    });
  };

  const geocodeCity = async (cityName) => {
    try {
      const response = await fetch(`${maps_url}address=${cityName}&key=${geocode_api_key}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng
        };
      } else {
        console.error('Geocoding API returned no results');
        return null;
      }
    } catch (error) {
      console.error('Error geocoding city:', error);
      return null;
    }
  };

  return (
    <ScrollView>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 1 }}
    >
      
        <View>
          <ImageBackground style={{ height: 1000 }} source={require('../assets/images/bg.jpg')}>
            <View>
              <TouchableOpacity style={{ backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center', marginTop: 15, marginStart: 10 }} onPress={() => props.navigation.goBack()}>
                <IonIcons name='caret-back-outline' color='black' size={25} />
                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 17 }}>{t('back')}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.maintxt}>{t('add_jobs')}</Text>
            <Text style={styles.sectxt}>{t('add_jobs_desc')}</Text>
            <TextInput onChangeText={(text) => setTitle(text)} placeholder={t('job_title')} style={styles.placeholder}></TextInput>
            <View style={{ paddingHorizontal: 20 }}>
              <DropDownPicker
                style={styles.dropdown}
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder={t('select_city')}
                mode='BADGE'
                multiple={true}
                placeholderStyle={{ color: '#5b5b5b', fontSize: 15 }}
                badgeTextStyle={{ color: 'black' }}
              />
            </View>
            <View style={{ paddingHorizontal: 20 }}>
              <DropDownPicker
                style={styles.dropdown}
                open={openo}
                value={valueo}
                items={itemso}
                setOpen={setOpeno}
                setValue={setValueo}
                setItems={setItemso}
                mode='BADGE'
                badgeTextStyle={{ color: 'black' }}
                placeholder={t('select_required_occupations')}
                multiple={true}
                placeholderStyle={{ color: '#5b5b5b', fontSize: 15 }}
              />
            </View>
            <TextInput onChangeText={(text) => setDescription(text)} placeholder={t('job_description')} multiline={true} style={styles.multi}></TextInput>
            <TouchableOpacity onPress={submit} style={styles.btnlog}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{t('add_job')}</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
    
    </KeyboardAvoidingView>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  maintxt: {
    fontSize: 32,
    marginTop: 100,
    marginStart: 10,
    marginEnd: 10,
    textAlign: 'center',
    color: '#345192',
    fontWeight: 'bold'
  },
  dropdown: {
    justifyContent: 'center',
    backgroundColor: '#D8E4E9',
    paddingVertical: 20,
    borderWidth: 0,
    marginTop: 10,
    zIndex: 99,
    fontSize: 15,
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
  multi: {
    height: 100,
    fontSize: 15,
    marginTop: 10,
    backgroundColor: '#D8E4E9',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    borderColor: '#345192',
    borderBottomWidth: 4
  }
});
