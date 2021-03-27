import React from 'react';
import {Ionicons} from '@expo/vector-icons';
import { Platform, View, TouchableOpacity, StyleSheet } from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import RunTrackerHomeScreen from '../screens/RunTrackerHomeScreen';
import LiveRunTracker from '../screens/LiveRunTracker';
import RunDetailsScreen from '../screens/RunDetailsScreen';
import RunHistoryScreen from '../screens/RunHistoryScreen';
import LogInScreen from '../screens/LogInScreen';
import LogOutScreen from '../screens/LogOutScreen';
import SplashScreen from '../screens/SplashScreen';
import TermsAndConditions from '../screens/TermsAndConditions';
import Privacy from '../screens/Privacy';
import UserDetailsScreen from '../screens/UserDetailsScreen';
import EventsListSummaryScreen from '../screens/EventsListSummaryScreen';
import {useDispatch,useSelector} from 'react-redux';
import * as userActions from '../store/user-actions';

const drawerNavigator = createDrawerNavigator();
const stackNavigator=createStackNavigator();
const tabNavigator=createBottomTabNavigator();

//Main Navigator
const RunTrackerNavigator=()=>{
  const dispatch=useDispatch();
  return (
    <NavigationContainer>
    <drawerNavigator.Navigator screenOptions={{
      swipeEnabled: false
    }}>
    <drawerNavigator.Screen name="Home" component={RunTrackerTabNavigator}/>
    <drawerNavigator.Screen name="Terms & Conditions" component={TermsAndConditions}/>
    <drawerNavigator.Screen name="Privacy" component={Privacy}/>
    <drawerNavigator.Screen name="LogOut" component={LogOutScreen}
    listeners={({ navigation }) => ({
        state: (e) => {
        if (e.data.state.index === 3) {
          dispatch(userActions.cleanUserDataStateAndDB());
        }
        }
    })}
    />
    </drawerNavigator.Navigator>
    </NavigationContainer>
    );
};

// Tab Navigator
const RunTrackerTabNavigator=({navigation, route})=>{
  var currentActiveScreenName=getActiveScreenName(route);
  var isTabNavigationVisible= currentActiveScreenName==='HomeScreen'
  ||currentActiveScreenName==='HomeScreen'
  ||currentActiveScreenName==='History'
  ||currentActiveScreenName==='RunHistoryScreen'
  ||currentActiveScreenName==='Events'
  ||currentActiveScreenName==='RunDetailsScreen'
  ?true:false;
  
  return (
   <tabNavigator.Navigator 
   screenOptions={(screenRoute) => ({
    tabBarVisible: isTabNavigationVisible,
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      if (screenRoute.route.name === 'Home') {
        iconName = focused
        ? Platform.OS === 'android'?'md-home':'ios-home'
        : Platform.OS === 'android'?'md-home':'ios-home';
      } else if (screenRoute.route.name === 'History') {
        iconName = focused 
        ? Platform.OS === 'android'?'md-stats':'ios-stats' 
        : Platform.OS === 'android'?'md-stats':'ios-stats';
      }
        else if (screenRoute.route.name === 'Events') {
        iconName = focused 
        ? Platform.OS === 'android'?'md-trophy':'ios-trophy' 
        : Platform.OS === 'android'?'md-trophy':'ios-trophy';
      }
      return <Ionicons name={iconName} size={25} color={color} />;
    },
  })}

   tabBarOptions={{
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray'
  }}
  >
  <tabNavigator.Screen name="Home" component={RunTrackerStackNavigator} 
  listeners={{
    tabPress: e=>{
    }
  }}/>
  <tabNavigator.Screen name="Events" component={EventsStackNavigator} />
  <tabNavigator.Screen name="History" component={RunTrackerHistoryStackNavigator} />
  </tabNavigator.Navigator>
  );
};

//Main Stack Navigator
const RunTrackerStackNavigator=({navigation, route})=>{
  const authDetails = useSelector(state => state.authDetails);
  const userDetails = useSelector(state => state.userDetails);

  return (
    <stackNavigator.Navigator screenOptions={{gestureEnabled: false}}>
    {(authDetails===null)
      ||(authDetails.userId===undefined)
      ||(authDetails.userId===null) 
      ||(userDetails===null) 
      ||(userDetails.userFirstName===undefined)
      ||(userDetails.userFirstName===null) ? (
    <stackNavigator.Screen name="LoginStackNavigator" component={LoginStackNavigator}
     options={{
      headerShown: false
    }}
    /> 
    ): (
    <React.Fragment>
    <stackNavigator.Screen name="HomeScreen" component={RunTrackerHomeScreen} 
    options={{
      tabBarVisible: false,
      title: 'Runner Home',
      headerLeft: ()=>{
        return (
          <View styles={styles.person}>
          <TouchableOpacity onPress={()=>navigation.toggleDrawer()}>
          <Ionicons name={Platform.OS === 'android'?'md-person':'ios-person'} size={40} color='grey'/>
          </TouchableOpacity>
          </View>
          );
      } 
    }}/>
    <stackNavigator.Screen name="RunHistoryScreen" component={RunHistoryScreen} 
    options={{
      title: 'Wall of Fame'
    }}/>
    <stackNavigator.Screen name="LiveRunTracker" component={LiveRunTracker} 
    options={{
      headerShown: false
    }}/>
    <stackNavigator.Screen name="RunDetailsScreen" component={RunDetailsScreen}
    options={{
      title: 'Run Details',
      headerLeft: null
    }}/>
    </React.Fragment>
     )}
    </stackNavigator.Navigator>
    );
  };

  //Run History Stack Navigator
  const RunTrackerHistoryStackNavigator=({navigation, route})=>{
    return (
      <stackNavigator.Navigator screenOptions={{gestureEnabled: false}}>
      <stackNavigator.Screen name="RunHistoryScreen" component={RunHistoryScreen} 
      options={{
        title: 'Wall of Fame'
      }}/>
      <stackNavigator.Screen name="RunDetailsScreen" component={RunDetailsScreen}
    options={{
      title: 'Run Details'
    }}/>
      </stackNavigator.Navigator>
      );
    };

   const styles = StyleSheet.create({
     person: {
       left: 10
     }
   });

  //Login Stack Navigator
  const LoginStackNavigator=({navigation, route})=>{
    return (
      <stackNavigator.Navigator 
      screenOptions={
        {gestureEnabled: false}
       }>
      <stackNavigator.Screen name="SplashScreen" component={SplashScreen} 
      options={{
        headerShown: false,
        tabBarVisible: false
      }}/>
      <stackNavigator.Screen name="LogInScreen" component={LogInScreen} 
      options={{
        headerShown: false
      }}/>
      <stackNavigator.Screen name="UserDetailsScreen" component={UserDetailsScreen} 
      options={{
        headerShown: false
      }}/>
      </stackNavigator.Navigator>
      );
    };

  //Events Stack Navigator
  const EventsStackNavigator=({navigation, route})=>{
    return (
      <stackNavigator.Navigator 
      screenOptions={
        {gestureEnabled: false}
       }>
      <stackNavigator.Screen name="EventsListSummaryScreen" component={EventsListSummaryScreen} 
      options={{
        title: 'Events'
      }}/>
      </stackNavigator.Navigator>
      );
    };

//Private Utility Method to Get Active Screen Name Recursively    
const getActiveScreenName = (route) => {
  if (route && route.state) {
    if (route.state.index >= 0 && route.state.routes) {
      return getActiveScreenName(route.state.routes[route.state.index]);
    }
  } else {
    return route.name;
  }
};
 
export default RunTrackerNavigator;
