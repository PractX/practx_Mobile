import { useTheme } from '@react-navigation/native';
import { usePubNub } from 'pubnub-react';
import React, { useEffect, useState } from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { normalize } from 'react-native-elements';
import timeAgo from '../../../utils/timeAgo';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const DmsBox = ({
  id,
  item,
  navigation,
  practiceDms,
  styling,
  allMessages,
  subgroups,
}) => {
  const { colors } = useTheme();
  // const [{ messages }, setNewMessage] = useState(allMessages);
  // const { messages } = newMessages && newMessages;
  const [newMessageTime, setNewMessageTime] = useState('');
  const d = new Date();
  const time = d.getTime();
  const [dmMessage, setDmMessage] = useState(null);
  // const addTime = (message) => {

  // };
  // console.log(
  //   'Last____',
  //   allMessages.messages[allMessages.messages.length - 1].timetoken / 10000000,
  // );
  // console.log(newMessages);

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
  }, [allMessages, time]);
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
      onPress={() => {
        navigation.navigate('ChatScreen', {
          practice: item && item,
          channelName:
            item && item.Dm && item.Dm.channelName && item.Dm.channelName,
          practiceDms,
          subgroups: subgroups.find((items) => items.practiceId === item.id),
          group: null,
          navigation: navigation,
          type: 'dm',
        });
      }}
      style={[
        styling,
        {
          marginVertical: 20,
          flexDirection: 'row',
          // borderBottomWidth: 0.8,
          // borderBottomColor: colors.background_1,
          justifyContent: 'space-between',
          alignSelf: 'center',
        },
      ]}>
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 15,
            backgroundColor: colors.background_1,
            overflow: 'hidden',
          }}>
          <FastImage
            source={{
              uri:
                item && item.logo
                  ? item.logo
                  : 'https://www.ischool.berkeley.edu/sites/default/files/default_images/avatar.jpeg',
            }}
            style={{
              width: 50,
              height: 50,
              // marginVertical: 5,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ChatScreen', {
              practice: item && item,
              channelName:
                item && item.Dm && item.Dm.channelName && item.Dm.channelName,
              practiceDms,
              subgroups: subgroups.find(
                (items) => items.practiceId === item.id,
              ),
              group: null,
              navigation: navigation,
              type: 'dm',
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
              fontSize: normalize(12),
              fontFamily: 'SofiaProSemiBold',
              textTransform: 'capitalize',
            }}>
            {item && item.practiceName}
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: normalize(11),
              fontFamily: 'SofiaProRegular',
            }}>
            {allMessages && allMessages.messages.length
              ? allMessages.messages[allMessages.messages.length - 1].message &&
                allMessages.messages[allMessages.messages.length - 1].message
                  .text
                ? allMessages.messages[
                    allMessages.messages.length - 1
                  ].message.text.replace(/(\r\n|\n|\r)/gm, '').length > 60
                  ? allMessages.messages[
                      allMessages.messages.length - 1
                    ].message.text
                      .replace(/(\r\n|\n|\r)/gm, '')
                      .substring(0, 28 - 3) + '...'
                  : allMessages.messages[
                      allMessages.messages.length - 1
                    ].message.text.replace(/(\r\n|\n|\r)/gm, '')
                : allMessages.messages[allMessages.messages.length - 1].message
                    .file
                ? allMessages.messages[
                    allMessages.messages.length - 1
                  ].message.file.name.match(/.(jpg|jpeg|png|gif)$/i)
                  ? ' Photo'
                  : 'Video'
                : allMessages.messages[allMessages.messages.length - 1].replace(
                    /(\r\n|\n|\r)/gm,
                    '',
                  )
              : `ℹ️ Chat with ${item && item.practiceName}`}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ justifyContent: 'space-evenly', alignItems: 'center' }}>
        <Text
          style={{
            color: colors.text,
            fontSize: normalize(10),
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

export default DmsBox;
