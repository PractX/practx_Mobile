import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { Dimensions } from 'react-native';
import { normalize } from 'react-native-elements';
import timeAgo from '../../utils/timeAgo';
import { usePubNub } from 'pubnub-react';
import { Day } from 'react-native-gifted-chat';
import moment from 'moment';

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
}) => {
  const { colors } = useTheme();
  const pubnub = usePubNub();
  // console.log('Bubble ID', id);
  const checkAmPm = (time) => {
    if (time.split(':')[0] > 12) {
      return time + ' pm';
    } else {
      return time + ' am';
    }
  };
  const addTime = (msg) => {
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
  // console.log(addTime(message).split(', ')[0]);
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
                height: 252,
                backgroundColor: colors.primary,
                alignItems: 'center',
                width: 252,
                justifyContent: 'center',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
              }}>
              {message.message.file.name.match(/.(jpg|jpeg|png|gif)$/i) ? (
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
                      borderBottomRightRadius: 20,
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
                borderBottomRightRadius: 20,
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
                  ? groupPractice.logo
                  : practice
                  ? practice.logo ||
                    'https://www.ischool.berkeley.edu/sites/default/files/default_images/avatar.jpeg'
                  : practiceStaff.length
                  ? practiceStaff.find(
                      (staff) => staff.id === message.message.staffId,
                    ).avatar ||
                    'https://www.ischool.berkeley.edu/sites/default/files/default_images/avatar.jpeg'
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
                  height: 252,
                  backgroundColor: colors.background_1,
                  alignItems: 'center',
                  width: 252,
                  justifyContent: 'center',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  borderBottomRightRadius: 20,
                }}>
                {message.message.file.name.match(/.(jpg|jpeg|png|gif)$/i) ? (
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
                        borderBottomRightRadius: 20,
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
                ) : (
                  <Text>Doc</Text>
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
                            (staff) => staff.id === message.message.staffId,
                          ).firstname
                        : 'Staff'}
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
                <Text
                  style={{
                    fontSize: normalize(12),
                    fontFamily: 'SofiaProRegular',
                    color: colors.text,
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
                paddingTop: 3,
              }}>
              {addTime(message)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ChatBubble;
