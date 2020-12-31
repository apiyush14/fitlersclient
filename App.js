import React from 'react';
import { StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import RunTrackerNavigator from './navigation/RunTrackerNavigator';
import runReducer from './store/run-reducer';
import eventReducer from './store/event-reducer';
import authReducer from './store/auth-reducer';
import userReducer from './store/user-reducer';
import {init} from './utils/DBUtils';
import ReduxThunk from 'redux-thunk';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';

const rootReducer= combineReducers({
 runs: runReducer,
 events: eventReducer,
 authDetails: authReducer,
 userDetails: userReducer
});

const store=createStore(rootReducer, applyMiddleware(ReduxThunk));

init().then(()=>{
  
})
.catch(err=>{
  
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
