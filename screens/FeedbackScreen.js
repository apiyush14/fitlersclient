  import React, {useState} from 'react';
  import {View,Text,TextInput,Alert,StyleSheet,TouchableWithoutFeedback,Keyboard,Switch,TouchableOpacity} from 'react-native';
  import { scale, moderateScale, verticalScale} from '../utils/Utils';
  import StatusCodes from "../utils/StatusCodes.json";
  import RoundButton from '../components/RoundButton';
  import TextInputItem from '../components/TextInputItem';
  import * as userActions from '../store/user-actions';
  import {useDispatch} from 'react-redux';
  import {Ionicons} from '@expo/vector-icons';

  //Feedback Screen
  const FeedbackScreen = props => {

  const dispatch = useDispatch();

  const [lastName, setLastName] = useState("");
  const [userFeedbackRating, setUserFeedbackRating] = useState(0);

  const onRatingChange = (rating) =>{
   setUserFeedbackRating(parseInt(rating));
  };

  //Submit User Feedback Event Handler
  const onClickSubmit = () => {
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
  };

    return (
     <View style={styles.userDetailsScreenContainerStyle}>
      <View style={styles.userDetailsSubContainerStyle}>
       
       <View style={styles.userFeedbackRatingContainerStyle}>
       <TouchableOpacity onPress={()=>onRatingChange(1)}>
        {userFeedbackRating>0?
        (<Ionicons name={Platform.OS === 'android'?"md-star":"ios-star"} size={35} color='black'/>):
        (<Ionicons name={Platform.OS === 'android'?"md-star-outline":"ios-star-outline"} size={35} color='black'/>)}
       </TouchableOpacity>
       <TouchableOpacity onPress={()=>onRatingChange(2)}>
        {userFeedbackRating>1?
        (<Ionicons name={Platform.OS === 'android'?"md-star":"ios-star"} size={35} color='black'/>):
        (<Ionicons name={Platform.OS === 'android'?"md-star-outline":"ios-star-outline"} size={35} color='black'/>)}
       </TouchableOpacity>
       <TouchableOpacity onPress={()=>onRatingChange(3)}> 
        {userFeedbackRating>2?
        (<Ionicons name={Platform.OS === 'android'?"md-star":"ios-star"} size={35} color='black'/>):
        (<Ionicons name={Platform.OS === 'android'?"md-star-outline":"ios-star-outline"} size={35} color='black'/>)}
       </TouchableOpacity>
       <TouchableOpacity onPress={()=>onRatingChange(4)}> 
        {userFeedbackRating>3?
        (<Ionicons name={Platform.OS === 'android'?"md-star":"ios-star"} size={35} color='black'/>):
        (<Ionicons name={Platform.OS === 'android'?"md-star-outline":"ios-star-outline"} size={35} color='black'/>)}
       </TouchableOpacity>
       <TouchableOpacity onPress={()=>onRatingChange(5)}>
        {userFeedbackRating>4?
        (<Ionicons name={Platform.OS === 'android'?"md-star":"ios-star"} size={35} color='black'/>):
        (<Ionicons name={Platform.OS === 'android'?"md-star-outline":"ios-star-outline"} size={35} color='black'/>)}
       </TouchableOpacity>
       </View>

       <TextInput style = {styles.nameInputStyle}
       textContentType = "name"
       keyboardType = "default"
       placeholder = "Comments"
       textAlign = "center"
       maxLength = {200}
       multiline = {true}
       onChangeText = {()=>{}}>
     </TextInput>

       <TextInputItem style = {styles.nameInputStyle}
       textContentType = "name"
       keyboardType = "default"
       placeholder = "Last Name"
       textAlign = "center"
       maxLength = {200}
       onChangeText = {(text)=>{setLastName(text)}}>
       </TextInputItem>

      <RoundButton style = {styles.buttonSubmitStyle}
      title = "Submit"
      disabled = {false}
      onPress = {onClickSubmit}/> 
      </View>

      <View style={styles.buttonContainerStyle}>
     <RoundButton 
                 title="Close" 
                 style={styles.buttonStyle} 
                 onPress={()=>{
                  if(props.onClose){
                        props.onClose();
                  }
                  else{
                    props.navigation.navigate('HomeScreen');
                  }
                }}/>
        </View>

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
    userFeedbackRatingContainerStyle: {
      flex: 1,
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center'
    },
    nameInputStyle: {
      marginTop: '6%',
      top: '10%'
    },
    buttonSubmitStyle: {
      alignSelf: 'center',
      top: '20%'
    },

    buttonContainerStyle: {
                padding: '4%',
                width: '100%',
                alignSelf: 'center',
                alignItems: 'center'
    },
        buttonStyle: {
                width: '100%',
                height: verticalScale(70),
                borderRadius: 25,
                bottom: '2%',
                backgroundColor: 'grey',
                opacity: 0.4
        },
  });

  export default FeedbackScreen;