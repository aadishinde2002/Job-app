import { useEffect, useState } from 'react';
import { ActivityIndicator, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const Jobreport = (props) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = useState(20);
  const [items, setItems] = useState('');

  const fetchdata = async() =>{
    try {
      const response = await fetch('http://10.0.2.2:3000/items')
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.warn('error while fetching data',error)
    }
  }

  useEffect(() => {
    setPage(0);
    fetchdata();
  }, [itemsPerPage]);

  const table= () =>{
    if(items.length  === 0){
      return <ActivityIndicator size="large" color="#0000ff" />;
    }else{
      return (
      <DataTable>
      <DataTable.Header style={{backgroundColor:'#345192',marginTop:20}}>
        <DataTable.Title ><Text style={styles.title}>{t('cities')}</Text></DataTable.Title>
        <DataTable.Title numeric><Text style={styles.title}>{t('applications')}</Text></DataTable.Title>
        <DataTable.Title numeric><Text style={styles.title}>{t('selected')}</Text></DataTable.Title>
      </DataTable.Header>

      {items.map((item) => (
        <DataTable.Row key={item.key}>
          <DataTable.Cell>{item.name}</DataTable.Cell>
          <DataTable.Cell numeric>{item.Applications}</DataTable.Cell>
          <DataTable.Cell numeric>{item.Selected}</DataTable.Cell>
        </DataTable.Row>
      ))}
      </DataTable>
      )
    }
  }

  return (
    <View style={{backgroundColor:'#9dabbd'}}>
    <View><TouchableOpacity style={{backgroundColor:'transparent' , flexDirection:'row',alignItems:'center',marginTop:15,marginStart:10}} onPress={()=> props.navigation.goBack()}><IonIcons name='caret-back-outline' color='black' size={25} />
        <Text style={{color:'black',fontWeight:'bold',fontSize:17}}>{t('back')}</Text></TouchableOpacity></View>
    {table()}
    </View>
  );
};

const styles = StyleSheet.create({
  title:{color:'white',fontSize:15,fontWeight:'bold'}
})

export default Jobreport;
