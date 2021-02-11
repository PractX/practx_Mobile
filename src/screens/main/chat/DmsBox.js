import { useTheme } from '@react-navigation/native';
import { usePubNub } from 'pubnub-react';
import React, { useEffect, useState } from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import normalize from '../../../utils/normalize';
import timeAgo from '../../../utils/timeAgo';

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
    setNewMessageTime(timeAgo(gmtDate));
  };
  // console.log(item);

  const getMessages = (cha, num) => {
    const myChannels = [cha];
    // console.log(cha);
    // console.log(num);

    pubnub.fetchMessages(
      {
        channels: [myChannels[0]],
        count: 1,
        end: time,
      },

      (status, data) => {
        // console.log(data);
        if (status.statusCode === 200) {
          let { channels } = data;
          // console.log(status);
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
            // console.log('new Msfg', message);
            setNewMessage(message);
            addTime(message);
          }
          // console.log(newMessage);
        }
      },
    );
  };
  // const handleMessage = (event) => {
  //   const message = event.message;
  //   if (typeof message === 'string' || message.hasOwnProperty('text')) {
  //     const text = message.text || message;
  //     // console.log(text);
  //     newMessage((messages) => [...messages, text]);
  //   }
  // };
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
      // pubnub.addListener({ message: handleMessage });
      // pubnub.subscribe([item.channelName]);
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
              channelName: item && item.channelName && item.channelName,
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
            {newMessage && newMessage.message && newMessage.message.text
              ? newMessage.message.text.length > 60
                ? newMessage.message.text.substring(0, 60 - 3) + '...'
                : newMessage.message.text
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
