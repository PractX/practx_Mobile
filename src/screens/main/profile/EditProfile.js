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
import { editProfile } from '../../../redux/user/user.actions';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const EditProfile = ({
  navigation,
  route,
  currentUser,
  extraData,
  editProfile,
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
    console.log(imageUri);
    // console.log(inputRef.current.values);
    let newData = {
      ...inputRef.current.values,
      dob: `${inputRef.current.values.MM}/${inputRef.current.values.DD}/${inputRef.current.values.YY}`,
      avatar: imageUri,
    };
    delete newData.DD;
    delete newData.MM;
    delete newData.YY;
    // console.log(newData);
    editProfile(newData);
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
          title="Edit Profile"
          backArrow={true}
          iconRight1={{
            name: 'ios-save-outline',
            type: 'ionicon',
            onPress: saveChanges,
            buttonType: 'save',
          }}
          isLoading={isLoading}
          hideCancel={true}
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
                avatar: currentUser.avatar,
                firstname: currentUser.firstname,
                lastname: currentUser.lastname,
                MM: currentUser.dob.split('/')[0],
                DD: currentUser.dob.split('/')[1],
                YY: currentUser.dob.split('/')[2],
                mobileNo: currentUser.mobileNo,
                bio: currentUser.bio,
                address: currentUser.address,
              }}
              onSubmit={(values) => {
                // signupPatient(values);
                console.log('Lets go');
              }}>
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
                      <TouchableOpacity
                        onPress={() =>
                          launchImageLibrary({ mediaType: 'photo' }, (i) => {
                            if (i && i.didCancel) {
                              console.log('No image attached');
                            } else {
                              setImageUri(i);
                            }
                          })
                        }
                        style={{
                          backgroundColor: colors.secondary,
                          height: 27,
                          width: 27,
                          borderRadius: 50,
                          position: 'absolute',
                          justifyContent: 'center',
                          bottom: 0,
                          right: 0,
                        }}>
                        <Icon
                          name="pencil"
                          type="simple-line-icon"
                          color={'white'}
                          size={normalize(13)}
                          style={{
                            color: colors.text,
                            // alignSelf: 'center',
                          }}
                        />
                      </TouchableOpacity>
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
                    valuesType={values.firstname}
                    name="firstname"
                    iconName="user"
                    iconType="feather"
                    iconSize={16}
                    placeholder="First Name"
                    autoCompleteType="name"
                    textContentType="givenName"
                    keyboardType="default"
                    autoCapitalize="sentences"
                    boxStyle={{ borderRadius: 50 }}
                    styling={{
                      input: {
                        fontSize: normalize(14),
                        color: colors.text_1,
                      },
                    }}
                  />
                  <InputBox
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    valuesType={values.lastname}
                    name="lastname"
                    iconName="user"
                    iconType="feather"
                    iconSize={16}
                    placeholder="Last Name"
                    autoCompleteType="name"
                    textContentType="familyName"
                    keyboardType="default"
                    autoCapitalize="sentences"
                    boxStyle={{ borderRadius: 50 }}
                    styling={{
                      input: {
                        fontSize: normalize(14),
                        color: colors.text_1,
                      },
                    }}
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
                      valuesType={values.MM}
                      name="MM"
                      iconName="calendar"
                      iconType="feather"
                      iconSize={16}
                      placeholder="MM"
                      autoCompleteType="cc-exp-month"
                      textContentType="none"
                      keyboardType="numeric"
                      autoCapitalize="none"
                      maxLength={2}
                      boxStyle={{ borderRadius: 50 }}
                      styling={{
                        input: {
                          fontSize: normalize(14),
                          color: colors.text_1,
                        },
                      }}
                    />

                    <SmallInputBox
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      valuesType={values.DD}
                      name="DD"
                      iconName="calendar"
                      iconType="feather"
                      iconSize={16}
                      placeholder="DD"
                      autoCompleteType="cc-exp"
                      textContentType="none"
                      keyboardType="numeric"
                      autoCapitalize="none"
                      maxLength={2}
                      boxStyle={{ borderRadius: 50 }}
                      styling={{
                        input: {
                          fontSize: normalize(14),
                          color: colors.text_1,
                        },
                      }}
                    />

                    <SmallInputBox
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      valuesType={values.YY}
                      name="YY"
                      iconName="calendar"
                      iconType="feather"
                      iconSize={16}
                      placeholder="YY"
                      autoCompleteType="cc-exp-year"
                      textContentType="none"
                      keyboardType="numeric"
                      autoCapitalize="none"
                      maxLength={4}
                      boxStyle={{ borderRadius: 50 }}
                      styling={{
                        input: {
                          fontSize: normalize(14),
                          color: colors.text_1,
                        },
                      }}
                    />
                  </View>

                  <InputBox
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    valuesType={values.mobileNo}
                    name="mobileNo"
                    iconName="phone"
                    iconType="feather"
                    iconSize={16}
                    placeholder="Phone"
                    autoCompleteType="tel"
                    textContentType="telephoneNumber"
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    boxStyle={{ borderRadius: 50 }}
                    styling={{
                      input: {
                        fontSize: normalize(14),
                        color: colors.text_1,
                      },
                    }}
                  />

                  {/* ------------------- BIO SECTION --------------------------------------- */}

                  <InputBox
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    valuesType={values.bio}
                    name="bio"
                    iconName="book-outline"
                    iconType="ionicon"
                    placeholder="Bio"
                    autoCompleteType="name"
                    textContentType="givenName"
                    keyboardType="default"
                    autoCapitalize="sentences"
                    boxStyle={{ borderRadius: 50 }}
                    styling={{
                      input: {
                        fontSize: normalize(14),
                        color: colors.text_1,
                      },
                    }}
                  />

                  <InputBox
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    valuesType={values.address}
                    name="address"
                    iconName="location-outline"
                    iconType="ionicon"
                    placeholder="Address"
                    autoCompleteType="street-address"
                    textContentType="addressCityAndState"
                    keyboardType="default"
                    autoCapitalize="sentences"
                    boxStyle={{ borderRadius: 50 }}
                    styling={{
                      input: {
                        fontSize: normalize(14),
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
  editProfile: (data) => dispatch(editProfile(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
