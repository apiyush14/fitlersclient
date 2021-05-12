  import React, {useState} from 'react';
  import {View,Text,TextInput,Alert,StyleSheet,TouchableWithoutFeedback,Keyboard,Switch,ScrollView,KeyboardAvoidingView,Platform} from 'react-native';
  import { scale, moderateScale, verticalScale} from '../utils/Utils';
  import StatusCodes from "../utils/StatusCodes.json";
  import RoundButton from '../components/RoundButton';
  import TextInputItem from '../components/TextInputItem';
  import * as userActions from '../store/user-actions';
  import {useDispatch} from 'react-redux';

  //User Details Screen
  const UserDetailsScreen = props => {

  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  //Submit User Details Event Handler
  const onClickSubmit = () => {
    var heightVar = parseInt(height);
    var weightVar = parseInt(weight);
    //Set default height and weight
    if (height.length === 0 || parseInt(height) === 0) {
      heightVar = 182;
      setHeight(182);
    }
    if (weight.length === 0 || parseInt(weight) === 0) {
      weightVar = 72;
      setWeight(72);
    }
    if (firstName.length === 0) {
      Alert.alert("Mandatory Input", "First Name is Mandatory!!!", [{
        text: 'OK',
        onPress: () => {

        }
      }], {
        cancelable: false
      });
    } else if (heightVar < 90 || heightVar > 242) {
      Alert.alert("Out Of Range", "Height value can be between 90 and 242 cms!!!", [{
        text: 'OK',
        onPress: () => {

        }
      }], {
        cancelable: false
      });
    } else if (weightVar < 10 || weightVar > 230) {
      Alert.alert("Out Of Range", "Weight value can be between 10 and 230 kgs!!!", [{
        text: 'OK',
        onPress: () => {

        }
      }], {
        cancelable: false
      });
    } else {
      dispatch(userActions.updateUserDetails(firstName, lastName, heightVar, weightVar)).then(response => {
        if (response.status === StatusCodes.NO_INTERNET) {
          Alert.alert("Internet Issue", "Active Internet Connection Required!!!", [{
            text: 'OK',
            onPress: () => {}
          }], {
            cancelable: false
          });
        } else if (response.status !== StatusCodes.OK) {
          Alert.alert("Try Again", "Please try again later!!!", [{
            text: 'OK',
            onPress: () => {}
          }], {
            cancelable: false
          });
        } else {
          props.navigation.navigate('Home');
        }
      });
    }
  };

    return (
    <KeyboardAvoidingView
      style={styles.userDetailsScreenContainerStyle}
      behavior="padding" enabled keyboardVerticalOffset={20}>
     <ScrollView>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.userDetailsSubContainerStyle}>
      <TextInputItem style = {styles.nameInputStyle}
       textContentType = "name"
       keyboardType = "default"
       placeholder = "First Name"
       textAlign = "center"
       maxLength = {20}
       onChangeText = {(text)=>{setFirstName(text)}}>
       </TextInputItem>
       
       <TextInputItem style = {styles.nameInputStyle}
       textContentType = "name"
       keyboardType = "default"
       placeholder = "Last Name"
       textAlign = "center"
       maxLength = {20}
       onChangeText = {(text)=>{setLastName(text)}}>
       </TextInputItem>

       <TextInputItem style = {styles.nameInputStyle}
       textContentType = "none"
       keyboardType = "number-pad"
       placeholder = "Height (in cms)"
       textAlign = "center"
       maxLength = {3}
       onChangeText = {(text)=>{setHeight(text)}}>
       </TextInputItem>
       
       <TextInputItem style = {styles.nameInputStyle}
       textContentType = "none"
       keyboardType = "number-pad"
       placeholder = "Weight (in kgs)"
       textAlign = "center"
       maxLength = {3}
       onChangeText = {(text)=>{setWeight(text)}}>
       </TextInputItem>

      <RoundButton style = {styles.buttonSubmitStyle}
      title = "Submit"
      disabled = {false}
      onPress = {onClickSubmit}/> 
      </View>
     </TouchableWithoutFeedback>
     </ScrollView>
     </KeyboardAvoidingView>
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
      top: '10%'
    },
    buttonSubmitStyle: {
      marginTop: '30%',
      alignSelf: 'center'
    }
  });

  export default UserDetailsScreen;