import React, { useState, useEffect} from 'react';
import { View, Text,TextInput, StyleSheet,Dimensions,Modal} from 'react-native';
import RoundButton from '../components/RoundButton';
import * as authActions from '../store/auth-actions';
import {useDispatch,useSelector} from 'react-redux';
import {getUserAuthenticationToken} from '../utils/AuthenticationUtils';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SplashScreen = props=>{

const dispatch=useDispatch();

useEffect(()=>{
  const fetchData=async()=>{
    return await dispatch(getUserAuthenticationToken());
  };
  fetchData();
  console.log('============Return Data========================');
  console.log(fetchData);
  if(!fetchData){
   props.navigation.navigate('LoginStackNavigator');
}
else{
   props.navigation.navigate('Home');
}
}, []);

return (
  <View>
   <Text>Splash Screen</Text>
  </View>
 );
};

const styles = StyleSheet.create({

});

export default SplashScreen;