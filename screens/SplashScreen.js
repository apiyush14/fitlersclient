import React, {useState,useEffect} from 'react';
import {View,StyleSheet,ActivityIndicator,ImageBackground} from 'react-native';
import {useDispatch} from 'react-redux';
import {AsyncStorage} from 'react-native';
import * as authActions from '../store/auth-actions';
import * as userActions from '../store/user-actions';

//Splash Screen to load Application pre-requisites
const SplashScreen = props => {

  const [animating, setAnimating] = useState(true);
  const dispatch = useDispatch();

  //Load time hook to load auth details
  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      dispatch(authActions.loadUserAuthDetails()).then((userAuthDetails) => {
        userAuthDetails === null || userAuthDetails.userId === null ? props.navigation.navigate('LogInScreen') : loadUserDetailsAndNavigate();
      }).catch(err => props.navigation.navigate('LogInScreen'));
    }, 5000);
  }, []);

  //Load User Details from local or server and navigate either to User Details screen or Home Screen
  const loadUserDetailsAndNavigate = () => {
    dispatch(userActions.loadUserDetails()).then((userDetails) => {
      console.log('=============Splash Screen============');
      console.log(userDetails);
      console.log('============Going to User Details Screen');
      console.log(userDetails === null || userDetails.userFirstName === null);
      userDetails === null || userDetails.userFirstName === null ? props.navigation.navigate('UserDetailsScreen') : props.navigation.navigate('Home');
    }).catch(err => props.navigation.navigate('UserDetailsScreen'));
  };

return (
  <View style={styles.splashScreenContainer}>
  <ImageBackground 
  source={require('../assets/images/splash.jpg')} 
  style={styles.bgImage}>
   <ActivityIndicator
        animating={animating}
        color="lightblue"
        size="large"
        style={styles.activityIndicator}
      />
  </ImageBackground>
  </View>
 );
};

const styles = StyleSheet.create({
 splashScreenContainer: {
  flex: 1
 },
 bgImage: {
  flex: 1
 },
 activityIndicator: {
  top: '50%'
 }
});

export default SplashScreen;