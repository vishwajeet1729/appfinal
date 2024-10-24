import React, { useEffect, useState } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import storage from '@react-native-firebase/storage';
import RNCallKeep from 'react-native-callkeep'; // Handles call states for Android/iOS

const CallRecorder = () => {
  const [recording, setRecording] = useState(false);
  const audioRecorderPlayer = new AudioRecorderPlayer();

  useEffect(() => {
    requestPermissions();
  }, []);

  // Request Permissions for Android (iOS needs its own permissions handling)
  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Start recording automatically on an incoming or outgoing call
  const startRecording = async () => {
    const path = `sdcard/CallRecording_${Date.now()}.mp3`; // Android path
    await audioRecorderPlayer.startRecorder(path);
    setRecording(true);
    audioRecorderPlayer.addRecordBackListener((e) => {
      console.log('Recording', e.current_position);
    });
  };

  // Stop recording and upload to Firebase
  const stopRecording = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    setRecording(false);
    console.log(result);
    audioRecorderPlayer.removeRecordBackListener();

    // Upload the file to Firebase
    const filename = result.split('/').pop(); // Get file name from path
    const reference = storage().ref(filename);
    await reference.putFile(result); // Upload to Firebase
    console.log('Uploaded to Firebase Storage:', filename);
  };

  // Call handling (use react-native-callkeep for actual call events)
  const handleCall = async () => {
    // Call detection logic can go here
    RNCallKeep.addEventListener('didReceiveStartCallAction', () => {
      console.log('Call detected');
      startRecording();
    });

    RNCallKeep.addEventListener('didEndCall', () => {
      console.log('Call ended');
      stopRecording();
    });
  };

  return (
    <View>
      <Text>Call Recorder</Text>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
    </View>
  );
};

export default CallRecorder;
