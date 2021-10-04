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
  ScrollView,
} from 'react-native';
import AppointmentList from './AppointmentList';
import Header from '../../../components/hoc/Header';
import moment from 'moment';

import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-navigation';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import { normalize, Icon } from 'react-native-elements';
import { FlatList } from 'react-native';
import AppointmentBooking from './AppointmentBooking';
import { getAppointmentStart } from '../../../redux/appointment/appointment.actions';
import { connect } from 'react-redux';
import {
  selectAppointments,
  selectIsLoading,
} from '../../../redux/appointment/appointment.selector';
import { createStructuredSelector } from 'reselect';

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

const Appointments = ({
  navigation,
  getAppointmentStart,
  allAppointments,
  isLoading,
}) => {
  const bottomSheetRef = useRef();
  const { colors } = useTheme();
  const isFocused = useIsFocused();
  const appointmentData = allAppointments?.rows;
  const [style1, setStyle1] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [showAppointmentBooking, setShowAppointmentBooking] = useState(true);
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
            appointmentData?.map((item) =>
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
                        ?.map((it) => {
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
                        ?.filter((ut) => ut !== undefined),

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
      ?.map((it) => {
        if (it.date.split('T')[0] === '2021-10-21') {
          return {
            key: 'vacation',
            color: 'red',
            selectedDotColor: 'white',
          };
        }
      })
      ?.filter((ut) => ut !== undefined),
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
    }
  }, [isFocused]);

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
          title="Appointments"
          hideCancel={true}
          iconRight1={{
            name: 'calendar-plus-o',
            type: 'font-awesome',
            size: normalize(20),
            // onPress: () => bottomSheetRef.current.snapTo(0),
            onPress: () => navigation.navigate('AppointmentBooking'),
            buttonType: 'save',
          }}
          notifyIcon={true}
        />
        {/* <ScrollView
          showsVerticalScrollIndicator=000000
            width: style1 === 'open' ? appwidth - 50 : appwidth,
            alignSelf: 'center',
            marginTop: 50,
          }}></ScrollView> */}
        <View
          style={{
            // backgroundColor: 'green',
            marginTop: 50,
            height: 390,
          }}>
          {appointmentDate && (
            <Calendar
              key={colors.mode}
              // onDayPress={(day) => {
              //   console.log('selected day', day);
              // }}
              // style={{ padding: 0 }}
              // Disable left arrow. Default = false
              // disableArrowLeft={true}
              // Disable right arrow. Default = false
              // disableArrowRight={true}
              enableSwipeMonths={true}
              horizontal={true}
              // pagingEnabled={true}
              showScrollIndicator={true}
              onDayPress={(day) => {
                console.log('Date', day.dateString);
                setPickedDate(day.dateString);
                return setSelectedDate({
                  ...appointmentDate,
                  [day.dateString]: {
                    selected: true,
                    selectedColor: colors.secondary,
                    customStyles: {
                      container: {
                        borderRadius: 50,
                        backgroundColor: colors.secondary,
                      },
                    },
                  },
                });
              }}
              minDate={new Date().toISOString().split('T')[0]}
              current={new Date().toISOString().split('T')[0]}
              markingType={'multi-dot'}
              markedDates={{
                // '2021-02-11': {
                //   customStyles: {
                //     container: {
                //       backgroundColor: colors.primary,
                //       borderRadius: 8,
                //     },
                //   },
                //   selected: true,
                //   // marked: true,
                //   // selectedColor: colors.primary,
                //   // dotColor: 'white',
                //   // textColor: 'green',
                // },
                ...selectedDate,
                // ...appointmentDate,
              }}
              theme={{
                backgroundColor: colors.background,
                calendarBackground: colors.background,
                textSectionTitleColor: colors.text,
                // textSectionTitleDisabledColor: 'yellow',
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: '#ffffff',

                todayTextColor: colors.secondary,
                dayTextColor: colors.text,
                textDisabledColor: colors.text_2,
                textDayFontFamily: 'SofiaProRegular',
                textMonthFontFamily: 'SofiaProSemiBold',
                textDayHeaderFontFamily: 'SofiaProRegular',
                dotColor: colors.primary,
                selectedDotColor: colors.text,
                arrowColor: colors.text,
                // disabledArrowColor: '#d9e1e8',
                monthTextColor: colors.text,
                // indicatorColor: colors.text,
                // textDayFontWeight: '300',
                // textMonthFontWeight: 'bold',
                // textDayHeaderFontWeight: '300',
                textDayFontSize: normalize(11),
                textMonthFontSize: normalize(13),
                textDayHeaderFontSize: normalize(12),
              }}
            />
          )}
        </View>
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            height: windowHeight - 413,
            width: '100%',
            // alignSelf: 'center',
            // marginBottom: 100,
          }}>
          <Text
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
          </Text>
          {appointmentDatas ? (
            <View
              style={{
                height: windowHeight - 400,
              }}>
              <FlatList
                // refreshControl={
                //   <RefreshControl
                //     refreshing={refreshing}
                //     onRefresh={() => getPracticesAllStart()}
                //   />
                // }
                // removeClippedSubviews
                // ListEmptyComponent
                initialNumToRender={5}
                updateCellsBatchingPeriod={5}
                showsVerticalScrollIndicator={true}
                style={{ marginBottom: 100 }}
                data={
                  appointmentData?.filter(
                    (it) => it.date.split('T')[0] === pickedDate,
                  ) || []
                }
                numColumns={1}
                ListEmptyComponent={() => (
                  <View
                    style={{
                      // margin: 0,
                      marginTop: 30,
                      marginBottom: 50,
                      height: '100%',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon
                      type="font-awesome"
                      name="calendar-times-o"
                      color={colors.text_2 + 'c0'}
                      size={normalize(28)}
                      style={
                        {
                          // fontSize: 11,
                          // margin: 0,
                          // alignSelf: 'center',
                        }
                      }
                    />
                    <Text
                      style={{
                        marginHorizontal: 20,
                        marginTop: 10,
                        marginBottom: 5,
                        color: colors.text_2 + 'c0',
                        fontFamily: 'Comfortaa-Bold',
                        fontSize: normalize(13),
                        textAlign: 'center',
                      }}>
                      You have no appointment
                      {/* {pickedDate === new Date().toISOString().split('T')[0]
                        ? "Today's Appointment"
                        : moment(pickedDate).format('ddd d MMM') +
                          ' Appointments'} */}
                    </Text>
                  </View>
                )}
                renderItem={({ item, index }) => (
                  <AppointmentList
                    id={index}
                    item={item}
                    practice={item.Practice}
                    status={item?.approvalStatus}
                    styling={[
                      {
                        width: style1 === 'open' ? appwidth - 50 : appwidth,
                      },
                      index ===
                        appointmentData?.filter(
                          (it) => it.date.split('T')[0] === pickedDate,
                        )?.length -
                          1 && {
                        paddingBottom: 60,
                      },
                    ]}
                  />
                )}
                keyExtractor={(item, index) => item.display_url}
                // showsHorizontalScrollIndicator={false}
                // extraData={selected}
              />
            </View>
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text>No data</Text>
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
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = createStructuredSelector({
  allAppointments: selectAppointments,
  isLoading: selectIsLoading,
});

const mapDispatchToProps = (dispatch) => ({
  getAppointmentStart: (data) => dispatch(getAppointmentStart(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Appointments);
