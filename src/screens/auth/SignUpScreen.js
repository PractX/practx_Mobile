import React, { useEffect, useState, useContext } from 'react';
// import Constants from "expo-constants";
import * as Animatable from 'react-native-animatable';

import { Formik } from 'formik';

import {
  Text,
  Content,
  CheckBox,
  Header,
  Right,
  Body,
  Left,
} from 'native-base';
import { Icon, Button } from 'react-native-elements';
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
import InputBox from '../../components/hoc/InputBox';
import SmallInputBox from '../../components/hoc/SmallInputBox';
import { normalize } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.8;

const SignUpScreen = ({ navigation }) => {
  const { colors } = useTheme();
  /* ---- Remember prev logged in user details in state ------*/

  const [agreeTos, setAgreeTos] = useState(false);

  /* ---- set password vissibility while typing ------*/

  const [passwordVisibility, setPasswordVisibility] = useState(true);

  const signupPatient = async (values) => {
    if (!agreeTos) {
      alert('Please agree to our terms and conditions');
    } else {
      await fetch(
        'http://practxbestaging-env.eba-6m7puu5w.us-east-2.elasticbeanstalk.com/api/auth/patients/signup',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
            dob: `${values.MM}/${values.DD}/${values.YY}`,
            mobileNo: values.mobileNo,
            firstname: values.firstname,
            lastname: values.lastname,
          }),
        },
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.patient) {
            console.log(data.message);
            alert(data.message);
            navigation.navigate('login2');
          } else {
            alert(data.errors);
          }
        });
    }
  };

  return (
    <React.Fragment>
      {/* <Header style={styles.header}>
        <Left>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon type="AntDesign" name="left" style={{ color: theme.text }} />
          </Pressable>
        </Left>
        <Body />
        <Right />
      </Header> */}
      <Content>
        <View
          style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={{ width: '80%' }}>
            {/* ------------------- LOGO SECTION --------------------------------------- */}

            <Animatable.View animation="pulse">
              <Image style={styles.logo} source={LOGO} resizeMode="contain" />

              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Text
                  style={{
                    fontSize: normalize(28),
                    fontFamily: 'SofiaProSemiBold',
                    color: 'white',
                  }}>
                  Get Started
                </Text>

                <Text style={[styles.topText, { color: colors.text_1 }]}>
                  Enter your personal details below for
                </Text>
                <Text style={[styles.topText, { color: colors.text_1 }]}>
                  Signup into practx
                </Text>
              </View>
            </Animatable.View>

            {/* ------------------- FORM SECTION --------------------------------------- */}

            <Animatable.View animation="bounceInLeft" style={{ marginTop: 20 }}>
              <Formik
                initialValues={{
                  firstname: '',
                  lastname: '',
                  DD: '',
                  MM: '',
                  YY: '',
                  mobileNo: '',
                  email: 'itstimiking@gmail.com',
                  password: 'xxxxxx',
                }}
                onSubmit={(values) => {
                  signupPatient(values);
                }}>
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                  <View>
                    <InputBox
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      valuesType={values.firstname}
                      name="firstname"
                      iconName="user"
                      iconType="feather"
                      placeholder="First Name"
                      autoCompleteType="name"
                      textContentType="givenName"
                      keyboardType="default"
                      autoCapitalize="sentences"
                    />
                    <InputBox
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      valuesType={values.lastname}
                      name="lastname"
                      iconName="user"
                      iconType="feather"
                      placeholder="Last Name"
                      autoCompleteType="name"
                      textContentType="familyName"
                      keyboardType="default"
                      autoCapitalize="sentences"
                    />
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

                    {/* --------------------------------------- DATE SECTION --------------------------------------- */}

                    <Text
                      style={{
                        marginTop: 20,
                        color: colors.text_1,
                        fontSize: normalize(14),
                        fontFamily: 'SofiaProRegular',
                      }}>
                      Date of Birth
                    </Text>

                    <View style={styles.formFieldRow}>
                      <SmallInputBox
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        valuesType={values.DD}
                        name="DD"
                        iconName="calendar"
                        iconType="feather"
                        placeholder="DD"
                        autoCompleteType="cc-exp"
                        textContentType="none"
                        keyboardType="numeric"
                        autoCapitalize="none"
                        maxLength={2}
                      />

                      <SmallInputBox
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        valuesType={values.MM}
                        name="MM"
                        iconName="calendar"
                        iconType="feather"
                        placeholder="MM"
                        autoCompleteType="cc-exp-month"
                        textContentType="none"
                        keyboardType="numeric"
                        autoCapitalize="none"
                        maxLength={2}
                      />

                      <SmallInputBox
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        valuesType={values.YY}
                        name="YY"
                        iconName="calendar"
                        iconType="feather"
                        placeholder="YY"
                        autoCompleteType="cc-exp-year"
                        textContentType="none"
                        keyboardType="numeric"
                        autoCapitalize="none"
                        maxLength={4}
                      />
                    </View>

                    <InputBox
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      valuesType={values.mobileNo}
                      name="mobileNo"
                      iconName="phone"
                      iconType="feather"
                      placeholder="Phone"
                      autoCompleteType="tel"
                      textContentType="telephoneNumber"
                      keyboardType="number-pad"
                      autoCapitalize="none"
                    />

                    {/* ------------------- PASSWORD SECTION --------------------------------------- */}

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
                          checked={agreeTos}
                          color={colors.primary}
                          style={styles.spacer}
                          onPress={() => setAgreeTos(!agreeTos)}
                        />
                        <Text
                          style={[
                            styles.whiteFont,
                            {
                              marginBottom: 30,
                              color: colors.text_1,
                              width: appwidth,
                            },
                          ]}>
                          I agree to the
                          <Text
                            style={{
                              fontSize: normalize(13),
                              color: colors.primary,
                              textDecorationStyle: 'solid',
                              textDecorationLine: 'underline',
                            }}>
                            {' '}
                            Privacy policy
                          </Text>{' '}
                          and{' '}
                          <Text
                            style={{
                              fontSize: normalize(13),
                              color: colors.primary,
                              textDecorationStyle: 'solid',
                              textDecorationLine: 'underline',
                            }}>
                            Terms of Services
                          </Text>{' '}
                          of practx
                        </Text>
                      </View>
                    </Animatable.View>

                    {/* ------------------- BUTTON SECTION --------------------------------------- */}

                    <View styel={styles.loginButtonView}>
                      {/*--------------------- SUBMIT ---------------*/}
                      <Button
                        title="Sign Up"
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
                        onPress={() => navigation.popToTop()}>
                        <Text
                          style={[styles.whiteFont, { color: colors.text_1 }]}>
                          Already have an account?
                          <Text
                            style={{
                              color: colors.primary,
                              fontSize: normalize(13),
                              fontFamily: 'SofiaProRegular',
                            }}>
                            {' '}
                            Login
                          </Text>
                        </Text>
                      </Pressable>
                      <View style={{ marginVertical: 30 }} />
                    </View>
                  </View>
                )}
              </Formik>
            </Animatable.View>
          </View>
        </View>
      </Content>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    alignItems: 'center',
  },

  topText: {
    marginTop: 5,
    fontSize: normalize(16),
    fontFamily: 'SofiaProRegular',
  },

  formField: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 7,
    marginTop: 15,
  },
  formTextInput: {
    marginLeft: 20,
    width: '90%',
    fontSize: 16,
  },
  formFieldRow: {
    flexDirection: 'row',
    width: appwidth,
    justifyContent: 'space-between',
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
  },

  whiteFont: {
    fontSize: normalize(13),
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
  },
});

export default SignUpScreen;
