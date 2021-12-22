import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  BackHandler,
  SafeAreaView,
} from 'react-native';
// import Header from '../components/HomeHeader';
import * as Animatable from 'react-native-animatable';
import {
  Avatar,
  ListItem,
  Icon,
  Button,
  Badge,
  normalize,
} from 'react-native-elements';
import {
  useTheme,
  useScrollToTop,
  useIsFocused,
} from '@react-navigation/native';
// import Spinner from 'react-native-spinkit';
// import DeviceInfo from 'react-native-device-info';
// import onGoogleButtonPress from '../helpers/onGoogleButtonPress';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// import { setCurrentUser, setMyDownloads } from '../redux/user/user.actions';
// import Error from '../components/Error';
// import NumDownloads from '../helpers/numDownloads';
// import AdBanner from '../helpers/adBanner';
// import {
//   selectNetState,
// } from '../redux/settings/settings.selector';
// import normalize from '../../normalize';
import { SvgXml } from 'react-native-svg';
import FeedbackImg from '../../../../assets/svg/feedback.svg';
import CardView from 'react-native-cardview';
import email from 'react-native-email';
import { selectCurrentUser } from '../../../redux/user/user.selector';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import Header from '../../../components/hoc/Header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import InAppReview from 'react-native-in-app-review';

const HelpFeedBack = ({
  navigation,
  currentUser,
  setCurrentUser,
  myDownloads,
  setMyDownloads,
  currentNetState,
  storageDownload,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const ref = React.useRef(null);
  const isFocused = useIsFocused();
  const [homeLoaded, setHomeLoaded] = useState(false);
  useScrollToTop(ref);
  const { colors } = useTheme();
  const [viewSubmit, setViewSubmit] = useState(false);
  const [comment, setComment] = useState('');
  const [reactionState, setReactionState] = useState(1);
  const [style1, setStyle1] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const isDrawerOpen = useIsDrawerOpen();
  const [onRate, setOnRate] = useState(false);
  const [reactionInfoState, setReactionInfoState] = useState({
    type: 1,
    msg: '❤️ I love this app',
  });
  const [keyBoardFocused, setKeyBoardFocused] = useState(false);

  const handleEmail = () => {
    const to = ['joshmatparrot@gmail.com']; // string or array of email addresses
    email(to, {
      // Optional additional arguments
      // cc: ['bazzy@moo.com', 'doooo@daaa.com'], // string or array of email addresses
      // bcc: 'mee@mee.com', // string or array of email addresses
      subject: 'Experience using WaveDownloader',
      body: `Title:  ${reactionInfoState.msg}\n\nRating:  ${
        (5 - reactionState === 4 && '🌟🌟🌟🌟') ||
        (5 - reactionState === 3 && '⭐⭐⭐') ||
        (5 - reactionState === 2 && '⭐⭐') ||
        (5 - reactionState === 1 && '⭐')
      }\n\nComment:  ${comment}`,
    }).catch(console.error);
  };

  const handleWhatsapp = () => {
    const body = `*My Experience when using WaveDownloader*\n\nTitle:  ${
      reactionInfoState.msg
    }\n\nRating:  ${
      (5 - reactionState === 4 && '🌟🌟🌟🌟') ||
      (5 - reactionState === 3 && '⭐⭐⭐') ||
      (5 - reactionState === 2 && '⭐⭐') ||
      (5 - reactionState === 1 && '⭐')
    }\n\nComment:  ${comment}`;
    let URL = 'whatsapp://send?text=' + body + '&phone=234' + '09035982285';

    Linking.openURL(URL)
      .then(data => {
        console.log('WhatsApp Opened');
        setComment('');
      })
      .catch(() => {
        Alert.alert('Make sure Whatsapp is installed on your device');
      });
  };

  useMemo(() => {
    setIsLoading(true);
    // DeviceInfo.getDeviceName().then((deviceName) => {
    //   console.log(deviceName);
    // });
    if (isFocused) {
      StatusBar.setBackgroundColor(colors.background_1);
      console.log(myDownloads);
    }
    // return () => {
    //   StatusBar.setBackgroundColor(colors.background);
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, setMyDownloads, currentUser, colors.background_1]);
  useEffect(() => {
    // InAppReview.isAvailable();

    // trigger UI InAppreview

    const keyboardHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyBoardFocused(false);
    });
    const keyboardShow = Keyboard.addListener('keyboardDidShow', () => {
      setKeyBoardFocused(true);
    });
    return () => {
      keyboardHide.remove();
      keyboardShow.remove();
    };
  }, []);

  useEffect(() => {
    if (isDrawerOpen) {
      setStyle1('open');
      console.log('Open');
    } else {
      setStyle1('close');
      console.log('Close');
    }
  }, [isDrawerOpen]);

  return (
    <SafeAreaView
      style={[
        style1 === 'open' && {
          borderWidth: 18,
          // borderColor: colors.background_1,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: colors.background_1,
          borderRightColor: 'transparent',
          flex: 1,
          // borderRadius: 240,
          borderTopLeftRadius: 110,
          borderBottomLeftRadius: 110,
        },
      ]}>
      <View
        style={[
          style1 === 'open' && {
            backgroundColor: colors.background,
            height: '100%',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            // Android
            elevation: 3,
            borderRadius: 30,
            overflow: 'hidden',
            opacity: 0.1,
          },
        ]}>
        <Header
          navigation={navigation}
          title="Notifications"
          hideCancel={true}
          // iconRight1={{
          //   name: 'calendar-plus-o',
          //   type: 'font-awesome',
          //   size: normalize(20),
          //   // onPress: () => bottomSheetRef.current.snapTo(0),
          //   onPress: () => navigation.navigate('AppointmentBooking'),
          //   buttonType: 'save',
          // }}
          // notifyIcon={true}
        />
        <KeyboardAwareScrollView>
          <SvgXml
            style={{ alignSelf: 'center', marginBottom: 20, marginTop: 60 }}
            width="180"
            height="180"
            xml={FeedbackImg}
          />

          <CardView
            style={{
              // position: keyBoardFocused ? 'absolute' : null,
              // top: keyBoardFocused ? '30%' : null,
              width: '80%',
              alignSelf: 'center',
              backgroundColor: colors.background,
              marginHorizontal: 30,
              borderBottomWidth: 1,
            }}
            cardElevation={4}
            cardMaxElevation={9}
            cornerRadius={10}>
            <Text
              style={{
                fontSize: normalize(15),
                fontFamily: 'Comfortaa-Bold',
                color: colors.text,
                textAlign: 'center',
                paddingVertical: 20,
              }}>
              Please rate your experience
            </Text>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <Icon
                onPress={() => setReactionState(1)}
                name="emoji-flirt"
                type="entypo"
                color={reactionState === 1 ? colors.primary : colors.text}
                size={normalize(30)}
              />
              <Icon
                onPress={() => setReactionState(2)}
                name="emoji-happy"
                type="entypo"
                color={reactionState === 2 ? colors.primary : colors.text}
                size={normalize(30)}
              />
              <Icon
                onPress={() => setReactionState(3)}
                name="emoji-neutral"
                type="entypo"
                color={reactionState === 3 ? colors.primary : colors.text}
                size={normalize(30)}
              />
              <Icon
                onPress={() => setReactionState(4)}
                name="emoji-sad"
                type="entypo"
                color={reactionState === 4 ? colors.primary : colors.text}
                size={normalize(30)}
              />
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                paddingLeft: 20,
                paddingRight: 20,
                backgroundColor: colors.background,
                paddingTop: 20,
                paddingBottom: 10,
              }}>
              {/* <Icon
              name="comment"
              type="feather"
              color={colors.text}
              size={normalize(17)}
            /> */}
              <ScrollView
                style={{ marginBottom: 20, flexDirection: 'row' }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyboardDismissMode="none"
                keyboardShouldPersistTaps="handled"
                // alwaysBounceHorizontal={true}
              >
                <TouchableOpacity
                  onPress={() =>
                    setReactionInfoState({ type: 1, msg: '❤️ I love this app' })
                  }
                  style={{
                    backgroundColor:
                      reactionInfoState.type === 1
                        ? colors.primary
                        : colors.background_1,
                    borderRadius: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    marginHorizontal: 5,
                  }}>
                  <Text
                    style={{
                      color:
                        reactionInfoState.type === 1 ? 'white' : colors.text,
                      fontFamily: 'Comfortaa-Bold',
                      fontSize: normalize(12),
                    }}>
                    ❤️ I love this app
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setReactionInfoState({ type: 2, msg: 'Report a bug 🐛' })
                  }
                  style={{
                    backgroundColor:
                      reactionInfoState.type === 2
                        ? colors.primary
                        : colors.background_1,
                    borderRadius: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    marginHorizontal: 5,
                  }}>
                  <Text
                    style={{
                      color:
                        reactionInfoState.type === 2 ? 'white' : colors.text,
                      fontFamily: 'Comfortaa-Bold',
                      fontSize: normalize(12),
                    }}>
                    Report a bug 🐛
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setReactionInfoState({
                      type: 3,
                      msg: 'App always crash 💥',
                    })
                  }
                  style={{
                    backgroundColor:
                      reactionInfoState.type === 3
                        ? colors.primary
                        : colors.background_1,
                    borderRadius: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    marginHorizontal: 5,
                  }}>
                  <Text
                    style={{
                      color:
                        reactionInfoState.type === 3 ? 'white' : colors.text,
                      fontFamily: 'Comfortaa-Bold',
                      fontSize: normalize(12),
                    }}>
                    App always crash 💥
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setReactionInfoState({
                      type: 4,
                      msg: 'Difficult to use 😓',
                    })
                  }
                  style={{
                    backgroundColor:
                      reactionInfoState.type === 4
                        ? colors.primary
                        : colors.background_1,
                    borderRadius: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    marginHorizontal: 5,
                  }}>
                  <Text
                    style={{
                      color:
                        reactionInfoState.type === 4 ? 'white' : colors.text,
                      fontFamily: 'Comfortaa-Bold',
                      fontSize: normalize(12),
                    }}>
                    Difficult to use 😓
                  </Text>
                </TouchableOpacity>
              </ScrollView>
              <TextInput
                placeholderTextColor={colors.text_4}
                blurOnSubmit={true}
                onFocus={() => setKeyBoardFocused(true)}
                onBlur={() => setKeyBoardFocused(false)}
                multiline={true}
                numberOfLines={6}
                returnKeyType="done"
                style={[
                  styles.searchInput,
                  {
                    width: '100%',
                    height: 80,
                    color: colors.text,
                    fontFamily: 'Comfortaa-Light',
                    fontSize: normalize(12),
                    backgroundColor: colors.background_1,
                    textAlignVertical: 'top',
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    textAlign: 'auto',
                    borderRadius: 10,
                  },
                ]}
                value={comment}
                // onSubmitEditing={handleSubmit}
                onChangeText={data => setComment(data)}
                placeholder={
                  (reactionInfoState.type === 1 && 'How can we improve?') ||
                  (reactionInfoState.type === 2 &&
                    'Please tell us about the bug') ||
                  (reactionInfoState.type === 3 &&
                    'Please tell us about how it happened') ||
                  (reactionInfoState.type === 4 &&
                    'Please tell us the area you are finding difficult to use')
                }
                // autoCapitalize="none"
              />
            </View>
          </CardView>
          {isFocused && (
            <Animatable.View
              animation={'fadeInUp'}
              duration={2000}
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',

                // marginTop: Dimensions.get('window').height / 7,
              }}>
              <Button
                onPress={handleWhatsapp}
                title="Submit"
                type="outline"
                icon={
                  <Icon
                    name="logo-whatsapp"
                    type="ionicon"
                    size={normalize(16)}
                    color={colors.primary}
                    style={{ paddingHorizontal: 5 }}
                  />
                }
                iconLeft
                titleStyle={{
                  paddingRight: 5,
                  color: colors.primary,
                  fontSize: normalize(14),
                  fontFamily: 'Comfortaa-Bold',
                }}
                buttonStyle={{
                  // backgroundColor: colors.primary,
                  alignSelf: 'center',
                  marginHorizontal: 10,
                  borderColor: colors.primary,
                  borderWidth: 1,
                  borderRadius: 10,
                  width: 100,
                  marginTop: 15,
                  padding: 5,
                }}
              />
              <Button
                onPress={handleEmail}
                title="Submit"
                type="outline"
                icon={
                  <Icon
                    name="mail-outline"
                    type="ionicon"
                    size={normalize(16)}
                    color={colors.primary}
                    style={{ paddingHorizontal: 5 }}
                  />
                }
                iconLeft
                titleStyle={{
                  paddingRight: 5,
                  color: colors.primary,
                  fontSize: normalize(14),
                  fontFamily: 'Comfortaa-Bold',
                }}
                buttonStyle={{
                  // backgroundColor: colors.primary,
                  marginHorizontal: 10,
                  borderColor: colors.primary,
                  borderWidth: 1,
                  borderRadius: 10,
                  width: 100,
                  marginTop: 15,
                  padding: 5,
                }}
              />
            </Animatable.View>
          )}
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  name: {
    marginTop: 10,
    alignSelf: 'center',
    // fontWeight: 'bold',s
    fontSize: normalize(18),
    textTransform: 'capitalize',
  },
  email: {
    marginTop: 10,
    // marginBottom: 30,
    alignSelf: 'center',
    // fontWeight: 'bold',
    fontSize: normalize(14),
  },
  spinner: {
    alignSelf: 'center',
    margin: 169.5,
  },
});

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  // myDownloads: selectMyDownload,
  // currentNetState: selectNetState,
  // storageDownload: selectDownloadStorage,
});
const mapDispatchToProps = dispatch => ({
  // setCurrentUser: data => dispatch(setCurrentUser(data)),
  // setMyDownloads: data => dispatch(setMyDownloads(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(HelpFeedBack);
