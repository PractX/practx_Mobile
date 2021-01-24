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
import { selectCurrentUser } from '../../../redux/user/user.selector';
import normalize from '../../../utils/normalize';
import { ListItem, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import InputBox from '../../../components/hoc/InputBox';
import SmallInputBox from '../../../components/hoc/SmallInputBox';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const EditProfile = ({ navigation, route, currentUser, extraData }) => {
  const { colors } = useTheme();
  // const props = useRoute();
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [style1, setStyle1] = useState();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
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
            name: 'save-outline',
            type: 'ionicon',
            // onPress: openMenu,
            buttonType: 'save',
          }}
        />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'always'}
          // style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          style={{
            width: style1 === 'open' ? appwidth - 50 : appwidth,
            alignSelf: 'center',
            marginTop: 50,
          }}>
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
                  uri:
                    'https://api.duniagames.co.id/api/content/upload/file/8143860661599124172.jpg',
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
                onPress={() => console.log('Add new image')}
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
                  fontSize: normalize(17),
                  fontFamily: 'SofiaProSemiBold',
                  textTransform: 'capitalize',
                }}>
                {currentUser.firstname + ' ' + currentUser.lastname}
              </Text>
              <Text
                style={{
                  color: colors.primary_light,
                  fontSize: normalize(13),
                  fontFamily: 'SofiaProRegular',
                }}>
                {currentUser.email}
              </Text>
            </View>
          </View>
          {/* /* -------------------------- Profile Details Edit -------------------------- */}
          <Animatable.View animation="bounceInLeft" style={{ marginTop: 0 }}>
            <Formik
              initialValues={{
                firstname: currentUser.firstname,
                lastname: currentUser.lastname,
                DD: currentUser.dob.split('/')[0],
                MM: currentUser.dob.split('/')[1],
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
                    boxStyle={{ borderRadius: 50 }}
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
                    boxStyle={{ borderRadius: 50 }}
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
                      boxStyle={{ borderRadius: 50 }}
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
                      boxStyle={{ borderRadius: 50 }}
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
                      boxStyle={{ borderRadius: 50 }}
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
                    boxStyle={{ borderRadius: 50 }}
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
                  />

                  <InputBox
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    valuesType={values.address}
                    name="lastname"
                    iconName="location-outline"
                    iconType="ionicon"
                    placeholder="Address"
                    autoCompleteType="street-address"
                    textContentType="addressCityAndState"
                    keyboardType="default"
                    autoCapitalize="sentences"
                    boxStyle={{ borderRadius: 50 }}
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
});

// const mapDispatchToProps = (dispatch) => ({
//   getPracticesAllStart: () => dispatch(getPracticesAllStart()),
//   setFilter: (data) => dispatch(setFilter(data)),
// });

export default connect(mapStateToProps)(EditProfile);
