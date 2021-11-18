import React, { useEffect } from 'react';
import { View, Dimensions, TextInput, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Appointments from './Appointments';
import AppointmentBooking from './AppointmentBooking';
// import ResetPassword from './ResetPassword';

const Stack = createStackNavigator();

const Appointment = ({ navigation, route }) => {
  const { params } = route;
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
  useEffect(() => {
    if (params) {
      console.log('Pramssss--', params);
      navigation.navigate(params?.to, { practice: params?.practice });
    }
  }, [params]);
  return (
    <Stack.Navigator initialRouteName="Appointments" headerMode="none">
      <Stack.Screen name="Appointments">
        {props => <Appointments {...props} extraData={navigation} />}
      </Stack.Screen>
      <Stack.Screen name="AppointmentBooking">
        {props => <AppointmentBooking {...props} extraData={navigation} />}
      </Stack.Screen>
      {/* <Stack.Screen name="Settings" component={Settings} /> */}
    </Stack.Navigator>
  );
};

export default Appointment;
