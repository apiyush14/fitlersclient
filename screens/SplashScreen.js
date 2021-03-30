import React, {useState,useEffect} from 'react';
import {View,StyleSheet,ActivityIndicator,ImageBackground} from 'react-native';
import {useDispatch} from 'react-redux';
import * as authActions from '../store/auth-actions';
import * as userActions from '../store/user-actions';

//Splash Screen (first screen) to load Application pre-requisites
const SplashScreen = props => {

  const [animating, setAnimating] = useState(true);
  const dispatch = useDispatch();

  //Load time hook to load auth details
  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      dispatch(authActions.loadUserAuthDetails()).then((userAuthDetails) => {
        userAuthDetails.status !== 200 || userAuthDetails.data.userId === null || userAuthDetails.data.userSecretKey === null ? props.navigation.navigate('LogInScreen') : loadUserDetailsAndNavigate();
      });
    }, 5000);
  }, []);

  //Load User Details from local or server and navigate either to User Details screen or Home Screen
  const loadUserDetailsAndNavigate = () => {
    dispatch(userActions.loadUserDetails()).then((userDetails) => {
      userDetails.status !== 200 || userDetails.data.userFirstName === null ? props.navigation.navigate('UserDetailsScreen') : props.navigation.navigate('Home');
    });
  };

return (
  <View style={styles.splashScreenContainer}>
  <ImageBackground 
  source={require('../assets/images/splash.png')} 
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