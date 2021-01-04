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
           colors={['black', 'grey']}>
          </LinearGradient>
           <Text style={styles.text}>{props.text}</Text>
           <Text style={styles.footerText}>{props.footerText}</Text>
          <View style={styles.icon}>
            <Ionicons name={props.icon} size={50} color='springgreen'/>
          </View>
          
          </View>
 	);
};


const styles = StyleSheet.create({
    circleDashboardContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        alignItems: 'center'
    },
    circleDashboardBorder: {
        width: 145,
        height: 145,
        backgroundColor: 'black',
        borderRadius: 72,
        borderWidth: 5,
        borderColor: 'springgreen',
        alignItems: 'center',
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
        shadowColor: 'black',
        shadowOffset: {width:2,height:2},
        shadowOpacity:1,
        shadowRadius:2,
        fontSize: windowWidth/21,
        alignSelf: 'center'
    },
    footerText: {
        position: 'absolute',
        top: '70%',
        color: 'springgreen',
        shadowColor: 'black',
        shadowOffset: {width:2,height:2},
        shadowOpacity:1,
        shadowRadius:2,
        fontSize: windowWidth/27,
        alignSelf: 'center'
    }
});

export default DashboardItem;