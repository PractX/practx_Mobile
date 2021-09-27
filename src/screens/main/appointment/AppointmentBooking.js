import React, { useEffect, useState, useContext, useRef } from 'react';
import * as Animatable from 'react-native-animatable';

import { Text, Thumbnail } from 'native-base';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Header from '../../../components/hoc/Header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Icon, ListItem } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@react-navigation/native';
import { normalize } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import BottomSheet from 'reanimated-bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import InputBox from '../../../components/hoc/InputBox';
import { Formik } from 'formik';

const Stack = createStackNavigator();

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const theme = {
  /* ---- THeme to be gotten from redux or context------*/
  background: '#1e1f36',
  highlight: '#ff0000',
  text: '#fff',
  text2: '#aaa',
  text3: '#555',
};

const AppointmentBooking = ({
  bottomSheetRef,
  isLoading,
  navigation,
  setPracticeId,
  practiceData,
  setPracticeData,
  joinPractices,
  leavePracticeStart,
  showAppointmentBooking,
  setShowAppointmentBooking,
  extraData,
}) => {
  const { colors } = useTheme();
  // const { show, data, type } = practiceData;
  const [style1, setStyle1] = useState();
  console.log(practiceData);
  // const pending = practice.requests;
  // const member = practice.patients.filter((val) => val.id === userId);
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const date18 = new Date(today.setFullYear(today.getFullYear() - 16));
  const [date, setDate] = useState(date18);
  const [dateValue, setDateValue] = useState();
  const [selectedDate, setSelectedDate] = useState('');

  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  console.log(
    'Selected date',
    // getFormatedDate(new Date('2021-09-27 11:34'), 'YYYY/MM/DD h:m'),
    selectedDate && selectedDate?.replaceAll('/', '-'),
    // new Date(selectedDate.replace('/', '-')),
  );
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
  // selectedDate;
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    console.log(
      'Data ---->',
      currentDate.toISOString().slice(0, 10).replace(/-/g, '-'),
    );
    setDateValue(currentDate.toISOString().slice(0, 10).replace(/-/g, '-'));
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('datetime');
  };

  const joinPractice = (practiceId) => {
    setLoading(true);
    joinPractices(practiceId);
  };

  useEffect(() => {
    !isLoading && setLoading(false);
  }, [isLoading]);

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
          title="Appointment Booking"
          backArrow={true}
          // iconRight1={{
          //   name: 'ios-save-outline',
          //   type: 'ionicon',
          //   onPress: saveChanges,
          //   buttonType: 'save',
          // }}
          isLoading={isLoading}
          hideCancel={true}
        />
        <KeyboardAwareScrollView
          // keyboardShouldPersistTaps={'always'}
          // style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          style={{
            width: windowWidth,
            alignSelf: 'center',
            marginTop: 50,
          }}>
          <Animatable.View animation="bounceInLeft" style={{ marginTop: 0 }}>
            <Formik
              initialValues={{
                // email: 'jaskyparrot@gmail.com',
                // password: '@Pass1234',
                email: '',
                password: '',
              }}
              onSubmit={(values) => {
                console.log(values);
              }}>
              {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View>
                  <InputBox
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    valuesType={values.title}
                    name="title"
                    iconName="calendar-edit"
                    iconType="material-community"
                    iconSize={16}
                    placeholder="Appointment Title"
                    autoCompleteType="email"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    boxStyle={{
                      width: appwidth,
                      alignSelf: 'center',
                      backgroundColor: colors.white,
                      borderColor: colors.background_1,
                      borderWidth: 1,
                    }}
                    styling={{
                      input: {
                        fontSize: normalize(14),
                        color: colors.text_1,
                        backgroundColor: colors.white,
                      },
                    }}
                  />

                  <DatePicker
                    options={{
                      backgroundColor: colors.background,
                      textHeaderColor: colors.primary_light1,
                      textDefaultColor: colors.text,
                      selectedTextColor: '#fff',
                      mainColor: colors.primary,
                      textSecondaryColor: colors.text,
                      borderColor: 'rgba(122, 146, 165, 0.1)',
                      textFontSize: normalize(11),
                      defaultFont: 'SofiaProRegular',
                      textHeaderFontSize: normalize(13),
                    }}
                    isGregorian={true}
                    onSelectedChange={(date) => setSelectedDate(date)}
                  />
                  <View style={styles.loginButtonView}>
                    <Button
                      title="Log In"
                      onPress={handleSubmit}
                      rounded
                      buttonStyle={[
                        styles.loginButton,
                        {
                          backgroundColor: colors.primary,
                          width: appwidth,
                          alignSelf: 'center',
                        },
                      ]}
                      titleStyle={{
                        fontFamily: 'SofiaProSemiBold',
                        fontSize: normalize(14),
                      }}
                      loading={isLoading}
                    />
                  </View>
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
  buttonAction: {
    width: 43,
    height: 43,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
});

// const mapStateToProps = createStructuredSelector({
//   isLoading: selectIsLoading,
// });

// const mapDispatchToProps = (dispatch) => ({
//   joinPractices: (practiceId) => dispatch(joinPractices(practiceId)),
//   setPracticeId: (id) => dispatch(setPracticeId(id)),
//   leavePracticeStart: (id) => dispatch(leavePracticeStart(id)),
// });

// export default connect(mapStateToProps)(AppointmentBooking);
export default AppointmentBooking;
