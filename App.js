import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LiveRunTracker from './screens/LiveRunTracker';
import MusicIntegrationScreen from './screens/MusicIntegrationScreen';
import * as Font from 'expo-font';
import {AppLoading} from 'expo';
import RunTrackerNavigator from './navigation/RunTrackerNavigator';

const fetchFonts=()=>{
return Font.loadAsync({
  'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
  'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
});
};

export default function App() {
  return (
      <RunTrackerNavigator/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
