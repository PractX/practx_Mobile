import React, { useEffect, useState, useContext } from 'react';
import * as Animatable from 'react-native-animatable';

import { Formik } from 'formik';

import { Button, Text, Content, CheckBox, Icon } from 'native-base';

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
  background: '#1e1f36',
  highlight: '#ff0000',
  text: '#fff',
  text2: '#aaa',
  text3: '#555',
};

function LogInScreen2({ navigation }) {
  const [remember, setRemember] = useState(true);
  const [passwordVisibility, setPasswordVisibility] = useState(true);

  const verify = async (values) => {
    try {
      await fetch(
        'http://practxbestaging-env.eba-6m7puu5w.us-east-2.elasticbeanstalk.com/api/patients/verify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            verificationKey: values.verificationKey,
          }),
        },
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.patient) {
            alert(data.message);
            navigation.navigate('login');
          } else {
            alert(data.error);
          }
        });
    } catch (e) {
      alert('We had a problem verifying your account');
    }
  };

  return (
    <Content>
      <View style={styles.container}>
        <View style={{ width: '100%' }}>
          <Animatable.View animation="pulse">
            <Image style={styles.logo} source={LOGO} resizeMode="contain" />

            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text
                style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>
                Welcome Back
              </Text>

              <Text style={styles.topText}>Verify your account</Text>
              <Text style={styles.topText}>
                Enter verification code from your email bellow
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
                  <View style={styles.formField}>
                    <Icon
                      type="FontAwesome"
                      name="envelope-o"
                      style={styles.formIcons}
                    />

                    <TextInput
                      autoCapitalize="none"
                      autoCompleteType="off"
                      textContentType="none"
                      placeholder="Verification key"
                      placeholderTextColor={theme.text3}
                      style={styles.formTextInput}
                      onChangeText={handleChange('verificationKey')}
                      onBlur={handleBlur('verificationKey')}
                      value={values.verificationKey}
                    />
                  </View>

                  {/*--------------------------------------- SUBMIT BUTTON -----------------------------------*/}

                  <View styel={styles.verify}>
                    <Pressable
                      onPress={handleSubmit}
                      android_ripple={{ color: 'green' }}>
                      <Button rounded style={styles.loginButton}>
                        <View style={styles.flexrow}>
                          <Text style={styles.logInButtonText}>
                            Verify My Account
                          </Text>
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
    width: '100%',
    height: windowHeight,
    paddingHorizontal: 40,
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
    marginBottom: 40,
    width: appwidth,
  },
  formTextInput: {
    marginLeft: 20,
    width: '90%',
    fontSize: 16,
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
    width: '100%',
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

export default LogInScreen2;
