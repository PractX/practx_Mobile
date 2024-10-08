import React, { useEffect, useState, useContext } from 'react';
// import Constants from 'expo-constants';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
// import { ThemeContext } from '../context/ThemeContext';

// import {
//   Button,
//   Text,
//   Content,
//   Header,
//   Title,
//   Right,
//   Left,
//   Body,
//   Thumbnail,
// } from 'native-base';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import { normalize } from 'react-native-elements';

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

const AppointmentList = ({ item, practice, status, styling }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styling,
        styles.card,
        { borderBottomColor: colors.background_1, borderBottomWidth: 0.5 },
      ]}>
      <View style={{ flexDirection: 'row' }}>
        <FastImage
          source={{
            uri: practice?.logo
              ? practice?.logo
              : 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/200px-No-Image-Placeholder.svg.png',
            // values.avatar
            //   ? values.avatar
            //   : 'https://api.duniagames.co.id/api/content/upload/file/8143860661599124172.jpg',
          }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 20,
            backgroundColor: colors.background_1,
            alignSelf: 'center',
            marginRight: 10,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={{}}>
          <View style={styles.cardhead}>
            <Text
              style={{
                fontSize: normalize(12),
                fontFamily: 'SofiaProSemiBold',
                color: colors.text,
              }}>
              {item.title}
            </Text>
          </View>

          <Text
            style={{
              marginTop: 5,
              fontSize: normalize(11),
              fontFamily: 'SofiaProRegular',
              color: theme.text2,
            }}>
            {/* 09:00 AM - 12:00 PM */}
            {/* {moment(item.date).format('d MMM')} */}
            {moment(item.date).format('HH:mm A') +
              ' - ' +
              (
                '0' +
                parseInt(
                  item?.duration?.hours
                    ? parseInt(
                        moment(item.date).format('HH:mmA').split(':')[0],
                        10,
                      ) + item?.duration?.hours
                    : parseInt(
                        moment(item.date).format('HH:mmA').split(':')[0],
                        10,
                      ),
                  10,
                )
              ).slice(-2) +
              ':' +
              (
                '0' +
                parseInt(
                  item?.duration?.minutes
                    ? parseInt(
                        moment(item.date).format('HH:mmA').split(':')[1],
                        10,
                      ) + item?.duration?.minutes
                    : parseInt(
                        moment(item.date).format('HH:mmA').split(':')[1],
                        10,
                      ),
                  10,
                )
              ).slice(-2) +
              moment(item.date).format(' A')}
          </Text>

          {/* ........ call text............. */}

          <View style={{ ...styles.flexrow, marginTop: 3 }}>
            <View
              style={{
                ...styles.dot,
                backgroundColor:
                  status === 'pending'
                    ? colors.text_2
                    : status === 'approved'
                    ? colors.tertiary
                    : colors.danger,
              }}
            />
            <Text
              style={{
                color:
                  status === 'pending'
                    ? colors.text_2
                    : status === 'approved'
                    ? colors.tertiary
                    : colors.danger,
                fontSize: normalize(10.5),
                fontFamily: 'SofiaProRegular',
                textTransform: 'capitalize',
              }}>
              {status}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ justifyContent: 'center' }}>
        <TouchableOpacity
          style={{
            // backgroundColor:
            //   status === 'pending'
            //     ? colors.text_2
            //     : status === 'approved'
            //     ? colors.tertiary
            //     : colors.danger,
            borderRadius: 10,
            marginBottom: 5,
            width: 35,
            height: 35,
            justifyContent: 'center',
          }}>
          <Icon
            type={'ionicon'}
            name={
              status === 'pending'
                ? 'ios-time-sharp'
                : status === 'approved'
                ? 'ios-checkmark-circle-sharp'
                : 'ios-close-circle-sharp'
            }
            color={
              status === 'pending'
                ? colors.text_2
                : status === 'approved'
                ? colors.tertiary
                : colors.danger
            }
            size={normalize(32)}
            style={
              {
                // fontSize: 11,
                // margin: 0,
                // alignSelf: 'center',
              }
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flexrow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flexGrow: 1,
    alignItems: 'center',
  },

  card: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  cardhead: {
    flexDirection: 'row',
  },
  dot: {
    backgroundColor: 'green',
    borderRadius: 10,
    justifyContent: 'flex-end',
    width: 6,
    height: 6,
    marginRight: 5,
    alignSelf: 'center',
  },
});

export default AppointmentList;
