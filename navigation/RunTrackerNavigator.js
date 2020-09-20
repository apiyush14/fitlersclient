import React from 'react';
import {Ionicons} from '@expo/vector-icons';
import { Platform, View, TouchableOpacity, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RunTrackerHomeScreen from '../screens/RunTrackerHomeScreen';
import LiveRunTracker from '../screens/LiveRunTracker';
import RunDetailsScreen from '../screens/RunDetailsScreen';
import RunHistoryScreen from '../screens/RunHistoryScreen';
import TestScreen from '../screens/TestScreen';


const drawerNavigator = createDrawerNavigator();
const stackNavigator=createStackNavigator();
const tabNavigator=createBottomTabNavigator();

const RunTrackerNavigator=()=>{
return (
  <NavigationContainer>
    <drawerNavigator.Navigator>
     <drawerNavigator.Screen name="Home" component={RunTrackerStackNavigator}/>
    </drawerNavigator.Navigator>
  </NavigationContainer>
  );
};

const RunTrackerStackNavigator=({navigation, route})=>{
return (
  <stackNavigator.Navigator>
    <stackNavigator.Screen name="RunTrackerTabNavigator" component={RunTrackerTabNavigator}
    options={{
      title: route.state.routes[0].state.index===0?'Runner Home':'Wall of Fame',
      headerLeft: ()=>{
        //Condition to be verfied in testing, used index of tab stack to check
        if(route.state&&route.state.routes[0].state.index===0
          ||(!route.state&&route.name==='Home')){
        return (
          <View styles={styles.person}>
           <TouchableOpacity onPress={()=>navigation.toggleDrawer()}>
            <Ionicons name="ios-person" size={40} color='grey'/>
           </TouchableOpacity>
          </View>
        );}
     } 
    }}/>
    <stackNavigator.Screen name="LiveRunTracker" component={LiveRunTracker} 
    options={{
    headerShown: false
    }}/>
    <stackNavigator.Screen name="RunDetailsScreen" component={RunDetailsScreen}
    options={{
    headerLeft: null
  }}/>
  </stackNavigator.Navigator>
  );
};

const RunTrackerTabNavigator=()=>{
return (
   <tabNavigator.Navigator 
    screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused
                ? Platform.OS === 'android'?'md-home':'ios-home'
                : Platform.OS === 'android'?'md-home':'ios-home';
            } else if (route.name === 'History') {
              iconName = focused 
                         ? Platform.OS === 'android'?'md-stats':'ios-stats' 
                         : Platform.OS === 'android'?'md-stats':'ios-stats';
            }
            return <Ionicons name={iconName} size={25} color={color} />;
          },
        })}

        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray'
        }}
    >
      <tabNavigator.Screen name="Home" component={RunTrackerHomeScreen} />
      <tabNavigator.Screen name="History" component={RunHistoryScreen} />
    </tabNavigator.Navigator>
 );
};


const drawerView=({navigation})=>{
 return (
     <View styles={styles.person}>
      <TouchableOpacity onPress={()=>navigation.toggleDrawer()}>
       <Ionicons name="ios-person" size={40} color='grey'/>
      </TouchableOpacity>
     </View>
 );
};

const styles = StyleSheet.create({
 person: {
   left: 10
 }
});

/*
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
);*/

export default RunTrackerNavigator;
