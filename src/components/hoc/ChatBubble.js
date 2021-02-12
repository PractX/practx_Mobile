import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { Dimensions } from 'react-native';
import normalize from '../../utils/normalize';
import timeAgo from '../../utils/timeAgo';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const ChatBubble = ({ practice, message }) => {
  const { colors } = useTheme();
  console.log('Bubble', practice);
  console.log('message', message);
  const checkAmPm = (time) => {
    if (time.split(':')[0] > 12) {
      return time + ' pm';
    } else {
      return time + ' am';
    }
  };
  const addTime = (msg) => {
    const unixTimestamp = msg.timetoken / 10000000;
    const gmtDate = new Date(unixTimestamp * 1000);
    const localeDateTime = gmtDate.toLocaleString();
    const time = localeDateTime.split(', ')[1];
    return checkAmPm(time.slice(0, -3));
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        width: appwidth,
        alignSelf: 'center',
        marginVertical: 20,
      }}>
      <FastImage
        source={{
          uri:
            (practice && practice.logo) ||
            'https://www.ischool.berkeley.edu/sites/default/files/default_images/avatar.jpeg',
        }}
        style={[
          {
            width: 35,
            height: 35,
            borderRadius: 15,
            backgroundColor: colors.background_1,
            marginVertical: 5,
            justifyContent: 'flex-end',
            alignSelf: 'flex-end',
            marginBottom: 17,
          },
        ]}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View
        style={{
          flexDirection: 'column',
          maxWidth: appwidth - 80,
          marginLeft: 15,
        }}>
        <View
          style={{
            // minHeight: 50,
            backgroundColor: colors.background_1,
            // alignItems: 'center',
            maxWidth: appwidth - 80,
            justifyContent: 'center',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            padding: 15,
          }}>
          <Text
            style={{
              fontSize: normalize(14),
              fontFamily: 'SofiaProRegular',
              color: colors.text,
              textAlign: 'left',
            }}>
            {message.message.text && message.message.text}
          </Text>
        </View>
        <Text
          style={{
            fontSize: normalize(12),
            fontFamily: 'SofiaProRegular',
            color: colors.text,
          }}>
          Message sent {addTime(message)}
        </Text>
      </View>
    </View>
  );
};

export default ChatBubble;
