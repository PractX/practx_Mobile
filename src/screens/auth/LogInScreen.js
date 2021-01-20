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
  Alert,
  AccessibilityInfo,
} from 'react-native';
import { Button } from 'react-native-elements';
import { Text, Content, CheckBox } from 'native-base';
import { useScrollToTop, useTheme } from '@react-navigation/native';
// import * as Actions from '../redux/auth/actions';
import { LOGO, LOGO2 } from '../../../assets/images';
import { normalize } from 'react-native-elements';
import InputBox from '../../components/hoc/InputBox';
import { createStructuredSelector } from 'reselect';
import { signInStart } from '../../redux/user/user.actions';
import {
  selectCurrentUser,
  selectIsLoading,
} from '../../redux/user/user.selector';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.8;

const LogInScreen = ({ navigation, signInStart, user, isLoading }) => {
  const [remember, setRemember] = useState(true);
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [logo, setLogo] = useState(LOGO);
  const ref = React.useRef(null);
  const { colors } = useTheme();
  useScrollToTop(ref);
  // const dispatch = useDispatch();
  const login = (values) => {
    console.log(values);
    // dispatch(Actions.loginPatient(values.email, values.password));
    signInStart(values.email, values.password);
  };

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
    <Content>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={{ width: '80%' }}>
          <Animatable.View animation="pulse">
            <Image style={styles.logo} source={logo} resizeMode="contain" />

            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <Text
                style={{
                  fontSize: normalize(28),
                  fontFamily: 'SofiaProSemiBold',
                  color: 'white',
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
                email: 'itstimiking@gmail.com',
                password: 'xxxxxx',
              }}
              onSubmit={(values) => {
                login(values);
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
                    placeholder="Email"
                    autoCompleteType="email"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <InputBox
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    valuesType={values.password}
                    name="password"
                    iconName="lock-outline"
                    iconType="material-community"
                    placeholder="Password"
                    autoCompleteType="password"
                    textContentType="password"
                    keyboardType="default"
                    autoCapitalize="none"
                    secureTextEntry={passwordVisibility}
                  />
                  <Animatable.View
                    animation="bounceInRight"
                    style={styles.bellowFormView}>
                    <View style={styles.bellowFormViewtext}>
                      <CheckBox
                        checked={remember}
                        color={colors.primary}
                        style={styles.spacer}
                        onPress={() => setRemember(!remember)}
                      />
                      <Text
                        style={[styles.whiteFont, { color: colors.text_1 }]}>
                        Remember me
                      </Text>
                    </View>

                    <Pressable
                      hitSlop={{ bottom: 10, top: 10 }}
                      onPress={() => navigation.navigate('forgotpass')}>
                      <Text
                        style={[
                          styles.whiteFont,
                          {
                            color: colors.text_1,
                            textDecorationLine: 'underline',
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
                      rounded
                      buttonStyle={[
                        styles.loginButton,
                        { backgroundColor: colors.primary },
                      ]}
                      titleStyle={{
                        fontFamily: 'SofiaProSemiBold',
                        fontSize: normalize(16),
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
                            fontSize: normalize(14),
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
                          fontSize: normalize(14),
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
    </Content>
  );
};

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topText: {
    marginTop: 5,
    fontSize: normalize(16),
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
    fontSize: normalize(17),
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
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: -40,
  },

  whiteFont: {
    fontSize: normalize(14),
    fontFamily: 'SofiaProRegular',
  },
  spacer: {
    marginRight: 15,
    borderRadius: 6,
    marginLeft: -10,
    width: 22,
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
});

const mapDispatchToProps = (dispatch) => ({
  signInStart: (email, password) => dispatch(signInStart({ email, password })),
});

export default connect(mapStateToProps, mapDispatchToProps)(LogInScreen);
