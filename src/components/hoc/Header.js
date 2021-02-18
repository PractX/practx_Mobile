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
import { ActivityIndicator } from 'react-native-paper';
import FastImage from 'react-native-fast-image';

const Header = ({
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
        width: Math.round(Dimensions.get('window').width),
        borderBottomColor: colors.background_1,
        borderBottomWidth: 0.8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.background,
      }}>
      {backArrow ? (
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 20,
            marginVertical: 15,
          }}>
          <TouchableOpacity
            style={{
              width: 40,
              height: 30,
              alignItems: 'flex-start',
              paddingTop: 5,
            }}
            onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-back"
              type="material-icons"
              color={colors.text}
              size={normalize(21)}
              style={{
                color: colors.text,
                // alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
          {practice || group ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <FastImage
                source={{
                  uri: practice
                    ? practice.logo ||
                      'https://www.ischool.berkeley.edu/sites/default/files/default_images/avatar.jpeg'
                    : group &&
                      'https://cdn.raceroster.com/assets/images/team-placeholder.png',
                }}
                style={[
                  {
                    width: 40,
                    height: 40,
                    borderRadius: 15,
                    backgroundColor: colors.background_1,
                    marginVertical: 5,
                    justifyContent: 'flex-end',
                  },
                  // currentPracticeId === practice.id && {
                  //   borderWidth: 1,
                  //   borderColor: colors.text,
                  // },
                ]}
                resizeMode={FastImage.resizeMode.cover}>
                {/* {currentPracticeId === practice.id && <Icon
            name={'primitive-dot'}
            type={'octicon'}
            color={colors.text}
            size={normalize(13)}
            style={[
              {
                right: 5,
                alignSelf: 'flex-end',
              },
            ]}
          />} */}
              </FastImage>
              <View style={{ flexDirection: 'column', paddingLeft: 10 }}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: normalize(15),
                    fontFamily: 'SofiaProSemiBold',
                  }}>
                  {practice
                    ? practice.practiceName && practice.practiceName.length > 18
                      ? practice.practiceName.substring(0, 11 - 3) + '...'
                      : practice.practiceName
                    : group && group.name.length > 18
                    ? group.name.substring(0, 11 - 3) + '...'
                    : group.name}
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: normalize(12),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  {practice
                    ? practice.specialty && practice.specialty.length > 18
                      ? practice.specialty.substring(0, 18 - 3) + '...'
                      : practice.specialty
                    : ''}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      ) : (
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
      )}
      <View
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          position: 'absolute',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: normalize(17.5),
            fontFamily: 'SofiaProSemiBold',
            color: colors.text,
          }}>
          {title}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginHorizontal: 20 }}>
        {iconRight1 && iconRight1.buttonType === 'filter' && (
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
                      color: 'white',
                      fontFamily: 'SofiaProRegular',
                      fontSize: normalize(15),
                      textAlign: 'center',
                    },
                  }}
                />
              </View>
            </MenuOptions>
          </Menu>
        )}
        {iconRight1 && iconRight1.buttonType === 'save' && (
          <Button
            // onPress={handleSubmit}
            TouchableComponent={() => {
              return isLoading ? (
                <ActivityIndicator
                  animating={true}
                  size={normalize(21)}
                  color={colors.text}
                />
              ) : (
                <TouchableOpacity onPress={() => iconRight1.onPress()}>
                  <Icon
                    name={iconRight1.name}
                    type={iconRight1.type}
                    color={colors.text}
                    size={normalize(21)}
                    style={{
                      color: colors.text,
                      // alignSelf: 'center',
                    }}
                  />
                </TouchableOpacity>
              );
            }}
          />
        )}
        {chatRight && (
          <>
            <Button
              // onPress={handleSubmit}
              TouchableComponent={() => (
                <TouchableOpacity onPress={() => chatRight[0].onPress()}>
                  <Icon
                    name={chatRight[0].name}
                    type={chatRight[0].type}
                    color={'white'}
                    size={normalize(21)}
                    style={{
                      borderRadius: 5,
                      backgroundColor: colors.primary,
                      padding: 5,
                      color: colors.text,
                      // alignSelf: 'center',
                    }}
                  />
                </TouchableOpacity>
              )}
            />
            <Button
              // onPress={handleSubmit}
              TouchableComponent={() => (
                <TouchableOpacity onPress={() => chatRight[1].onPress()}>
                  <Icon
                    name={chatRight[1].name}
                    type={chatRight[1].type}
                    color={'white'}
                    size={normalize(20)}
                    style={{
                      borderRadius: 5,
                      backgroundColor: colors.quaternary,
                      padding: 5,
                      color: colors.text,
                      marginLeft: 15,
                    }}
                  />
                </TouchableOpacity>
              )}
            />
          </>
        )}
        {notifyIcon && (
          <TouchableOpacity onPress={() => console.log('hello world')}>
            <Icon
              name="ios-notifications-outline"
              type="ionicon"
              color={colors.text}
              size={normalize(21)}
              style={{
                color: colors.text,
                marginLeft: 25,
              }}
            />
            <View
              style={{
                position: 'absolute',
                right: 3,
                top: 2,
                width: 6,
                height: 6,
                backgroundColor: colors.primary,
                borderRadius: 50,
              }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;
