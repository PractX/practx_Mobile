import React, { useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { DrawerActions, useTheme } from '@react-navigation/native';
import { normalize } from 'react-native-elements';
import { Button, Icon } from 'react-native-elements';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { CheckBox } from 'native-base';
import MenuCheckOption from './MenuCheckOption';
import { ActivityIndicator } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;
const MainHeader = ({
  navigation,
  title,
  iconRight1,
  chatRight,
  notifyIcon,
  checkState,
  setCheckState,
  setFilter,
  backArrow,
  isLoading,
  practice,
  group,
  width,
  allNotifications,
}) => {
  const { colors } = useTheme();
  const screenWidth = Math.round(Dimensions.get('window').width);
  // console.log(screenWidth, '&', screenWidth / 2);
  // console.log(checkState);

  // const advanceCheck = (type) => {
  //   if (type === 'opt1') {
  //     console.log('Test working');
  //     // setCheckState(...checkState, { opt1: !checkState.opt1 });
  //   }
  // };

  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 100,
        height: 50,
        width: width,
        borderColor: colors.background_1,
        borderWidth: 0.8,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        // justifyContent: 'space-between',/
        backgroundColor: colors.background,
        marginVertical: 10,
        borderRadius: 10,
      }}>
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          flexDirection: 'column',
          // marginTop: 20,
          // marginLeft: 20,
          // backgroundColor: 'green',
          marginLeft: 20,
          marginVertical: 15,
          width: 40,
          height: 30,
          alignItems: 'center',
        }}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <View
          style={{
            backgroundColor: colors.text,
            width: 22,
            height: 1.7,
            marginTop: 4,
            alignSelf: 'flex-start',
          }}
        />
        <View
          style={{
            backgroundColor: colors.primary,
            width: 11,
            height: 1.8,
            marginTop: 4,
            alignSelf: 'flex-start',
          }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flexGrow: 100,
        }}
        onPress={() => navigation.navigate('PractxSearch')}>
        <Text
          style={{
            fontSize: normalize(13),
            fontFamily: 'SofiaProRegular',
            color: colors.text_1,
          }}>
          Search for a practice
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', marginRight: 10 }}>
        {notifyIcon && (
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Icon
              name="ios-notifications-outline"
              type="ionicon"
              color={colors.text}
              size={normalize(21)}
              style={{
                color: colors.text,
                marginLeft: 10,
              }}
            />
            {allNotifications > 0 && (
              <View
                style={{
                  position: 'absolute',
                  right: allNotifications > 20 ? -8 : -5,
                  top: -2,
                  minWidth: 15,
                  backgroundColor: colors.primary,
                  borderRadius: 100,
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    fontSize: normalize(7.5),
                    fontFamily: 'SofiaProRegular',
                    color: 'white',
                    textAlign: 'center',
                    paddingVertical: allNotifications > 20 ? 2.5 : 2.5,
                    paddingHorizontal: allNotifications > 20 ? 2 : 2.5,
                  }}>
                  {allNotifications > 20 ? '20+' : allNotifications}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MainHeader;
