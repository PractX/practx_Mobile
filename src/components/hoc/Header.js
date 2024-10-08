import React, { useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Pressable,
  TextInput,
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
import firstLetterWord from '../../utils/firstLetterWord';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

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
  search,
  searchData,
  subgroups,
  setTextInput,
  searchText,
  setSearchText,
  textImage,
  hideCancel,
  signalType,
  avatar,
  textRight,
}) => {
  const { colors } = useTheme();
  const screenWidth = Math.round(Dimensions.get('window').width);
  const [searchRef, setSearchRef] = useState();
  // console.log(practice);

  // const advanceCheck = (type) => {
  //   if (type === 'opt1') {
  //     console.log('Test working');
  //     // setCheckState(...checkState, { opt1: !checkState.opt1 });
  //   }
  // };

  return (
    <View
      style={{
        position: searchData && searchData.hideTitle ? 'relative' : 'absolute',
        zIndex: 5000,
        height: subgroups && subgroups.show ? null : 50,
        width: '100%',
        borderBottomColor: colors.background_1,
        borderBottomWidth: searchData && searchData.hideBorder ? 0 : 0.8,
        flexDirection: 'column',
        // justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.background,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: subgroups && subgroups.show ? 50 : '100%',
          width: appwidth,
          backgroundColor: colors.background,
          // height: 50,
        }}>
        {backArrow && !practice && !group && (
          <TouchableOpacity
            style={{
              width: 40,
              height: 30,
              alignItems: 'flex-start',
              paddingTop: 5,
              zIndex: 20,
              marginVertical: 15,
            }}
            onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-back"
              type="material-icons"
              color={colors.text}
              size={normalize(18)}
              style={{
                color: colors.text,
                // alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
        )}
        {(backArrow && practice) || (backArrow && group) ? (
          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 15,
            }}>
            <TouchableOpacity
              style={{
                width: 28,
                height: 30,
                alignItems: 'flex-start',
                paddingTop: 5,
                zIndex: 20,
              }}
              onPress={() => navigation.goBack()}>
              <Icon
                name="arrow-back"
                type="material-icons"
                color={colors.text}
                size={normalize(18)}
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
                  justifyContent: 'center',
                }}>
                {practice ? (
                  <FastImage
                    source={{
                      uri:
                        practice.logo ||
                        'https://www.ischool.berkeley.edu/sites/default/files/default_images/avatar.jpeg',
                      // : group &&
                      //   'https://cdn.raceroster.com/assets/images/team-placeholder.png',
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
                ) : (
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 15,
                      backgroundColor: colors.background_1,
                      overflow: 'hidden',
                      justifyContent: 'center',
                      marginVertical: 5,
                    }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: normalize(18),
                        fontFamily: 'SofiaProSemiBold',
                        textTransform: 'capitalize',
                        textAlign: 'center',
                      }}>
                      {group && group.name.indexOf(' ') >= 0
                        ? firstLetterWord(group.name)
                        : group.name.substring(0, 2)}
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    flexDirection: 'column',
                    paddingLeft: 10,
                  }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: normalize(13),
                      fontFamily: 'SofiaProSemiBold',
                    }}>
                    {practice
                      ? practice.practiceName &&
                        practice.practiceName.length > 14
                        ? practice.practiceName.substring(0, 11 - 3) + '...'
                        : practice.practiceName
                      : group && group.name.length > 14
                      ? group.name.substring(0, 11 - 3) + '...'
                      : group.name}
                  </Text>
                  {/* {practice && practice.specialty && (
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: normalize(12),
                        fontFamily: 'SofiaProRegular',
                      }}>
                      {practice.specialty.length > 18
                        ? practice.specialty.substring(0, 18 - 3) + '...'
                        : practice.specialty}
                    </Text>
                  )} */}
                  {(practice && signalType) || (group && signalType) ? (
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: normalize(12),
                        fontFamily: 'SofiaProRegular',
                      }}>
                      <Text
                        style={{
                          textTransform: 'capitalize',
                        }}>
                        {signalType && group ? signalType.message.sentBy : ''}
                      </Text>
                      <Text
                        style={{
                          textTransform: 'lowercase',
                        }}>
                        {signalType && practice
                          ? `${signalType.message.eventType.split('_')[0]}...`
                          : signalType && group
                          ? ` is ${
                              signalType.message.eventType.split('_')[0]
                            }...`
                          : ''}
                      </Text>
                    </Text>
                  ) : (
                    <View />
                  )}
                </View>
              </View>
            ) : null}
          </View>
        ) : (
          <>
            {!backArrow && (
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  flexDirection: 'column',
                  marginHorizontal: 0,
                  marginVertical: 15,
                  width: 40,
                  height: 30,
                  alignItems: 'center',
                  zIndex: 2,
                }}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                <View
                  style={{
                    backgroundColor: colors.text,
                    width: 21,
                    height: 1.6,
                    marginTop: 4,
                    alignSelf: 'flex-start',
                  }}
                />
                <View
                  style={{
                    backgroundColor: colors.primary,
                    width: 10,
                    height: 1.6,
                    marginTop: 4,
                    alignSelf: 'flex-start',
                  }}
                />
              </TouchableOpacity>
            )}
          </>
        )}
        {title && (
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
                fontSize: normalize(14),
                fontFamily: 'SofiaProSemiBold',
                color: colors.text,
              }}>
              {title}
            </Text>
          </View>
        )}
        {/* !searchData.hideTitle */}
        {searchData && (
          <>
            {!searchData.hideTitle ? (
              <TouchableOpacity
                onPress={() => navigation.navigate('PractxSearch')}
                style={{
                  // top: 0,
                  left: 0,
                  // right: 0,
                  // bottom: 0,
                  width: screenWidth - 130,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // position: 'absolute',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: normalize(14),
                    fontFamily: 'SofiaProRegular',
                    color: colors.text,
                  }}>
                  {searchData.name}
                </Text>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  // top: 0,
                  left: 0,
                  // right: 0,
                  // bottom: 0,
                  width: screenWidth - 130,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // position: 'absolute',
                  alignItems: 'center',
                }}
              />
            )}
            <TouchableOpacity
              onPress={() => navigation.navigate('PractxSearch')}
              style={{
                // top: 0,
                left: 0,
                // right: 0,
                // bottom: 0,
                width: screenWidth - 130,
                flexDirection: 'row',
                justifyContent: 'space-between',
                // position: 'absolute',
                alignItems: 'center',
              }}>
              <Icon
                name={'search'}
                type={'ionicon'}
                color={colors.text}
                size={normalize(18)}
                style={{
                  color: colors.text,
                  // alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
          </>
        )}
        {search && (
          <View
            style={{
              width: screenWidth - 130,
              flexDirection: 'row',
              justifyContent: 'space-between',
              // position: 'absolute',
              alignItems: 'center',
            }}>
            <TextInput
              ref={input => {
                setSearchRef(input);
                setTextInput(input);
              }}
              autoFocus={true}
              autoCapitalize={false}
              autoCompleteType={'name'}
              textContentType={'givenName'}
              keyboardType={'default'}
              placeholder={search.placeholder}
              placeholderTextColor={colors.text_2}
              returnKeyType="search"
              onSubmitEditing={() => search.onSubmit()}
              style={{
                color: colors.text,
                fontFamily: 'SofiaProRegular',
                fontSize: normalize(14),
                width: '100%',
              }}
              onChangeText={text => {
                setSearchText(text);
                text.length >= 2 &&
                  setTimeout(() => {
                    search.action(text);
                  }, 0);
              }}
              // onBlur={handleBlur(name)}
              // value={valuesType}
              // onFocus={() => iconLeft && iconLeft.action(false)}
            />
          </View>
        )}
        {search && searchText.length > 0 ? (
          <TouchableOpacity
            style={{
              alignItems: 'center',
              paddingTop: 5,
              zIndex: 20,
              marginLeft: 20,
            }}
            onPress={() => searchRef.clear()}>
            <Icon
              name="x"
              type="feather"
              color={colors.text}
              size={normalize(18)}
              style={{
                color: colors.text,
                // alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
        ) : hideCancel ? null : (
          <>
            {textRight ? null : (
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  paddingTop: 5,
                  zIndex: 20,
                  marginLeft: 20,
                }}
                onPress={() => null}>
                <Icon
                  name="x"
                  type="feather"
                  color={colors.background}
                  size={normalize(18)}
                  style={{
                    color: colors.text,
                    // alignSelf: 'center',
                  }}
                />
              </TouchableOpacity>
            )}
          </>
        )}
        {avatar && (
          <>
            {avatar.url ? (
              <Avatar
                size={normalize(28)}
                rounded
                source={{
                  uri: avatar.url,
                }}
                onPress={avatar.press}
                containerStyle={{ alignSelf: 'center' }}
                // activeOpacity={0.7}
              />
            ) : (
              <Icon
                name="heart-plus-outline"
                // name="stethoscope"
                type="material-community"
                color={colors.text}
                onPress={avatar.press}
                size={normalize(18)}
                style={{
                  color: colors.text,
                  // alignSelf: 'center',
                }}
              />
            )}
          </>
        )}
        {textRight && (
          <Button
            // onPress={handleSubmit}
            TouchableComponent={() => {
              return (
                <TouchableOpacity onPress={() => textRight.press()}>
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: normalize(14),
                      fontFamily: 'SofiaProSemiBold',
                    }}>
                    {textRight.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        )}
        {iconRight1 && (
          <View style={{ flexDirection: 'row' }}>
            {/* {iconRight1.buttonType === 'filter' && (
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
            )} */}

            {iconRight1 && iconRight1.buttonType === 'save' && (
              <Button
                // onPress={handleSubmit}
                TouchableComponent={() => {
                  return isLoading ? (
                    <ActivityIndicator
                      animating={true}
                      size={normalize(18)}
                      color={colors.text}
                    />
                  ) : (
                    <TouchableOpacity onPress={() => iconRight1.onPress()}>
                      <Icon
                        name={iconRight1.name}
                        type={iconRight1.type}
                        color={colors.text}
                        size={
                          iconRight1?.size ? iconRight1.size : normalize(18)
                        }
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
          </View>
        )}
        {chatRight || subgroups ? (
          <View style={{ flexDirection: 'row' }}>
            {chatRight && (
              <>
                <Button
                  // onPress={handleSubmit}
                  TouchableComponent={() => (
                    <TouchableOpacity onPress={() => chatRight[0].onPress()}>
                      <Icon
                        name={chatRight[0].name}
                        type={chatRight[0].type}
                        color={colors.text}
                        size={normalize(18)}
                        style={{
                          borderRadius: 5,
                          // backgroundColor: colors.primary,
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
                        color={colors.text}
                        size={normalize(18)}
                        style={{
                          borderRadius: 5,
                          // backgroundColor: colors.quaternary,
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
            {subgroups &&
              subgroups.data &&
              subgroups.data.groups &&
              subgroups.data.groups.length > 0 && (
                <TouchableOpacity
                  onPress={() => subgroups.onShow(!subgroups.show)}>
                  <Icon
                    name={subgroups.show ? 'arrowup' : 'arrowdown'}
                    type={'antdesign'}
                    color={colors.text}
                    size={normalize(18)}
                    style={{
                      borderRadius: 5,
                      // backgroundColor: colors.quaternary,
                      padding: 5,
                      color: colors.text,
                      marginLeft: 15,
                    }}
                  />
                </TouchableOpacity>
              )}
            {notifyIcon && (
              <TouchableOpacity onPress={() => console.log('hello world')}>
                <Icon
                  name="ios-notifications-outline"
                  type="ionicon"
                  color={colors.text}
                  size={normalize(18)}
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
        ) : null}
      </View>
      {subgroups && subgroups.show && (
        <View
          style={{
            width: '100%',
            alignSelf: 'center',
            flexDirection: 'row',
            marginTop: 0,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              paddingVertical: 7,
              paddingHorizontal: 10,
              color: colors.text_2,
              fontSize: normalize(12),
              fontFamily: 'SofiaProRegular',
            }}>
            Join a group for more conversation ?
          </Text>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              flexDirection: 'row',
              marginTop: 15,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
            {subgroups.data.groups.map(item => (
              <TouchableOpacity
                onPress={() => {
                  // console.log(item);
                  navigation.navigate('ChatScreen', {
                    practice: null,
                    groupPractice: subgroups.groupPractice,
                    group: item,
                    channelName:
                      item &&
                      item.subgroupChats &&
                      item.subgroupChats[0].PatientSubgroup.channelName,
                    practiceDms: subgroups.practiceDms,
                    type: 'group',
                  });
                }}
                style={{
                  marginVertical: 6,
                  marginHorizontal: 10,
                  backgroundColor: colors.primary,
                  borderRadius: 25,
                }}>
                <Text
                  style={{
                    paddingVertical: 7,
                    paddingHorizontal: 10,
                    color: 'white',
                    fontSize: normalize(10),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default Header;
