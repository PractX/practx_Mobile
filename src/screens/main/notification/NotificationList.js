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
import timeAgo from '../../../utils/timeAgo';
import isToday from '../../../utils/isToday';

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

const NotificationList = ({ item, practice, currentUser, styling }) => {
  const { colors } = useTheme();
  const actionText = (action, practices) => {
    switch (action) {
      case 'Join request':
        return {
          text: `have just made a request to join ${practices.practiceName}, it is currently on pending and waiting for approval`,
          color: colors.text_2,
        };
      case 'Book appointment':
        return {
          text:
            'have just made a request to schedule an appointment with ${practices.practiceName}',
          color: colors.text_2,
        };
      case 'Book appointment for patient':
        return {
          text:
            'have just scheduled an appointment for you, please go to the appointment screen to view more details about the appointment date and time',
          color: colors.tertiary_1,
        };
      case 'Declined appointment':
        return {
          text:
            'have just declined your appointment schedule. You can chat with them to reschedule another date for the appointment',
          color: colors.danger,
        };
      case 'Approved appointment':
        return {
          text:
            'have just approved your appointment schedule, please go to appointment screen to view more details of the time and date.',
          color: colors.tertiary_1,
        };
      case 'Accept join request':
        return {
          text:
            'have just accepted your join request. Now you have access to chat with them, create a schedule for appoint, etc.',
          color: colors.tertiary_1,
        };
      case 'Remove patient':
        return {
          text:
            'have just removed you from there practices. You can request to join again, so you have access to chat with them, create a schedule for appoint, etc.',
          color: colors.danger,
        };
      case 'Leave practice':
        return {
          text: `have just left ${practices.practiceName}. So, you do not have access to chat with them, create a schedule for appoint, etc.`,
          color: colors.danger,
        };
      default:
        return { text: 'foo', color: colors.text_2 };
    }
  };
  return (
    <View
      style={[
        styling,
        styles.card,
        {
          width: appwidth,
          borderBottomColor: colors.background_1,
          borderBottomWidth: 0.5,
        },
      ]}>
      <View style={{ flexDirection: 'row', flex: 0.7 }}>
        <FastImage
          source={{
            uri:
              item.recipientId === item.patientId
                ? practice?.logo ||
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/200px-No-Image-Placeholder.svg.png'
                : currentUser?.avatar ||
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/200px-No-Image-Placeholder.svg.png',
            // values.avatar
            //   ? values.avatar
            //   : 'https://api.duniagames.co.id/api/content/upload/file/8143860661599124172.jpg',
          }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 20,
            backgroundColor: colors.background_1,
            borderWidth: 1,
            borderColor: colors.background_1,
            alignSelf: 'center',
            marginRight: 10,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View
          style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
          <View style={styles.cardhead}>
            <Text
              style={{
                fontSize: normalize(11),
                fontFamily: 'SofiaProSemiBold',
                color: colors.text,
              }}
              numberOfLines={2}>
              {item.recipientId === item.patientId
                ? practice.practiceName
                : 'You'}{' '}
              <Text
                style={{
                  fontSize: normalize(10),
                  fontFamily: 'SofiaProRegular',
                  color: colors.text,
                }}
                numberOfLines={2}>
                {actionText(item.action, practice).text}
              </Text>
            </Text>
          </View>
          <View
            style={{
              fontSize: normalize(8),
              fontFamily: 'SofiaProRegular',
              color: 'white',
              paddingHorizontal: 0,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                paddingVertical: 2,
                paddingHorizontal: 5,
                backgroundColor: actionText(item.action, practice).color,
              }}>
              <Text
                style={{
                  fontSize: normalize(8),
                  fontFamily: 'SofiaProRegular',
                  color: 'white',
                }}>
                {item.action}
              </Text>
            </View>
          </View>

          {/* ........ call text............. */}
        </View>
      </View>
      <View style={{ justifyContent: 'center' }}>
        {isToday(item.time.split('T')[0]) && (
          <View
            style={{
              backgroundColor: colors.quinary,
              width: 30,
              alignSelf: 'center',
              borderColor: colors.background_1,
              borderRadius: 2,
            }}>
            <Text
              style={{
                fontSize: normalize(9),
                fontFamily: 'SofiaProBlack',
                color: '#0000008e',
                textAlign: 'center',
              }}>
              NEW
            </Text>
          </View>
        )}
        <Text
          style={{
            marginTop: 5,
            fontSize: normalize(10),
            fontFamily: 'SofiaProMedium',
            color: theme.text2,
          }}>
          {isToday(item.createdAt)
            ? timeAgo(item.createdAt, 'short')
            : timeAgo(item.createdAt.split('T')[0], 'short')}
        </Text>
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
    // flexDirection: 'row',
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

export default NotificationList;
