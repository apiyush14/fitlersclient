import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
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

//State Variables
//const [mapState,setMapState]=useState(null);
const [runPath, setRunPath]=useState([]);
const [mapRegion, setMapRegion]=useState(null);
const [runDate, setRunDate]=useState(null);
const [runDay, setRunDay]=useState(null);
const [runDistance,setRunDistance]=useState(0);
const [runTotalTime, setRunTotalTime]=useState(0);
const [runCaloriesBurnt,setRunCaloriesBurnt]=useState(0);
const [runPace, setRunPace]=useState(0.00);
const [trackTimer, setTrackTimer]=useState({
  seconds: "00",
  minutes: "00",
  hours: "00"
});

//Load Screen Use Effect hook used to populate state variables
useEffect(() => {
  
  console.log(props.route);

  if(props.route.params.sourceScreen){
    if(props.route.params.sourceScreen==='RunHistoryScreen'){
      isCalledFromHistoryScreen=true;
    }
  }

  if(props.route.params.runPath)
  {
    const pathArray=props.route.params.runPath;
    setRunPath(pathArray);
    setRunDate(props.route.params.runDate);
    setRunDay(props.route.params.runDay);
    setRunDistance(props.route.params.runDistance);
    setRunPace(props.route.params.runPace);
    setRunCaloriesBurnt(props.route.params.runCaloriesBurnt);

    setMapRegion({
     latitude: pathArray[Math.floor(pathArray.length/2)].latitude,
     longitude: pathArray[Math.floor(pathArray.length/2)].longitude,
     latitudeDelta: Math.abs(pathArray[pathArray.length-1].latitude-pathArray[0].latitude)+0.005,
     longitudeDelta: Math.abs(pathArray[pathArray.length-1].longitude-pathArray[0].longitude)+0.005
   });

    var runTotalTimeVar=props.route.params.runTotalTime;
    let secondsVar = ("0" + (Math.floor(runTotalTimeVar / 1000) % 60)).slice(-2);
    let minutesVar = ("0" + (Math.floor(runTotalTimeVar / 60000) % 60)).slice(-2);
    let hoursVar = ("0" + Math.floor(runTotalTimeVar / 3600000)).slice(-2);
    setTrackTimer(
    {
      seconds: secondsVar,
      minutes: minutesVar,
      hours: hoursVar
    });
    setRunTotalTime(runTotalTimeVar);
  }

       //To be removed
       if(!isCalledFromHistoryScreen){
         console.log('Setting Up Run Path');
         setRunPath(TESTPOINTS);
       }
       
     }, []);

//Use effect hook for taking a snapshot of the map
useEffect(() => {
 if(runPath.length>0&&(!isCalledFromHistoryScreen)){
   takeSnapshot();
 }
}, [runPath]);

//Method to take a snapshot and call save method
const takeSnapshot=()=>{
  const snapshot = mapRef.takeSnapshot({
   // width: 300,      // optional, when omitted the view-width is used
   // height: 300,     // optional, when omitted the view-height is used
    format: 'png',   // image formats: 'png', 'jpg' (default: 'png')
    quality: 0.8,    // image quality: 0..1 (only relevant for jpg, default: 1)
    result: 'file'   // result types: 'file', 'base64' (default: 'file')
  });
  snapshot.then((uri) => {
    //setMapState(uri);
    //savePlaceHandler(uri,date,day,lapsedTime,totalDistance,averagePace,caloriesBurnt,path);
    savePlaceHandler(runTotalTime,runDistance,runPace,runCaloriesBurnt,null,runDate,runDay,runPath,uri);
  });
};

//Method to dispatch Add Run
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
 coordinates={runPath}/>
 <Marker pinColor='green' coordinate={runPath[0]}/>
 <Marker pinColor='red' coordinate={runPath[runPath.length-1]}/>
 </MapView>

 <View style={styles.runMetricsContainer}>
 <View style={styles.row1}>
 <Card style={styles.runDistanceCard}>
 <View style={styles.walkIcon}>
 <Ionicons name="ios-walk" size={30} color='springgreen'/>
 </View>
 <Text style={styles.runDistanceText}>{parseFloat(runDistance/1000).toFixed(2)} KM</Text>
 </Card>

 <Card style={styles.runTotalTimeCard}>
 <View style={styles.timerIcon}>
 <Ionicons name="ios-stopwatch" size={20} color='springgreen'/>
 </View>
 <Text style={styles.runTotalTimeText}>{trackTimer.hours}:{trackTimer.minutes}:{trackTimer.seconds}</Text>
 <Text style={styles.timeMetricsText}>HH:MM:SS</Text>
 </Card>
 </View>

 <View style={styles.row2}>
 <Card style={styles.calendarCard}>
 <View style={styles.calendarIcon}>
 <Ionicons name="ios-calendar" size={25} color='springgreen'/>
 </View>
 <Text style={styles.calendarText}>{runDate}</Text>
 <Text style={styles.runDayText}>{runDay}</Text>
 </Card>

 <Card style={styles.runCaloriesBurntCard}>
 <View style={styles.caloriesIcon}>
 <Ionicons name="ios-flame" size={25} color='springgreen'/>
 </View>
 <Text style={styles.runCaloriesBurntText}>{runCaloriesBurnt}</Text>
 <Text style={styles.caloriesStaticText}>Calories</Text>
 </Card>


 <Card style={styles.runPaceCard}>
 <View style={styles.paceIcon}>
 <Ionicons name="ios-speedometer" size={25} color='springgreen'/>
 </View>
 <Text style={styles.runPaceText}>{parseFloat(runPace).toFixed(2)}</Text>
 <Text style={styles.paceStaticText}>Pace</Text>
 </Card>

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
  runDistanceCard: {
    marginVertical: '2%',
    marginHorizontal: '2%',
    backgroundColor: 'black',
    width: '60%',
    height: windowHeight/6
  },
  walkIcon: {
    alignSelf: 'center'
  },
  runDistanceText: {
    position: 'absolute',
    top: '35%',
    fontSize: 50,
    alignSelf: 'center',
    color: 'springgreen'
  },
  runTotalTimeCard: {
    marginVertical: '2%',
    backgroundColor: 'black',
    width: '33%',
    height: windowHeight/6
  },
  timerIcon: {
    alignSelf: 'center'
  },
  runTotalTimeText: {
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
  runDayText: {
    position: 'absolute',
    top: '70%',
    fontSize: 20,
    alignSelf: 'center',
    color: 'springgreen'
  },

  runCaloriesBurntCard: {
    marginVertical: '2%',
    backgroundColor: 'black',
    width: '27%',
    height: windowHeight/6
  },
  caloriesIcon: {
    alignSelf: 'center'
  },
  runCaloriesBurntText: {
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

  runPaceCard: {
    marginVertical: '2%',
    marginHorizontal: '2%',
    backgroundColor: 'black',
    width: '31%',
    height: windowHeight/6
  },
  paceIcon: {
    alignSelf: 'center'
  },
  runPaceText: {
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