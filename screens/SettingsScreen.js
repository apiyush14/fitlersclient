import React, {useState, useEffect} from 'react';
import {View,StyleSheet,Text,TouchableOpacity} from 'react-native';
import { scale, moderateScale, verticalScale} from '../utils/Utils';
import RoundButton from '../components/RoundButton';
import {NativeModules,NativeEventEmitter} from 'react-native';

//Settings Screen
const SettingsScreen = props => {
  const [isGoogleFitConnected,setIsGoogleFitConnected] = useState(false);
  
  var GoogleFitJavaModule=NativeModules.GoogleFitJavaModule;

  useEffect(() => {
    GoogleFitJavaModule.hasPermissionsForGoogleFitAPI((response) => {
      console.log('===========Google Fit Permissions===============');
      console.log(response);
      setIsGoogleFitConnected(response);
    });
  }, []);
  
  const onClickConnect = () =>{
    GoogleFitJavaModule.signInToGoogleFit((response)=>{
      setIsGoogleFitConnected(response);
    });
  };

  const onClickDisconnect = () =>{
    GoogleFitJavaModule.signOutFromGoogleFit((response) => {
      setIsGoogleFitConnected(!response);
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
         style={{...styles.buttonStyle,...{backgroundColor: 'black'}}} 
         onPress={onClickConnect} disabled={false}>
          <Text style={styles.buttonTitleStyle}>Connect</Text>
         </TouchableOpacity>
         <TouchableOpacity style={{...styles.buttonStyle,...{backgroundColor: 'grey'}}} onPress={()=>{}} disabled={true}>
          <Text style={styles.buttonTitleStyle}>Disconnected</Text>
         </TouchableOpacity>
        </View>
         ):(
        <View style = {styles.buttonsViewContainerStyle}>
         <TouchableOpacity 
         style={{...styles.buttonStyle,...{backgroundColor: 'green'}}} 
         onPress={onClickConnect} disabled={true}>
          <Text style={styles.buttonTitleStyle}>Connected</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.buttonStyle} onPress={onClickDisconnect} disabled={false}>
          <Text style={styles.buttonTitleStyle}>Disconnect</Text>
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
     backgroundColor: 'lightgrey',
     height: verticalScale(150),
     width: '100%',
     alignItems: 'center',
     alignSelf: 'center',
     borderBottomColor: 'darkgrey',
     borderBottomWidth: 2
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
    flexDirection: 'row'
  },
  buttonStyle: {
    backgroundColor: 'black',
    width: verticalScale(100),
    height: verticalScale(40),
    borderRadius: 10,
    opacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.5,
    marginHorizontal: '2%'
  },
  buttonTitleStyle: {
    color: 'white',
    fontSize: moderateScale(15, 0.8),
    fontFamily: 'open-sans',
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