  import React, {useState} from 'react';
  import {View,StyleSheet,TouchableWithoutFeedback,Keyboard,TouchableOpacity,Alert} from 'react-native';
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

  const [userFeedbackComments, setUserFeedbackComments] = useState("");
  const [userFeedbackRating, setUserFeedbackRating] = useState(0);

  //Rating Change Listener
  const onRatingChange = (rating) => {
    setUserFeedbackRating(parseInt(rating));
  };

  //Submit User Feedback Event Handler
  const onClickSubmit = () => {
    dispatch(userActions.updateUserFeedback(userFeedbackRating, userFeedbackComments)).then(response => {
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
        Alert.alert("Success", "Your feedback submitted successfully!!!", [{
          text: 'OK',
          onPress: () => {}
        }], {
          cancelable: false
        });
        props.navigation.navigate('Home');
      }
    });
  };
    //View
    return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
     <View style={styles.userFeedbackScreenContainerStyle}>
      <View style={styles.userFeedbackSubContainerStyle}>
       
       <View style={styles.userFeedbackRatingContainerStyle}>
       <TouchableOpacity onPress={()=>onRatingChange(1)}>
        {userFeedbackRating>0?
        (<Ionicons name={Platform.OS === 'android'?"md-star":"ios-star"} size={35} color='goldenrod'/>):
        (<Ionicons name={Platform.OS === 'android'?"md-star-outline":"ios-star-outline"} size={35} color='black'/>)}
       </TouchableOpacity>
       <TouchableOpacity onPress={()=>onRatingChange(2)}>
        {userFeedbackRating>1?
        (<Ionicons name={Platform.OS === 'android'?"md-star":"ios-star"} size={35} color='goldenrod'/>):
        (<Ionicons name={Platform.OS === 'android'?"md-star-outline":"ios-star-outline"} size={35} color='black'/>)}
       </TouchableOpacity>
       <TouchableOpacity onPress={()=>onRatingChange(3)}> 
        {userFeedbackRating>2?
        (<Ionicons name={Platform.OS === 'android'?"md-star":"ios-star"} size={35} color='goldenrod'/>):
        (<Ionicons name={Platform.OS === 'android'?"md-star-outline":"ios-star-outline"} size={35} color='black'/>)}
       </TouchableOpacity>
       <TouchableOpacity onPress={()=>onRatingChange(4)}> 
        {userFeedbackRating>3?
        (<Ionicons name={Platform.OS === 'android'?"md-star":"ios-star"} size={35} color='goldenrod'/>):
        (<Ionicons name={Platform.OS === 'android'?"md-star-outline":"ios-star-outline"} size={35} color='black'/>)}
       </TouchableOpacity>
       <TouchableOpacity onPress={()=>onRatingChange(5)}>
        {userFeedbackRating>4?
        (<Ionicons name={Platform.OS === 'android'?"md-star":"ios-star"} size={35} color='goldenrod'/>):
        (<Ionicons name={Platform.OS === 'android'?"md-star-outline":"ios-star-outline"} size={35} color='black'/>)}
       </TouchableOpacity>
       </View>
      
       <TextInputItem style = {styles.commentsInputStyle}
        textContentType = "none"
        keyboardType = "default"
        placeholder = "Comments"
        textAlign = "center"
        maxLength = {200}
        multiline = {true}
        onChangeText = {(text)=>{setUserFeedbackComments(text)}}>
       </TextInputItem>

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
                    props.navigation.navigate('HomeScreen');
                  }
                }}/>
        </View>
     </View>
     </TouchableWithoutFeedback>
    );
  };

  const styles = StyleSheet.create({
    userFeedbackScreenContainerStyle: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center'
    },
    userFeedbackSubContainerStyle: {
      flex: 1
    },
    userFeedbackRatingContainerStyle: {
      flex: 1,
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center'
    },
    commentsInputStyle: {
      height: verticalScale(200),
      width: verticalScale(350)
    },
    buttonSubmitStyle: {
      marginTop: '5%',
      alignSelf: 'center'
    },
    closeButtonContainerStyle: {
      padding: '4%',
      width: '100%',
      alignSelf: 'center',
      alignItems: 'center'
    },
    closeButtonStyle: {
      width: '100%',
      height: verticalScale(70),
      borderRadius: 25,
      bottom: '2%',
      backgroundColor: 'black',
      opacity: 0.7
    },
  });

  export default FeedbackScreen;