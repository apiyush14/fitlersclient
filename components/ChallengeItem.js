import React from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity,ImageBackground} from 'react-native';

const ChallengeItem=props=>{
return(
 	<View style={styles.challengeItem}>
 	<TouchableOpacity onPress={()=>{}}>
 	<View>
 	<ImageBackground 
 	source={{uri:props.image}} 
 	style={styles.bgImage}>
 	<Text style={styles.title}>{props.title}</Text>
 	</ImageBackground>
 	</View>
 	</TouchableOpacity>
 	</View>
 	);
};


const styles = StyleSheet.create({
	title: {
     fontSize: 22,
     color: 'white',
     backgroundColor: 'rgba(0,0,0,0.5)',
     paddingVertical: 5,
     paddingHorizontal: 12,
     textAlign: 'center'
	},
 challengeRow: {
 	flexDirection: 'row',
 },
 challengeItem: {
 	height: 100,
 	width: 200,
 	backgroundColor: 'white',
 	borderRadius: 10,
 	marginHorizontal: 10,
 	marginBottom: 15,
 	opacity: 0.7,
 	shadowOffset: { width: 4, height: 4 },  
    shadowColor: 'black',  
    shadowOpacity: 0.7,
    shadowRadius: 2
 },
 challengeHeader: {
 	height: '70%'
 },
 challengeDetail: {
 	paddingHorizontal: 10,
 	justifyContent: 'space-between',
 	alignItems: 'center',
 	marginVertical: 2
 },
 bgImage: {
 	width: '100%',
 	height: '100%',
    overflow: 'hidden',
    borderRadius: 10,
 	justifyContent: 'flex-end'
 }
});

export default ChallengeItem;