import React, { useEffect, useState, useContext } from 'react';
// import Constants from "expo-constants";
import * as Animatable from 'react-native-animatable';

import { Formik } from 'formik';

import {
  Button,
  Text,
  Content,
  CheckBox,
  Icon,
  Header,
  Right,
  Body,
  Left,
} from 'native-base';

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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.8;

const theme = {
  /* ---- THeme to be gotten from redux or context------*/
  background: '#1e1f36',
  highlight: '#ff0000',
  text: '#fff',
  text2: '#aaa',
  text3: '#555',
};

function LogInScreen({ navigation }) {
  {
    /* ---- Remember prev logged in user details in state ------*/
  }
  const [agreeTos, setAgreeTos] = useState(false);

  {
    /* ---- set password vissibility while typing ------*/
  }
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
      <Header style={styles.header}>
        <Left>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon type="AntDesign" name="left" style={{ color: theme.text }} />
          </Pressable>
        </Left>
        <Body />
        <Right />
      </Header>
      <Content>
        <View style={styles.container}>
          <View style={{ width: '80%' }}>
            {/* ------------------- LOGO SECTION --------------------------------------- */}

            <Animatable.View animation="pulse">
              <Image style={styles.logo} source={LOGO} resizeMode="contain" />

              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Text
                  style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>
                  Get Started
                </Text>

                <Text style={styles.topText}>Enter your details bellow</Text>
                <Text style={styles.topText}>to register</Text>
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
                    <View style={styles.formField}>
                      <Icon
                        type="FontAwesome"
                        name="envelope-o"
                        style={styles.formIcons}
                      />

                      <TextInput
                        autoCapitalize="none"
                        autoCompleteType="username"
                        textContentType="username"
                        placeholder="Email"
                        placeholderTextColor={theme.text3}
                        style={styles.formTextInput}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                      />
                    </View>

                    <View style={styles.formField}>
                      <Icon
                        type="FontAwesome"
                        name="user-circle-o"
                        style={styles.formIcons}
                      />
                      <TextInput
                        autoCapitalize="words"
                        autoCompleteType="name"
                        placeholder="First Name"
                        textContentType="givenName"
                        placeholderTextColor={theme.text3}
                        style={styles.formTextInput}
                        onChangeText={handleChange('firstname')}
                        onBlur={handleBlur('firstname')}
                        value={values.firstname}
                      />
                    </View>

                    <View style={styles.formField}>
                      <Icon
                        type="FontAwesome"
                        name="user-circle-o"
                        style={styles.formIcons}
                      />
                      <TextInput
                        autoCapitalize="words"
                        autoCompleteType="name"
                        placeholder="Last Name"
                        textContentType="familyName"
                        placeholderTextColor={theme.text3}
                        style={styles.formTextInput}
                        onChangeText={handleChange('lastname')}
                        onBlur={handleBlur('lastname')}
                        value={values.lastname}
                      />
                    </View>

                    {/* --------------------------------------- DATE SECTION --------------------------------------- */}

                    <Text
                      style={{
                        marginTop: 20,
                        color: theme.text2,
                        marginLeft: 10,
                        fontSize: 14,
                      }}>
                      Date of Birth
                    </Text>

                    <View style={styles.formFieldRow}>
                      <View
                        style={{ ...styles.formField, width: appwidth * 0.25 }}>
                        <Icon
                          type="FontAwesome"
                          name="calendar"
                          style={styles.formIcons}
                        />
                        <TextInput
                          autoCapitalize="none"
                          autoCompleteType="cc-exp"
                          placeholder="DD"
                          maxLength={2}
                          placeholderTextColor={theme.text3}
                          style={{ marginLeft: 10 }}
                          onChangeText={handleChange('DD')}
                          onBlur={handleBlur('DD')}
                          value={values.DD}
                        />
                      </View>

                      <View
                        style={{ ...styles.formField, width: appwidth * 0.25 }}>
                        <Icon
                          type="FontAwesome"
                          name="calendar"
                          style={styles.formIcons}
                        />
                        <TextInput
                          autoCapitalize="none"
                          autoCompleteType="cc-exp-month"
                          placeholder="MM"
                          maxLength={2}
                          placeholderTextColor={theme.text3}
                          style={{ marginLeft: 10 }}
                          onChangeText={handleChange('MM')}
                          onBlur={handleBlur('MM')}
                          value={values.MM}
                        />
                      </View>
                      <View
                        style={{ ...styles.formField, width: appwidth * 0.25 }}>
                        <Icon
                          type="FontAwesome"
                          name="calendar"
                          style={styles.formIcons}
                        />
                        <TextInput
                          autoCapitalize="none"
                          autoCompleteType="cc-exp-year"
                          placeholder="YY"
                          maxLength={4}
                          placeholderTextColor={theme.text3}
                          style={{ marginLeft: 10 }}
                          onChangeText={handleChange('YY')}
                          onBlur={handleBlur('YY')}
                          value={values.YY}
                        />
                      </View>
                    </View>

                    {/* ------------------- PASSWORD SECTION --------------------------------------- */}

                    <View style={styles.formField}>
                      <Icon
                        type="FontAwesome"
                        name="lock"
                        style={styles.formIcons}
                      />
                      <TextInput
                        autoCapitalize="none"
                        autoCompleteType="password"
                        textContentType="password"
                        placeholder="Password"
                        placeholderTextColor={theme.text3}
                        secureTextEntry={passwordVisibility}
                        style={{ marginLeft: 26, ...styles.formTextInput }}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                      />
                    </View>

                    <View style={styles.formField}>
                      <Icon
                        type="FontAwesome"
                        name="phone"
                        style={styles.formIcons}
                      />
                      <TextInput
                        autoCapitalize="none"
                        autoCompleteType="tel"
                        textContentType="telephoneNumber"
                        placeholder="Phone Number"
                        placeholderTextColor={theme.text3}
                        style={{ marginLeft: 26, ...styles.formTextInput }}
                        onChangeText={handleChange('mobileNo')}
                        onBlur={handleBlur('mobileNo')}
                        value={values.mobileNo}
                      />
                    </View>

                    <Animatable.View
                      animation="bounceInRight"
                      style={styles.bellowFormView}>
                      <View style={styles.bellowFormViewtext}>
                        <CheckBox
                          checked={agreeTos}
                          color={theme.highlight}
                          style={styles.spacer}
                          onPress={() => setAgreeTos(!agreeTos)}
                        />
                        <Text
                          style={{
                            ...styles.whiteFont,
                            marginBottom: 30,
                            fontSize: 11,
                            width: appwidth,
                          }}>
                          I agree to the
                          <Text
                            style={{
                              fontSize: 11,
                              color: theme.highlight,
                              textDecorationStyle: 'solid',
                              textDecorationLine: 'underline',
                            }}>
                            {' '}
                            Privacy policy
                          </Text>{' '}
                          and{' '}
                          <Text
                            style={{
                              fontSize: 11,
                              color: theme.highlight,
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
                      <Pressable
                        onPress={handleSubmit}
                        android_ripple={{ color: 'green' }}>
                        <Button rounded style={styles.loginButton}>
                          <View style={styles.flexrow}>
                            <Text style={styles.logInButtonText}>Sign Up</Text>
                          </View>
                        </Button>
                      </Pressable>

                      <Pressable
                        style={styles.bellowButtonText}
                        onPress={() => navigation.popToTop()}>
                        <Text style={styles.whiteFont}>
                          Already have an account?
                          <Text
                            style={{ color: theme.highlight, fontSize: 13 }}>
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
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    alignItems: 'center',
    backgroundColor: theme.background,
  },

  header: {
    backgroundColor: theme.background,
    // marginTop: Constants.statusBarHeight,
    paddingVertical: 10,
  },

  topText: {
    marginTop: 10,
    fontSize: 13,
    color: theme.text2,
  },

  formField: {
    flexDirection: 'row',
    borderColor: theme.text,
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
    color: theme.text3,
    fontSize: 16,
    alignSelf: 'center',
  },

  textInput: {
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.text,
    marginTop: 20,
    width: appwidth,
    padding: 5,
    color: theme.text,
    borderRadius: 10,
    paddingLeft: 20,
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
    color: theme.text2,
    fontSize: 12,
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
    width: windowWidth,
    alignItems: 'center',
  },

  loginButton: {
    backgroundColor: theme.highlight,
    width: appwidth,
    justifyContent: 'center',
    borderRadius: 10,
  },

  logInButtonText: {
    fontWeight: 'bold',
    fontSize: 17,
    color: theme.text,
  },
  bellowButtonText: {
    alignItems: 'center',
    marginTop: windowHeight * 0.05,
  },
});

export default LogInScreen;
