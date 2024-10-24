import React, { useEffect, useState } from 'react';
import { View, Text, PermissionsAndroid, Platform } from 'react-native';
import { Audio } from 'expo-av';
import CallKeep from 'react-native-callkeep'; // Import CallKeep
import * as FileSystem from 'expo-file-system';

const App = () => {
  const [recording, setRecording] = useState(null);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        const audioGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        const phoneStateGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        );
        const storageGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );

        if (
          audioGranted !== PermissionsAndroid.RESULTS.GRANTED ||
          phoneStateGranted !== PermissionsAndroid.RESULTS.GRANTED ||
          storageGranted !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions denied');
          return;
        }

        // Initialize CallKeep
        CallKeep.setup({
          ios: {
            appName: 'Auto Call Recording App',
            supportsVideo: false,
          },
          android: {
            alertTitle: 'Permissions required',
            alertDescription: 'This app needs to access your phone state to record calls',
            cancelButton: 'Cancel',
            okButton: 'Ok',
          },
        });

        // Listen for call events
        CallKeep.addEventListener('didReceiveStartCallAction', onStartCall);
        CallKeep.addEventListener('didDisconnectCall', onEndCall);
      }
    };

    requestPermissions();

    return () => {
      // Remove the event listeners on cleanup
      CallKeep.removeEventListener('didReceiveStartCallAction', onStartCall);
      CallKeep.removeEventListener('didDisconnectCall', onEndCall);
    };
  }, []);

  const onStartCall = async (data) => {
    console.log('Call started:', data);
    startRecording();
  };

  const onEndCall = async (data) => {
    console.log('Call ended:', data);
    stopRecording();
  };

  const startRecording = async () => {
    if (Platform.OS !== 'android') return; // Exit if not on Android
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status === 'granted') {
        const newRecording = new Audio.Recording();

        // Define the path to save the recording
        const folderName = 'vishwajeet';
        const directory = `${FileSystem.documentDirectory}${folderName}/`;

        // Create the directory if it doesn't exist
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

        // Create a file name for the recording
        const fileName = `${directory}${Date.now()}.m4a`;

        await newRecording.prepareToRecordAsync(
          {
            ...Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
            uri: fileName, // Use the defined file name for the recording
          }
        );
        await newRecording.startAsync();
        setRecording(newRecording);
        console.log('Recording started:', fileName);
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      console.log('Recording stopped');
      setRecording(null);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Auto Call Recording App</Text>
    </View>
  );
};

export default App;
