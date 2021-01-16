import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useWindowDimensions } from 'react-native';
import DrawerContent from './DrawerContent';
import AddGroup from '../addGroup/AddGroup';

const Drawer = createDrawerNavigator();

const MainScreen = () => {
  const dimensions = useWindowDimensions();
  const [isInitialRender, setIsInitialRender] = useState(false);
  useEffect(() => {
    // WhatsAppNum().then((res) => {
    //   console.log('WE MOVE');
    //   console.log('Hel', res);
    // });

    // SplashScreen.hide();
    // RNAudiotransition.initAudioTransition();

    // backgroundTask();
    // BackgroundFetch.registerHeadlessTask(MyHeadlessTask);
    // internetChecker();
    // hideNavigationBar();
    if (!isInitialRender) {
      setIsInitialRender(true);
      // setTimeout(() => {
      //   // getTimeSinceStartup().then((time) => {
      //   //   console.log(`Time since startup: ${time} ms`);
      //   // });
      // }, 1);
      // return true;
    }
  }, [isInitialRender]);
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      drawerStyle={{
        width: !isInitialRender ? 0 : 280,
        // backgroundColor: 'white',
      }}
      overlayColor={0}
      drawerType="slide"
      detachInactiveScreens={true}>
      <Drawer.Screen name="HomeTabs" component={AddGroup} />
      {/* <Drawer.Screen name="MyDownloadsTabs" component={MyDownloadsTabs} />
            <Drawer.Screen name="WhatsAppTabs" component={WhatsAppTabs} />
            <Drawer.Screen name="InstagramPro" component={InstagramPro} />
            <Drawer.Screen name="InstagramDownload" component={Instagram} />
            <Drawer.Screen name="TwitterDownload" component={Twitter} />
            <Drawer.Screen name="FacebookDownload" component={Facebook} />
            <Drawer.Screen name="SettingsScreen" component={SettingsScreen} /> */}
      {/* <Drawer.Screen name="HelpFeedBackScreen" component={HelpFeedbackScreen} />
      <Drawer.Screen
        name="VideoDownloadScreen"
        component={VideoDownloadScreen}
      />
      <Drawer.Screen
        name="CollectionDownloadScreen"
        component={CollectionDownloadScreen}
      />
      <Drawer.Screen
        name="CollectionVideoScreen"
        component={CollectionVideoScreen}
      />
      <Drawer.Screen name="VideoModalScreen" component={VideoModalScreen} />
      <Drawer.Screen name="ImageModalScreen" component={ImageModalScreen} /> */}
    </Drawer.Navigator>
  );
};

export default MainScreen;
