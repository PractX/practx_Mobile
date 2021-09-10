import { useTheme } from '@react-navigation/native';
import { usePubNub } from 'pubnub-react';
import React, { useEffect, useState } from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { normalize } from 'react-native-elements';
import timeAgo from '../../../utils/timeAgo';
import firstLetterWord from '../../../utils/firstLetterWord';

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
  practices,
  subgroups,
  signals,
  currentUser,
}) => {
  const { colors } = useTheme();
  const pubnub = usePubNub();
  // const [{ messages }, setNewMessage] = useState(allMessages);
  // const { messages } = newMessages && newMessages;
  const [newMessageTime, setNewMessageTime] = useState('');
  const d = new Date();
  const time = d.getTime();

  // console.log('The whole Item', item);
  // const addTime = (message) => {

  // };
  // console.log(
  //   'Last____',
  //   allMessages.messages[allMessages.messages.length - 1].timetoken / 10000000,
  // );

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

  let groupChannel =
    item &&
    item.subgroupChats.length > 0 &&
    item.subgroupChats[0].PatientSubgroup.channelName;

  const getSignal = () =>
    signals ? signals.find((i) => i.channel === groupChannel) : null;
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
          signals: signals,
          groupPractice: practices && practices,
          group: item ? item : {},
          channelName:
            item &&
            item.subgroupChats.length > 0 &&
            item.subgroupChats[0].PatientSubgroup.channelName,
          practiceDms,
          subgroups: subgroups.find(
            (items) => items.practiceId === practices.id,
          ),
          type: 'group',
        });
      }}
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
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 15,
            backgroundColor: colors.background_1,
            overflow: 'hidden',
            justifyContent: 'center',
          }}>
          {/* <FastImage
            source={{
              uri:
                'https://cdn.raceroster.com/assets/images/team-placeholder.png',
            }}
            style={{
              width: 50,
              height: 50,
            }}
            resizeMode={FastImage.resizeMode.cover}
          /> */}
          <Text
            style={{
              color: colors.text,
              fontSize: normalize(18),
              fontFamily: 'SofiaProSemiBold',
              textTransform: 'capitalize',
              textAlign: 'center',
            }}>
            {item && item.name.indexOf(' ') >= 0
              ? firstLetterWord(item.name)
              : item.name.substring(0, 2)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ChatScreen', {
              groupPractice: practices && practices,
              group: item ? item : {},
              channelName:
                item &&
                item.subgroupChats.length > 0 &&
                item.subgroupChats[0].PatientSubgroup.channelName,
              practiceDms,
              subgroups: subgroups.find(
                (items) => items.practiceId === practices.id,
              ),
              type: 'group',
            });
          }}
          style={{
            marginLeft: 10,
            flexDirection: 'column',
            marginVertical: 2,
            paddingHorizontal: 4,
            width: appwidth - 140,
            // width: '62%',
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
            {item && item.name && item.name.length > 30
              ? item.name.substring(0, 30 - 3) + '...'
              : item && item.name
              ? item.name
              : ''}
          </Text>
          {(getSignal() &&
            getSignal().message.eventType === 'typing_on' &&
            getSignal().publisher !== currentUser.chatId) ||
          (getSignal() &&
            getSignal().message.eventType === 'recording_on' &&
            getSignal().publisher !== currentUser.chatId) ? (
            <Text
              style={{
                color: colors.text,
                fontSize: normalize(11),
                fontFamily: 'SofiaProRegular',
              }}>
              <Text
                style={{
                  textTransform: 'capitalize',
                }}>
                {getSignal().message.sentBy.split(' ')[0] +
                  ' ' +
                  getSignal().message.sentBy.split(' ')[1].substring(0, 1)}
              </Text>
              <Text style={{ textTransform: 'lowercase' }}>
                {` is ${getSignal().message.eventType.split('_')[0]}...`}
              </Text>
            </Text>
          ) : (
            <Text
              style={{
                color: colors.text,
                fontSize: normalize(11),
                fontFamily: 'SofiaProRegular',
              }}>
              {allMessages && allMessages.messages.length
                ? allMessages.messages[allMessages.messages.length - 1]
                    .message &&
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
                  : allMessages.messages[allMessages.messages.length - 1]
                      .message.file
                  ? allMessages.messages[
                      allMessages.messages.length - 1
                    ].message.file.name.match(/.(jpg|jpeg|png|gif)$/i)
                    ? '📷 Photo'
                    : allMessages.messages[
                        allMessages.messages.length - 1
                      ].message.file.name.match(/.(aac)$/i)
                    ? '🎤 Voice note '
                    : allMessages.messages[
                        allMessages.messages.length - 1
                      ].message.file.name.match(/.(mp4)$/i)
                    ? '🎥 Video'
                    : '📁 File'
                  : allMessages.messages[
                      allMessages.messages.length - 1
                    ].replace(/(\r\n|\n|\r)/gm, '')
                : '💬 Begin conversation'}
            </Text>
          )}
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

export default GroupBox;
