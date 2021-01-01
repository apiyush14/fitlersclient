import React, {useState,useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity,ImageBackground, Dimensions, Image} from 'react-native';

/*
Event Item Card with shadow effects
*/

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const EventItem=props=>{

const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
      (async () => {
       let currentDate=new Date();
       let eventStartDate=new Date(props.eventStartDate);
       setDaysLeft((currentDate.getTime()-eventStartDate.getTime())/(1000*3600*24));
      })();
    }, []);


return(
 	<View style={styles.eventItemContainer}>
 	 <TouchableOpacity onPress={props.onClickEventItem}>
      <View style={styles.imageContainer}>
       <Image 
        source={{uri:props.image}} 
        style={styles.bgImage}>
       </Image>
       <View style={styles.textViewHeader}>
       {props.isRegistered===true?(
        <Text style={styles.registeredIndicatorText}>Registered : {Math.floor(daysLeft)} days to go</Text>):
       (<Text></Text>)
      }
      </View>
      <View style={styles.textViewFooter}>
       <Text style={styles.title}>{props.title}</Text>
      </View>
      </View>
     </TouchableOpacity>
 	</View>
 	);
};


const styles = StyleSheet.create({
    textViewHeader: {
      width: '100%',
      borderRadius: 20,
      overflow: 'hidden',
      position: 'absolute',
      alignSelf: 'center',
      top: 0
    },
    textViewFooter: {
      width: '100%',
      borderRadius: 20,
      overflow: 'hidden',
      position: 'absolute',
      alignSelf: 'center',
      bottom: 0
    },
	title: {
     fontSize: windowWidth/22,
     color: 'white',
     backgroundColor: 'rgba(0,0,0,0.5)',
     paddingVertical: 5,
     paddingHorizontal: 12,
     textAlign: 'center'
	},
    registeredIndicatorText: {
     fontSize: windowWidth/30,
     color: 'white',
     backgroundColor: 'rgba(0,0,0,0.5)',
     alignSelf: 'center'
    },
 eventItemContainer: {
 	height: windowHeight/4,
 	width: windowWidth/1.1,
 	backgroundColor: 'white',
 	borderRadius: 20,
 	marginHorizontal: 10,
 	marginBottom: 15,
 	opacity: 0.7,
 	shadowOffset: { width: 4, height: 4 },  
    shadowColor: 'black',  
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 7
 },
 imageContainer:{
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: 'white',
    shadowOffset: { width: 4, height: 4 },  
    shadowColor: 'black',
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 7
 },
 bgImage: {
 	flex: 1,
  overflow: 'hidden',
  borderRadius: 20,
 }
});

export default EventItem;