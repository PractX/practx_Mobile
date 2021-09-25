import React, { useEffect, useState, useContext, useRef } from 'react';
// import Constants from 'expo-constants';
import * as Animatable from 'react-native-animatable';
// import { ThemeContext } from '../context/ThemeContext';

import {
  Button,
  Text,
  Content,
  Title,
  Right,
  Left,
  Icon,
  Body,
  Thumbnail,
} from 'native-base';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import Appointment from './Appointment';
import Header from '../../../components/hoc/Header';

import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-navigation';
import { useTheme } from '@react-navigation/native';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import { normalize } from 'react-native-elements';
import { FlatList } from 'react-native';

// const Stack = createStackNavigator();

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const appointmentData = [
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

const Appointments = ({ navigation }) => {
  const ref = useRef();
  const { colors } = useTheme();
  const [style1, setStyle1] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const isDrawerOpen = useIsDrawerOpen();
  const [selectedDate, setSelectedDate] = useState({
    [new Date().toISOString().split('T')[0]]: {
      selected: true,
      selectedColor: colors.secondary,
      customStyles: {
        container: {
          borderRadius: 8,
        },
      },
    },
  });

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
            name: 'calendar-plus',
            type: 'material-community',
            size: normalize(20),
            onPress: () => console.log('ffff'),
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
            height: 360,
          }}>
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
            onDayPress={(day) =>
              setSelectedDate({
                [day.dateString]: {
                  selected: true,
                  selectedColor: colors.secondary,
                  customStyles: {
                    container: {
                      borderRadius: 8,
                    },
                  },
                },
              })
            }
            minDate={new Date().toISOString().split('T')[0]}
            current={new Date().toISOString().split('T')[0]}
            markingType={'custom'}
            markedDates={{
              '2021-01-31': {
                customStyles: {
                  container: {
                    backgroundColor: colors.primary,
                    borderRadius: 8,
                  },
                },
                selected: true,
                // marked: true,
                // selectedColor: colors.primary,
                // dotColor: 'white',
                // textColor: 'green',
              },
              '2021-02-11': {
                customStyles: {
                  container: {
                    backgroundColor: colors.primary,
                    borderRadius: 8,
                  },
                },
                selected: true,
                // marked: true,
                // selectedColor: colors.primary,
                // dotColor: 'white',
                // textColor: 'green',
              },
              ...selectedDate,
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
        </View>
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            height: windowHeight - 433,
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
            Today's Appointment
          </Text>
          {appointmentData ? (
            <View
              style={{
                height: windowHeight - 370,
              }}>
              <FlatList
                ref={ref}
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
                style={{ marginBottom: 50 }}
                data={appointmentData}
                numColumns={1}
                renderItem={({ item, index }) => (
                  <Appointment
                    id={index}
                    type={item.type}
                    styling={[
                      {
                        width: style1 === 'open' ? appwidth - 50 : appwidth,
                      },
                      index === appointmentData.length - 1 && {
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

export default Appointments;
