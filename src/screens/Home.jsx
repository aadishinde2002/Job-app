import {
  ImageBackground,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';
const screenWidth = Dimensions.get('window').width;

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import {useTranslation} from 'react-i18next';

export default function Home() {
  const [circledata, setCircledata] = useState('');
  const [commitdata, setCommitdata] = useState('');
  const [linedata, setLinedata] = useState('');
  const {t} = useTranslation();

  const getdata = async () => {
    const url = 'http://10.0.2.2:3000/circledata';

    try {
      const response = await fetch(url);
      let fdata = await response.json();
      setCircledata(fdata);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getcommitdata = async () => {
    const url = 'http://10.0.2.2:3000/commitdata';

    try {
      const response = await fetch(url);
      let fdata = await response.json();
      setCommitdata(fdata);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getlinedata = async () => {
    const url = 'http://10.0.2.2:3000/linedata';

    try {
      const response = await fetch(url);
      let fdata = await response.json();
      setLinedata(fdata[0]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    getdata();
    getcommitdata();
    getlinedata();
  }, []);

  const chartConfig = {
    backgroundGradientFrom: '#345192',
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: '#345192',
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const renderPieChart = () => {
    if (circledata.length === 0) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    } else {
      return (
        <PieChart
          data={circledata}
          width={screenWidth - 30}
          height={220}
          chartConfig={chartConfig}
          accessor={'population'}
          backgroundColor={'#345192'}
          paddingLeft={'15'}
          style={{borderRadius: 30, marginTop: 10}}
        />
      );
    }
  };
  const renderChart = () => {
    if (commitdata.length === 0) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    } else {
      return (
        <ContributionGraph
          values={commitdata}
          endDate={new Date('2023-04-01')}
          numDays={105}
          width={screenWidth - 30}
          style={{marginTop: 10, borderRadius: 30, marginBottom: 30}}
          height={220}
          chartConfig={chartConfig}
        />
      );
    }
  };

  const renderlineChart = () => {
    if (linedata.length === 0) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    } else {
      return (
        <LineChart
          data={linedata}
          width={screenWidth - 30}
          height={220}
          chartConfig={chartConfig}
          style={{borderRadius: 30, marginTop: 10}}
          bezier
        />
      );
    }
  };

  return (
    <ScrollView>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#8597be',
          minHeight: 900,
        }}>
        <Text
          style={{
            color: '#345192',
            fontSize: 30,
            fontWeight: 800,
            marginTop: 15,
            textAlign: 'center',
          }}>
          {t('dashboard')}
        </Text>
        <Text
          style={{
            color: '#1f3158',
            fontWeight: 'bold',
            fontSize: 20,
            marginTop: 15,
          }}>
          {t('Monthly applications count')}
        </Text>
        {renderlineChart()}
        <Text
          style={{
            color: '#1f3158',
            fontWeight: 'bold',
            fontSize: 20,
            marginTop: 20,
            textAlign: 'center',
          }}>
          {t('Applications percentage from cities')}
        </Text>
        {renderPieChart()}
        <View>
          <View style={{borderRadius: 30}}>
            <Text
              style={{
                color: '#1f3158',
                fontWeight: 'bold',
                fontSize: 20,
                marginTop: 20,
                textAlign: 'center',
              }}>
              {t('Daily Application Counts')}
            </Text>
            {renderChart()}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
