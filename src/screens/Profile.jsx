import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import {useTranslation} from 'react-i18next';
import {RadioButton} from 'react-native-paper';
import {getLocales} from 'react-native-localize';
import  { database }  from '../database/database';
import NetInfo from '@react-native-community/netinfo';
import Share from 'react-native-share';
import { resume } from '../../api';




export default function Profile() {
  const [selectedLanguage, setSelectedLanguage] = useState(getLocales()[0].languageCode);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [lname, setLname] = useState('');
  const [profile, setProfile] = useState(
    'https://i.pinimg.com/564x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg',
  );
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [secondmodal, setsecondmodal] = useState(false);
  const {t, i18n} = useTranslation();
  const {db, setDb} = useState('');

  const changeLanguage = async (lng)=> {
    try {
      i18n.changeLanguage(lng);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

 const resumeshare = async()=>{
  const sharefile = {
    message: 'This is my resume',
    url: resume
  }
  try {
    const ShareResponse = await Share.open(sharefile)
  } catch (error) {
    console.log('error in sharing',error)
  }
 }

  const checkNetworkStatus = async () => {
    try {
      const state = await NetInfo.fetch();
      return state.isConnected;
    } catch (error) {
      console.error('Error checking network status:', error);
      return false;
    }
  };

  const updateProfile = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/users/f4cc', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fname: name,
          lname: lname,
          email: email,
          profile: profile,
        }),
      });
      if (response.ok) {
        setModalVisible(false);
        Toast.show({
          type: 'success',
          text1: 'Updated SuccessFully',
        });
      } else {
        console.error('Error updating profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const cameraimg = () => {
    ImagePicker.openCamera({
      width: 150,
      height: 150,
      cropping: true,
    }).then(image => {
      setProfile(image.path);
      setsecondmodal(false);
    });
  };

  const imageupdate = () => {
    ImagePicker.openPicker({
      width: 150,
      height: 150,
      cropping: true,
    }).then(image => {
      setProfile(image.path);
      setsecondmodal(false);
    });
  };

  // const fetchData = async () => {
  //   try {
  //     const url = 'http://10.0.2.2:3000/users/f4cc';
  //     const resp = await fetch(url);
  //     const result = await resp.json();
  //     setName(result.fname);
  //     setLname(result.lname);
  //     setEmail(result.email);
  //     setProfile(result.profile);
  //   } catch (err) {
  //     console.warn('There was an error fetching data:', err);
  //   }
  // };

  const fetchData = async () => {
    try {
      const isConnected = await checkNetworkStatus();
      let result;
      if (isConnected) {
        const url = 'http://10.0.2.2:3000/users/f4cc';
        const resp = await fetch(url);
        result = await resp.json();
        await saveProfileToLocalDatabase(result);
      } else {
        console.log('offline')
        const profileModel = await database.get('profiledata');
        const profileRecord = await database.query(profileModel).fetch();
        result = {
          fname: profileRecord.name,
          lname: profileRecord.lname,
          email: profileRecord.email,
          profile: profileRecord.profile,
        };
      }
  
      setName(result.fname);
      setLname(result.lname);
      setEmail(result.email);
      setProfile(result.profile);  
    } catch (error) {
      console.warn('There was an error fetching data:', error);
    }
  };

  const getdata = async () => {
    try {
      const databasecall = await database.collections.get('profiledata');
      await databasecall.query().observe().forEach(item => {
        console.log(item);
      });

    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const eraseAllData = async () => {
    try {
      const profiles = await database.collections.get('profiledata'); 
      const allProfiles = await profiles.query().fetch(); 
      await database.write(async () => {
        await Promise.all(allProfiles.map(profile => profile.destroyPermanently())); 
      });
      console.log('All data erased from the database');
    } catch (error) {
      console.error('Error erasing data from the database:', error);
    }
  };

// const saveProfileToLocalDatabase = async (result) => {
//   try {
//     await database.write(async () => {
//       const profileModel = await database.get('profiledata');
//       if (profileModel) {
//         await profileModel.create(table => {
//           table.name = result.name;
//           table.lname = result.lname;
//           table.email = result.email;
//           table.profile = result.profile;
//         });
//       } else {
//         console.error('Profile model not found'); 
//     }
//     })
//   } catch (error) {
//     console.error('Error saving profile to local database:', error);
//   }
// };

const saveProfileToLocalDatabase = async (result) => {
  try {
    await database.write(async () => {
      const profiles = await database.collections.get('profiledata'); 
      const profile = await profiles.query().fetch(); 
      if (profile.length > 0) {
        await profile[0].update(updatedProfile => {
          updatedProfile.name = result.name;
          updatedProfile.lname = result.lname;
          updatedProfile.email = result.email;
          updatedProfile.profile = result.profile;
        });
      } else {
        await profiles.create(table => {
          table.name = result.name;
          table.lname = result.lname;
          table.email = result.email;
          table.profile = result.profile;
         });
      }
    });
    console.log('Profile updated successfully');
  } catch (error) {
    console.error('Error saving profile to local database:', error);
  }
};


//  useEffect(()=>{
//   getdata()
//  },[])

  useEffect(() => {
    fetchData();
    getdata();
  }, []);


  const modalclose = () => {
    setModalVisible(false);
    fetchData();
  };

  return (
    <View style={{backgroundColor: '#345192'}}>
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
                changeLanguage(value);
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={secondmodal}
          onRequestClose={() => {
            setsecondmodal(false);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalinnerContent}>
              <TouchableOpacity
                style={{position: 'absolute', right: '1%', top: '1%'}}
                onPress={() => setsecondmodal(false)}>
                <IonIcons name="close" color="black" size={35} />
              </TouchableOpacity>
              <TouchableOpacity onPress={cameraimg}>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <IonIcons name="camera-outline" color="black" size={70} />
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginTop: -10,
                      marginBottom: 20,
                    }}>
                    {t('camera')}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={imageupdate}>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <IonIcons name="image-outline" color="black" size={70} />
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginTop: -10,
                      marginBottom: 20,
                    }}>
                    {t('gallery')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setsecondmodal(true)}>
              <Image source={{uri: profile}} style={styles.updatePhoto} />
              <IonIcons
                name="camera-outline"
                color="white"
                size={70}
                style={{position: 'absolute', top: '30%', left: '37%'}}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={t('First Name')}
            />
            <TextInput
              style={styles.input}
              value={lname}
              onChangeText={setLname}
              placeholder={t('Last Name')}
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder={t('Email')}
            />
            <TouchableOpacity
              style={styles.updateButton}
              onPress={updateProfile}>
              <Text style={styles.updateButtonText}>{t('Update')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={modalclose}>
              <Text style={styles.closeButton}>{t('Close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={{flexDirection:'row'}}>
        <TouchableOpacity
          style={{
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignItems: 'center',
            paddingStart:100,
            justifyContent: 'center',
            marginTop: 10,
            flex:5
          }}>
          <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 25}}>
            {t('profile')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
           borderColor:'#fff',
           borderWidth:2,
           borderRadius:20,
           marginTop: 15,
           marginVertical:'1.2%',
           marginHorizontal:'6%',
           paddingHorizontal:'1.5%',
           alignItems: 'center',
           justifyContent: 'center',
           flex:1
          }}
          onPress={() => setLanguageModalVisible(true)}>
          <Text style={{color: 'white', fontSize: 18}}>
            {t('Lang')}
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <View style={styles.container}>
          <TouchableOpacity
            style={{
              backgroundColor: 'transparent',
              flexDirection: 'row',
              alignItems: 'center',
              position: 'absolute',
              top: '03%',
              right: '07%',
            }}
            onPress={() => setModalVisible(true)}>
            <MaterialCommunityIcons
              name="account-edit"
              color="black"
              size={35}
            />
          </TouchableOpacity>
          <Image source={{uri: profile}} style={styles.profilePhoto} />
          <Text style={styles.name}>
            {name} {lname}
          </Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        <View style={{backgroundColor: '#345192', paddingBottom: 20}}>
          <View style={styles.menucontainer}>
            <View style={styles.menu}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 40,
                  justifyContent: 'start',
                  marginTop: 0,
                }}>
                <View
                  style={{
                    backgroundColor: '#5d74a8',
                    padding: '02%',
                    borderRadius: 50,
                  }}>
                  <MaterialCommunityIcons
                    name="view-dashboard-outline"
                    color="#fff"
                    size={35}
                  />
                </View>
                <Text
                  style={{color: 'black', fontWeight: 'bold', fontSize: 25}}>
                  {t('dashboard')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.menu}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 40,
                  justifyContent: 'start',
                  marginTop: 15,
                }}
                onPress={resumeshare}
                >
                <View
                  style={{
                    backgroundColor: '#5d74a8',
                    padding: '02%',
                    borderRadius: 50,
                  }}>
                  <MaterialIcons name="payment" color="#fff" size={35} />
                </View>
                <Text
                  style={{color: 'black', fontWeight: 'bold', fontSize: 25}}>
                  {t('shareresume')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.menu}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 40,
                  justifyContent: 'start',
                  marginTop: 15,
                }}
                onPress={eraseAllData}>
                <View
                  style={{
                    backgroundColor: '#5d74a8',
                    padding: '02%',
                    borderRadius: 50,
                  }}>
                  <IonIcons name="stats-chart-outline" color="#fff" size={35} />
                </View>
                <Text
                  style={{color: 'black', fontWeight: 'bold', fontSize: 25}}>
                  {t('statistics')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.menu}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 40,
                  justifyContent: 'start',
                  marginTop: 15,
                }}>
                <View
                  style={{
                    backgroundColor: '#5d74a8',
                    padding: '02%',
                    borderRadius: 50,
                  }}>
                  <MaterialIcons name="password" color="#fff" size={35} />
                </View>
                <Text
                  style={{color: 'black', fontWeight: 'bold', fontSize: 25}}>
                  {t('password')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menu}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 40,
                  justifyContent: 'start',
                  marginTop: 15,
                }}>
                <View
                  style={{
                    backgroundColor: '#5d74a8',
                    padding: '02%',
                    borderRadius: 50,
                  }}>
                  <MaterialCommunityIcons
                    name="logout"
                    color="#fff"
                    size={35}
                  />
                </View>
                <Text
                  style={{color: 'black', fontWeight: 'bold', fontSize: 25}}>
                  {t('logout')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  menucontainer: {
    backgroundColor: '#9aa8c9',
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 30,
    marginTop: 10,
  },
  container: {
    position: 'relative',
    flex: 1,
    minHeight: 250,
    alignItems: 'center',
    justifyContent: 'start',
    backgroundColor: '#9aa8c9',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 20,
  },
  menu: {
    justifyContent: 'center',
    marginStart: 40,
    marginTop: 18,
  },
  profilePhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  email: {
    fontSize: 18,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalinnerContent: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 15,
    paddingTop: 45,
    borderRadius: 10,
    width: '60%',
    flexDirection: 'row',
    gap: 40,
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: '#345192',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  updatePhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginVertical: 20,
    marginStart: '23%',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#345192',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
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
  },
});
