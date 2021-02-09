import React from 'react';
import { View, Dimensions, TextInput, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatMessages from './ChatMessages';
import ChatScreen from './ChatScreen';

const Stack = createStackNavigator();

const Chats = ({ navigation }) => {
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
    <Stack.Navigator initialRouteName="ChatMessages" headerMode="none">
      <Stack.Screen name="ChatMessages">
        {(props) => <ChatMessages {...props} extraData={navigation} />}
      </Stack.Screen>
      <Stack.Screen name="ChatScreen">
        {(props) => <ChatScreen {...props} extraData={navigation} />}
      </Stack.Screen>
      {/* <Stack.Screen name="Settings" component={Settings} /> */}
    </Stack.Navigator>
  );
};

export default Chats;
