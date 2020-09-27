import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Dimensions, ImageBackground} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import * as Location from 'expo-location';
import { useDispatch } from 'react-redux';
import * as runActions from '../store/run-actions';
import Card from '../components/Card';
import { Ionicons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
var isCalledFromHistoryScreen=false;

let mapRef=null;

const TESTPOINTS = [
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

const RunDetailsScreen = props=>{

const dispatch = useDispatch();
const [mapState,setMapState]=useState(null);
const [path, setPath]=useState([]);
const [mapRegion, setMapRegion]=useState(null);
const [date, setDate]=useState(null);
const [day, setDay]=useState(null);
const [totalDistance,setTotalDistance]=useState(0);
const [lapsedTime, setLapsedTime]=useState(0);
const [caloriesBurnt,setCaloriesBurnt]=useState(0);
const [averagePace, setAveragePace]=useState(0.00);
const [trackImage, setTrackImage]=useState(null);
const [trackTimer, setTrackTimer]=useState({
  seconds: "00",
  minutes: "00",
  hours: "00"
});

useEffect(() => {
       if(props.route.params.sourceScreen){
            if(props.route.params.sourceScreen==='RunHistoryScreen'){
              isCalledFromHistoryScreen=true;
            }
       }
       if(props.route.params.track_image)
       {
        setTrackImage(props.route.params.track_image);
       }

       if(props.route.params.path)
       {
        const pathArray=props.route.params.path;
        setPath(props.route.params.path);
        setMapRegion({
        latitude: pathArray[Math.floor(pathArray.length/2)].latitude,
        longitude: pathArray[Math.floor(pathArray.length/2)].longitude,
        latitudeDelta: Math.abs(pathArray[pathArray.length-1].latitude-pathArray[0].latitude)+0.001,
        longitudeDelta: Math.abs(pathArray[pathArray.length-1].longitude-pathArray[0].longitude)+0.001
         });
       }

       //To be removed
       if(!isCalledFromHistoryScreen){
       setPath(TESTPOINTS);
     }

       if(props.route.params.date)
       {
        setDate(props.route.params.date);
       }

       if(props.route.params.lapsedTime)
       {
         let secondsVar = ("0" + (Math.floor(props.route.params.lapsedTime / 1000) % 60)).slice(-2);
         let minutesVar = ("0" + (Math.floor(props.route.params.lapsedTime / 60000) % 60)).slice(-2);
         let hoursVar = ("0" + Math.floor(props.route.params.lapsedTime / 3600000)).slice(-2);
         setTrackTimer(
        {
            seconds: secondsVar,
            minutes: minutesVar,
            hours: hoursVar
        });
        setLapsedTime(props.route.params.lapsedTime);
       }

       if(props.route.params.totalDistance)
       {
        setTotalDistance(props.route.params.totalDistance);
       }

       if(props.route.params.day)
       {
        setDay(props.route.params.day);
       }

       if(props.route.params.averagePace)
       {
        setAveragePace(props.route.params.averagePace);
       }

       if(props.route.params.caloriesBurnt)
       {
        setCaloriesBurnt(props.route.params.caloriesBurnt);
       }
    }, []);

useEffect(() => {
       if(path.length>0&&(!isCalledFromHistoryScreen)){
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
    //savePlaceHandler(uri,date,day,lapsedTime,totalDistance,averagePace,caloriesBurnt,path);
    savePlaceHandler(lapsedTime,totalDistance,averagePace,caloriesBurnt,null,date,day,path,uri);
  });
};

const savePlaceHandler = (runTotalTime,runDistance,runPace,runCaloriesBurnt,runCredits,runDate,runDay,runPath,runTrackSnapUrl) => {
    dispatch(runActions.addRun(runTotalTime,runDistance,runPace,runCaloriesBurnt,runCredits,runDate,runDay,runPath,runTrackSnapUrl));
  };

return (
         <View style={styles.runDetailsContainer}>
         <MapView style={styles.mapContainer} region={mapRegion} ref={map => {mapRef = map }}
         pitchEnabled={true} rotateEnabled={true} zoomEnabled={true} scrollEnabled={true}>
         <Polyline 
         strokeWidth={5}
         strokeColor='red'
         coordinates={path}/>
         </MapView>

      <View style={styles.runMetricsContainer}>
        <View style={styles.row1}>
           <Card style={styles.totalDistanceCard}>
            <View style={styles.walkIcon}>
             <Ionicons name="ios-walk" size={30} color='springgreen'/>
            </View>
            <Text style={styles.totalDistanceText}>{parseFloat(totalDistance/1000).toFixed(2)} KM</Text>
           </Card>

           <Card style={styles.totalTimeCard}>
            <View style={styles.timerIcon}>
             <Ionicons name="ios-stopwatch" size={20} color='springgreen'/>
            </View>
            <Text style={styles.totalTimeText}>{trackTimer.hours}:{trackTimer.minutes}:{trackTimer.seconds}</Text>
            <Text style={styles.timeMetricsText}>HH:MM:SS</Text>
           </Card>
        </View>

          <View style={styles.row2}>
           <Card style={styles.calendarCard}>
            <View style={styles.calendarIcon}>
             <Ionicons name="ios-calendar" size={25} color='springgreen'/>
            </View>
            <Text style={styles.calendarText}>{date}</Text>
            <Text style={styles.dayText}>{day}</Text>
           </Card>

            <Card style={styles.caloriesCard}>
            <View style={styles.caloriesIcon}>
             <Ionicons name="ios-flame" size={25} color='springgreen'/>
            </View>
            <Text style={styles.caloriesText}>{caloriesBurnt}</Text>
            <Text style={styles.caloriesStaticText}>Calories</Text>
           </Card>


            <Card style={styles.paceCard}>
            <View style={styles.paceIcon}>
             <Ionicons name="ios-speedometer" size={25} color='springgreen'/>
            </View>
            <Text style={styles.averagePaceText}>{parseFloat(averagePace).toFixed(2)}</Text>
            <Text style={styles.paceStaticText}>Pace</Text>
           </Card>

          </View>
         </View>
            <View style={styles.footerTabContainer}>
            <View style={styles.footerHome}>
            <TouchableOpacity onPress={()=>{
              props.navigation.navigate('Home');
            }}>
             <Ionicons name="ios-home" size={25} color='gray'/>
            </TouchableOpacity>
            </View>

            <View style={styles.footerRunHistory}>
             <TouchableOpacity onPress={()=>{
              props.navigation.navigate('History');
             }}>
             <Ionicons name="ios-stats" size={25} color='gray'/>
             </TouchableOpacity>
            </View>
            </View>
         </View>
		);
};

const styles = StyleSheet.create({
    runDetailsContainer: {
        flex: 1,
        backgroundColor: 'lightgrey',
        flexDirection: 'column',
    },
    mapContainer: {
        position: 'absolute',
        height: '40%',
        width: '100%',
        borderRadius: 20
    },
    trackImage: {
      flex: 1,
    },
    runMetricsContainer: {
      top: '40%',
      position: 'absolute',
      height: '60%',
      width: '100%',
      flexDirection: 'column'
    },
    row1: {
      height: '30%',
      flexDirection: 'row'
    },
    totalDistanceCard: {
      marginVertical: '2%',
      marginHorizontal: '2%',
      backgroundColor: 'black',
      width: '60%',
      height: windowHeight/6
    },
    walkIcon: {
      alignSelf: 'center'
    },
    totalDistanceText: {
        position: 'absolute',
        top: '35%',
        fontSize: 50,
        alignSelf: 'center',
        color: 'springgreen'
    },
    totalTimeCard: {
      marginVertical: '2%',
      backgroundColor: 'black',
      width: '33%',
      height: windowHeight/6
    },
    timerIcon: {
      alignSelf: 'center'
    },
    totalTimeText: {
        position: 'absolute',
        top: '45%',
        fontSize: 20,
        alignSelf: 'center',
        color: 'springgreen'
    },
    timeMetricsText: {
        position: 'absolute',
        top: '70%',
        fontSize: 10,
        alignSelf: 'center',
        color: 'springgreen'
    },

    row2: {
      marginVertical: '5%',
      height: '30%',
      flexDirection: 'row'
    },
    calendarCard: {
      marginVertical: '2%',
      marginHorizontal: '2%',
      backgroundColor: 'black',
      width: '33%',
      height: windowHeight/6
    },
    calendarIcon: {
      alignSelf: 'center'
    },
    calendarText: {
        marginVertical: '5%',
        position: 'absolute',
        top: '35%',
        fontSize: 20,
        alignSelf: 'center',
        color: 'springgreen'
    },
    dayText: {
        position: 'absolute',
        top: '70%',
        fontSize: 20,
        alignSelf: 'center',
        color: 'springgreen'
    },

    caloriesCard: {
      marginVertical: '2%',
      backgroundColor: 'black',
      width: '27%',
      height: windowHeight/6
    },
    caloriesIcon: {
      alignSelf: 'center'
    },
    caloriesText: {
        marginVertical: '5%',
        position: 'absolute',
        top: '35%',
        fontSize: 20,
        alignSelf: 'center',
        color: 'springgreen'
    },
    caloriesStaticText: {
        position: 'absolute',
        top: '70%',
        fontSize: 20,
        alignSelf: 'center',
        color: 'springgreen'
    },

    paceCard: {
      marginVertical: '2%',
      marginHorizontal: '2%',
      backgroundColor: 'black',
      width: '31%',
      height: windowHeight/6
    },
    paceIcon: {
      alignSelf: 'center'
    },
    averagePaceText: {
        marginVertical: '5%',
        position: 'absolute',
        top: '35%',
        fontSize: 20,
        alignSelf: 'center',
        color: 'springgreen'
    },
    paceStaticText: {
        position: 'absolute',
        top: '70%',
        fontSize: 20,
        alignSelf: 'center',
        color: 'springgreen'
    },

    footerTabContainer: {
      backgroundColor: 'white',
      position: 'absolute',
      width: '100%',
      height: 50,
      bottom: 2,
      flexDirection: 'row'
    },
    footerHome: {
      width: '50%',
      alignSelf: 'center',
      alignItems: 'center'
    },
    footerRunHistory: {
      width: '50%',
      alignSelf: 'center',
      alignItems: 'center'
    }
});

export default RunDetailsScreen;