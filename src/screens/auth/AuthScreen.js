import * as React from 'react';

import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';

import ForgotPassScreen from './ForgotPassScreen';
import SignUpScreen from './SignUpScreen';
import LogInScreen from './LogInScreen';
import VerifyAccount from './VerifyAccount';
import { connect } from 'react-redux';
import { setLoading } from '../../redux/user/user.actions';

const theme = {
  /* ---- THeme to be gotten from redux or context------*/
  background: '#1e1f36',
  highlight: '#ff0000',
  text: '#fff',
  text2: '#aaa',
  text3: '#555',
};

const Stack = createStackNavigator();

const AuthScreen = ({ setLoading }) => {
  // setLoading(false);
  return (
    <>
      <Stack.Navigator
        initialRouteName="login"
        headerMode="none"
        screenOptions={{
          headerTitleAlign: 'center',
          headerTitleAllowFontScaling: true,
          headerBackAllowFontScaling: true,

          headerTintColor: theme.text,
          headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
          headerStyle: { backgroundColor: theme.background },
          cardStyleInterpolator:
            CardStyleInterpolators.forRevealFromBottomAndroid,
        }}>
        <Stack.Screen name="login" component={LogInScreen} />
        <Stack.Screen name="signup" component={SignUpScreen} />
        <Stack.Screen name="forgotpass" component={ForgotPassScreen} />
        <Stack.Screen name="login2" component={VerifyAccount} />
      </Stack.Navigator>
    </>
  );
};
const mapDispatchToProps = (dispatch) => ({
  setLoading: (type) => dispatch(setLoading(type)),
});

export default connect(null, mapDispatchToProps)(AuthScreen);
