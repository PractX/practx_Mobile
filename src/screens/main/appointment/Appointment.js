import React, { useEffect, useState, useContext } from 'react';
// import Constants from 'expo-constants';
import * as Animatable from 'react-native-animatable';
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
import normalize from '../../../utils/normalize';

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

const Appointment = ({ type }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row' }}>
        <FastImage
          source={{
            uri:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/200px-No-Image-Placeholder.svg.png',
            // values.avatar
            //   ? values.avatar
            //   : 'https://api.duniagames.co.id/api/content/upload/file/8143860661599124172.jpg',
          }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 10,
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
                fontSize: normalize(14),
                fontFamily: 'SofiaProSemiBold',
                color: colors.text,
              }}>
              Dr John Snow
            </Text>
          </View>

          <Text
            style={{
              marginTop: 5,
              fontSize: normalize(12),
              fontFamily: 'SofiaProRegular',
              color: theme.text2,
            }}>
            09:00 AM - 12:00 PM
          </Text>

          {/* ........ call text............. */}

          <View style={{ ...styles.flexrow, marginTop: 3 }}>
            <View
              style={{
                ...styles.dot,
                backgroundColor:
                  type === 'video' ? colors.quinary : colors.quaternary,
              }}
            />
            <Text
              style={{
                color: type === 'video' ? colors.quinary : colors.quaternary,
                fontSize: normalize(10),
                fontFamily: 'SofiaProRegular',
              }}>
              {type === 'video' ? 'Video call' : 'Voice call'}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ justifyContent: 'center' }}>
        <TouchableOpacity
          style={{
            backgroundColor:
              type === 'video' ? colors.quinary : colors.quaternary,
            borderRadius: 10,
            marginBottom: 5,
            width: 35,
            height: 35,
            justifyContent: 'center',
          }}>
          <Icon
            type={type === 'video' ? 'foundation' : 'foundation'}
            name={type === 'video' ? 'video' : 'telephone'}
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
    alignItems: 'center',
  },

  card: {
    width: appwidth,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomColor: theme.text3,
    borderBottomWidth: 0.5,
  },
  cardhead: {
    flexDirection: 'row',
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

export default Appointment;
