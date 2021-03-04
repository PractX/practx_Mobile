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

const GroupBox = ({
  id,
  item,
  navigation,
  practiceDms,
  styling,
  allMessages,
}) => {
  const { colors } = useTheme();
  const pubnub = usePubNub();
  // const [{ messages }, setNewMessage] = useState(allMessages);
  // const { messages } = newMessages && newMessages;
  const [newMessageTime, setNewMessageTime] = useState('');
  const d = new Date();
  const time = d.getTime();
  // const addTime = (message) => {

  // };
  // console.log(
  //   'Last____',
  //   allMessages.messages[allMessages.messages.length - 1].timetoken / 10000000,
  // );
  console.log(item);
  console.log(allMessages);

  useEffect(() => {
    if (allMessages) {
      const unixTimestamp =
        allMessages &&
        allMessages.messages[allMessages.messages.length - 1].timetoken /
          10000000;
      const gmtDate = new Date(unixTimestamp * 1000);
      // const localeDateTime = gmtDate.toLocaleString();
      setNewMessageTime(timeAgo(gmtDate));
    }
  }, [allMessages]);
  // const handleMessage = (event) => {
  //   const message = event.message;
  //   if (typeof message === 'string' || message.hasOwnProperty('text')) {
  //     const text = message.text || message;
  //     // console.log(text);
  //     newMessage((messages) => [...messages, text]);
  //   }
  // };
  // useEffect(() => {
  //   // var d = new Date('16125953266304813');
  //   var timeValue = 16125953266304813;
  //   // document.write(new Date(timeValue / 1e4));
  //   console.log(new Date(timeValue / 1e4));
  //   // const message = channels[myChannels][0];
  //   // 16125953266304813;
  //   console.log(newMessage);
  //   if (item) {
  //     getMessages(item.channelName, 1);
  //     // pubnub.addListener({ message: handleMessage });
  //     // pubnub.subscribe([item.channelName]);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [item, pubnub]);
  return (
    <TouchableOpacity
      onPress={() => console.log('clicking')}
      style={[
        styling,
        {
          marginVertical: 10,
          flexDirection: 'row',
          // borderBottomWidth: 0.8,
          // borderBottomColor: colors.background_1,
          justifyContent: 'space-between',
          alignSelf: 'center',
        },
      ]}>
      <View style={{ flexDirection: 'row' }}>
        <FastImage
          source={{
            uri:
              'https://cdn.raceroster.com/assets/images/team-placeholder.png',
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
            navigation.navigate('ChatScreen', {
              group: item ? item : {},
              channelName: item && item.channelName && item.channelName,
              practiceDms,
              type: 'group',
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
            {item && item.name}
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: normalize(12),
              fontFamily: 'SofiaProRegular',
            }}>
            {allMessages
              ? allMessages.messages.length &&
                allMessages.messages[allMessages.messages.length - 1].message &&
                allMessages.messages[allMessages.messages.length - 1].message
                  .text
                ? allMessages.messages[allMessages.messages.length - 1].message
                    .text.length > 60
                  ? allMessages.messages[
                      allMessages.messages.length - 1
                    ].message.text.substring(0, 60 - 3) + '...'
                  : allMessages.messages[allMessages.messages.length - 1]
                      .message.text
                : allMessages.messages[allMessages.messages.length - 1]
              : 'ℹ️ Begin conversation'}
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
          {allMessages && newMessageTime ? newMessageTime : null}
        </Text>
        {/* <View
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
        </View> */}
      </View>
    </TouchableOpacity>
  );
};

export default GroupBox;
