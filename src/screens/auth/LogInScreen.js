import React, { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { Formik } from 'formik';

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
import { Icon, Button } from 'react-native-elements';
import { Text, Content, CheckBox } from 'native-base';
import { useScrollToTop, useTheme } from '@react-navigation/native';

// import * as Actions from '../redux/auth/actions';

import { LOGO } from '../../../assets/images';
import { normalize } from 'react-native-elements';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.8;

const LogInScreen = ({ navigation }) => {
  const [remember, setRemember] = useState(true);
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const ref = React.useRef(null);
  const { colors } = useTheme();
  useScrollToTop(ref);
  // const dispatch = useDispatch();

  const login = (values) => {
    // dispatch(Actions.loginPatient(values.email, values.password));
  };

  return (
    <Content>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={{ width: '80%' }}>
          <Animatable.View animation="pulse">
            <Image style={styles.logo} source={LOGO} resizeMode="contain" />

            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <Text
                style={{
                  fontSize: normalize(28),
                  fontFamily: 'SofiaProSemiBold',
                  color: 'white',
                }}>
                Welcome Backs
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
                  <View
                    style={[
                      styles.formField,
                      {
                        backgroundColor: colors.background_1,
                      },
                    ]}>
                    <Icon
                      name={'mail'}
                      type={'feather'}
                      color={colors.text_1}
                      size={normalize(19)}
                      style={[
                        styles.formIcons,
                        { color: colors.text_1, alignSelf: 'center' },
                      ]}
                    />

                    <TextInput
                      autoCapitalize="none"
                      autoCompleteType="username"
                      textContentType="username"
                      placeholder="Email"
                      placeholderTextColor={colors.text_1}
                      style={[styles.formTextInput, { color: colors.text_1 }]}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                    />
                  </View>

                  <View
                    style={[
                      styles.formField,
                      {
                        backgroundColor: colors.background_1,
                      },
                    ]}>
                    <Icon
                      name={'lock-outline'}
                      type={'material-community'}
                      color={colors.text_1}
                      size={normalize(19)}
                      style={[
                        styles.formIcons,
                        { color: colors.text_1, alignSelf: 'center' },
                      ]}
                    />
                    <TextInput
                      autoCapitalize="none"
                      autoCompleteType="password"
                      textContentType="password"
                      placeholder="Password"
                      placeholderTextColor={colors.text_1}
                      secureTextEntry={passwordVisibility}
                      style={[styles.formTextInput, { color: colors.text_1 }]}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                    />
                  </View>

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

                  <View styel={styles.loginButtonView}>
                    <Pressable
                      onPress={handleSubmit}
                      android_ripple={{ color: 'green' }}>
                      <Button
                        title="Log In"
                        rounded
                        buttonStyle={[
                          styles.loginButton,
                          { backgroundColor: colors.primary },
                        ]}
                        loading={false}
                      />
                    </Pressable>
                    <Pressable
                      style={styles.bellowButtonText}
                      hitSlop={{ bottom: 10, top: 10 }}
                      onPress={() => navigation.navigate('signup')}>
                      <Text
                        style={[styles.whiteFont, { color: colors.text_1 }]}>
                        Dont have an account?{' '}
                        <Text style={{ color: colors.primary, fontSize: 13 }}>
                          Sign up
                        </Text>
                      </Text>
                    </Pressable>

                    <Pressable
                      hitSlop={{ bottom: 10, top: 10 }}
                      onPress={() => navigation.navigate('login2')}>
                      <Text
                        style={{
                          color: colors.primary,
                          fontSize: 13,
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
    width: windowWidth,
    alignItems: 'center',
  },

  loginButton: {
    width: appwidth,
    justifyContent: 'center',
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

export default LogInScreen;
