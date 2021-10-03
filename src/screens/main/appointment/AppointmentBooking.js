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
import { useIsFocused, useTheme } from '@react-navigation/native';
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
import { Modal, Portal } from 'react-native-paper';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { selectJoinedPractices } from '../../../redux/practices/practices.selector';
import { bookAppointment } from '../../../redux/appointment/appointment.actions';
import { selectIsLoading } from '../../../redux/appointment/appointment.selector';
// import Modal from 'react-native-modal';

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
  joinedPractices,
  leavePracticeStart,
  showAppointmentBooking,
  setShowAppointmentBooking,
  extraData,
  bookAppointment,
}) => {
  const { colors } = useTheme();
  const isFocused = useIsFocused();
  const [style1, setStyle1] = useState();
  console.log(practiceData);
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  // const pending = practice.requests;
  // const member = practice.patients.filter((val) => val.id === userId);
  const [selectedPractice, setSelectedPractice] = useState(null);
  const today = new Date();
  const date18 = new Date(today.setFullYear(today.getFullYear() - 16));
  const [date, setDate] = useState(date18);
  const [dateValue, setDateValue] = useState();
  const [selectedDate, setSelectedDate] = useState('');
  const minimumDate = getFormatedDate(new Date(), 'YYYY/MM/DD h:m');
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const list = [
    {
      name: 'Amy Farha',
      avatar_url:
        'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
      subtitle: 'Vice President',
    },
    {
      name: 'Chris Jackson ChrisJacksonChrisJacksonChrisJacksonChrisJackson',
      avatar_url:
        'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      subtitle: 'Vice Chairman',
    },
    {
      name: 'Chris Jackson',
      avatar_url:
        'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      subtitle: 'Vice Chairman',
    },
    {
      name: 'Chris Jackson',
      avatar_url:
        'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      subtitle: 'Vice Chairman',
    },
    {
      name: 'Chris Jackson',
      avatar_url:
        'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      subtitle: 'Vice Chairman',
    },
  ];

  console.log(
    'Selected date',
    // getFormatedDate(new Date('2021-09-27 11:34'), 'YYYY/MM/DD h:m'),
    selectedDate && new Date(selectedDate?.replaceAll('/', '-')).toISOString(),
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

  useEffect(() => {
    if (isFocused && selectedPractice === null) {
      setTimeout(() => {
        console.log('Good', selectedPractice);
        showModal();
      }, 1000);
    }
  }, [isFocused, selectedPractice]);

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
          avatar={{
            url: selectedPractice?.logo,
            press: () => showModal(),
          }}
          // iconRight1={{
          //   name: 'ios-save-outline',
          //   type: 'ionicon',
          //   onPress: saveChanges,
          //   buttonType: 'save',
          // }}
          // isLoading={isLoading}
          hideCancel={true}
        />
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={{
              backgroundColor: colors.background,
              width: appwidth - 50,
              height: 400,
              paddingVertical: 20,
              alignSelf: 'center',
              borderColor: colors.background_1,
              borderWidth: 0.8,
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontSize: normalize(14),
                fontFamily: 'SofiaProSemiBold',
                color: colors.text,
                textAlign: 'center',
                paddingBottom: 10,
              }}>
              Choose a practice
            </Text>
            <ScrollView style={{ backgroundColor: colors.background }}>
              {joinedPractices.map((l, i) => (
                <ListItem
                  key={i}
                  containerStyle={{ backgroundColor: colors.background }}
                  onPress={() => setSelectedPractice(l)}>
                  <Avatar rounded source={{ uri: l.logo }} />
                  <ListItem.Content>
                    <ListItem.Title
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        fontSize: normalize(12),
                        fontFamily: 'SofiaProRegular',
                        color: colors.text,
                      }}>
                      {l.practiceName}
                    </ListItem.Title>
                    <ListItem.Subtitle
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        fontSize: normalize(10),
                        fontFamily: 'SofiaProLight',
                        color: colors.text_1,
                      }}>
                      {l.specialty}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                  <Icon
                    name={'check-circle'}
                    color={
                      selectedPractice?.id === l.id
                        ? colors.tertiary
                        : colors.background
                    }
                    size={normalize(18)}
                  />
                </ListItem>
              ))}
            </ScrollView>
            <Button
              title="Done"
              onPress={() => hideModal()}
              rounded
              buttonStyle={[
                styles.loginButton,
                {
                  backgroundColor: colors.primary,
                  width: '50%',
                  alignSelf: 'center',
                },
              ]}
              titleStyle={{
                fontFamily: 'SofiaProSemiBold',
                fontSize: normalize(13),
              }}
              loading={isLoading}
            />
          </Modal>
        </Portal>
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
                title: '',
                description: '',
              }}
              onSubmit={async (values, { resetForm }) => {
                console.log({
                  ...values,
                  practiceId: selectedPractice?.id,
                  data:
                    selectedDate &&
                    new Date(selectedDate?.replaceAll('/', '-')).toISOString(),
                });
                bookAppointment({
                  ...values,
                  practiceId: selectedPractice?.id,
                  date:
                    selectedDate &&
                    new Date(selectedDate?.replaceAll('/', '-')).toISOString(),
                  navigation,
                });
                // do your stuff
                resetForm();
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
                    autoCapitalize="none"
                    boxStyle={{
                      width: appwidth,
                      alignSelf: 'center',
                      backgroundColor: colors.background,
                      borderColor: colors.background_1,
                      borderWidth: 1,
                    }}
                    styling={{
                      input: {
                        fontSize: normalize(14),
                        color: colors.text_1,
                        backgroundColor: colors.background,
                      },
                    }}
                  />
                  <InputBox
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    valuesType={values.description}
                    name="description"
                    iconName="calendar-edit"
                    iconType="material-community"
                    iconSize={16}
                    placeholder="Description"
                    autoCapitalize="none"
                    boxStyle={{
                      width: appwidth,
                      alignSelf: 'center',
                      backgroundColor: colors.background,
                      borderColor: colors.background_1,
                      borderWidth: 1,
                    }}
                    styling={{
                      input: {
                        fontSize: normalize(14),
                        color: colors.text_1,
                        backgroundColor: colors.background,
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
                      textSecondaryColor: colors.text_1,
                      borderColor: 'rgba(122, 146, 165, 0.1)',
                      textFontSize: normalize(11),
                      defaultFont: 'SofiaProRegular',
                      textHeaderFontSize: normalize(13),
                    }}
                    minimumDate={minimumDate}
                    isGregorian={true}
                    onSelectedChange={(date) => setSelectedDate(date)}
                  />

                  <View style={styles.loginButtonView}>
                    <Button
                      title="Book Appointment"
                      onPress={handleSubmit}
                      disabled={
                        selectedDate &&
                        values.title &&
                        values.description &&
                        selectedPractice
                          ? false
                          : true
                      }
                      disabledStyle={{
                        backgroundColor: colors.background_1,
                        width: appwidth,
                        alignSelf: 'center',
                        opacity: 0.2,
                      }}
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

const mapStateToProps = createStructuredSelector({
  joinedPractices: selectJoinedPractices,
  isLoading: selectIsLoading,
});

const mapDispatchToProps = (dispatch) => ({
  bookAppointment: (data) => dispatch(bookAppointment(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentBooking);
