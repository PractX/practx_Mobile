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
} from 'react-native';

import { LOGO } from '../../../assets/images';
import { useTheme } from '@react-navigation/native';
import InputBox from '../../components/hoc/InputBox';
import { Formik } from 'formik';
import { normalize } from 'react-native-elements';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.8;

function ForgotPassScreen({ navigation }) {
  const { colors } = useTheme();

  const sumbitReqPassReset = (values) => {
    console.log(values);
    // dispatch(Actions.loginPatient(values.email, values.password));
  };
  return (
    <React.Fragment>
      <Content>
        <View
          style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={{ width: '80%' }}>
            <Animatable.View animation="pulse">
              <Image style={styles.logo} source={LOGO} resizeMode="contain" />

              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Text
                  style={{
                    fontSize: normalize(25),
                    fontFamily: 'SofiaProSemiBold',
                    color: 'white',
                  }}>
                  Reset Password
                </Text>

                <Text style={[styles.topText, { color: colors.text_1 }]}>
                  Enter your email / username bellow
                </Text>
                <Text style={[styles.topText, { color: colors.text_1 }]}>
                  We will send you an email
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
                      keyboardType="email"
                      autoCapitalize="none"
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
                          fontSize: normalize(16),
                        }}
                        loading={false}
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
                              fontSize: normalize(14),
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
                              fontSize: normalize(14),
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
  },
  topText: {
    marginTop: 5,
    fontSize: normalize(16),
    fontFamily: 'SofiaProRegular',
  },

  flexrow: {
    flexDirection: 'row',
  },

  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
  },

  whiteFont: {
    fontSize: normalize(14),
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

export default ForgotPassScreen;
