import { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet} from 'react-native';
import { DataTable } from 'react-native-paper';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const Subreport = (props) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
  const [items, setItems] = useState('');

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/items');
      const data = await response.json();
      setItems(data); 
    } catch (error) {
      console.error('Error fetching job data:', error);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchJobs();
  }, [itemsPerPage]);

  const table = () => {
    if (items.length === 0) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    } else {
      const from = page * itemsPerPage;
      const to = Math.min((page + 1) * itemsPerPage, items.length);
      return (
      <DataTable>
      <DataTable.Header style={{backgroundColor:'#345192',marginTop:20}}>
        <DataTable.Title ><Text style={styles.title}>{t('cities')}</Text></DataTable.Title>
        <DataTable.Title numeric><Text style={styles.title}>{t('users')}</Text></DataTable.Title>
        <DataTable.Title numeric><Text style={styles.title}>{t('subscribers')}</Text></DataTable.Title>
      </DataTable.Header>

      {items.slice(from, to).map((item) => (
        <DataTable.Row key={item.key}>
          <DataTable.Cell>{item.name}</DataTable.Cell>
          <DataTable.Cell numeric>{item.Applications}</DataTable.Cell>
          <DataTable.Cell numeric>{item.Selected}</DataTable.Cell>
        </DataTable.Row>
      ))}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(items.length / itemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} ${t('of')} ${items.length}`}
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        showFastPaginationControls
        selectPageDropdownLabel={t('rows')}
      />
    </DataTable>
      );
    }
  };

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

export default Subreport;
