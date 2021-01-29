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
import { SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import normalize from '../../../utils/normalize';
import { FlatList } from 'react-native';

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
];

const Appointments = ({ navigation }) => {
  const ref = useRef();
  const { colors } = useTheme();
  const [style1, setStyle1] = useState();
  const [refreshing, setRefreshing] = useState(false);
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

  // useEffect(() => {
  // }, [colors.background]);

  React.useEffect(() => {
    console.log(selectedDate);
    console.log(new Date().toJSON().slice(0, 10));
    const unsubscribe = navigation.addListener('drawerOpen', (e) => {
      // Do something
      setStyle1('open');
    });

    return unsubscribe;
  }, [navigation, selectedDate]);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('drawerClose', (e) => {
      // Do something
      setStyle1('close');
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <View
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
            height: windowHeight,
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
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
        ]}>
        <Header navigation={navigation} title="Appointments" />
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
            pagingEnabled={true}
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
            current={new Date().toISOString().split('T')[0]}
            markingType={'custom'}
            markedDates={{
              '2021-01-21': {
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
              textDayFontSize: normalize(16),
              textMonthFontSize: normalize(17),
              textDayHeaderFontSize: normalize(15),
            }}
          />
        </View>
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            height: windowHeight - 435,
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
              fontSize: normalize(16),
            }}>
            Today's Appointment
          </Text>
          {appointmentData ? (
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
              // style={{ width: '100%', backgroundColor: 'blue' }}
              data={appointmentData}
              numColumns={1}
              renderItem={({ item, index }) => (
                <Appointment
                  id={index}
                  type={item.type}
                  styling={{
                    width: style1 === 'open' ? appwidth - 50 : appwidth,
                  }}
                />
              )}
              keyExtractor={(item, index) => item.display_url}
              // showsHorizontalScrollIndicator={false}
              // extraData={selected}
            />
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
    </View>
  );
};

const styles = StyleSheet.create({
  date: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text2,
    paddingTop: 20,
    paddingLeft: 10,
  },
  header: {
    backgroundColor: theme.background,
    borderBottomColor: theme.text3,
    borderBottomWidth: 1,
    // marginTop: Constants.statusBarHeight,
  },
  image: {
    width: 50,
    height: 50,
    backgroundColor: 'gray',
    borderRadius: 15,
    marginRight: 10,
  },
  topThumbnails: {
    paddingVertical: 10,
    paddingLeft: 15,
    backgroundColor: theme.background,
  },
  topThumbnailsItem: {
    marginRight: 5,
  },
  topThumbnailsName: {
    color: theme.text2,
    fontSize: 12,
    textAlign: 'center',
    width: 50,
  },

  flexrow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flexGrow: 1,
  },

  card: {
    width: '100%',
    paddingVertical: 16,
    borderBottomColor: theme.text3,
    borderBottomWidth: 0.5,
  },
  cardbody: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flexGrow: 1,
    borderRightWidth: 1,
    paddingHorizontal: 16,
    width: '100%',
  },
  cardhead: {
    flexDirection: 'row',
    width: windowWidth * 0.74,
  },

  notificationHeader: {
    color: theme.text,
    fontSize: 12,
    fontWeight: 'bold',
    flex: 2,
  },

  notificationBody: {
    marginTop: 5,
    fontSize: 12,
    paddingRight: 80,
    color: theme.text2,
    fontWeight: 'bold',
  },
  notificationBody2: {
    color: 'green',
    fontSize: 11,
  },

  dot: {
    backgroundColor: 'green',
    borderRadius: 10,
    justifyContent: 'flex-end',
    width: 9,
    height: 9,
    marginRight: 5,
    alignSelf: 'center',
  },
});

export default Appointments;
