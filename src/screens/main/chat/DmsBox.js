import { useTheme } from '@react-navigation/native';
import { usePubNub } from 'pubnub-react';
import React, { useEffect, useState } from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import normalize from '../../../utils/normalize';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const DmsBox = ({ id, item, navigation, practiceDms }) => {
  const { colors } = useTheme();
  const pubnub = usePubNub();
  const [newMessage, setNewMessage] = useState('');
  const [newMessageTime, setNewMessageTime] = useState('');
  const d = new Date();
  const time = d.getTime();
  const addTime = (message) => {
    const unixTimestamp = message.timetoken / 10000000;
    const gmtDate = new Date(unixTimestamp * 1000);
    // const localeDateTime = gmtDate.toLocaleString();
    setNewMessageTime(time_ago(gmtDate));
  };

  const time_ago = (time) => {
    switch (typeof time) {
      case 'number':
        break;
      case 'string':
        time = +new Date(time);
        break;
      case 'object':
        if (time.constructor === Date) {
          time = time.getTime();
        }
        break;
      default:
        time = +new Date();
    }
    let time_formats = [
      [60, 'seconds', 1], // 60
      [120, '1 minute ago', '1 minute from now'], // 60*2
      [3600, 'minutes', 60], // 60*60, 60
      [7200, '1 hour ago', '1 hour from now'], // 60*60*2
      [86400, 'hours', 3600], // 60*60*24, 60*60
      [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
      [604800, 'days', 86400], // 60*60*24*7, 60*60*24
      [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
      [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
      [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
      [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
      [58060800000, 'centuries', 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
      token = 'ago',
      list_choice = 1;

    if (seconds == 0) {
      return 'Just now';
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'from now';
      list_choice = 2;
    }
    var i = 0,
      format;
    while ((format = time_formats[i++])) {
      if (seconds < format[0]) {
        if (typeof format[2] === 'string') {
          return format[list_choice];
        } else {
          return (
            Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token
          );
        }
      }
    }
    return time;
  };

  const getMessages = (cha, num) => {
    const myChannels = [cha];
    console.log(cha);
    console.log(num);

    pubnub.fetchMessages(
      {
        channels: [myChannels[0]],
        count: 1,
        end: time,
      },

      (status, data) => {
        if (status.statusCode === 200) {
          let { channels } = data;
          console.log(status);
          if (Object.keys(channels).length === 0) {
            console.log(Object.keys(channels).length === 0);
            // console.log(channels);
            // console.log('Datas', ...channels[myChannels]);
            setNewMessage(
              `ℹ️ Click here to send a direct message to ${
                item && item.Practice && item.Practice.practiceName
              }`,
            );
            addTime('');
          } else {
            // const unixTimestamp = message.timetoken / 10000000;
            // const gmtDate = new Date(unixTimestamp * 1000);
            // const localeDateTime = gmtDate.toLocaleString();
            const message = channels[myChannels][0];
            // console.log('Hello', localeDateTime);
            console.log('new Msfg', message);
            setNewMessage(message);
            addTime(message);
          }
          console.log(newMessage);
        }
      },
    );
  };
  const handleMessage = (event) => {
    const message = event.message;
    if (typeof message === 'string' || message.hasOwnProperty('text')) {
      const text = message.text || message;
      // console.log(text);
      newMessage((messages) => [...messages, text]);
    }
  };
  useEffect(() => {
    // var d = new Date('16125953266304813');
    var timeValue = 16125953266304813;
    // document.write(new Date(timeValue / 1e4));
    console.log(new Date(timeValue / 1e4));
    // const message = channels[myChannels][0];
    // 16125953266304813;
    console.log(newMessage);
    if (item) {
      getMessages(item.channelName, 1);
      pubnub.addListener({ message: handleMessage });
      pubnub.subscribe([item.channelName]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, pubnub]);
  return (
    <TouchableOpacity
      onPress={() => console.log('clicking')}
      style={{
        marginVertical: 20,
        flexDirection: 'row',
        // borderBottomWidth: 0.8,
        // borderBottomColor: colors.background_1,
        justifyContent: 'space-between',
        width: appwidth,
        alignSelf: 'center',
      }}>
      <View style={{ flexDirection: 'row' }}>
        <FastImage
          source={{
            uri:
              item && item.Practice && item.Practice.logo
                ? item.Practice.logo
                : 'https://www.ischool.berkeley.edu/sites/default/files/default_images/avatar.jpeg',
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 15,
            backgroundColor: colors.background_1,
            marginVertical: 5,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <TouchableOpacity
          onPress={() => {
            getMessages(item && item.channelName, 10);
            navigation.navigate('ChatScreen', {
              practice: item && item.Practice && item.Practice,
              practiceDms,
            });
          }}
          style={{
            marginLeft: 10,
            flexDirection: 'column',
            marginVertical: 2,
            paddingHorizontal: 4,
            width: appwidth - 140,
            // alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <Text
            style={{
              color: colors.text,
              fontSize: normalize(15),
              fontFamily: 'SofiaProSemiBold',
              textTransform: 'capitalize',
            }}>
            {item && item.Practice && item.Practice.practiceName}
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: normalize(12),
              fontFamily: 'SofiaProRegular',
            }}>
            {newMessage && newMessage.message && newMessage.message.length > 60
              ? newMessage.message.substring(0, 60 - 3) + '...'
              : newMessage.message
              ? newMessage.message
              : newMessage}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ justifyContent: 'space-evenly', alignItems: 'center' }}>
        <Text
          style={{
            color: colors.text,
            fontSize: normalize(11),
            fontFamily: 'SofiaProRegular',
          }}>
          {newMessageTime ? newMessageTime : null}
        </Text>
        <View
          style={{
            backgroundColor: colors.primary,
            borderRadius: 8,
            paddingVertical: 5,
            paddingHorizontal: 12,
            // width: 20,
            // height: 20,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: normalize(13),
              fontFamily: 'SofiaProRegular',
              // backgroundColor: colors.primary,
              textAlign: 'center',
            }}>
            {1}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DmsBox;
