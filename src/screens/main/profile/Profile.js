import React from 'react';
import { View, Dimensions, TextInput, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from './ProfileScreen';
import EditProfile from './EditProfile';
import ResetPassword from './ResetPassword';

const Stack = createStackNavigator();

const Profile = ({ navigation }) => {
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
    <Stack.Navigator initialRouteName="ProfileScreen" headerMode="none">
      <Stack.Screen name="ProfileScreen">
        {(props) => <ProfileScreen {...props} extraData={navigation} />}
      </Stack.Screen>
      <Stack.Screen name="EditProfile">
        {(props) => <EditProfile {...props} extraData={navigation} />}
      </Stack.Screen>
      <Stack.Screen name="ResetPassword">
        {(props) => <ResetPassword {...props} extraData={navigation} />}
      </Stack.Screen>
      {/* <Stack.Screen name="Settings" component={Settings} /> */}
    </Stack.Navigator>
  );
};

export default Profile;
