import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity,ImageBackground, Dimensions} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

/*
Dashboard item
*/

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const DashboardItem=props=>{
return(
 	      <View style={{...props.style,...styles.circleDashboardBorder}}>
          <LinearGradient style={styles.circleDashboardContainer}
          colors={['#303030', 'grey']}>
           <Text style={styles.text}>{props.text}</Text>
           <Text style={styles.footerText}>{props.footerText}</Text>
          <View style={styles.icon}>
            <Ionicons name={props.icon} size={50} color='springgreen'/>
          </View>
          </LinearGradient>
          </View>
 	);
};


const styles = StyleSheet.create({
    circleDashboardContainer:{
        width: windowWidth/2.5,
        height: windowWidth/2.5,
        borderRadius: windowWidth/5,
        shadowColor: 'white',
        shadowOffset: {width:2,height:2},
        shadowOpacity:1,
        shadowRadius:6,
    },
    circleDashboardBorder: {
        width: (windowWidth+12)/2.5,
        height: (windowWidth+12)/2.5,
        borderRadius: (windowWidth+12)/5,
        borderWidth: 3,
        borderColor: 'springgreen',
        shadowColor: 'springgreen',
        shadowOffset: {width:3,height:4},
        shadowOpacity:1,
        shadowRadius:6,
        opacity: 0.6
    },
    icon: {
        position: 'absolute',
        alignSelf: 'center',
        shadowColor: 'black',
        shadowOffset: {width:2,height:2},
        shadowOpacity:1,
        shadowRadius:2,
    },
    text: {
        position: 'absolute',
        top: '40%',
        color: 'springgreen',
        alignSelf: 'center',
        shadowColor: 'black',
        shadowOffset: {width:2,height:2},
        shadowOpacity:1,
        shadowRadius:2,
        fontSize: 30,
    },
    footerText: {
        position: 'absolute',
        top: '70%',
        color: 'springgreen',
        alignSelf: 'center',
        shadowColor: 'black',
        shadowOffset: {width:2,height:2},
        shadowOpacity:1,
        shadowRadius:2,
        fontSize: 15,
    }
});

export default DashboardItem;