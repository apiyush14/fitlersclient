import React, {
  useState,
  useEffect
} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ImageBackground
} from 'react-native';
import {
  useDispatch
} from 'react-redux';
import {
  AsyncStorage
} from 'react-native';

export const UPDATE_USER_AUTH_DETAILS = 'UPDATE_USER_AUTH_DETAILS';
export const UPDATE_USER_DETAILS = 'UPDATE_USER_DETAILS';

//Splash Screen to load Application pre-requisites
const SplashScreen = props => {

    const [animating, setAnimating] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
      setTimeout(() => {
        setAnimating(false);
        AsyncStorage.getItem('USER_ID').then((userId) => {
          console.log('===========Splash Screen=================');
          console.log(userId);
          dispatch({
            type: UPDATE_USER_AUTH_DETAILS,
            authDetails: {
              userId: userId,
              secret: null
            }
          });
          userId === null ? props.navigation.navigate('LogInScreen') : validateUserName();
        }).catch(err => props.navigation.navigate('LogInScreen'))
      }, 5000);
    }, []);

const validateUserName=()=>{
 AsyncStorage.getItem('USER_NAME').then((userName) => {
  if(userName!==null){
    var userNameArr=userName.split(" ");
    dispatch({
            type: UPDATE_USER_DETAILS,
            userDetails: {
              userFirstName: userNameArr[0],
              userLastName: userNameArr[1]
            }
          });
  }
    userName === null ? props.navigation.navigate('UserDetailsScreen') : props.navigation.navigate('Home');
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