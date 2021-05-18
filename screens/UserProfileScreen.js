  import React, {useState,useEffect} from 'react';
  import {View,Text,TextInput,Alert,StyleSheet,TouchableWithoutFeedback,Keyboard,ScrollView,KeyboardAvoidingView} from 'react-native';
  import { scale, moderateScale, verticalScale} from '../utils/Utils';
  import StatusCodes from "../utils/StatusCodes.json";
  import RoundButton from '../components/RoundButton';
  import TextInputItem from '../components/TextInputItem';
  import * as userActions from '../store/user-actions';
  import {useDispatch,useSelector} from 'react-redux';

  //User Profile Screen
  const UserProfileScreen = props => {

  const dispatch = useDispatch();

  // State Selectors
  const userDetails = useSelector(state => state.userDetails);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);

  //Use Effect Load Time Hook
  useEffect(() => {
    setFirstName(userDetails.userFirstName);
    setLastName(userDetails.userLastName);
    setHeight(parseInt(userDetails.userHeight));
    setWeight(parseInt(userDetails.userWeight));
  }, []);

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
          Alert.alert("Success", "Your profile has been updated successfully!!!", [{
            text: 'OK',
            onPress: () => {}
          }], {
            cancelable: false
          });
          props.navigation.navigate('Home');
        }
      });
    }
  };

    return (
     <KeyboardAvoidingView
      style={styles.userProfileScreenContainerStyle}
      behavior="padding" enabled keyboardVerticalOffset={20}>
     <ScrollView>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
     <React.Fragment>
      <View style={styles.userProfileSubContainerStyle}>
      <View style={styles.inputContainerStyle}>
      <Text style={styles.smallTextStyle}>First Name</Text>
      <TextInputItem style = {styles.nameInputStyle}
       textContentType = "name"
       keyboardType = "default"
       value = {firstName}
       textAlign = "center"
       maxLength = {20}
       onChangeText = {(text)=>{setFirstName(text)}}>
       </TextInputItem>
       </View>
       
       <View style={styles.inputContainerStyle}>
       <Text style={styles.smallTextStyle}>Last Name</Text>
       <TextInputItem style = {styles.nameInputStyle}
       textContentType = "name"
       keyboardType = "default"
       value = {lastName}
       textAlign = "center"
       maxLength = {20}
       onChangeText = {(text)=>{setLastName(text)}}>
       </TextInputItem>
       </View>

       <View style={styles.inputContainerStyle}>
       <Text style={styles.smallTextStyle}>Height (in cms)</Text>
       <TextInputItem style = {styles.nameInputStyle}
       textContentType = "none"
       keyboardType = "number-pad"
       value = {height.toString()}
       textAlign = "center"
       maxLength = {3}
       onChangeText = {(text)=>{setHeight(text)}}>
       </TextInputItem>
       </View>
       
       <View style={styles.inputContainerStyle}>
       <Text style={styles.smallTextStyle}>Weight (in kgs)</Text>
       <TextInputItem style = {styles.nameInputStyle}
       textContentType = "none"
       keyboardType = "number-pad"
       value = {weight.toString()}
       textAlign = "center"
       maxLength = {3}
       onChangeText = {(text)=>{setWeight(text)}}>
       </TextInputItem>
       </View>

      <RoundButton style = {styles.buttonSubmitStyle}
      title = "Submit"
      disabled = {false}
      onPress = {onClickSubmit}/> 
     
      </View>
      <View style={styles.closeButtonContainerStyle}>
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
      </React.Fragment>
     </TouchableWithoutFeedback>
     </ScrollView>
    </KeyboardAvoidingView>
    );
  };

  const styles = StyleSheet.create({
    userProfileScreenContainerStyle: {
      flex: 1,
      flexDirection: 'column'
    },
    userProfileSubContainerStyle: {
      flex: 1,
      marginTop: '20%'
    },
    inputContainerStyle: {
     alignSelf: 'center'
    },
    nameInputStyle: {
     height: verticalScale(50)
    },
    buttonSubmitStyle: {
      alignSelf: 'center',
      top: '2%'
    },
    closeButtonContainerStyle: {
      padding: '4%',
      width: '100%',
      alignSelf: 'center',
      alignItems: 'center'
    },
    closeButtonStyle: {
      width: '100%',
      height: verticalScale(60),
      borderRadius: 25,
      backgroundColor: 'black',
      opacity: 0.7
    },
    smallTextStyle: {
      padding: '3%',
      fontSize: moderateScale(12, 0.8),
      color: 'black',
      fontFamily: 'open-sans',
      alignSelf: 'center'
    }
  });

  export default UserProfileScreen;