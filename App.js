import { StatusBar } from 'expo-status-bar';
import React,{ useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LiveRunTracker from './screens/LiveRunTracker';
import MusicIntegrationScreen from './screens/MusicIntegrationScreen';
import * as Font from 'expo-font';
import {AppLoading} from 'expo';
import RunTrackerNavigator from './navigation/RunTrackerNavigator';
import runReducer from './store/run-reducer';
import eventReducer from './store/event-reducer';
import {init} from './utils/DBUtils';
import ReduxThunk from 'redux-thunk';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import * as authActions from './store/auth-actions'
import {useDispatch,useSelector} from 'react-redux';

const rootReducer= combineReducers({
runs: runReducer,
events: eventReducer
});

const store=createStore(rootReducer, applyMiddleware(ReduxThunk));

init().then(()=>{
  console.log('Initialized DB Success!!!');
})
.catch(err=>{
  console.log('Initialized DB Failed!!!');
  console.log(err);
});


const fetchFonts=()=>{
return Font.loadAsync({
  'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
  'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
});
};

export default function App() {
  return (
      <Provider store={store}><RunTrackerNavigator/></Provider>
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
