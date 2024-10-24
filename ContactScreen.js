import React, { useState, useEffect } from 'react';
import { View, Text, Button, Linking, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Audio } from 'expo-av';
import { storage } from './firebase'; // Import your Firebase config file
import { ref, uploadBytes, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import Toast from 'react-native-toast-message';

// Dummy function for sentiment analysis
const getSentimentAnalysis = () => {
  const sentiments = ['Positive', 'Neutral', 'Negative'];
  return "";
};

const ContactScreen = ({ route }) => {
  const { name, phone } = route.params;
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [sound, setSound] = useState();

  const callContact = () => {
    let phoneNumber = `tel:${phone}`;
    Linking.openURL(phoneNumber);
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permission Denied',
          text2: 'Permission to access microphone was denied.',
        });
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      Toast.show({
        type: 'success',
        text1: 'Recording Started',
        text2: 'Your recording has started.',
      });
    } catch (err) {
      console.error('Failed to start recording:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to start recording.',
      });
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      const sentiment = getSentimentAnalysis();
      Toast.show({
        type: 'success',
        text1: 'Recording Stopped',
        text2: `File saved at: ${uri}`,
      });

      // Upload the recording to Firebase
      await uploadRecording(uri, phone, "Analyzing");
    } catch (err) {
      console.error('Failed to stop recording:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to stop recording.',
      });
    }
  };

  const uploadRecording = async (uri, contactPhone, sentiment) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const recordingId = Date.now().toString(36) + Math.random().toString(36).substring(2, 12);
      const storageRef = ref(storage, `recordings/${contactPhone}/${recordingId}.m4a`);

      // Upload the recording and store sentiment as metadata
      await uploadBytes(storageRef, blob, {
        customMetadata: { sentiment },
      });
      console.log('Recording uploaded successfully!');
      fetchRecordings(contactPhone); // Fetch recordings after upload
    } catch (error) {
      console.error('Error uploading recording:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error uploading recording.',
      });
    }
  };

  const fetchRecordings = async (contactPhone) => {
    try {
      const recordingsRef = ref(storage, `recordings/${contactPhone}/`);
      const list = await listAll(recordingsRef);
      const recordingData = await Promise.all(
        list.items.map(async (item) => {
          const url = await getDownloadURL(item);
          const metadata = await getMetadata(item);
          const sentiment = metadata.customMetadata ? metadata.customMetadata.sentiment : 'Unknown';

          return {
            uri: url,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            duration: `${Math.floor(Math.random() * 10) + 1} min`,
            tone: sentiment,
          };
        })
      );
      setRecordings(recordingData);
    } catch (error) {
      console.error('Error fetching recordings:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error fetching recordings.',
      });
    }
  };

  const playRecording = async (uri) => {
    if (sound) {
      await sound.stopAsync();
      setSound(null);
    }

    const { sound: newSound } = await Audio.Sound.createAsync({ uri });
    setSound(newSound);
    await newSound.playAsync();

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setSound(null);
      }
    });
  };

  useEffect(() => {
    fetchRecordings(phone);
  }, [phone]);

  return (
    <View style={styles.container}>
      <Text style={styles.contactName}>Name: {name}</Text>
      <Text style={styles.contactPhone}>Phone: {phone}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Call Contact" onPress={callContact} color="#007BFF" />
        <Button
          title={recording ? 'Stop Recording' : 'Start Recording'}
          onPress={recording ? stopRecording : startRecording}
          color={recording ? '#dc3545' : '#28a745'}
        />
      </View>

      <Text style={styles.previousRecordingsTitle}>Previous Recordings:</Text>
      <FlatList
        data={recordings}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <RecordingItem 
            uri={item.uri} 
            onPlay={playRecording} 
            date={item.date} 
            time={item.time} 
            duration={item.duration} 
            tone={item.tone} 
          />
        )}
      />

      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const RecordingItem = ({ uri, onPlay, date, time, duration, tone }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      await Audio.Sound.createAsync({ uri }).then(sound => sound.stopAsync());
    } else {
      setIsPlaying(true);
      await onPlay(uri);
    }
  };

  return (
    <View style={styles.recordingItem}>
      <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
        <Image
          source={isPlaying ? require('./assets/pause-icon.png') : require('./assets/play-icon.png')}
          style={styles.playIcon}
        />
      </TouchableOpacity>
      <View style={styles.recordingInfo}>
        <Text style={styles.recordingText}>Recording from {date} at {time}</Text>
        <Text style={styles.recordingDetail}>Duration: {duration}</Text>
        <Text style={styles.recordingDetail}>Sentiment Analysis: {tone}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  contactName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  contactPhone: {
    fontSize: 18,
    marginBottom: 20,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  previousRecordingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: '#e0e7ff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  playButton: {
    marginRight: 10,
  },
  playIcon: {
    width: 24,
    height: 24,
  },
  recordingInfo: {
    flex: 1,
  },
  recordingText: {
    fontSize: 16,
    color: '#0e141b',
  },
  recordingDetail: {
    fontSize: 14,
    color: '#4e7397',
  },
});

export default ContactScreen;
