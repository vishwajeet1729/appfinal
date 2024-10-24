import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { PieChart, LineChart, BarChart } from 'react-native-chart-kit';
import RNPickerSelect from 'react-native-picker-select';

const Overall = () => {
  const [timePeriod, setTimePeriod] = useState('daily'); // default filter
  const [animation] = useState(new Animated.Value(0)); // Animation value

  // Sample data
  const sentimentData = {
    positive: 40,
    negative: 30,
    neutral: 30,
  };

  const lineGraphData = [20, 35, 30, 40, 35, 50, 60];
  const barGraphData = [10, 20, 30, 25, 15];

  const pieData = [
    {
      name: 'Positive',
      population: sentimentData.positive,
      color: '#28a745',
      legendFontColor: '#fff',
      legendFontSize: 15,
    },
    {
      name: 'Negative',
      population: sentimentData.negative,
      color: '#dc3545',
      legendFontColor: '#fff',
      legendFontSize: 15,
    },
    {
      name: 'Neutral',
      population: sentimentData.neutral,
      color: '#6c757d',
      legendFontColor: '#fff',
      legendFontSize: 15,
    },
  ];

  useEffect(() => {
    // Start the animation when the component mounts
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000, // Animation duration
      useNativeDriver: false,
    }).start();
  }, [animation]);

  // Interpolating values for animated opacity
  const animatedOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <ScrollView style={styles.container}>
      {/* Filter Dropdown */}
      <View style={styles.filterContainer}>
        <RNPickerSelect
          onValueChange={(value) => setTimePeriod(value)}
          items={[
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: 'Apply filter', value: null }}
        />
      </View>

      {/* Pie Chart */}
      <Text style={styles.chartTitle}>Sentiment Distribution</Text>
      <Animated.View style={{ opacity: animatedOpacity }}>
        <PieChart
          data={pieData}
          width={350}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute // Show absolute values
        />
      </Animated.View>

      {/* Line Chart */}
      <Text style={styles.chartTitle}>Sentiment Over Time</Text>
      <Animated.View style={{ opacity: animatedOpacity }}>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
              {
                data: lineGraphData,
              },
            ],
          }}
          width={350}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
      </Animated.View>

      {/* Bar Chart */}
      <Text style={styles.chartTitle}>Sentiment Counts</Text>
      <Animated.View style={{ opacity: animatedOpacity }}>
        <BarChart
          data={{
            labels: ['Positive', 'Negative', 'Neutral'],
            datasets: [
              {
                data: barGraphData,
              },
            ],
          }}
          width={350}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={styles.chart}
        />
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  filterContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

const pickerSelectStyles = {
    // inputIOS: {
    //   fontSize: 16,
    //   paddingVertical: 12,
    //   paddingHorizontal: 10,
    //   borderWidth: 1,
    //   borderColor: '#ccc',
    //   borderRadius: 8,
    //   color: '#ffffff', // text color for iOS
    //   backgroundColor: '#343a40', // dark background
    //   paddingRight: 30, // to ensure the text is never behind the icon
    // },
    inputAndroid: {
      fontSize: 16,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
    //   color: '#ffffff', // text color for Android
    //   backgroundColor: '#343a40', // dark background
    },
    placeholder: {
      color:'#000000'
    },
  };
  
export default Overall;
