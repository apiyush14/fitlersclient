import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Dimensions} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import * as Location from 'expo-location';
import { useDispatch } from 'react-redux';
import * as runActions from '../store/run-actions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
let mapRef=null;

/*const TESTPOINTS = [
  {latitude: 31.624708978431634, longitude: 74.87492581820307},
  {latitude:31.624808978431635, longitude:74.87502581820307},
  {latitude:31.624908978431636, longitude:74.87512581820307},
  {latitude:31.625008978431637, longitude:74.87522581820307},
  {latitude:31.625208978431640, longitude:74.87532581820307},
  {latitude:31.625308978431645, longitude:74.87542581820307},
  {latitude:31.625408978431647, longitude:74.87552581820307},
  {latitude:31.625608978431648, longitude:74.87562581820307},
  {latitude:31.625708978431649, longitude:74.87572581820307},
  {latitude:31.625808978431656, longitude:74.87582581820307},
  {latitude:31.625908978431664, longitude:74.87592581820307},
  {latitude:31.626008978431667, longitude:74.87602581820307},
  {latitude:31.626109998432674, longitude:74.87612581820307},

  {latitude:31.626008978431667, longitude:74.87602581820307},
  {latitude:31.625908978431664, longitude:74.87612581820307},
  {latitude:31.625808978431664, longitude:74.87622581820307},
  {latitude:31.625708978431664, longitude:74.87632581820307},
  {latitude:31.625608978431664, longitude:74.87632581820307},
  {latitude:31.625508978431664, longitude:74.87652581820307},
  {latitude:31.625408978431664, longitude:74.87662581820307},
  {latitude:31.625308978431664, longitude:74.87672581820307},
  {latitude:31.625208978431664, longitude:74.87682581820307},
  {latitude:31.625108978431664, longitude:74.87692581820307},
  {latitude:31.625008978431664, longitude:74.87702581820307}
];
*/

const RunDetailsScreen = props=>{

const dispatch = useDispatch();
const [mapState,setMapState]=useState(null);
const [path, setPath]=useState([]);
const [mapRegion, setMapRegion]=useState(null);
const [date, setDate]=useState(null);
const [day, setDay]=useState(null);
const [totalDistance,setTotalDistance]=useState(0);
const [lapsedTime, setLapsedTime]=useState(0);

useEffect(() => {
       if(props.navigation.state.params.path)
       {
        const pathArray=props.navigation.state.params.path;
        setPath(props.navigation.state.params.path);
        setMapRegion({
        latitude: pathArray[Math.floor(pathArray.length/2)].latitude,
        longitude: pathArray[Math.floor(pathArray.length/2)].longitude,
        latitudeDelta: Math.abs(pathArray[pathArray.length-1].latitude-pathArray[0].latitude)+0.001,
        longitudeDelta: Math.abs(pathArray[pathArray.length-1].longitude-pathArray[0].longitude)+0.001
         });
       }

       if(props.navigation.state.params.date)
       {
        setDate(props.navigation.state.params.date);
       }

       if(props.navigation.state.params.lapsedTime)
       {
        setLapsedTime(props.navigation.state.params.lapsedTime);
       }

       if(props.navigation.state.params.totalDistance)
       {
        setTotalDistance(props.navigation.state.params.totalDistance);
       }

       if(props.navigation.state.params.day)
       {
        setDay(props.navigation.state.params.day);
       }
    }, []);

useEffect(() => {
       if(path.length>0){
       takeSnapshot();
     }
    }, [path]);

const takeSnapshot=()=>{
const snapshot = mapRef.takeSnapshot({
   // width: 300,      // optional, when omitted the view-width is used
   // height: 300,     // optional, when omitted the view-height is used
    format: 'png',   // image formats: 'png', 'jpg' (default: 'png')
    quality: 0.8,    // image quality: 0..1 (only relevant for jpg, default: 1)
    result: 'file'   // result types: 'file', 'base64' (default: 'file')
  });
  snapshot.then((uri) => {
    setMapState(uri);
    savePlaceHandler(uri,date,day,lapsedTime,totalDistance);
  });
};

const savePlaceHandler = (uri,date,day,lapsedTime,totalDistance) => {
    dispatch(runActions.addRun(uri,date,day,lapsedTime,totalDistance));
  };

return (
         <View style={styles.runDetailsContainer}>
         <MapView style={styles.map} region={mapRegion} ref={map => {mapRef = map }}
         pitchEnabled={false} rotateEnabled={false} zoomEnabled={false} scrollEnabled={false}>
         <Polyline 
         strokeWidth={5}
         strokeColor='red'
         coordinates={path} />
         </MapView>
         </View>
		);
};

const styles = StyleSheet.create({
    runDetailsContainer: {
        flex: 1,
        backgroundColor: 'lightgrey',
        flexDirection: 'column',
    },
    map: {
        height: windowHeight/1.2,
        width: windowWidth,
        borderRadius: 20
    }
});

export default RunDetailsScreen;