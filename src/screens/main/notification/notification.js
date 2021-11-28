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

import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-navigation';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import { normalize, Icon } from 'react-native-elements';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
// 07015922425
import {
  selectAppointments,
  selectIsLoading,
} from '../../../redux/appointment/appointment.selector';
import { createStructuredSelector } from 'reselect';
import { showMessage } from 'react-native-flash-message';
import { selectPatientNotifications } from '../../../redux/practices/practices.selector';
import timeAgo from '../../../utils/timeAgo';
import { selectCurrentUser } from '../../../redux/user/user.selector';
import isToday from '../../../utils/isToday';
import { getAllPatientNotificationStart } from '../../../redux/practices/practices.actions';
import datesGroupByComponent from '../../../utils/datesGroupByComponent';
import convertToArray from '../../../utils/convertToArray';
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
  currentUser,
  getAllPatientNotificationStart,
  allNotifications,
  isLoading,
}) => {
  const bottomSheetRef = useRef();
  const { colors } = useTheme();
  const isFocused = useIsFocused();
  const [style1, setStyle1] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const isDrawerOpen = useIsDrawerOpen();
  const [pickedDate, setPickedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [appointmentDate, setAppointmentDate] = useState([]);

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

  // useEffect(() => {
  //   if (isFocused) {
  //   }
  // }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      getAllPatientNotificationStart();
      setNotificationData(
        convertToArray(datesGroupByComponent(allNotifications.rows, 'D'))
          .map(it => {
            return {
              title: isToday(it[it.length - 1].createdAt)
                ? timeAgo(it[it.length - 1].createdAt)
                : timeAgo(it[it.length - 1].createdAt.split('T')[0]),
              data: it,
            };
          })
          .map(its => {
            its.data.sort(function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(b.time) - new Date(a.time);
            });
            return its;
          })
          .reverse(),
      );
    }
  }, [isFocused]);

  useEffect(() => {
    setNotificationData(
      convertToArray(datesGroupByComponent(allNotifications.rows, 'D'))
        .map(it => {
          return {
            title: isToday(it[it.length - 1].createdAt)
              ? timeAgo(it[it.length - 1].createdAt)
              : timeAgo(it[it.length - 1].createdAt.split('T')[0]),
            data: it,
          };
        })
        .map(its => {
          its.data.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.time) - new Date(a.time);
          });
          return its;
        })
        .reverse(),
    );
  }, [allNotifications]);

  useEffect(() => {
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
            backgroundColor: colors.background,
            height: '100%',
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
          <SectionList
            sections={notificationData}
            // sections={[]}
            keyExtractor={(item, index) => item + index}
            initialNumToRender={5}
            updateCellsBatchingPeriod={5}
            showsVerticalScrollIndicator={true}
            ListEmptyComponent={() => (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: windowHeight / 6,
                }}>
                <Icon
                  name="bell-off"
                  type="material-community"
                  color={colors.text_2}
                  size={normalize(70)}
                  style={{ marginBottom: 10 }}
                />
                <Text
                  style={{
                    fontSize: normalize(17),
                    fontFamily: 'SofiaProSemiBold',
                    color: colors.text,
                    marginBottom: 5,
                  }}>
                  Nothing here!!!
                </Text>
                <Text
                  style={{
                    fontSize: normalize(14),
                    fontFamily: 'SofiaProMedium',
                    color: colors.text,
                    textAlign: 'center',
                  }}>
                  {'You have no notification available \n check again later'}
                </Text>
              </View>
            )}
            renderItem={({ item, sections, index }) => (
              // <EventLists item={item} navigation={navigation} styles={styles} />
              <NotificationList
                item={item}
                practice={item.Practice}
                navigation={navigation}
                notificationData={notificationData}
                section={sections}
                currentUser={currentUser}
              />
            )}
            renderSectionHeader={
              ({ section: { title, gigs } }) => (
                // title !== notificationData[0].title ? (
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
              )
              // ) : null
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
  currentUser: selectCurrentUser,
  allNotifications: selectPatientNotifications,
  isLoading: selectIsLoading,
});

const mapDispatchToProps = dispatch => ({
  getAllPatientNotificationStart: () =>
    dispatch(getAllPatientNotificationStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
