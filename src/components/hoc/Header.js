import React, { useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { DrawerActions, useTheme } from '@react-navigation/native';
import normalize from '../../utils/normalize';
import { Button, Icon } from 'react-native-elements';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { CheckBox } from 'native-base';
import MenuCheckOption from './MenuCheckOption';

const Header = ({
  navigation,
  title,
  iconRight1,
  checkState,
  setCheckState,
  setFilter,
}) => {
  const { colors } = useTheme();
  const screenWidth = Math.round(Dimensions.get('window').width);
  console.log(screenWidth, '&', screenWidth / 2);
  console.log(checkState);

  // const advanceCheck = (type) => {
  //   if (type === 'opt1') {
  //     console.log('Test working');
  //     // setCheckState(...checkState, { opt1: !checkState.opt1 });
  //   }
  // };

  return (
    <View
      style={{
        height: 50,
        width: Math.round(Dimensions.get('window').width),
        borderBottomColor: colors.background_1,
        borderBottomWidth: 0.8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          flexDirection: 'column',
          // marginTop: 20,
          // marginLeft: 20,
          // backgroundColor: 'green',
          marginHorizontal: 20,
          marginVertical: 15,
          width: 40,
          height: 30,
          alignItems: 'center',
        }}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <View
          style={{
            backgroundColor: colors.text,
            width: 23,
            height: 2,
            alignSelf: 'flex-start',
          }}
        />
        <View
          style={{
            backgroundColor: colors.primary,
            width: 11,
            height: 2,
            marginTop: 6,
            alignSelf: 'flex-start',
          }}
        />
      </TouchableOpacity>
      <Text
        style={{
          position: 'absolute',
          fontSize: normalize(17.5),
          fontFamily: 'SofiaProSemiBold',
          color: colors.text,
          left: Math.round(Dimensions.get('window').width) / 3,
        }}>
        {title}
      </Text>
      <View style={{ flexDirection: 'row', marginHorizontal: 20 }}>
        <Menu>
          <MenuTrigger
            // text="Select option"
            children={
              <Icon
                name={iconRight1.name}
                type={iconRight1.type}
                color={colors.text}
                size={normalize(19)}
                style={{
                  color: colors.text,
                  alignSelf: 'center',
                }}
              />
            }
          />
          <MenuOptions
            customStyles={{
              optionsWrapper: {
                backgroundColor: colors.background,
                borderWidth: 0.8,
                borderColor: colors.background_1,
              },
            }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: colors.background_1,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 5,
              }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: normalize(16),
                  fontFamily: 'SofiaProRegular',
                }}>
                Filter By
              </Text>
            </View>
            <MenuCheckOption
              name="None Member"
              setCheckState={setCheckState}
              checkState={checkState}
              checkStateType={['opt1', checkState.opt1]}
              colors={colors}
            />
            <MenuCheckOption
              name="Pending Member"
              setCheckState={setCheckState}
              checkState={checkState}
              checkStateType={['opt2', checkState.opt2]}
              colors={colors}
            />
            <MenuCheckOption
              name="Member"
              setCheckState={setCheckState}
              checkState={checkState}
              checkStateType={['opt3', checkState.opt3]}
              colors={colors}
            />
            <View style={{ marginVertical: 10 }}>
              <MenuOption
                text="Filter"
                onSelect={() => setFilter(checkState)}
                customStyles={{
                  optionWrapper: {
                    width: '50%',
                    alignSelf: 'center',
                    backgroundColor: colors.tertiary,
                    borderRadius: 5,
                    // paddingVertical: 4,
                  },
                  optionText: {
                    color: colors.text,
                    fontFamily: 'SofiaProRegular',
                    fontSize: normalize(15),
                    textAlign: 'center',
                  },
                }}
              />
            </View>
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
};

export default Header;
