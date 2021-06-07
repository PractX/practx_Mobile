import React, { useEffect, useState, useContext } from 'react';
// import Constants from "expo-constants";
import * as Animatable from 'react-native-animatable';

import { Text, Content } from 'native-base';
import { Button } from 'react-native-elements';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';

import { LOGO, LOGO2 } from '../../../assets/images';
import { useTheme } from '@react-navigation/native';
import InputBox from '../../components/hoc/InputBox';
import { Formik } from 'formik';
import { normalize } from 'react-native-elements';
import { connect } from 'react-redux';
import { forgetPasswordStart } from '../../redux/user/user.actions';
import { createStructuredSelector } from 'reselect';
import { selectIsLoading } from '../../redux/user/user.selector';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.8;

function ForgotPassScreen({ navigation, isLoading, forgetPasswordStart }) {
  const { colors } = useTheme();
  const [logo, setLogo] = useState(LOGO);
  useEffect(() => {
    console.log(colors.mode);
    if (colors.mode === 'dark') {
      // practxLogo-dark
      setLogo(LOGO);
    } else {
      setLogo(LOGO2);
    }
  }, [colors.mode]);

  const sumbitReqPassReset = (values) => {
    console.log(values);
    forgetPasswordStart(values.email);
    // dispatch(Actions.loginPatient(values.email, values.password));
  };
  return (
    <React.Fragment>
      <Content>
        <View
          style={[styles.container, { backgroundColor: colors.background }]}>
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
                  Reset Password
                </Text>

                <Text style={[styles.topText, { color: colors.text_1 }]}>
                  Enter your email or username below
                </Text>
                <Text style={[styles.topText, { color: colors.text_1 }]}>
                  We will send you an email
                </Text>
              </View>
            </Animatable.View>

            <Animatable.View animation="bounceInLeft" style={{ marginTop: 20 }}>
              <Formik
                initialValues={{
                  email: '',
                }}
                onSubmit={(values) => {
                  sumbitReqPassReset(values);
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
                      styling={{
                        input: {
                          fontSize: normalize(14),
                          color: colors.text_1,
                        },
                      }}
                    />
                    <View style={styles.loginButtonView}>
                      <Button
                        title="Reset Password"
                        onPress={handleSubmit}
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
                        onPress={() => navigation.navigate('signup')}>
                        <Text
                          style={[styles.whiteFont, { color: colors.text_1 }]}>
                          Dont have an account?
                          <Text
                            style={{
                              color: colors.primary,
                              fontSize: normalize(12),
                            }}>
                            {' '}
                            Sign up
                          </Text>
                        </Text>
                      </Pressable>

                      <Pressable
                        style={styles.bellowButtonText2}
                        onPress={() => navigation.popToTop()}>
                        <Text
                          style={[styles.whiteFont, { color: colors.text_1 }]}>
                          Remembered your password?
                          <Text
                            style={{
                              color: colors.primary,
                              fontSize: normalize(12),
                            }}>
                            {' '}
                            Login
                          </Text>
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </Formik>
            </Animatable.View>

            <Animatable.View
              animation="bounceInRight"
              style={styles.bellowFormView}
            />
          </View>
        </View>
      </Content>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight,
    alignItems: 'center',
    marginTop: 30,
  },
  topText: {
    marginTop: 5,
    fontSize: normalize(14),
    fontFamily: 'SofiaProRegular',
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
    marginLeft: -9,
  },

  bellowFormView: {
    flexDirection: 'row',
    width: appwidth,
    justifyContent: 'space-between',
    marginTop: 15,
  },

  bellowFormViewtext: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  loginButtonView: {
    marginTop: 15,
    // width: windowWidth,
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
    marginBottom: 15,
  },
  bellowButtonText2: {
    alignItems: 'center',
  },
});
const mapStateToProps = createStructuredSelector({
  isLoading: selectIsLoading,
});
const mapDispatchToProps = (dispatch) => ({
  forgetPasswordStart: (email) => dispatch(forgetPasswordStart(email)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassScreen);
