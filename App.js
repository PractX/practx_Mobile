import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ColorList } from './src/utils/color';
import { selectThemeMode } from './src/redux/settings/settings.selector';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Orientation from 'react-native-orientation-locker';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import AuthScreen from './src/screens/auth/AuthScreen';
import MainScreen from './src/screens/main/MainScreen';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectCurrentUser, selectToken } from './src/redux/user/user.selector';
import FlashMessage from 'react-native-flash-message';

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}
const Stack = createStackNavigator();
const App = ({ themeMode, user, token }) => {
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    color: null,
    scheme: null,
    theme: null,
  });
  useMemo(() => {
    console.log(state.color);
    if (themeMode === 'Dark') {
      setState({
        ...state,
        color: ColorList[1].background,
        scheme: 'light-content',

        theme: {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            ...ColorList[1],
          },
        },
      });
    } else {
      setState({
        ...state,
        color: ColorList[0].background,
        scheme: 'dark-content',

        theme: {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            ...ColorList[0],
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeMode]);
  useEffect(() => {
    // console.log(token);
    Orientation.lockToPortrait();
    themeMode === 'Dark'
      ? changeNavigationBarColor(ColorList[1].background)
      : changeNavigationBarColor(ColorList[0].background);
  }, [themeMode]);
  return (
    <>
      <StatusBar backgroundColor={state.color} />
      <NavigationContainer
        theme={state.theme}
        ref={navigationRef}
        onReady={() =>
          (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
        }>
        <Stack.Navigator initialRouteName="NoAuth" headerMode="none">
          {isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : user === null ? (
            // No token found, user isn't signed in
            <Stack.Screen name="AuthScreen" component={AuthScreen} />
          ) : (
            // User is signed in
            <Stack.Screen name="MainScreen" component={MainScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <FlashMessage
        animated={true}
        animationDuration={500}
        floating={true}
        position={'right'}
        style={{
          width: '70%',
          alignSelf: 'center',
          zIndex: 20000,
          // alignItems: 'center',
        }}
        // titleStyle={{ textAlign: 'center' }}
        duration={4000}
        icon={{ icon: 'auto', position: 'right' }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

const mapStateToProps = createStructuredSelector({
  themeMode: selectThemeMode,
  user: selectCurrentUser,
  token: selectToken,
});
export default connect(mapStateToProps)(App);
