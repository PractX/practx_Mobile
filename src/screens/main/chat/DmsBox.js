import { useTheme } from '@react-navigation/native';
import { usePubNub } from 'pubnub-react';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import normalize from '../../../utils/normalize';

const DmsBox = ({ item }) => {
  const { colors } = useTheme();
  const pubnub = usePubNub();
  const [newMessage, setNewMessage] = useState('');
  const d = new Date();
  const time = d.getTime();
  const getMessages = (cha, num) => {
    const myChannels = [cha];
    console.log(cha);
    console.log(num);

    pubnub.fetchMessages(
      {
        channels: [myChannels[0]],
        count: num,
        end: time,
      },

      (status, data) => {
        if (status.statusCode === 200) {
          let { channels } = data;
          console.log(status);
          console.log('Datas', ...channels[myChannels]);
          const { message } = channels[myChannels][0];
          console.log(message);
          setNewMessage(message);
          // console.log('new Msfg', message);
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
    // 16125953266304813;
    getMessages(item.dms[0].channelName, 1);
    pubnub.addListener({ message: handleMessage });
    pubnub.subscribe([item.dms[0].channelName]);
  }, [item.dms, pubnub]);
  return (
    <View
      style={{
        marginVertical: 20,
        flexDirection: 'row',
        // borderBottomWidth: 0.8,
        // borderBottomColor: colors.background_1,
      }}>
      <FastImage
        source={{
          uri:
            item && item.avatar
              ? item.avatar
              : 'https://www.ischool.berkeley.edu/sites/default/files/default_images/avatar.jpeg',
        }}
        style={{
          width: 60,
          height: 63,
          borderRadius: 15,
          backgroundColor: colors.background_1,
          marginVertical: 5,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <TouchableOpacity
        onPress={() => getMessages(item.dms[0].channelName, 10)}
        style={{
          marginLeft: 10,
          flexDirection: 'column',
          marginVertical: 2,
          paddingHorizontal: 4,
          // alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <Text
          style={{
            color: colors.text,
            fontSize: normalize(17),
            fontFamily: 'SofiaProSemiBold',
            textTransform: 'capitalize',
          }}>
          {item && item.firstname + ' ' + item.lastname}
        </Text>
        <Text
          style={{
            color: colors.text_1,
            fontSize: normalize(13),
            fontFamily: 'SofiaProRegular',
          }}>
          {newMessage && newMessage.text}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DmsBox;
