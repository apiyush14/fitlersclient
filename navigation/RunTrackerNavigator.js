import React from 'react';
import {Ionicons} from '@expo/vector-icons';
import { Platform } from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import { createBottomTabNavigator} from 'react-navigation-tabs';
import RunTrackerHomeScreen from '../screens/RunTrackerHomeScreen';
import LiveRunTracker from '../screens/LiveRunTracker';
import RunDetailsScreen from '../screens/RunDetailsScreen';
import RunHistoryScreen from '../screens/RunHistoryScreen';
import TestScreen from '../screens/TestScreen';

const RunTrackerNavigator = createStackNavigator(
  {
    RunTrackerHome: RunTrackerHomeScreen,
    LiveRunTracker: 
    {
     screen: LiveRunTracker, 
     navigationOptions: {
      
    }
   }
    ,
    RunDetailsScreen: RunDetailsScreen,
    TestScreen: TestScreen
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Platform.OS === 'android' ? 'white' : 'white'
      },
      headerTintColor: Platform.OS === 'android' ? 'white' : 'white'
    }
  }
);


RunTrackerNavigator.navigationOptions = ({ navigation }) => {
  let navigationOptions = {};
  if (navigation.state.index === 1) {
    navigationOptions.tabBarVisible = false;
  }

  return navigationOptions;
};

const RunHistoryNavigator = createStackNavigator(
  {
    RunHistoryScreen: RunHistoryScreen
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Platform.OS === 'android' ? 'white' : 'white'
      },
      headerTintColor: Platform.OS === 'android' ? 'white' : 'white'
    }
  }
);

const RunTrackerTabNavigator=createBottomTabNavigator(
{
  RunTracker: {
  screen: RunTrackerNavigator, 
  navigationOptions: {
 tabBarIcon: (tabInfo)=>
 {
  return (
  <Ionicons 
  name='ios-home' 
  size={25}
  />
  );
 }
}
},
RunHistory: {
  screen:RunHistoryNavigator, 
  navigationOptions: {
  tabBarIcon: (tabInfo)=>
 {
  return (<Ionicons name='ios-stats' size={25}/>);
 }
}
}

},
{
  tabBarOptions: {
    activeTintColor: 'grey'
  }
}
);

export default createAppContainer(RunTrackerTabNavigator);
