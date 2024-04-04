import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  FlatList,
  Modal,
} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation'; 
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import Voice from '@react-native-voice/voice';
import { useTranslation } from 'react-i18next';
import { geocode_api_key, maps_url } from '../../api';


export default function Jobs(props) {
  const [userLocation, setUserLocation] = useState(null); 
  const [userCity, setUserCity] = useState('');
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const { t } = useTranslation();

  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  

  useEffect(() => {
    if (userLocation) {
      fetch(`${maps_url}latlng=${userLocation.latitude},${userLocation.longitude}&key=${geocode_api_key}`)
        .then(response => response.json())
        .then(data => {
          const city = data.results[0].address_components.find(component => component.types.includes('locality'));
          setUserCity(city ? city.long_name : '');
          fetchJobs();
        }
       )
        .catch(error => {
          console.error('Error getting city name:', error);
        });
    }    
  }, [userLocation]);

  
  const nearbyJobs = ()=>{
    Geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
          // latitude: 18.5204303,
          // longitude: 73.8567437
        });
      },
      error => {
        console.error('Error getting user location:', error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    setSearchQuery(userCity)
  }

  const startListening = async () => {
    try {
      setIsListening(true);
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
    }
  };

  const stopListening = async () => {
    try {
      setIsListening(false);
      await Voice.stop();
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  const onSpeechResults = (e) => {
    setSearchQuery(e.value[0]);
    console.log(e.value[0])
  };


  const fetchJobs = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching job data:', error);
    }
  };

  const deleteJob = async (id) => {
    try {
      await fetch(`http://10.0.2.2:3000/jobs/${id}`, {
        method: 'DELETE',
      });
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };



  const updateJob = (id) => {
    props.navigation.navigate('UdJob', { jobId: id });
  };

  const handleDeleteConfirmation = (id) => {
    setSelectedJobId(id);
    setShowModal(true);
  };

  const handleDeleteConfirmed = () => {
    deleteJob(selectedJobId);
    setShowModal(false);
    Toast.show({
      type:"error",
      text1:"Deleted Successfully"
    })
  };

  

  useEffect(() => {
    fetchJobs()
    if (searchQuery.length > 8) {
      setIsListening(false);
    }
  }, [jobs,searchQuery]);

  useEffect(() => {
    fetchJobs()
    if (searchQuery.length > 8) {
      setIsListening(false);
    }
  }, [jobs,searchQuery]);

  let filteredJobs = jobs.filter((job) =>
   job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.city.join(' ').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
  
    
    <View style={{ backgroundColor: '#8597be' }}>
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          placeholder={t("Search Jobs")}
          style={styles.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
         <TouchableOpacity style={styles.btnadd} onPress={isListening ? stopListening : startListening}>
          <IonIcons name={isListening ? 'mic-off' : 'mic'} color="black" size={30} />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.btnadd}>
          <IonIcons name="search" color="black" size={30} />
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.btnplus}
          onPress={() => props.navigation.navigate('Addjob')}
        >
          <IonIcons name="bag-add-outline" color="white" size={25} />
          <Text style={{ color: 'white', fontWeight: 'bold' }}>{t('Jobs')}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
          style={styles.btnnear}
          onPress={() => nearbyJobs()}
        >
          <IonIcons name="location-outline" color="white" size={25} />
          <Text style={{ color: 'white', fontWeight: 'bold',fontSize:18}}>{t('Search nearby jobs')}</Text>
      </TouchableOpacity>
      <FlatList
        style={{ marginBottom: 70, minHeight: 700 }}
        data={filteredJobs}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'end' }}>
              <View
                style={{
                  flex: 6,
                  backgroundColor: '#9dabbd',
                  marginBottom: 10,
                  borderRadius: 10,
                }}
              >
                <Text style={styles.title}> {item.title}</Text>
                <Text style={styles.city}>{item.city.join(' . ')}</Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'row', padding: 10 }}>
                <TouchableOpacity onPress={() => updateJob(item.id)}>
                  <MaterialCommunityIcons
                    name="square-edit-outline"
                    color={'#345192'}
                    size={33}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteConfirmation(item.id)}
                >
                  <MaterialCommunityIcons
                    name="delete-outline"
                    color={'red'}
                    size={33}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.title}>{t("Required Occupations")}: {item.occupations.join(' . ')}</Text>
            <Text style={styles.des}>{t("Job Description")}: {item.description}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      {/* Modal for delete confirmation */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this job?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeleteConfirmed}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Toast/>
    </View>
  );
}

const styles = StyleSheet.create({
  card:{
    marginBottom: 20 ,
    marginHorizontal:20,
    marginVertical:10,
    backgroundColor:'#D8E4E9',
    padding:20,
    borderRadius:30,
    borderColor: '#345192',
    borderWidth:2,
  },
  
  btnVoice: {
    marginTop: 20,
    marginHorizontal: 5,
    backgroundColor: '#D8E4E9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
  },

  id:{
    textAlign:'left',
    fontSize:16,
    color:'black',
    marginStart:20,
    fontWeight:'bold', 
    marginBottom:5
  },
  title:{ 
  textAlign:'left',
  fontSize:20,
  color:'black',
  paddingTop:10,
  marginStart:20,
  fontWeight:'bold',
  marginBottom:5},
  

  city:{
    textAlign:'left',
    fontSize:15,
    color:'black',
    marginStart:25,
    fontWeight:'bold',
    paddingBottom:10,
    marginBottom:5
  },

  occ:{
    textAlign:'left',
    fontSize:18,
    color:'black',
    paddingStart:20,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    paddingBottom:10,
    paddingTop:10,
    backgroundColor:'#b6c0cd',
    fontWeight:'bold',
    
  },

  des:{
    textAlign:'left',
    fontSize:15,
    color:'black',
    backgroundColor:'#ced5de',
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    paddingHorizontal:20,
    paddingVertical:10,
    fontWeight:'bold',
  },


  
  placeholder:{
    flex:3,
    fontSize:18,
    marginTop:20,
    backgroundColor:'#D8E4E9',
    paddingHorizontal:20,
    paddingVertical:15,
    marginStart:20,
    borderTopLeftRadius:10,
    borderBottomLeftRadius:10
  },
  btnadd:{
    flex:1,
    marginTop:20,
    alignItems:'center',
    marginEnd:5,
    
    backgroundColor:'#D8E4E9',
    justifyContent:'center',
    borderTopRightRadius:10,
    borderBottomRightRadius:10
  },
  btnnear:{
    padding:10,
    marginTop:10,
    backgroundColor:'#345192',
    borderColor:'#345192',
    alignItems:'center',
    marginHorizontal:19,
    flexDirection:'row',
    justifyContent:'center',
    borderRadius:10,
    borderWidth:3
  },

  btnplus:{
    flex:1,
    marginTop:20,
    backgroundColor:'#345192',
    borderColor:'#345192',
    alignItems:'center',
    marginEnd:18,
    justifyContent:'center',
    borderRadius:10,
    borderWidth:3
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    minWidth: 300,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});




  


