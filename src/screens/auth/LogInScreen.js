import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { Formik } from 'formik';

import { showMessage, hideMessage } from 'react-native-flash-message';

import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import { Button } from 'react-native-elements';
import { Text } from 'native-base';
import { useScrollToTop, useTheme } from '@react-navigation/native';
// import * as Actions from '../redux/auth/actions';
import { LOGO, LOGO2 } from '../../../assets/images';
import InputBox from '../../components/hoc/InputBox';
import { createStructuredSelector } from 'reselect';
import { signInStart } from '../../redux/user/user.actions';
import {
  selectCurrentUser,
  selectIsLoading,
} from '../../redux/user/user.selector';
import { normalize, CheckBox, Icon } from 'react-native-elements';
import PushNotification from 'react-native-push-notification';
import { setPassRem } from '../../redux/settings/settings.actions';
import { selectPassRem } from '../../redux/settings/settings.selector';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.8;

const LogInScreen = ({
  navigation,
  signInStart,
  user,
  isLoading,
  setPassRem,
  passRem,
}) => {
  const [remember, setRemember] = useState(true);
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [logo, setLogo] = useState(LOGO);
  const ref = React.useRef(null);
  const { colors } = useTheme();
  useScrollToTop(ref);
  // const dispatch = useDispatch();
  const login = values => {
    console.log(values);
    // dispatch(Actions.loginPatient(values.email, values.password));
    signInStart(values.email, values.password);
  };
  // const notify = () => {
  //   console.log('Local notify');
  //   PushNotification.localNotificationSchedule({
  //     //... You can use all the options from localNotifications
  //     message: 'My Notification Message', // (required)
  //     date: new Date(Date.now() + 60 * 1000), // in 60 secs
  //     allowWhileIdle: false, // (optional) set notification to work while on doze, default: false

  //     /* Android Only Properties */
  //     repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
  //   });
  // };
  // useEffect(() => {
  //   notify();
  // }, []);
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    console.log(colors.mode);
    if (colors.mode === 'dark') {
      // practxLogo-dark
      setLogo(LOGO);
    } else {
      setLogo(LOGO2);
    }
  }, [colors.mode]);

  return (
    <ScrollView>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={{ width: '80%' }}>
          <Animatable.View animation="pulse">
            <Image style={styles.logo} source={logo} resizeMode="contain" />

            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <Text
                style={{
                  fontSize: normalize(18),
                  fontFamily: 'SofiaProSemiBold',
                  color: colors.text_1,
                  marginBottom: 5,
                }}>
                Welcome Back
              </Text>

              <Text style={[styles.topText, { color: colors.text_1 }]}>
                Enter your Email & Password for
              </Text>
              <Text style={[styles.topText, { color: colors.text_1 }]}>
                Login into practx
              </Text>
            </View>
          </Animatable.View>

          <Animatable.View animation="bounceInLeft" style={{ marginTop: 20 }}>
            <Formik
              initialValues={{
                // email: 'jaskyparrot@gmail.com',
                // password: '@Pass1234',
                // email: '',
                // password: '',
                email: passRem ? passRem.email : '',
                password: passRem ? passRem.password : '',
              }}
              onSubmit={values => {
                console.log('Item Pass Rem', values);
                login(values);
                remember && setPassRem(values);
              }}>
              {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View>
                  <InputBox
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    valuesType={values.email}
                    name="email"
                    iconName="mail"
                    iconType="feather"
                    iconSize={16}
                    placeholder="Email"
                    autoCompleteType="email"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    styling={{
                      input: {
                        fontSize: normalize(14),
                        color: colors.text_1,
                      },
                    }}
                  />
                  <InputBox
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    valuesType={values.password}
                    name="password"
                    iconName="lock-outline"
                    iconType="material-community"
                    iconSize={16}
                    placeholder="Password"
                    autoCompleteType="password"
                    textContentType="password"
                    keyboardType="default"
                    autoCapitalize="none"
                    secureTextEntry={passwordVisibility}
                    styling={{
                      input: {
                        fontSize: normalize(14),
                        color: colors.text_1,
                      },
                    }}
                  />
                  <Animatable.View
                    animation="bounceInRight"
                    style={styles.bellowFormView}>
                    <View style={styles.bellowFormViewtext}>
                      <CheckBox
                        center
                        containerStyle={{ margin: 0, padding: 0 }}
                        // style={{ margin: 0, padding: 0 }}
                        checkedIcon={
                          <Icon
                            name="ios-checkbox"
                            type="ionicon"
                            color={colors.primary}
                            size={20}
                            iconStyle={{ marginRight: 5 }}
                          />
                        }
                        uncheckedIcon={
                          <Icon
                            name="ios-square-outline"
                            type="ionicon"
                            color={colors.primary}
                            size={20}
                            iconStyle={{ marginRight: 5 }}
                          />
                        }
                        checked={remember}
                        onPress={() => setRemember(!remember)}
                      />
                      <Text
                        style={[styles.whiteFont, { color: colors.text_1 }]}>
                        Remember me
                      </Text>
                    </View>

                    <Pressable
                      hitSlop={{ bottom: 10, top: 10 }}
                      onPress={() => navigation.navigate('forgotpass')}
                      style={{ justifyContent: 'center' }}>
                      <Text
                        style={[
                          styles.whiteFont,
                          {
                            color: colors.text_1,
                            textDecorationLine: 'underline',
                            textAlign: 'center',
                          },
                        ]}>
                        Forgot Password
                      </Text>
                    </Pressable>
                  </Animatable.View>
                  <View style={styles.loginButtonView}>
                    <Button
                      title="Log In"
                      onPress={handleSubmit}
                      disabled={
                        !emailRegex.test(values.email) || !values.password
                      }
                      disabledStyle={{
                        backgroundColor: colors.background_1,
                        opacity: 0.5,
                      }}
                      rounded
                      buttonStyle={[
                        styles.loginButton,
                        { backgroundColor: colors.primary },
                      ]}
                      titleStyle={{
                        fontFamily: 'SofiaProSemiBold',
                        fontSize: normalize(14),
                      }}
                      loading={isLoading}
                    />
                    <Pressable
                      style={styles.bellowButtonText}
                      hitSlop={{ bottom: 10, top: 10 }}
                      onPress={() => navigation.navigate('signup')}>
                      <Text
                        style={[styles.whiteFont, { color: colors.text_1 }]}>
                        Dont have an account?{' '}
                        <Text
                          style={{
                            color: colors.primary,
                            fontSize: normalize(12),
                          }}>
                          Sign up
                        </Text>
                      </Text>
                    </Pressable>

                    <Pressable
                      hitSlop={{ bottom: 10, top: 10 }}
                      onPress={() => navigation.navigate('verifyAccount')}>
                      <Text
                        style={{
                          color: colors.primary,
                          fontSize: normalize(12),
                          textAlign: 'center',
                        }}>
                        Verify Account
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </Formik>
          </Animatable.View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    // height: windowHeight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  topText: {
    marginTop: 5,
    fontSize: normalize(14),
    fontFamily: 'SofiaProRegular',
  },

  formField: {
    flexDirection: 'row',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 0,
    marginTop: 15,
    alignItems: 'center',
  },

  formTextInput: {
    marginLeft: 20,
    width: '90%',
    fontSize: normalize(14),
    fontFamily: 'SofiaProRegular',
  },

  formIcons: {
    fontSize: 16,
    alignSelf: 'center',
  },

  flexrow: {
    flexDirection: 'row',
  },

  logo: {
    width: normalize(130),
    height: normalize(130),
    alignSelf: 'center',
    marginTop: Platform.OS === 'ios' ? 30 : 0,
  },

  whiteFont: {
    fontSize: normalize(12),
    fontFamily: 'SofiaProRegular',
  },
  spacer: {
    marginRight: 15,
    borderRadius: 6,
    marginLeft: -10,
    width: 20,
    alignItems: 'center',
  },

  bellowFormView: {
    flexDirection: 'row',
    width: appwidth,
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 25,
  },

  bellowFormViewtext: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  loginButtonView: {
    alignItems: 'center',
  },

  loginButton: {
    width: appwidth,
    justifyContent: 'center',
    fontFamily: 'SofiaProRegular',
    borderRadius: 10,
  },
  bellowButtonText: {
    alignItems: 'center',
    marginTop: windowHeight * 0.05,
    marginBottom: 23,
  },

  error: {
    fontSize: 13,
    color: 'red',
  },
});

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
  isLoading: selectIsLoading,
  passRem: selectPassRem,
});

const mapDispatchToProps = dispatch => ({
  signInStart: (email, password) => dispatch(signInStart({ email, password })),
  setPassRem: data => dispatch(setPassRem(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LogInScreen);
