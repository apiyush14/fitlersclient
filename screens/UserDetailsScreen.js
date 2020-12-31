  import React, {
    useState
  } from 'react';
  import {
    View,
    Text,
    TextInput,
    Alert,
    StyleSheet,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    ImageBackground
  } from 'react-native';
  import RoundButton from '../components/RoundButton';
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
     <View style={styles.userDetailsScreenContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.userDetailsSubContainer}>
      <TextInput style = {styles.nameInputStyle}
       textContentType = "name"
       keyboardType = "default"
       placeholder = " First Name"
       textAlign = "center"
       maxLength = {20}
       onChangeText = {(text)=>{setFirstName(text)}}>
       </TextInput>
       <TextInput style = {styles.nameInputStyle}
       textContentType = "name"
       keyboardType = "default"
       placeholder = " Last Name"
       textAlign = "center"
       maxLength = {20}
       onChangeText = {(text)=>{setLastName(text)}}>
       </TextInput>
      <RoundButton style = {styles.buttonSubmit}
      title = "Submit"
      disabled = {firstName.length === 0}
      onPress = {onClickSubmit}/> 
      </View>
       </TouchableWithoutFeedback>
     </View> 
    );
  };

  const styles = StyleSheet.create({
    userDetailsScreenContainer: {
      flex: 1,
      flexDirection: 'column'
    },
    userDetailsSubContainer: {
      flex: 1
    },
    nameInputStyle: {
      backgroundColor: 'white',
      height: '8%',
      width: '50%',
      alignSelf: 'center',
      borderWidth: 2,
      borderColor: 'lightblue',
      top: '40%'
    },
    buttonSubmit: {
      marginTop: '5%',
      alignSelf: 'center',
      top: '60%'
    }
  });

  export default UserDetailsScreen;