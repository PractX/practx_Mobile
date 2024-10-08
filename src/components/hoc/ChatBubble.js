import React, { useCallback, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { Dimensions } from 'react-native';
import { normalize } from 'react-native-elements';
import timeAgo from '../../utils/timeAgo';
import { usePubNub } from 'pubnub-react';
import { Day } from 'react-native-gifted-chat';
import moment from 'moment';
import { Icon } from 'react-native-elements';
// import Video from 'react-native-video';
import { useRef } from 'react';
import AudioPlayer from '../../utils/audioPlayer';
import { TouchableOpacity } from 'react-native';
// import WaveForm from 'react-native-audiowaveform';
// import Audio from 'react-native-video';
import ProgressBar from '../../utils/progressBar';
import { useState } from 'react';
import VoiceNoteRecorder from './VoiceNoteRecorder';
import typingIcon from '../../../assets/gif/typingIndicator.gif';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const ChatBubble = ({
  id,
  practice,
  groupPractice,
  message,
  patientChatId,
  index,
  practiceStaff,
  // onStartPlay,
  // onPausePlay,
  // onStopPlay,
  // audioTime,
  setIsVisible,
  setChatMediaPrev,
  setIsVideoVisible,
}) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const { colors } = useTheme();
  const pubnub = usePubNub();

  let rate = 10000;

  // console.log(Player.isStopped);
  // console.log(audioPlayers);
  // console.log('Bubble ID', audioRef);
  const checkAmPm = time => {
    if (time.split(':')[0] > 12) {
      return time + ' pm';
    } else {
      return time + ' am';
    }
  };

  const addTime = msg => {
    const unixTimestamp = msg.timetoken / 10000000;
    // const gmtDate = new Date(unixTimestamp * 1000);
    // const localeDateTime = gmtDate.toLocaleString('en-US', {
    //   weekday: 'short',
    //   // hour12: false,
    //   hour: 'numeric',
    //   minute: 'numeric',
    // });
    // const time = localeDateTime;
    // console.log('new time >>>', time, '---Old time >>', localeDateTime);
    // // return time.slice(0, -6) + ' ' + time.slice(-2);
    // // const time = localeDateTime.split(', ')[1].substring(6);
    // // return checkAmPm(time);
    // return time.replace('AM', 'am').replace('PM', 'pm');
    const newDate = new Date(unixTimestamp * 1000);
    return moment(newDate).format('ddd hh:mm a');
  };

  return (
    <View key={index} style={{ width: appwidth, alignSelf: 'center' }}>
      {/* <Text>{addTime(message).split(', ')[0]}</Text> */}
      {message.uuid === patientChatId ? (
        <View
          style={{
            alignSelf: 'flex-end',
            flexDirection: 'column',
            maxWidth: appwidth - 50,
            marginVertical: 20,
          }}>
          {message.messageType === 4 ? (
            <View
              style={{
                height: message.message.file.name.match(/.(aac)$/i)
                  ? null
                  : 252,
                backgroundColor: colors.primary,
                alignItems: 'center',
                width: 252,
                justifyContent: 'center',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderBottomLeftRadius: 20,
              }}>
              {message.message.file.name.match(/.(jpg|jpeg|png|gif)$/i) ? (
                <TouchableOpacity
                  onPress={() => {
                    setChatMediaPrev(
                      pubnub.getFileUrl({
                        channel: message.channel,
                        id: message.message.file.id,
                        name: message.message.file.name,
                      }),
                    );
                    setIsVisible(true);
                  }}>
                  <FastImage
                    source={{
                      uri: pubnub.getFileUrl({
                        channel: message.channel,
                        id: message.message.file.id,
                        name: message.message.file.name,
                      }),
                      priority: FastImage.priority.high,
                    }}
                    style={[
                      {
                        width: 250,
                        height: 250,
                        backgroundColor: colors.background_1,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        borderBottomLeftRadius: 20,
                      },
                      // currentPracticeId === practice.id && {
                      //   borderWidth: 1,
                      //   borderColor: colors.text,
                      // },
                    ]}
                    resizeMode={FastImage.resizeMode.cover}>
                    {/* {currentPracticeId === practice.id && <Icon
            name={'primitive-dot'}
            type={'octicon'}
            color={colors.text}
            size={normalize(13)}
            style={[
              {
                right: 5,
                alignSelf: 'flex-end',
              },
            ]}
          />} */}
                  </FastImage>
                </TouchableOpacity>
              ) : message.message.file.name.match(/.(mp4)$/i) ? (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setChatMediaPrev(
                        pubnub.getFileUrl({
                          channel: message.channel,
                          id: message.message.file.id,
                          name: message.message.file.name,
                        }),
                      );
                      setIsVideoVisible(true);
                    }}>
                    <FastImage
                      source={{
                        uri: pubnub.getFileUrl({
                          channel: message.channel,
                          id: message.message.file.id,
                          name: message.message.file.name,
                        }),
                        priority: FastImage.priority.high,
                      }}
                      style={[
                        {
                          width: 250,
                          height: 250,
                          backgroundColor: colors.background_1,
                          borderTopLeftRadius: 20,
                          borderTopRightRadius: 20,
                          borderBottomLeftRadius: 20,
                        },
                        // currentPracticeId === practice.id && {
                        //   borderWidth: 1,
                        //   borderColor: colors.text,
                        // },
                      ]}
                      resizeMode={FastImage.resizeMode.cover}>
                      <Icon
                        name={'play-circle'}
                        type={'font-awesome'}
                        color={colors.text}
                        size={normalize(55)}
                        style={[{ alignSelf: 'center', marginTop: '40%' }]}
                      />
                    </FastImage>
                  </TouchableOpacity>
                </>
              ) : message.message.file.name.match(/.(aac)$/i) ? (
                <VoiceNoteRecorder
                  position="right"
                  voiceNoteUrl={
                    message.messageType === 4 &&
                    message.message.file.name.match(/.(aac)$/i)
                      ? pubnub.getFileUrl({
                          channel: message.channel,
                          id: message.message.file.id,
                          name: message.message.file.name,
                        })
                      : null
                  }
                />
              ) : (
                <Text>Doc</Text>
              )}
            </View>
          ) : (
            <View
              style={{
                // minHeight: 50,
                backgroundColor: colors.primary,
                alignItems: 'flex-start',
                // width: 80,
                // maxWidth: appwidth - 80,
                justifyContent: 'center',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderBottomLeftRadius: 20,
                padding: 15,
              }}>
              <Text
                style={{
                  fontSize: normalize(12),
                  fontFamily: 'SofiaProRegular',
                  color: 'white',
                  textAlign: 'left',
                }}>
                {message.message.text && message.message.text}
              </Text>
            </View>
          )}
          <Text
            style={{
              fontSize: normalize(10),
              fontFamily: 'SofiaProLight',
              color: colors.text,
              textAlign: 'right',
              paddingRight: 10,
              paddingTop: 3,
            }}>
            {addTime(message)}
          </Text>
        </View>
      ) : (
        //NOTE PRACTICE
        <View
          style={{
            flexDirection: 'row',
            maxWidth: appwidth - 50,
            alignSelf: 'flex-start',
            marginVertical: 20,
          }}>
          <FastImage
            source={{
              uri:
                message.message.userType === 'practice' && groupPractice
                  ? groupPractice?.logo
                  : practice
                  ? practice?.logo
                  : practiceStaff.length
                  ? message.message.file
                    ? practiceStaff.find(
                        staff => staff.id === message.message.message.staffId,
                      )
                      ? practiceStaff.find(
                          staff => staff.id === message.message.message.staffId,
                        ).avatar ||
                        'https://www.ischool.berkeley.edu/sites/default/files/default_images/avatar.jpeg'
                      : groupPractice?.logo ||
                        'https://www.ischool.berkeley.edu/sites/default/files/default_images/avatar.jpeg'
                    : practiceStaff.find(
                        staff => staff.id === message.message.staffId,
                      )
                    ? practiceStaff.find(
                        staff => staff.id === message.message.staffId,
                      ).avatar ||
                      'https://www.ischool.berkeley.edu/sites/default/files/default_images/avatar.jpeg'
                    : 'https://www.ischool.berkeley.edu/sites/default/files/default_images/avatar.jpeg'
                  : 'https://www.ischool.berkeley.edu/sites/default/files/default_images/avatar.jpeg',
            }}
            style={[
              {
                width: 35,
                height: 35,
                borderRadius: 15,
                backgroundColor: colors.background_1,
                marginVertical: 5,
                // justifyContent: 'flex-end',
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
            {message.messageType === 4 ? (
              <View
                style={{
                  height: message.message.file.name.match(/.(aac|svg)$/i)
                    ? null
                    : 252,
                  backgroundColor: colors.background_1,
                  alignItems: 'center',
                  width: message.message.file.name.match(/.(pdf|svg|doc|txt)$/i)
                    ? null
                    : 252,
                  // width: appwidth - 50,
                  justifyContent: 'center',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  borderBottomRightRadius: 20,
                }}>
                {message.message.message.userType === 'practice' && (
                  <Text
                    style={{
                      fontSize: normalize(10),
                      fontFamily: 'SofiaProLight',
                      color: colors.primary,
                      alignSelf: 'flex-start',
                      paddingLeft: 15,
                      top: 8,
                      textAlign: 'left',
                      paddingBottom: 5,
                      textTransform: 'capitalize',
                    }}>
                    {groupPractice
                      ? groupPractice.practiceName
                      : practice
                      ? practice.practiceName
                      : 'Practice'}
                  </Text>
                )}
                {message.message.message.userType === 'staff' && (
                  <View
                    style={{
                      textAlign: 'left',
                      paddingBottom: 5,
                      flexDirection: 'row',
                      paddingLeft: 15,
                      alignSelf: 'flex-start',
                      top: 8,
                    }}>
                    <Text
                      style={{
                        fontSize: normalize(10),
                        fontFamily: 'SofiaProRegular',
                        color: colors.primary,
                        textAlign: 'left',
                        paddingBottom: 5,
                        marginRight: 6,
                      }}>
                      Staff
                    </Text>
                    <Text
                      style={{
                        fontSize: normalize(10),
                        fontFamily: 'SofiaProLight',
                        color: colors.text_2,
                        textAlign: 'left',
                        paddingBottom: 5,
                        textTransform: 'capitalize',
                      }}>
                      {practiceStaff.length
                        ? practiceStaff.find(
                            staff =>
                              staff.id === message.message.message.staffId,
                          ).firstname
                        : ''}
                    </Text>
                  </View>
                )}
                {/* //NOTE */}
                {message.message.file.name.match(/.(jpg|jpeg|png|gif)$/i) ? (
                  <TouchableOpacity
                    onPress={() => {
                      setChatMediaPrev(
                        pubnub.getFileUrl({
                          channel: message.channel,
                          id: message.message.file.id,
                          name: message.message.file.name,
                        }),
                      );
                      setIsVisible(true);
                    }}>
                    <FastImage
                      source={{
                        uri: pubnub.getFileUrl({
                          channel: message.channel,
                          id: message.message.file.id,
                          name: message.message.file.name,
                        }),
                        priority: FastImage.priority.high,
                      }}
                      style={[
                        {
                          width: 250,
                          height: 220,
                          backgroundColor: colors.background_1,
                          // borderTopLeftRadius: 20,
                          // borderTopRightRadius: 20,
                          borderBottomRightRadius: 20,
                          marginTop: 10,
                        },
                        // currentPracticeId === practice.id && {
                        //   borderWidth: 1,
                        //   borderColor: colors.text,
                        // },
                      ]}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </TouchableOpacity>
                ) : message.message.file.name.match(/.(mp4)$/i) ? (
                  <TouchableOpacity
                    onPress={() => {
                      setChatMediaPrev(
                        pubnub.getFileUrl({
                          channel: message.channel,
                          id: message.message.file.id,
                          name: message.message.file.name,
                        }),
                      );
                      setIsVideoVisible(true);
                    }}>
                    <FastImage
                      source={{
                        uri: pubnub.getFileUrl({
                          channel: message.channel,
                          id: message.message.file.id,
                          name: message.message.file.name,
                        }),
                        priority: FastImage.priority.high,
                      }}
                      style={[
                        {
                          width: 250,
                          height: 220,
                          backgroundColor: colors.background_1,
                          // borderTopLeftRadius: 20,
                          // borderTopRightRadius: 20,
                          borderBottomRightRadius: 20,
                          marginTop: 10,
                        },
                        // currentPracticeId === practice.id && {
                        //   borderWidth: 1,
                        //   borderColor: colors.text,
                        // },
                      ]}
                      resizeMode={FastImage.resizeMode.cover}>
                      <Icon
                        name={'play-circle'}
                        type={'font-awesome'}
                        color={colors.text}
                        size={normalize(55)}
                        style={[{ alignSelf: 'center', marginTop: '30%' }]}
                      />
                    </FastImage>
                  </TouchableOpacity>
                ) : message.message.file.name.match(/.(aac)$/i) ? (
                  <VoiceNoteRecorder
                    position="left"
                    voiceNoteUrl={
                      message.messageType === 4 &&
                      message.message.file.name.match(/.(aac)$/i)
                        ? pubnub.getFileUrl({
                            channel: message.channel,
                            id: message.message.file.id,
                            name: message.message.file.name,
                          })
                        : null
                    }
                  />
                ) : (
                  <View
                    style={{
                      alignSelf: 'center',
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 20,
                    }}>
                    <Icon
                      name={'file-document'}
                      type={'material-community'}
                      color={colors.text}
                      size={normalize(60)}
                      style={{
                        alignSelf: 'center',
                        paddingTop: 20,
                        // marginBottom: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: normalize(10),
                        fontFamily: 'SofiaProRegular',
                        color: colors.primary,
                        textAlign: 'left',
                        paddingTop: 15,
                        paddingBottom: 10,
                        marginRight: 6,
                      }}>
                      {message.message.file.name}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View
                style={{
                  // minHeight: 50,
                  backgroundColor: colors.background_1,
                  // alignItems: 'center',
                  justifyContent: 'center',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  borderBottomRightRadius: 20,
                  padding: 15,
                }}>
                {message.message.userType === 'practice' && (
                  <Text
                    style={{
                      fontSize: normalize(10),
                      fontFamily: 'SofiaProLight',
                      color: colors.primary,
                      textAlign: 'left',
                      paddingBottom: 5,
                      textTransform: 'capitalize',
                    }}>
                    {groupPractice
                      ? groupPractice.practiceName
                      : practice
                      ? practice.practiceName
                      : 'Practice'}
                  </Text>
                )}
                {message.message.userType === 'staff' && (
                  <View
                    style={{
                      textAlign: 'left',
                      paddingBottom: 5,
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        fontSize: normalize(10),
                        fontFamily: 'SofiaProRegular',
                        color: colors.primary,
                        textAlign: 'left',
                        paddingBottom: 5,
                        marginRight: 6,
                      }}>
                      Staff
                    </Text>
                    <Text
                      style={{
                        fontSize: normalize(10),
                        fontFamily: 'SofiaProLight',
                        color: colors.text_2,
                        textAlign: 'left',
                        paddingBottom: 5,
                        textTransform: 'capitalize',
                      }}>
                      {practiceStaff.length
                        ? practiceStaff.find(
                            staff => staff.id === message.message.staffId,
                          ).firstname
                        : ''}
                    </Text>
                  </View>
                )}
                {message.message.userType === 'patient' && (
                  <Text
                    style={{
                      fontSize: normalize(10),
                      fontFamily: 'SofiaProLight',
                      color: colors.text_2,
                      textAlign: 'left',
                      paddingBottom: 5,
                    }}>
                    {message.message.profile.name}
                  </Text>
                )}
                {message.messageType === 10 ? (
                  <FastImage
                    source={typingIcon}
                    style={[
                      {
                        width: 40,
                        height: 20,
                        backgroundColor: colors.background_1,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20,
                        alignSelf: 'center',
                      },
                    ]}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                ) : (
                  <Text
                    style={{
                      fontSize: normalize(12),
                      fontFamily: 'SofiaProRegular',
                      color: colors.text,
                      textAlign: 'left',
                    }}>
                    {message.message.text && message.message.text}
                  </Text>
                )}
              </View>
            )}
            {message.messageType === 10 ? (
              <Text
                style={{
                  fontSize: normalize(10),
                  fontFamily: 'SofiaProLight',
                  color: colors.text,
                  paddingTop: 3,
                  // textTransform: 'capitalize',
                }}>
                <Text
                  style={{
                    textTransform: 'capitalize',
                  }}>
                  {message.message &&
                    message.message.message.sentBy.split(' ')[0] +
                      ' ' +
                      message.message.message.sentBy
                        .split(' ')[1]
                        .substring(0, 1)}
                </Text>
                <Text style={{ textTransform: 'lowercase' }}>
                  {` is ${
                    message && message.message.message.eventType.split('_')[0]
                  }...`}
                </Text>
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: normalize(10),
                  fontFamily: 'SofiaProLight',
                  color: colors.text,
                  paddingTop: 3,
                }}>
                {addTime(message)}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default ChatBubble;
