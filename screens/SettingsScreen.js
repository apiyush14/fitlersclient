import React, {useState, useEffect} from 'react';
import {View,StyleSheet,Text,TouchableOpacity,Alert,Image} from 'react-native';
import { scale, moderateScale, verticalScale} from '../utils/Utils';
import RoundButton from '../components/RoundButton';
import {NativeModules,NativeEventEmitter} from 'react-native';
import {useIsFocused} from "@react-navigation/native";
import StatusCodes from "../utils/StatusCodes.json";
import * as runActions from '../store/run-actions';
import {useDispatch} from 'react-redux';

//Settings Screen
const SettingsScreen = props => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [isGoogleFitConnected,setIsGoogleFitConnected] = useState(false);
  
  var GoogleFitJavaModule=NativeModules.GoogleFitJavaModule;

  //Load time useEffect, gets called everytime screen is opened
  useEffect(() => {
    if (isFocused) {
      GoogleFitJavaModule.hasPermissionsForGoogleFitAPI((response) => {
        setIsGoogleFitConnected(response);
      });
    }
  }, [props, isFocused]);
  
  //Trigger Action to Connect Google Fit
  const onClickConnect = () => {
    dispatch(runActions.isConnectedToNetwork()).then((response) => {
      if (response.status === StatusCodes.NO_INTERNET) {
        Alert.alert("Internet Issue", "Active Internet Connection Required!!!", [{
          text: 'OK',
          onPress: () => {}
        }], {
          cancelable: false
        });
      } else {
        GoogleFitJavaModule.signInToGoogleFit((response) => {
          setIsGoogleFitConnected(response);
        });
      }
    });
  };

  //Trigger Action to Disconnect
  const onClickDisconnect = () => {
    dispatch(runActions.isConnectedToNetwork()).then((response) => {
      if (response.status === StatusCodes.NO_INTERNET) {
        Alert.alert("Internet Issue", "Active Internet Connection Required!!!", [{
          text: 'OK',
          onPress: () => {}
        }], {
          cancelable: false
        });
      } else {
        GoogleFitJavaModule.signOutFromGoogleFit((response) => {
          setIsGoogleFitConnected(!response);
        });
      }
    });
  };

	return ( 
      <View style = {styles.settingsScreenContainerStyle}>
       <View style = {styles.settingsCardStyle}>
        <View style = {styles.labelViewStyle}>
         <Text style = {styles.labelTextStyle}>Google Fit</Text>
        </View>

      {!isGoogleFitConnected?(
        <View style = {styles.buttonsViewContainerStyle}>
         <TouchableOpacity 
         style={styles.buttonStyle} 
         onPress={onClickConnect} disabled={false}>
         <View style={styles.imageViewContainerStyle}>
          <Image 
           source={require('../assets/images/btn_google_signin_new.png')} 
           style={styles.bgButtonImageStyle}>
           </Image>
          </View>
         </TouchableOpacity>
        </View>
         ):(
        <View style = {{...styles.buttonsViewContainerStyle, ...{backgroundColor: 'royalblue'}}}>
         <TouchableOpacity 
         style={styles.buttonStyle} 
         onPress={onClickDisconnect} disabled={false}>
          <Text style={styles.buttonTitleStyle}>Sign Out</Text>
         </TouchableOpacity>
        </View>
         )}
       </View>

      <RoundButton 
                 title="Close" 
                 style={styles.closeButtonStyle} 
                 onPress={()=>{
                  if(props.onClose){
                        props.onClose();
                  }
                  else{
                    props.navigation.navigate('Home');
                  }
                }}/>

      </View>
	);
};

const styles = StyleSheet.create({
	settingsScreenContainerStyle: {
      flex: 1,
    },
  settingsCardStyle: {
     marginTop: '10%',
     marginBottom: '1%',
     backgroundColor: 'white',
     height: verticalScale(150),
     width: '100%',
     alignItems: 'center',
     alignSelf: 'center',
     borderColor: 'darkgrey',
     borderWidth: 2
  },
  labelViewStyle: {
  },
  labelTextStyle: {
    fontSize: moderateScale(20, 0.8),
    color: 'grey',
    paddingHorizontal: '7%',
    fontFamily: 'open-sans'
  },
  buttonsViewContainerStyle: {
    bottom: 2,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '60%'
  },
  buttonStyle: {
    width: '100%',
    height: verticalScale(50),
    opacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  buttonTitleStyle: {
    color: 'white',
    fontSize: moderateScale(13, 0.8),
    fontFamily: 'open-sans',
  },
  imageViewContainerStyle: {
    height: '100%',
    width: '100%',
  },
  bgButtonImageStyle: {
    width: '100%',
    height: '100%',
    overflow:'hidden',
    resizeMode: 'contain'
  },

  closeButtonStyle: {
      width: '90%',
      height: verticalScale(60),
      alignSelf: 'center',
      borderRadius: 25,
      backgroundColor: 'black',
      opacity: 0.7,
      bottom: '2%',
      position: 'absolute'
    }

});

export default SettingsScreen;