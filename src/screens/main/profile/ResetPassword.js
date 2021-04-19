import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Dimensions,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Text, Content } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '../../../components/hoc/Header';
import { DrawerActions, useRoute, useTheme } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectCurrentUser,
  selectIsLoading,
} from '../../../redux/user/user.selector';
import { normalize } from 'react-native-elements';
import { ListItem, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import InputBox from '../../../components/hoc/InputBox';
import SmallInputBox from '../../../components/hoc/SmallInputBox';
import { changePassword } from '../../../redux/user/user.actions';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const ResetPassword = ({
  navigation,
  route,
  currentUser,
  extraData,
  changePassword,
  isLoading,
}) => {
  const { colors } = useTheme();
  const inputRef = useRef();
  // const props = useRoute();
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [style1, setStyle1] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [imageUri, setImageUri] = useState();

  const saveChanges = () => {
    // console.log(imageUri);
    // console.log(inputRef.current.values);
    // console.log(newData);
    changePassword({ ...inputRef.current.values });
  };

  useEffect(() => {
    console.log(inputRef);
    extraData.setOptions({
      drawerLockMode: 'locked-closed',
      swipeEnabled: false,
    });

    return () =>
      extraData.setOptions({
        drawerLockMode: 'locked-closed',
        swipeEnabled: true,
      });
  }, [extraData]);

  return (
    <SafeAreaView
      style={[
        style1 === 'open' && {
          borderWidth: 18,
          // borderColor: colors.background_1,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: colors.background_1,
          borderRightColor: 'transparent',
          flex: 1,
          // borderRadius: 240,
          borderTopLeftRadius: 110,
          borderBottomLeftRadius: 110,
        },
      ]}>
      <View
        style={[
          style1 === 'open' && {
            // borderWidth: 20,
            backgroundColor: colors.background,
            height: '100%',
            // zIndex: 100,
            // IOS
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            // Android
            elevation: 3,
            borderRadius: 30,
            overflow: 'hidden',
          },
        ]}>
        <Header
          navigation={navigation}
          title="Reset Password"
          backArrow={true}
          iconRight1={{
            name: 'ios-save-outline',
            type: 'ionicon',
            onPress: saveChanges,
            buttonType: 'save',
          }}
          isLoading={isLoading}
        />
        <KeyboardAwareScrollView
          // keyboardShouldPersistTaps={'always'}
          // style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          style={{
            width: style1 === 'open' ? appwidth - 50 : appwidth,
            alignSelf: 'center',
            marginTop: 50,
          }}>
          <Animatable.View animation="bounceInLeft" style={{ marginTop: 0 }}>
            <Formik
              innerRef={inputRef}
              initialValues={{
                oldPassword: '',
                newPassword: '',
              }}
              // onSubmit={(values) => {
              //   // signupPatient(values);
              //   console.log('Lets go');
              // }}
            >
              {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View style={{ marginBottom: 10 }}>
                  <View
                    style={{
                      marginVertical: 20,
                      flexDirection: 'column',
                    }}>
                    <View
                      style={{
                        alignSelf: 'center',
                        alignItems: 'center',
                        width: 100,
                        height: 100,
                      }}>
                      <FastImage
                        source={{
                          uri: imageUri ? imageUri.uri : currentUser.avatar,
                          // values.avatar
                          //   ? values.avatar
                          //   : 'https://api.duniagames.co.id/api/content/upload/file/8143860661599124172.jpg',
                        }}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 50,
                          backgroundColor: colors.background_1,
                          alignSelf: 'center',
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    </View>
                    <View
                      style={{
                        marginLeft: 10,
                        flexDirection: 'column',
                        marginVertical: 5,
                        paddingHorizontal: 4,
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: colors.text,
                          fontSize: normalize(14),
                          fontFamily: 'SofiaProSemiBold',
                          textTransform: 'capitalize',
                        }}>
                        {currentUser.firstname + ' ' + currentUser.lastname}
                      </Text>
                      <Text
                        style={{
                          color: colors.primary_light,
                          fontSize: normalize(12),
                          fontFamily: 'SofiaProRegular',
                        }}>
                        {currentUser.email}
                      </Text>
                    </View>
                  </View>
                  {/* /* -------------------------- Profile Details Edit -------------------------- */}
                  <InputBox
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    valuesType={values.oldPassword}
                    name="oldPassword"
                    iconName="lock-outline"
                    iconType="material-community"
                    iconSize={15}
                    placeholder="Old password"
                    autoCompleteType="off"
                    textContentType="password"
                    keyboardType="default"
                    autoCapitalize="none"
                    secureTextEntry={passwordVisibility}
                    styling={{
                      input: {
                        fontSize: normalize(15),
                        color: colors.text_1,
                      },
                    }}
                  />
                  <InputBox
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    valuesType={values.newPassword}
                    name="newPassword"
                    iconName="lock-outline"
                    iconType="material-community"
                    iconSize={15}
                    placeholder="New password"
                    autoCompleteType="off"
                    textContentType="password"
                    keyboardType="default"
                    autoCapitalize="none"
                    secureTextEntry={passwordVisibility}
                    styling={{
                      input: {
                        fontSize: normalize(15),
                        color: colors.text_1,
                      },
                    }}
                  />
                </View>
              )}
            </Formik>
          </Animatable.View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  formFieldRow: {
    flexDirection: 'row',
    width: appwidth,
    justifyContent: 'space-between',
  },
});

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  isLoading: selectIsLoading,
});

const mapDispatchToProps = (dispatch) => ({
  // getPracticesAllStart: () => dispatch(getPracticesAllStart()),
  changePassword: (data) => dispatch(changePassword(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
