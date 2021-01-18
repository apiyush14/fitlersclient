  import React, {useState} from 'react';
  import {View,Text,TextInput,Alert,StyleSheet,Dimensions,Modal,TouchableWithoutFeedback,Keyboard,ImageBackground} from 'react-native';
  import { scale, moderateScale, verticalScale} from '../utils/Utils';
  import RoundButton from '../components/RoundButton';
  import TextInputItem from '../components/TextInputItem';
  import * as userActions from '../store/user-actions';
  import {
    useDispatch
  } from 'react-redux';

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  //User Details Screen
  const UserDetailsScreen = props => {

    const dispatch = useDispatch();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const onClickSubmit = () => {
      dispatch(userActions.updateUserDetails(firstName,lastName)).then(response => {
       props.navigation.navigate('Home');  
      });
    };
   
    return (
     <View style={styles.userDetailsScreenContainerStyle}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.userDetailsSubContainerStyle}>
      <TextInputItem style = {styles.nameInputStyle}
       textContentType = "name"
       keyboardType = "default"
       placeholder = " First Name"
       textAlign = "center"
       maxLength = {20}
       onChangeText = {(text)=>{setFirstName(text)}}>
       </TextInputItem>
       <TextInputItem style = {styles.nameInputStyle}
       textContentType = "name"
       keyboardType = "default"
       placeholder = " Last Name"
       textAlign = "center"
       maxLength = {20}
       onChangeText = {(text)=>{setLastName(text)}}>
       </TextInputItem>
      <RoundButton style = {styles.buttonSubmitStyle}
      title = "Submit"
      disabled = {firstName.length === 0}
      onPress = {onClickSubmit}/> 
      </View>
       </TouchableWithoutFeedback>
     </View> 
    );
  };

  const styles = StyleSheet.create({
    userDetailsScreenContainerStyle: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center'
    },
    userDetailsSubContainerStyle: {
      flex: 1
    },
    nameInputStyle: {
      marginTop: '6%',
      top: '30%'
    },
    buttonSubmitStyle: {
      alignSelf: 'center',
      top: '40%'
    }
  });

  export default UserDetailsScreen;