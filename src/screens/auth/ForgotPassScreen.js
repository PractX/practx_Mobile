import React, { useEffect, useState, useContext } from 'react';
// import Constants from "expo-constants";
import * as Animatable from 'react-native-animatable';

import {
  Button,
  Text,
  Content,
  CheckBox,
  Container,
  Icon,
  Header,
  Body,
  Left,
  Right,
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
  background: '#1e1f36',
  highlight: '#ff0000',
  text: '#fff',
  text2: '#aaa',
  text3: '#555',
};

function ForgotPassScreen({ navigation }) {
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
            <Animatable.View animation="pulse">
              <Image style={styles.logo} source={LOGO} resizeMode="contain" />

              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Text
                  style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>
                  Reset Password
                </Text>

                <Text style={styles.topText}>
                  Enter your email / username bellow
                </Text>
                <Text style={styles.topText}>We will send you an email</Text>
              </View>
            </Animatable.View>

            <Animatable.View animation="bounceInLeft" style={{ marginTop: 20 }}>
              <View style={styles.formField}>
                <Icon
                  type="FontAwesome"
                  name="envelope-o"
                  style={styles.formIcons}
                />
                <TextInput
                  autoCapitalize="none"
                  autoCompleteType="email"
                  textContentType="username"
                  placeholder="Email"
                  placeholderTextColor={theme.text3}
                  style={styles.formTextInput}
                />
              </View>
            </Animatable.View>

            <Animatable.View
              animation="bounceInRight"
              style={styles.bellowFormView}
            />
          </View>

          <View styel={styles.loginButtonView}>
            <Button rounded style={styles.loginButton}>
              <View style={styles.flexrow}>
                <Text style={styles.logInButtonText}>Reset Password</Text>
              </View>
            </Button>

            <Pressable
              style={styles.bellowButtonText}
              onPress={() => navigation.navigate('signup')}>
              <Text style={styles.whiteFont}>
                Dont have an account?
                <Text style={{ color: theme.highlight, fontSize: 13 }}>
                  {' '}
                  Sign up
                </Text>
              </Text>
            </Pressable>

            <Pressable
              style={styles.bellowButtonText2}
              onPress={() => navigation.popToTop()}>
              <Text style={styles.whiteFont}>
                Remembered your details?
                <Text style={{ color: theme.highlight, fontSize: 13 }}>
                  {' '}
                  Login
                </Text>
              </Text>
            </Pressable>
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
    backgroundColor: theme.background,
  },
  topText: {
    marginTop: 10,
    fontSize: 13,
    color: theme.text2,
  },
  header: {
    backgroundColor: theme.background,
    // marginTop: Constants.statusBarHeight,
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
    marginTop: 10,
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
  bellowButtonText2: {
    alignItems: 'center',
  },
});

export default ForgotPassScreen;
