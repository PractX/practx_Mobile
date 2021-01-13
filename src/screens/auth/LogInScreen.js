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
import { Button, Text, Content, CheckBox, Icon } from 'native-base';
import { useScrollToTop } from '@react-navigation/native';

// import * as Actions from '../redux/auth/actions';

import { LOGO } from '../../../assets/images';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.8;

const theme = {
  background: '#1e1f36',
  highlight: '#ff0000',
  text: '#fff',
  text2: '#aaa',
  text3: '#555',
};

const LogInScreen = ({ navigation }) => {
  const [remember, setRemember] = useState(true);
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const ref = React.useRef(null);
  useScrollToTop(ref);
  // const dispatch = useDispatch();

  const login = (values) => {
    // dispatch(Actions.loginPatient(values.email, values.password));
  };

  return (
    <Content>
      <View style={styles.container}>
        <View style={{ width: '80%' }}>
          <Animatable.View animation="pulse">
            <Image style={styles.logo} source={LOGO} resizeMode="contain" />

            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text
                style={{
                  fontSize: 25,
                  fontFamily: 'SofiaProBold',
                  color: 'white',
                }}>
                Welcome Backs
              </Text>

              <Text style={styles.topText}>
                Enter your email and Password for
              </Text>
              <Text style={styles.topText}>Login into practx</Text>
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

                  <Animatable.View
                    animation="bounceInRight"
                    style={styles.bellowFormView}>
                    <View style={styles.bellowFormViewtext}>
                      <CheckBox
                        checked={remember}
                        color={theme.highlight}
                        style={styles.spacer}
                        onPress={() => setRemember(!remember)}
                      />
                      <Text style={styles.whiteFont}>Remember me</Text>
                    </View>

                    <Pressable
                      hitSlop={{ bottom: 10, top: 10 }}
                      onPress={() => navigation.navigate('forgotpass')}>
                      <Text style={styles.whiteFont}>Forgot Password</Text>
                    </Pressable>
                  </Animatable.View>

                  <View styel={styles.loginButtonView}>
                    <Pressable
                      onPress={handleSubmit}
                      android_ripple={{ color: 'green' }}>
                      <Button rounded style={styles.loginButton}>
                        <View style={styles.flexrow}>
                          <Text style={styles.logInButtonText}>Login</Text>
                        </View>
                      </Button>
                    </Pressable>
                    <Pressable
                      style={styles.bellowButtonText}
                      hitSlop={{ bottom: 10, top: 10 }}
                      onPress={() => navigation.navigate('signup')}>
                      <Text style={styles.whiteFont}>
                        Dont have an account?{' '}
                        <Text style={{ color: theme.highlight, fontSize: 13 }}>
                          Sign up
                        </Text>
                      </Text>
                    </Pressable>

                    <Pressable
                      hitSlop={{ bottom: 10, top: 10 }}
                      onPress={() => navigation.navigate('login2')}>
                      <Text
                        style={{
                          color: theme.highlight,
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
    backgroundColor: theme.background,
    justifyContent: 'space-around',
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
    color: theme.text,
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

  error: {
    fontSize: 13,
    color: 'red',
  },
});

export default LogInScreen;
