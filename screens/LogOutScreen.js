import React from 'react';
import {View,StyleSheet,ImageBackground,ActivityIndicator} from 'react-native';

//Dummy LogOutScreen
const LogOutScreen = props => {

	return ( 
      <View style = {styles.logOutScreenContainerStyle}>
        <ImageBackground source = {require('../assets/images/splash.png')}
        style = {styles.bgImageStyle}>
         <ActivityIndicator
          animating={true}
          color="lightblue"
          size="large"
          style={styles.activityIndicator}
         />
        </ImageBackground>
       </View>
	);
};

const styles = StyleSheet.create({
	logOutScreenContainerStyle: {
      flex: 1,
      flexDirection: 'column'
    },
    bgImageStyle: {
      flex: 1
    },
    activityIndicator: {
      top: '50%'
    }
});

export default LogOutScreen;