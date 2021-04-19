import React from 'react';
import { View, Dimensions, TextInput, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Practices from './Practices';
import PractxScreen from './PractxScreen';
import PractxSearch from './PractxSearch';
import SinglePractice from './SinglePractice';

const Stack = createStackNavigator();

const Practx = ({ navigation }) => {
  // console.log(navigation.dangerouslyGetState());
  // Stack.navigationOptions = ({ navigation }) => {
  //     navigation.state.index !== undefined
  //       ? navigation.state.routes[navigation.state.index]
  //       : navigation.state.routeName;
  //   let drawerLockMode = 'locked-closed';
  //   if (name.routeName != 'Authentication' && name.routeName != 'Signup') {
  //     drawerLockMode = 'unlocked';
  //   }

  //   return {
  //     drawerLockMode,
  //   };
  // };
  return (
    <Stack.Navigator initialRouteName="PractxScreen" headerMode="none">
      <Stack.Screen name="PractxScreen">
        {(props) => <PractxScreen {...props} extraData={navigation} />}
      </Stack.Screen>
      <Stack.Screen name="Practices">
        {(props) => <Practices {...props} extraData={navigation} />}
      </Stack.Screen>
      <Stack.Screen name="PractxSearch">
        {(props) => <PractxSearch {...props} extraData={navigation} />}
      </Stack.Screen>
      <Stack.Screen name="SinglePractice">
        {(props) => <SinglePractice {...props} extraData={navigation} />}
      </Stack.Screen>

      {/* <Stack.Screen name="Settings" component={Settings} /> */}
    </Stack.Navigator>
  );
};

export default Practx;
