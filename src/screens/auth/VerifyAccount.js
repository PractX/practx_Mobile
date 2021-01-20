import React, { useEffect, useState, useContext } from 'react';
import * as Animatable from 'react-native-animatable';

import { Formik } from 'formik';

import { Text, Content, CheckBox } from 'native-base';
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

import { LOGO, LOGO2 } from '../../../assets/images';
import { useTheme } from '@react-navigation/native';
import InputBox from '../../components/hoc/InputBox';
import { normalize } from 'react-native-elements';
import { connect } from 'react-redux';
import { verifyAccount } from '../../redux/user/user.actions';
import { createStructuredSelector } from 'reselect';
import { selectIsLoading } from '../../redux/user/user.selector';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.8;

function VerifyAccount({ navigation, verifyAccount, isLoading }) {
  const { colors } = useTheme();
  const [remember, setRemember] = useState(true);
  const [passwordVisibility, setPasswordVisibility] = useState(true);
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

  const verify = async (values) => {
    verifyAccount(values.verificationKey);
    // try {
    //     await fetch(
    //       'http://practxbestaging-env.eba-6m7puu5w.us-east-2.elasticbeanstalk.com/api/patients/verify',
    //       {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //           verificationKey: values.verificationKey,
    //         }),
    //       },
    //     )
    //       .then((res) => res.json())
    //       .then((data) => {
    //         if (data.patient) {
    //           alert(data.message);
    //           navigation.navigate('login');
    //         } else {
    //           alert(data.error);
    //         }
    //       });
    // } catch (e) {
    //   alert('We had a problem verifying your account');
    // }
  };

  return (
    <Content>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={{ width: '80%' }}>
          <Animatable.View animation="pulse">
            <Image style={styles.logo} source={logo} resizeMode="contain" />

            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text
                style={{
                  fontSize: normalize(25),
                  fontFamily: 'SofiaProSemiBold',
                  color: 'white',
                }}>
                Verify Account
              </Text>

              <Text style={[styles.topText, { color: colors.text_1 }]}>
                Enter verification code sent
              </Text>
              <Text style={[styles.topText, { color: colors.text_1 }]}>
                to your email
              </Text>
            </View>
          </Animatable.View>

          <Animatable.View animation="bounceInLeft" style={{ marginTop: 20 }} />

          <Animatable.View animation="bounceInRight">
            {/*------------------------ FORM SECTION ------------------------------*/}

            <Formik
              initialValues={{ verificationKey: '' }}
              onSubmit={(values) => {
                verify(values);
              }}>
              {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View>
                  <InputBox
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    valuesType={values.verificationKey}
                    name="verificationKey"
                    iconName="key"
                    iconType="feather"
                    placeholder="Verification Key"
                    autoCompleteType="off"
                    textContentType="password"
                    keyboardType="default"
                    autoCapitalize="none"
                    secureTextEntry={passwordVisibility}
                  />

                  {/*--------------------------------------- SUBMIT BUTTON -----------------------------------*/}

                  <View style={styles.loginButtonView}>
                    <Button
                      title="Verify Account"
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
                        Verified your account?
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
        </View>
      </View>
    </Content>
  );
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight,
    alignItems: 'center',
    justifyContent: 'space-around',
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
    width: 400,
    justifyContent: 'space-between',
    marginTop: 15,
  },

  bellowFormViewtext: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
  },

  loginButtonView: {
    // width: '100%',
    alignItems: 'center',
    marginTop: 35,
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
  verifyAccount: (key) => dispatch(verifyAccount(key)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyAccount);
