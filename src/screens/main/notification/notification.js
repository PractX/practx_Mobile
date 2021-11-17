import React, { useEffect, useState, useContext, useRef } from 'react';
// import Constants from 'expo-constants';
import * as Animatable from 'react-native-animatable';
// import { ThemeContext } from '../context/ThemeContext';
import BottomSheet from 'reanimated-bottom-sheet';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TextInput,
  SectionList,
} from 'react-native';
import NotificationList from './NotificationList';
import Header from '../../../components/hoc/Header';
import moment from 'moment';

import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-navigation';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import { normalize, Icon } from 'react-native-elements';
import { FlatList } from 'react-native';
import { getAppointmentStart } from '../../../redux/appointment/appointment.actions';
import { connect } from 'react-redux';
import {
  selectAppointments,
  selectIsLoading,
} from '../../../redux/appointment/appointment.selector';
import { createStructuredSelector } from 'reselect';
import { showMessage } from 'react-native-flash-message';
import { selectPatientNotifications } from '../../../redux/practices/practices.selector';
import timeAgo from '../../../utils/timeAgo';
// const Stack = createStackNavigator();

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const appointmentDatas = [
  {
    type: 'voice',
  },
  {
    type: 'video',
  },
  {
    type: 'voice',
  },
  {
    type: 'voice',
  },
  {
    type: 'voice',
  },
  {
    type: 'video',
  },
  {
    type: 'video',
  },
  {
    type: 'voice',
  },
  {
    type: 'voice',
  },
  {
    type: 'video',
  },
];

const Notification = ({
  navigation,
  getAppointmentStart,
  allAppointments,
  allNotifications,
  isLoading,
}) => {
  const bottomSheetRef = useRef();
  const { colors } = useTheme();
  const isFocused = useIsFocused();
  const appointmentData = allAppointments?.rows;
  const [style1, setStyle1] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const isDrawerOpen = useIsDrawerOpen();
  const [pickedDate, setPickedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [appointmentDate, setAppointmentDate] = useState([]);

  // const appointmentDate =
  //   appointmentData && appointmentData.length > 0
  //     ? Object.fromEntries(
  //         appointmentData?.map((item) =>
  //           item.date.split('T')[0] >= new Date().toISOString().split('T')[0]
  //             ? [
  //                 item.date.split('T')[0],
  //                 {
  //                   selected: true,
  //                   selectedColor: colors.primary,
  //                   customStyles: {
  //                     container: {
  //                       borderRadius: 50,
  //                       // backgroundColor: colors.primary,
  //                     },
  //                   },
  //                   marked: true,
  //                   dotColor: 'white',
  //                 },
  //               ]
  //             : {},
  //         ),
  //       )
  //     : [];

  useEffect(() => {
    appointmentData?.length > 0
      ? setAppointmentDate(
          Object.fromEntries(
            appointmentData?.map(item =>
              item.date.split('T')[0] >= new Date().toISOString().split('T')[0]
                ? [
                    item.date.split('T')[0],
                    {
                      selected: true,
                      selectedColor:
                        item?.approvalStatus === 'pending'
                          ? colors.text_2
                          : item?.approvalStatus === 'approved'
                          ? colors.tertiary
                          : colors.primary_light1,
                      dots: appointmentData
                        ?.map(it => {
                          if (
                            it.date.split('T')[0] === item.date.split('T')[0]
                          ) {
                            return {
                              key: 'vacation',
                              color: 'red',
                              selectedDotColor:
                                it.approvalStatus === 'approved'
                                  ? colors.success0
                                  : it.approvalStatus === 'declined'
                                  ? colors.danger_3
                                  : 'white',
                            };
                          }
                        })
                        ?.filter(ut => ut !== undefined),

                      customStyles: {
                        container: {
                          borderRadius: 50,
                          // backgroundColor: colors.primary,
                        },
                      },
                      marked: true,
                      dotColor: 'white',
                    },
                  ]
                : {},
            ),
          ),
        )
      : setAppointmentDate({});
  }, [allAppointments]);

  console.log(
    'Appointment Date',
    appointmentData
      ?.map(it => {
        if (it.date.split('T')[0] === '2021-10-21') {
          return {
            key: 'vacation',
            color: 'red',
            selectedDotColor: 'white',
          };
        }
      })
      ?.filter(ut => ut !== undefined),
  );

  useEffect(() => {
    appointmentDate && Object.keys(appointmentDate)?.length > 0
      ? setSelectedDate({
          ...appointmentDate,
          [new Date().toISOString().split('T')[0]]: {
            selected: true,
            selectedColor: colors.secondary,
            customStyles: {
              container: {
                borderRadius: 50,
              },
            },
          },
        })
      : setSelectedDate({
          [new Date().toISOString().split('T')[0]]: {
            selected: true,
            selectedColor: colors.secondary,
            customStyles: {
              container: {
                borderRadius: 50,
              },
            },
          },
        });
  }, [appointmentDate]);

  const [selectedDate, setSelectedDate] = useState({
    [new Date().toISOString().split('T')[0]]: {
      selected: true,
      selectedColor: colors.secondary,
      customStyles: {
        container: {
          borderRadius: 50,
        },
      },
    },
  });

  useEffect(() => {
    if (isFocused) {
      getAppointmentStart();
      showMessage({
        message: 'You have being removed from Super medical practice',
        type: 'none',
        duration: 6000,
        icon: { icon: 'auto', position: 'left' },
        renderFlashMessageIcon: () => (
          <Icon
            type="ionicon"
            name="ios-notifications-sharp"
            color={'white'}
            style={{ paddingRight: 10 }}
          />
        ),
        backgroundColor: colors.background_3,
      });
    }
  }, [isFocused]);

  function datesGroupByComponent(dates, token) {
    return dates.reduce(function (val, obj) {
      // console.log('DATE TIME', moment(obj.time, 'MM/DD/YYYY'));
      let comp = moment(obj.time, 'YYYY/MM/DD').format(token);
      (val[comp] = val[comp] || []).push(obj);
      return val;
    }, {});
  }
  function convertToArray(obj) {
    const length = Math.max(...Object.keys(obj));
    const res = Array.from({ length }, (_, i) => obj[i + 1] || 0).filter(
      it => it !== 0,
    );
    return res;
  }
  // 09034301510
  useEffect(() => {
    if (allNotifications) {
      // const gmtDate = new Date(unixTimestamp * 1000);
      // const localeDateTime = gmtDate.toLocaleString();
      // setNewMessageTime(timeAgo(gmtDate));
      setNotificationData(
        convertToArray(datesGroupByComponent(allNotifications.rows, 'D'))
          .map(it => {
            return {
              title: timeAgo(it[0].time),
              data: it,
            };
          })
          .reverse(),
      );
      console.log('All Notifications---', notificationData);
    }
  }, [allNotifications]);
  // allNotifications;
  // 07015922425
  useEffect(() => {
    getAppointmentStart();
    if (isDrawerOpen) {
      setStyle1('open');
      console.log('Open');
    } else {
      setStyle1('close');
      console.log('Close');
    }
  }, [isDrawerOpen]);

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
            // flexDirection: 'column',
            // justifyContent: 'space-between',
          },
        ]}>
        <Header
          navigation={navigation}
          title="Notifications"
          hideCancel={true}
          // iconRight1={{
          //   name: 'calendar-plus-o',
          //   type: 'font-awesome',
          //   size: normalize(20),
          //   // onPress: () => bottomSheetRef.current.snapTo(0),
          //   onPress: () => navigation.navigate('AppointmentBooking'),
          //   buttonType: 'save',
          // }}
          // notifyIcon={true}
        />
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            // height: windowHeight - 413,
            width: style1 === 'open' ? appwidth - 50 : windowWidth,
            // alignSelf: 'center',
            // marginBottom: 100,
          }}>
          {/* <Text
            style={{
              marginHorizontal: 20,
              marginTop: 10,
              marginBottom: 5,
              color: colors.text,
              fontFamily: 'SofiaProSemiBold',
              fontSize: normalize(13),
            }}>
            {pickedDate === new Date().toISOString().split('T')[0]
              ? "Today's Appointment"
              : moment(pickedDate).format('ddd d MMM') + ' Appointments'}
          </Text> */}
          <SectionList
            sections={notificationData}
            keyExtractor={(item, index) => item + index}
            initialNumToRender={5}
            updateCellsBatchingPeriod={5}
            showsVerticalScrollIndicator={true}
            renderItem={({ item, sections, index }) => (
              // <EventLists item={item} navigation={navigation} styles={styles} />
              <NotificationList
                item={item}
                practice={item.Practice}
                navigation={navigation}
                notificationData={notificationData}
                section={sections}
              />
            )}
            renderSectionHeader={({ section: { title, gigs } }) =>
              title !== notificationData[0].title ? (
                <View
                  style={[
                    {
                      width: windowWidth,
                      backgroundColor: colors.background_1 + 'af',
                      borderTopColor: colors.background_1,
                      borderBottomColor: colors.background_1,
                      borderTopWidth: 0.8,
                      borderBottomWidth: 0.8,
                      paddingVertical: 10,
                    },
                  ]}>
                  <Text
                    style={{
                      fontSize: normalize(11),
                      fontFamily: 'SofiaProBold',
                      color: colors.text_4,
                      paddingHorizontal: 16,
                    }}>
                    {title}
                  </Text>
                </View>
              ) : null
            }
            style={{
              marginTop: 50,
              alignSelf: 'center',
            }}
          />
        </View>

        {/* {errorData ? (
                <Error
                  title={errorData.includes('internet') ? 'OOPS!!!' : 'SORRY'}
                  subtitle={
                    errorData.includes('internet')
                      ? 'Poor internet connection, Please check your connectivity, And try again'
                      : errorData.includes('fetch')
                      ? 'Enable to fetch post, please try again later'
                      : 'Download link is not supported OR Account is private'
                  }
                />
              ) : (
                <Spinner
                  style={styles.spinner}
                  size={80}
                  type="Circle"
                  color={colors.primary}
                />
              )} */}
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = createStructuredSelector({
  allAppointments: selectAppointments,
  allNotifications: selectPatientNotifications,
  isLoading: selectIsLoading,
});

const mapDispatchToProps = dispatch => ({
  getAppointmentStart: data => dispatch(getAppointmentStart(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
