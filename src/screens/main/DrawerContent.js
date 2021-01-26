import React, { useMemo, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Switch,
  Text,
  InteractionManager,
  ImageBackground,
  StatusBar,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import {
  Avatar as TextAvatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  TouchableRipple,
} from 'react-native-paper';
// import BgImg1 from '../assets/icon/bg.png';
// import BgImg2 from '../assets/icon/bg0.png';
// import Logo from '../assets/icon/logo.png';s
// import { Avatar, Button, Badge, normalize } from 'react-native-elements';
import {
  DrawerContentScrollView,
  DrawerItem,
  useIsDrawerOpen,
} from '@react-navigation/drawer';
import { Icon } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';
import { connect } from 'react-redux';
import { setTheme } from '../../redux/settings/settings.actions';
import {
  selectDownloadStorage,
  selectNetState,
  selectOnScroll,
  selectThemeMode,
} from '../../redux/settings/settings.selector';
import { createStructuredSelector } from 'reselect';
import {
  setCurrentUser,
  setMyDownloads,
  signOutStart,
} from '../../redux/user/user.actions';
// import onGoogleButtonPress from '../helpers/onGoogleButtonPress';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  selectCurrentUser,
  selectMyDownload,
} from '../../redux/user/user.selector';
import { showMessage } from 'react-native-flash-message';
// import NumDownloads from '../helpers/numDownloads';
// import { SvgXml } from 'react-native-svg';
// import { checkInternetConnection } from 'react-native-offline';
import normalize from '../../utils/normalize';
import FastImage from 'react-native-fast-image';
import { Formik } from 'formik';
import InputBox from '../../components/hoc/InputBox';
import ToggleSwitch from 'toggle-switch-react-native';
import { Keyboard } from 'react-native';

const DrawerContent = ({
  navigation,
  setTheme,
  themeMode,
  currentUser,
  setCurrentUser,
  signOutStart,
  myDownloads,
  setMyDownloads,
  currentNetState,
  storageDownload,
}) => {
  const { colors } = useTheme();
  // const route = useRoute();
  const [isEnabled, setIsEnabled] = useState(false);
  const [bgImage, setBgImage] = useState(null);
  const [signOutText, setSignOutText] = useState('Logout');
  const [loginText, setLoginText] = useState('Login');
  // const isFocused = useIsFocused();
  const isDrawerOpen = useIsDrawerOpen();

  const toggleSwitch = () => {
    isEnabled ? setTheme('Light') : setTheme('Dark');
    setIsEnabled((previousState) => !previousState);
  };

  // console.log(currentUser);

  const signOut = () => {
    setSignOutText('Logging Out...');
    // onGoogleButtonPress('signOut').then((res) => {
    //   console.log(res, 'Signed Out of Google!');
    //   // setCurrentUser(additionalUserInfo.profile);
    // });
    setTimeout(() => {
      signOutStart();
      showMessage({
        message: 'Logout successful',
        type: 'success',
      });
    }, 2500);
  };

  const signIn = () => {
    setLoginText('Logging In...');
    // onGoogleButtonPress('signIn')
    //   .then(({ additionalUserInfo }) => {
    //     console.log(additionalUserInfo.profile, 'Signed in with Google!');
    //     setCurrentUser(additionalUserInfo.profile);
    //     setLoginText('Login');
    //   })
    //   .catch((error) => setLoginText('Login'));
  };
  const search = (value) => {
    console.log(value);
  };
  useMemo(() => {
    Keyboard.dismiss();
    if (!currentUser) {
      setSignOutText('Log Out');
    }
    console.log(navigation.dangerouslyGetState().index);

    InteractionManager.runAfterInteractions(() => {
      themeMode === 'Dark' ? setIsEnabled(true) : setIsEnabled(false);
      // isEnabled ? setTheme('Dark') : setTheme('Light');
      themeMode === 'Dark'
        ? StatusBar.setBarStyle('light-content')
        : StatusBar.setBarStyle('dark-content');
    });
    // if (isDrawerOpen) {

    //   NumDownloads(storageDownload).then((res) => {
    //     setMyDownloads(res);
    //   });
    // }
    // console.log('drawer');
  }, [currentUser, navigation, themeMode]);
  // useEffect(() => {
  //   console.log(currentUser);
  // }, []);
  return (
    <View style={{ flex: 1 }}>
      <View
        style={[
          styles.userInfoSection,
          { borderBottomWidth: 0.8, borderBottomColor: colors.background_1 },
        ]}>
        <FastImage
          source={{
            uri:
              'https://api.duniagames.co.id/api/content/upload/file/8143860661599124172.jpg',
          }}
          style={{
            width: 65,
            height: 65,
            borderRadius: 15,
            backgroundColor: colors.background_1,
          }}
          resizeMode={FastImage.resizeMode.cover}
          // placeHolder={<ActivityIndicator />}
        />

        <View
          style={{
            marginLeft: 10,
            flexDirection: 'column',
            marginVertical: 2,
            // alignItems: 'center',
          }}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                // width: 150,
                // flexWrap: 'wrap',
                // flexShrink: 1,
                fontFamily: 'SofiaProSemiBold',
              },
            ]}>
            {/* {currentUser.firstname} */}
            {currentUser
              ? currentUser.firstname.length + currentUser.lastname.length > 18
                ? currentUser.firstname
                : currentUser.firstname + ' ' + currentUser.lastname
              : ''}
          </Text>
          <TouchableOpacity
            onPress={() => {
              requestAnimationFrame(() => {
                navigation.navigate(
                  'Profile',
                  // , {
                  //   screen: 'Home',
                  // }
                );
              });
            }}
            style={{
              // flexDirection: 'row',
              marginVertical: 2,
            }}>
            <Text
              style={[
                styles.caption,
                {
                  // width: 150,
                  color: colors.secondary,
                  // flexWrap: 'wrap',
                  // flexShrink: 1,
                  fontFamily: 'SofiaProRegular',
                },
              ]}>
              View and Edit profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/*  */}
      <View style={styles.drawerContent}>
        {/* <View> */}

        <Drawer.Section style={styles.drawerSection}>
          <Formik
            initialValues={{
              search: '',
            }}
            onSubmit={(values) => {
              search(values);
            }}>
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View style={{ paddingBottom: 10 }}>
                <InputBox
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  valuesType={values.email}
                  name="email"
                  iconName="search"
                  iconType="feather"
                  iconColor={colors.text}
                  iconSize={16}
                  placeholder="Search"
                  placeholderTextColor={colors.text}
                  autoCompleteType="off"
                  textContentType="none"
                  keyboardType="default"
                  autoCapitalize="none"
                  boxStyle={{ height: 40, width: '87%', alignSelf: 'center' }}
                  styling={{
                    input: {
                      color: colors.text,
                      alignSelf: 'center',
                      fontSize: normalize(15),
                    },
                    icon: { color: colors.text, alignSelf: 'center' },
                  }}
                />
              </View>
            )}
          </Formik>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              marginBottom: 60,
            }}>
            {/* -------------------------------- Services -------------------------------- */}
            <View
              style={{
                borderBottomWidth: 0.8,
                borderBottomColor: colors.background_1,
                marginTop: 10,
                paddingBottom: 10,
              }}>
              <View
                style={{
                  width: '85%',
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    fontSize: normalize(14),
                    fontFamily: 'SofiaProSemiBold',
                    color: colors.primary_light,
                  }}>
                  Services
                </Text>
              </View>
              <DrawerItem
                labelStyle={{
                  fontFamily: 'SofiaProSemiBold',
                  fontSize: normalize(16),
                  paddingLeft: 3,
                  // color: colors.text,
                }}
                inactiveTintColor={colors.text}
                activeTintColor={colors.secondary}
                focused={
                  navigation.dangerouslyGetState().index === 1 ? true : false
                }
                activeBackgroundColor={null}
                label="Add Group"
                onPress={() => {
                  requestAnimationFrame(() => {
                    navigation.navigate(
                      'AddGroup',
                      // , {
                      //   screen: 'Home',
                      // }
                    );
                  });
                }}
              />
              <DrawerItem
                labelStyle={{
                  fontFamily: 'SofiaProSemiBold',
                  fontSize: normalize(16),
                  paddingLeft: 3,
                  // color: colors.text,
                }}
                inactiveTintColor={colors.text}
                activeTintColor={colors.secondary}
                focused={
                  navigation.dangerouslyGetState().index === 2 ? true : false
                }
                activeBackgroundColor={null}
                label="Notifications"
                onPress={() => {
                  requestAnimationFrame(() => {
                    navigation.navigate(
                      'AddGroup',
                      // , {
                      //   screen: 'Home',
                      // }
                    );
                  });
                }}
              />
              <DrawerItem
                labelStyle={{
                  fontFamily: 'SofiaProSemiBold',
                  fontSize: normalize(16),
                  paddingLeft: 3,
                  // color: colors.text,
                }}
                inactiveTintColor={colors.text}
                activeTintColor={colors.secondary}
                focused={
                  navigation.dangerouslyGetState().index === 3 ? true : false
                }
                activeBackgroundColor={null}
                label="Appointments"
                onPress={() => {
                  requestAnimationFrame(() => {
                    navigation.navigate(
                      'AddGroup',
                      // , {
                      //   screen: 'Home',
                      // }
                    );
                  });
                }}
              />
              <DrawerItem
                labelStyle={{
                  fontFamily: 'SofiaProSemiBold',
                  fontSize: normalize(16),
                  paddingLeft: 3,
                  // color: colors.text,
                }}
                inactiveTintColor={colors.text}
                activeTintColor={colors.secondary}
                focused={
                  navigation.dangerouslyGetState().index === 3 ? true : false
                }
                activeBackgroundColor={null}
                label="Chats"
                onPress={() => {
                  requestAnimationFrame(() => {
                    navigation.navigate(
                      'AddGroup',
                      // , {
                      //   screen: 'Home',
                      // }
                    );
                  });
                }}
              />
            </View>

            {/* ---------------------------- Customer Support ---------------------------- */}
            <View
              style={{
                // borderBottomWidth: 0.8,
                // borderBottomColor: colors.background_1,
                marginTop: 20,
                paddingBottom: 10,
              }}>
              <View
                style={{
                  width: '85%',
                  // backgroundColor: 'red',
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    fontSize: normalize(14),
                    fontFamily: 'SofiaProSemiBold',
                    color: colors.primary_light,
                  }}>
                  Customer support
                </Text>
              </View>
              <DrawerItem
                labelStyle={{
                  fontFamily: 'SofiaProSemiBold',
                  fontSize: normalize(16),
                  paddingLeft: 3,
                  // color: colors.text,
                }}
                inactiveTintColor={colors.text}
                activeTintColor={colors.secondary}
                focused={
                  navigation.dangerouslyGetState().index === 2 ? true : false
                }
                activeBackgroundColor={null}
                label="Settings"
                onPress={() => {
                  requestAnimationFrame(() => {
                    navigation.navigate(
                      'AddGroup',
                      // , {
                      //   screen: 'Home',
                      // }
                    );
                  });
                }}
              />
              <DrawerItem
                labelStyle={{
                  fontFamily: 'SofiaProSemiBold',
                  fontSize: normalize(16),
                  paddingLeft: 3,
                  // color: colors.text,
                }}
                inactiveTintColor={colors.text}
                activeTintColor={colors.secondary}
                focused={
                  navigation.dangerouslyGetState().index === 4 ? true : false
                }
                activeBackgroundColor={null}
                label="FAQ"
                onPress={() => {
                  requestAnimationFrame(() => {
                    navigation.navigate(
                      'AddGroup',
                      // , {
                      //   screen: 'Home',
                      // }
                    );
                  });
                }}
              />
              <DrawerItem
                labelStyle={{
                  fontFamily: 'SofiaProSemiBold',
                  fontSize: normalize(16),
                  paddingLeft: 3,
                  // color: colors.text,
                }}
                inactiveTintColor={colors.text}
                activeTintColor={colors.secondary}
                focused={
                  navigation.dangerouslyGetState().index === 5 ? true : false
                }
                activeBackgroundColor={null}
                label="Help Center"
                onPress={() => {
                  requestAnimationFrame(() => {
                    navigation.navigate(
                      'AddGroup',
                      // , {
                      //   screen: 'Home',
                      // }
                    );
                  });
                }}
              />
            </View>

            <View style={styles.preference}>
              {/* {isEnabled ? (
                <Icon name="moon" color={colors.text} type="entypo" size={20} />
              ) : (
                <Icon name="sun" color={colors.text} type="feather" size={20} />
              )} */}
              <ToggleSwitch
                isOn={isEnabled}
                onColor={colors.background_1}
                offColor={colors.background_1}
                size="medium"
                onToggle={(isOn) => toggleSwitch()}
                icon={
                  isEnabled ? (
                    <Icon
                      name="moon"
                      color={colors.background}
                      type="ionicon"
                      size={13}
                    />
                  ) : (
                    <Icon
                      name="sun"
                      color={colors.text}
                      type="feather"
                      size={13}
                    />
                  )
                }
              />
              {isEnabled ? (
                <Text
                  style={{
                    color: colors.text,
                    paddingLeft: 20,
                    fontFamily: 'SofiaProSemiBold',
                    fontSize: normalize(16),
                    // textAlign: 'center',
                  }}>
                  Dark
                </Text>
              ) : (
                <Text
                  style={{
                    color: colors.text,
                    paddingLeft: 10,
                    fontFamily: 'SofiaProSemiBold',
                    fontSize: normalize(16),
                  }}>
                  Light
                </Text>
              )}
              {/* <Switch
                // trackColor={{ false: '#767577', true: '#81b0ff' }}
                // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={
                  // requestAnimationFrame(() => {
                  toggleSwitch
                  // })
                }
                value={isEnabled}
              /> */}
            </View>
          </ScrollView>
        </Drawer.Section>
        {/* <Drawer.Section style={{ color: 'white' }}> */}

        {/* </Drawer.Section>s */}
      </View>
      {/* </DrawerContentScrollView> */}

      {/* <Drawer.Section
        style={[
          styles.bottomDrawerSection,
          { borderWidth: 0 },
          // { borderTopWidth: 1, borderColor: colors.background_1 },
        ]}> */}
      {currentUser && (
        <View style={{ backgroundColor: colors.background }}>
          <DrawerItem
            style={[
              styles.bottomDrawerSection,
              {
                width: '75%',
                alignSelf: 'center',
                borderTopWidth: 1,
                borderColor: colors.background_1,
              },
            ]}
            labelStyle={{
              fontFamily: 'SofiaProSemiBold',
              color: colors.text,
              fontSize: normalize(16),
            }}
            label={signOutText || 'Log Out'}
            onPress={() => {
              signOut();
            }}
          />
        </View>
      )}
      {/* </Drawer.Section> */}
    </View>
  );
};
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: normalize(16),
    // paddingLeft: 3,
    marginTop: 3,
    // fontWeight: 'bold',
  },
  caption: {
    fontSize: normalize(12),
    // lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    // fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 0,
    marginLeft: 20,
    marginRight: 20,
  },
  bottomDrawerSection: {
    marginTop: 5,
  },
  preference: {
    flexDirection: 'row',
    // alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
});

const mapStateToProps = createStructuredSelector({
  themeMode: selectThemeMode,
  onScroll: selectOnScroll,
  currentUser: selectCurrentUser,
  myDownloads: selectMyDownload,
  currentNetState: selectNetState,
  storageDownload: selectDownloadStorage,
});
const mapDispatchToProps = (dispatch) => ({
  setTheme: (mode) => dispatch(setTheme(mode)),
  setCurrentUser: (data) => dispatch(setCurrentUser(data)),
  signOutStart: () => dispatch(signOutStart()),
  setMyDownloads: (data) => dispatch(setMyDownloads(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);
