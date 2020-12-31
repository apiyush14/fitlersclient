import React, {useState,useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity,ImageBackground, Dimensions} from 'react-native';

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
 	<ImageBackground 
 	source={{uri:props.image}} 
 	style={styles.bgImage}>
    {props.isRegistered===true?(
     <Text style={styles.registeredIndicatorText}>Registered : {Math.floor(daysLeft)} days to go</Text>):
     (<Text></Text>)
    }
 	<Text style={styles.title}>{props.title}</Text>
 	</ImageBackground>
 	</View>
 	</TouchableOpacity>
 	</View>
 	);
};


const styles = StyleSheet.create({
	title: {
     fontSize: windowWidth/21,
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
     paddingVertical:1,
     paddingHorizontal: 10,
     textAlign: 'left',
     bottom: '70%',
     justifyContent: 'space-between'
    },
 eventItemContainer: {
 	height: windowHeight/4,
 	width: windowWidth/1.1,
 	backgroundColor: 'white',
 	borderRadius: 10,
 	marginHorizontal: 10,
 	marginBottom: 15,
 	opacity: 0.7,
 	shadowOffset: { width: 4, height: 4 },  
    shadowColor: 'black',  
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 10
 },
 imageContainer:{
    width: '100%',
    height: '100%',
    borderRadius: 10,
 },
 bgImage: {
 	width: '100%',
 	height: '100%',
    overflow: 'hidden',
    borderRadius: 10,
 	justifyContent: 'flex-end'
 }
});

export default EventItem;