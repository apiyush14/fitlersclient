import React, {useState,useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity,Image} from 'react-native';
import { scale, moderateScale, verticalScale} from '../utils/Utils';

/*
Challenge Card with shadow effects
*/

const ChallengeItem=props=>{

//State Variables
const [daysLeft, setDaysLeft] = useState(0);

  //Load Time Useeffect hook
  useEffect(() => {
    (async () => {
      let currentDate = new Date();
      let eventStartDate = new Date(props.eventStartDate);
      setDaysLeft((currentDate.getTime() - eventStartDate.getTime()) / (1000 * 3600 * 24));
    })();
  }, []);

//View
return(
 	<View style={styles.challengeItemContainerStyle}>
 	 <TouchableOpacity onPress={props.onClickEventItem}>
 	  <View style={styles.imageContainerStyle}>
 	   <Image 
      source={{uri:props.image}} 
      style={styles.imageStyle}>
    </Image>
    <View style={styles.textViewHeaderStyle}>
     {props.isRegistered===true?(
      <Text style={styles.textStyle}>Registered : {Math.floor(daysLeft)} days to go</Text>):
     (<Text></Text>)
     }
    </View>
    <View style={styles.textViewFooterStyle}>
     <Text style={styles.textStyle}>{props.title}</Text>
    </View>
 	</View>
 	</TouchableOpacity>
 	</View>
 	);
};

const styles = StyleSheet.create({
  challengeItemContainerStyle: {
    height: verticalScale(110),
    width: scale(200),
    backgroundColor: 'white',
    borderRadius: 20,
    marginVertical: verticalScale(8),
    opacity: 0.7,
    shadowOffset: {
      width: 4,
      height: 4
    },
    shadowOffset: {
      width: 4,
      height: 4
    },
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 6
  },
  imageContainerStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: 'white',
    elevation: 6
  },
  imageStyle: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 20
  },
  textViewHeaderStyle: {
    position: 'absolute',
    width: '100%',
    overflow: 'hidden',
    borderRadius: 20,
    alignSelf: 'center',
    top: 0
  },
  textViewFooterStyle: {
    position: 'absolute',
    width: '100%',
    overflow: 'hidden',
    borderRadius: 20,
    alignSelf: 'center',
    bottom: 0
  },
  textStyle: {
    fontSize: moderateScale(15, 0.8),
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: verticalScale(5),
    textAlign: 'center'
  }
});

export default ChallengeItem;