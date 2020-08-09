import { Platform } from 'react-native';
import {createStackNavigator} from 'react-navigation-stack'; 
import {createAppContainer} from 'react-navigation';

import RunTrackerHomeScreen from '../screens/RunTrackerHomeScreen';
import LiveRunTracker from '../screens/LiveRunTracker';
import TestScreen from '../screens/TestScreen';

const PlacesNavigator = createStackNavigator(
  {
    RunTrackerHome: RunTrackerHomeScreen,
    LiveRunTracker: LiveRunTracker,
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

export default createAppContainer(PlacesNavigator);
