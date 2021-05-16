  import React, {useState} from 'react';
  import {View,StyleSheet,TouchableWithoutFeedback,Keyboard,TouchableOpacity,Alert,ScrollView,KeyboardAvoidingView} from 'react-native';
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
   <KeyboardAvoidingView
      style={styles.userFeedbackScreenContainerStyle}
      behavior="padding" enabled keyboardVerticalOffset={20}>
    <ScrollView>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.userFeedbackSubContainerStyle}>
       
       <View style={styles.userFeedbackRatingContainerStyle}>
       <TouchableOpacity onPress={()=>onRatingChange(1)}>
        {userFeedbackRating>0?
        (<Ionicons name={Platform.OS === 'android'?"md-star":"ios-star"} size={verticalScale(30)} color='goldenrod'/>):
        (<Ionicons name={Platform.OS === 'android'?"md-star-outline":"ios-star-outline"} size={verticalScale(30)} color='black'/>)}
       </TouchableOpacity>
       <TouchableOpacity onPress={()=>onRatingChange(2)}>
        {userFeedbackRating>1?
        (<Ionicons name={Platform.OS === 'android'?"md-star":"ios-star"} size={verticalScale(30)} color='goldenrod'/>):
        (<Ionicons name={Platform.OS === 'android'?"md-star-outline":"ios-star-outline"} size={verticalScale(30)} color='black'/>)}
       </TouchableOpacity>
       <TouchableOpacity onPress={()=>onRatingChange(3)}> 
        {userFeedbackRating>2?
        (<Ionicons name={Platform.OS === 'android'?"md-star":"ios-star"} size={verticalScale(30)} color='goldenrod'/>):
        (<Ionicons name={Platform.OS === 'android'?"md-star-outline":"ios-star-outline"} size={verticalScale(30)} color='black'/>)}
       </TouchableOpacity>
       <TouchableOpacity onPress={()=>onRatingChange(4)}> 
        {userFeedbackRating>3?
        (<Ionicons name={Platform.OS === 'android'?"md-star":"ios-star"} size={verticalScale(30)} color='goldenrod'/>):
        (<Ionicons name={Platform.OS === 'android'?"md-star-outline":"ios-star-outline"} size={verticalScale(30)} color='black'/>)}
       </TouchableOpacity>
       <TouchableOpacity onPress={()=>onRatingChange(5)}>
        {userFeedbackRating>4?
        (<Ionicons name={Platform.OS === 'android'?"md-star":"ios-star"} size={verticalScale(30)} color='goldenrod'/>):
        (<Ionicons name={Platform.OS === 'android'?"md-star-outline":"ios-star-outline"} size={verticalScale(30)} color='black'/>)}
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
     </TouchableWithoutFeedback>
    </ScrollView>
     </KeyboardAvoidingView>
    );
  };

  const styles = StyleSheet.create({
    userFeedbackScreenContainerStyle: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      top: '20%'
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
      width: verticalScale(350),
      marginTop: '10%'
    },
    buttonSubmitStyle: {
      marginTop: '5%',
      alignSelf: 'center'
    },
    closeButtonStyle: {
      width: '90%',
      height: verticalScale(60),
      alignSelf: 'center',
      borderRadius: 25,
      marginTop: '5%',
      backgroundColor: 'black',
      opacity: 0.7,
      bottom: '1%'
    }
  });

  export default FeedbackScreen;