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

const NotificationList = ({
  item,
  practice,
  status,
  notificationData,
  styling,
  section,
}) => {
  const { colors } = useTheme();
  console.log(section);
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
            {timeAgo(item.time)}
          </Text>

          {/* ........ call text............. */}
        </View>
      </View>
      <View style={{ justifyContent: 'center' }}>
        <TouchableOpacity
          style={{
            backgroundColor:
              status === 'pending'
                ? colors.text_2
                : status === 'approved'
                ? colors.tertiary
                : colors.danger,
            borderRadius: 10,
            marginBottom: 5,
            width: 35,
            height: 35,
            justifyContent: 'center',
          }}>
          <Icon
            type={status === 'video' ? 'foundation' : 'foundation'}
            name={status === 'video' ? 'video' : 'telephone'}
            color="white"
            size={normalize(18)}
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

export default NotificationList;
