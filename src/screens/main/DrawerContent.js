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
import { Avatar, Button, Badge, normalize } from 'react-native-elements';
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
// import normalize from '../../normalize';
// import FastImage from 'react-native-fast-image';

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
  const [signOutText, setSignOutText] = useState();
  const [loginText, setLoginText] = useState('Login');
  // const isFocused = useIsFocused();
  const isDrawerOpen = useIsDrawerOpen();

  const toggleSwitch = () => {
    isEnabled ? setTheme('Light') : setTheme('Dark');
    setIsEnabled((previousState) => !previousState);
  };

  // console.log(currentUser);

  const signOut = () => {
    // setSignOutText('Signing Out...');
    // onGoogleButtonPress('signOut').then((res) => {
    //   console.log(res, 'Signed Out of Google!');
    //   // setCurrentUser(additionalUserInfo.profile);
    // });
    signOutStart();
    setTimeout(() => {
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

  // useMemo(() => {
  //   if (!currentUser) {
  //     setSignOutText('Sign Out');
  //   }
  //   console.log(navigation.dangerouslyGetState().index);
  //   colors.mode === 'light' ? setBgImage(BgImg2) : setBgImage(BgImg1);
  //   InteractionManager.runAfterInteractions(() => {
  //     themeMode === 'Dark' ? setIsEnabled(true) : setIsEnabled(false);
  //     // isEnabled ? setTheme('Dark') : setTheme('Light');
  //   });
  //   if (isDrawerOpen) {
  //     // StatusBar.setBackgroundColor(colors.background_1);
  //     NumDownloads(storageDownload).then((res) => {
  //       setMyDownloads(res);
  //     });
  //   }
  //   // console.log('drawer');
  // }, [
  //   colors.mode,
  //   currentUser,
  //   isDrawerOpen,
  //   navigation,
  //   setMyDownloads,
  //   storageDownload,
  //   themeMode,
  // ]);
  // useEffect(() => {

  // }, [isDrawerOpen, setMyDownloads, storageDownload]);
  return (
    <View style={{ flex: 1 }}>
      {/* <FastImage
        source={bgImage}
        style={[styles.userInfoSection]}
        resizeMode={FastImage.resizeMode.cover}
        // placeHolder={<ActivityIndicator />}
      >
        {!currentUser && (
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              marginRight: 8,
              justifyContent: 'flex-end',
            }}>
            <Button
              onPress={() => signIn()}
              title={loginText}
              loading={false}
              icon={
                <Icon
                  name="login"
                  type="antdesign"
                  size={normalize(12)}
                  color={colors.text}
                />
              }
              iconRight
              titleStyle={{
                marginRight: 5,
                color: colors.text,
                // fontWeight: 'normal',
                fontFamily: 'Comfortaa-Bold',
                fontSize: normalize(13),
              }}
              buttonStyle={{
                backgroundColor: colors.background_1,
                alignItems: 'center',
                // width: 100,
                // marginTop: 30,
              }}
            />
          </View>
        )}
        {!currentUser && (
          <View
            style={{
              flexDirection: 'row',
            }}>
            {colors ? (
              <View>
                <Avatar
                  rounded
                  size={60}
                  source={require('../assets/icon/icon_logo.png')}
                  activeOpacity={0.2}
                  titleStyle={{ color: colors.text }}
                  containerStyle={{
                    alignSelf: 'center',
                    backgroundColor: colors.card,
                    borderColor: colors.text_4,
                    borderWidth: 1,
                  }}
                  placeholder={{ backgroundColor: colors.background }}
                />
                {/* <Accessory /> */}
      {/* <Badge
                  status={currentNetState === 'success' ? 'success' : 'error'}
                  badgeStyle={{ width: 12, height: 12, borderRadius: 50 }}
                  containerStyle={{
                    position: 'absolute',
                    bottom: 4,
                    right: 4,
                  }}
                />
              </View>
            ) : (
              <View>
                <Avatar
                  rounded
                  size={60}
                  source={require('../assets/icon/stat_logo.png')}
                  activeOpacity={0.2}
                  titleStyle={{ color: colors.text }}
                  containerStyle={{
                    alignSelf: 'center',
                    backgroundColor: colors.card,
                    borderColor: colors.text_4,
                    borderWidth: 1,
                  }}
                  placeholder={{ backgroundColor: colors.background }}
                />
                {/* <Accessory /> */}
      {/* <Badge
                  status={currentNetState === 'success' ? 'success' : 'error'}
                  badgeStyle={{ width: 12, height: 12, borderRadius: 50 }}
                  containerStyle={{
                    position: 'absolute',
                    bottom: 4,
                    right: 4,
                  }}
                />
              </View>
            )}
          </View>
        )} */}
      {/* {currentUser && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={{
              flexDirection: 'row',
            }}>
            <View>
              <Avatar
                rounded
                size={60}
                source={{
                  uri: currentUser.picture,
                }}
                activeOpacity={0.2}
                titleStyle={{ color: colors.text }}
                containerStyle={{
                  alignSelf: 'center',
                  backgroundColor: colors.card,
                  borderColor: colors.text_4,
                  borderWidth: 1,
                }}
              />
              <Badge
                status={currentNetState === 'success' ? 'success' : 'error'}
                badgeStyle={{ width: 12, height: 12, borderRadius: 50 }}
                containerStyle={{
                  position: 'absolute',
                  bottom: 4,
                  right: 4,
                }}
              />
            </View>
            <View
              style={{
                marginLeft: 15,
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <Title
                style={[
                  styles.title,
                  {
                    color: colors.text,
                    width: 150,
                    flexWrap: 'wrap',
                    flexShrink: 1,
                    fontFamily: 'Comfortaa-Bold',
                  },
                ]}>
                {currentUser.name}
              </Title>
              <Caption
                style={[
                  styles.caption,
                  {
                    width: 150,
                    color: colors.text,
                    flexWrap: 'wrap',
                    flexShrink: 1,
                    fontFamily: 'Comfortaa-Regular',
                  },
                ]}>
                @{currentUser.email.split('@')[0]}
              </Caption>
            </View>
          </TouchableOpacity>
        )}

        {currentUser && (
          <View style={styles.row}> */}
      {/* <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  80
                </Paragraph>
                <Caption style={styles.caption}>Following</Caption>
              </View> */}
      {/* <View style={styles.section}>
              <Paragraph
                style={[
                  styles.paragraph,
                  // styles.caption,
                  {
                    color: colors.text,
                    lineHeight: 14,
                    fontSize: normalize(13),
                  },
                ]}>
                {(myDownloads && myDownloads.totalDownloads) || '0'}
              </Paragraph>
              <Caption style={[styles.caption, { color: colors.text }]}>
                Downloads
              </Caption>
            </View>
          </View>
        )}
      </FastImage> */}
      <DrawerContentScrollView>
        {/* <View style={styles.drawerContent}> */}
        {/* <View> */}

        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            labelStyle={{
              fontFamily: 'Comfortaa-Bold',
              fontSize: normalize(13),
              // color: colors.text,
            }}
            inactiveTintColor={colors.text}
            activeTintColor={colors.primary}
            focused={
              navigation.dangerouslyGetState().index === 0 ? true : false
            }
            activeBackgroundColor={null}
            icon={({ color, size }) => (
              <Icon name="home" type="antdesign" color={color} size={size} />
            )}
            label="Home"
            onPress={() => {
              requestAnimationFrame(() => {
                navigation.navigate(
                  'HomeTabs',
                  // , {
                  //   screen: 'Home',
                  // }
                );
              });
            }}
          />
          <DrawerItem
            labelStyle={{
              fontFamily: 'Comfortaa-Bold',
              fontSize: normalize(13),
              // color: colors.text,
            }}
            inactiveTintColor={colors.text}
            activeTintColor={colors.primary}
            focused={
              navigation.dangerouslyGetState().index === 1 ? true : false
            }
            activeBackgroundColor={null}
            icon={({ color, size }) => (
              <Icon
                name="download-cloud"
                type="feather"
                color={color}
                size={size}
              />
            )}
            label="My Downloads"
            onPress={() => {
              requestAnimationFrame(() => {
                navigation.navigate(
                  'MyDownloadsTabs',
                  //  {
                  //   screen: 'MyInstagram',
                  // }
                );
              });
            }}
          />
          <DrawerItem
            labelStyle={{
              fontFamily: 'Comfortaa-Bold',
              fontSize: normalize(13),
              // color: colors.text,
            }}
            inactiveTintColor={colors.text}
            activeTintColor={colors.primary}
            focused={
              navigation.dangerouslyGetState().index === 2 ? true : false
            }
            activeBackgroundColor={null}
            icon={({ color, size }) => (
              <Icon name="whatsapp" type="fontisto" color={color} size={size} />
            )}
            label={({ focused, color }) => (
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    color,
                    alignItems: 'flex-start',
                    // justifyContent: 'center',
                    fontSize: normalize(13),
                    fontFamily: 'Comfortaa-Bold',
                    flexDirection: 'column',
                  }}>
                  {/* {focused ? 'Focused text' : 'Unfocused text'} */}
                  WhatsApp Status
                </Text>
                <Text
                  style={{
                    fontWeight: 'normal',
                    top: -5,
                    left: 5,
                    color: colors.secondary,
                    fontSize: normalize(11),
                    fontFamily: 'Comfortaa-Bold',
                  }}>
                  pro
                </Text>
              </View>
            )}
            onPress={() => {
              requestAnimationFrame(() => {
                navigation.navigate(
                  'WhatsAppTabs',
                  //  {
                  //   screen: 'MyInstagram',
                  // }
                );
              });
            }}
          />
          <DrawerItem
            labelStyle={{
              fontFamily: 'Comfortaa-Bold',
              fontSize: normalize(13),
              // color: colors.text,
            }}
            inactiveTintColor={colors.text}
            activeTintColor={colors.primary}
            focused={
              navigation.dangerouslyGetState().index === 3 ? true : false
            }
            activeBackgroundColor={null}
            icon={({ color, size }) => (
              <Icon
                name="instagram"
                type="fontisto"
                color={color}
                size={size}
              />
            )}
            label={({ focused, color }) => (
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    color,
                    alignItems: 'flex-start',
                    // justifyContent: 'center',
                    fontSize: normalize(13),
                    flexDirection: 'column',
                    fontFamily: 'Comfortaa-Bold',
                  }}>
                  {/* {focused ? 'Focused text' : 'Unfocused text'} */}
                  Instagram
                </Text>
                <Text
                  style={{
                    fontWeight: 'normal',
                    top: -5,
                    left: 5,
                    color: colors.secondary,
                    fontSize: normalize(11),
                    fontFamily: 'Comfortaa-Bold',
                  }}>
                  pro
                </Text>
              </View>
            )}
            onPress={() => {
              requestAnimationFrame(() => {
                navigation.navigate(
                  'InstagramPro',
                  //  {
                  //   screen: 'MyInstagram',
                  // }
                );
              });
            }}
          />
          <DrawerItem
            labelStyle={{
              fontFamily: 'Comfortaa-Bold',
              fontSize: normalize(13),
            }}
            inactiveTintColor={colors.text}
            activeTintColor={colors.primary}
            focused={
              navigation.dangerouslyGetState().index === 10 ? true : false
            }
            activeBackgroundColor={null}
            icon={({ color, size }) => (
              <Icon name="setting" type="antdesign" color={color} size={size} />
            )}
            label="Settings"
            onPress={() => {
              requestAnimationFrame(() => {
                navigation.navigate(
                  'SettingsScreen',
                  //  {
                  //   screen: 'MyInstagram',
                  // }
                );
              });
            }}
          />
          <DrawerItem
            labelStyle={{
              fontFamily: 'Comfortaa-Bold',
              fontSize: normalize(13),
              // color: colors.primary,
            }}
            inactiveTintColor={colors.text}
            activeTintColor={colors.primary}
            activeBackgroundColor={null}
            focused={
              navigation.dangerouslyGetState().index === 11 ? true : false
            }
            icon={({ color, size }) => (
              <Icon name="like2" type="antdesign" color={color} size={size} />
            )}
            label="Help & Feedback"
            onPress={() => {
              requestAnimationFrame(() => {
                navigation.navigate(
                  'HelpFeedBackScreen',
                  //  {
                  //   screen: 'MyInstagram',
                  // }
                );
              });
            }}
          />
          <View style={styles.preference}>
            {isEnabled ? (
              <Icon name="moon" color={colors.text} type="entypo" size={20} />
            ) : (
              <Icon name="sun" color={colors.text} type="feather" size={20} />
            )}
            <Text
              style={{
                color: colors.text,
                paddingRight: 10,
                fontFamily: 'Comfortaa-Bold',
                fontSize: normalize(13),
              }}>
              Dark Theme
            </Text>
            <Switch
              // trackColor={{ false: '#767577', true: '#81b0ff' }}
              // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={
                // requestAnimationFrame(() => {
                toggleSwitch
                // })
              }
              value={isEnabled}
            />
          </View>
        </Drawer.Section>
        {/* <Drawer.Section style={{ color: 'white' }}> */}

        {/* </Drawer.Section>s */}
        {/* </View> */}
      </DrawerContentScrollView>

      {/* <Drawer.Section
        style={[
          styles.bottomDrawerSection,
          { borderWidth: 0 },
          // { borderTopWidth: 1, borderColor: colors.background_1 },
        ]}> */}
      {currentUser && (
        <DrawerItem
          style={[
            styles.bottomDrawerSection,
            { borderWidth: 0 },
            { borderTopWidth: 1, borderColor: colors.background_1 },
          ]}
          labelStyle={{
            fontFamily: 'Comfortaa-Bold',
            color: colors.text,
            fontSize: normalize(13),
          }}
          icon={({ size }) => (
            <Icon
              name="logout"
              type="antdesign"
              color={colors.text}
              size={size}
            />
          )}
          label={signOutText || 'Sign Out'}
          onPress={() => {
            signOut();
          }}
        />
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
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: normalize(16),
    marginTop: 3,
    // fontWeight: 'bold',
  },
  caption: {
    fontSize: normalize(12),
    lineHeight: 14,
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
  },
  bottomDrawerSection: {
    marginBottom: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
