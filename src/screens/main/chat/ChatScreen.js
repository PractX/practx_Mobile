import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Dimensions,
  Platform,
  StyleSheet,
  SafeAreaView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Text, Content } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '../../../components/hoc/Header';
import {
  DrawerActions,
  useIsFocused,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectCurrentUser,
  selectIsLoading,
} from '../../../redux/user/user.selector';
import { normalize } from 'react-native-elements';
import { ListItem, Icon, Button } from 'react-native-elements';
import { Formik } from 'formik';
import InputBox from '../../../components/hoc/InputBox';
import SmallInputBox from '../../../components/hoc/SmallInputBox';
import { editProfile } from '../../../redux/user/user.actions';
import { ActivityIndicator } from 'react-native-paper';
import ChatBubble from '../../../components/hoc/ChatBubble';
import { usePubNub } from 'pubnub-react';
import {
  selectAllMessages,
  selectCurrentPracticeId,
  selectJoinedPractices,
  selectPatientNotifications,
  selectPracticeStaffs,
  selectSignals,
} from '../../../redux/practices/practices.selector';
import {
  setAllMessages,
  setCurrentChatChannel,
  setMessagesCount,
} from '../../../redux/practices/practices.actions';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import { Keyboard } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import MediaPicker from './MediaPicker';
import {
  Actions,
  Bubble,
  Day,
  GiftedChat,
  InputToolbar,
  LoadEarlier,
  Message,
  Composer,
  Send,
} from 'react-native-gifted-chat';
import EmojiBoard from 'react-native-emoji-board';
import {} from 'react-navigation';
import moment from 'moment';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import SwipeButton from 'rn-swipe-button';
import GestureRecognizer, {
  swipeDirections,
} from 'react-native-swipe-gestures';
import generateName from '../../../utils/generateName';
import RNFetchBlob from 'rn-fetch-blob';
import VoiceNoteRecorder from '../../../components/hoc/VoiceNoteRecorder';
import { SvgXml } from 'react-native-svg';
import typingIcon from '../../../../assets/gif/typingIndicator.gif';
import { Image } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { removeItem, setItem, getItem } from '../../../utils/storage';
import ImageView from 'react-native-image-viewing';
import Video from 'react-native-video';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
import VideoModal from '../../../components/hoc/VideoModal';

const { flags, sports, food } = Categories;
// console.log(Categories);
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const audioRecorderPlayer = new AudioRecorderPlayer();

const ChatScreen = ({
  navigation,
  route,
  currentUser,
  extraData,
  editProfile,
  isLoading,
  allMessages,
  setAllMessages,
  practiceStaffs,
  signals,
  setCurrentChatChannel,
  joinedPractices,
  currentPracticeId,
  setMessagesCount,
  allNotifications,
}) => {
  const [chatRef, setChatRef] = useState();
  const { colors } = useTheme();
  const inputRef = useRef();
  const { params } = useRoute();
  const isFocused = useIsFocused();
  const [loader, setLoader] = useState(true);
  const {
    practice,
    practiceDms,
    channelName,
    subgroups,
    group,
    type,
    groupPractice,
  } = params;

  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [style1, setStyle1] = useState();
  const [refreshing, setRefreshing] = useState(false);
  // const [channels] = useState();
  const [imageUri, setImageUri] = useState();
  const [messages, addMessages] = useState([]);
  const [messagesLength, setMessagesLength] = useState({
    old: 0,
    new: 0,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [inputText, setInputText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAccessories, setShowAccessories] = useState(false);
  const [showMediaPick, setShowMediaPick] = useState(false);
  const [mediaFile, setMediaFile] = useState();
  const [groupSuggest, setGroupSuggest] = useState(false);
  const d = new Date();
  const time = d.getTime();
  const pubnub = usePubNub();
  const [onRecording, setOnRecording] = useState(false);
  const [vnFile, setVnFile] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [chatMediaPrev, setChatMediaPrev] = useState('');
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  const [recordTime, setRecordTime] = useState({
    recordSecs: 0,
    recordTime: 0,
  });

  // const config = {
  //   velocityThreshold: 0.8,
  //   directionalOffsetThreshold: 150,
  // };

  const addTime = timetoken => {
    const unixTimestamp = timetoken / 10000000;
    const gmtDate = new Date(unixTimestamp * 1000);
    const localeDateTime = gmtDate.toLocaleString();
    // const time = localeDateTime.split(', ')[1];
    // return checkAmPm(time.slice(0, -3));
    return localeDateTime.split(', ')[0];
  };

  const resetMsgCount = channel => {
    pubnub.time((status, response) => {
      if (!status.error) {
        pubnub.objects
          .setMemberships({
            channels: [
              {
                id: channel,
                custom: {
                  lastReadTimetoken: response.timetoken,
                },
              },
            ],
            include: {
              customFields: true,
            },
          })
          .then(data => {
            if (data.status === 200) {
              if (data.data.length > 0) {
                const channels = data.data.map(res => res.channel.id);
                const timetoken = data.data.map(
                  res => res.custom.lastReadTimetoken,
                );

                pubnub
                  .messageCounts({
                    channels: channels,
                    channelTimetokens: timetoken,
                  })
                  .then(async response => {
                    let mCount =
                      (await Object.values(response.channels).reduce(
                        (partialSum, a) => partialSum + a,
                        0,
                      )) +
                      allNotifications?.rows?.filter(it => !it.patientSeen)
                        ?.length;

                    console.log('Count', mCount);
                    setMessagesCount(response.channels);
                    mCount && (await setItem('msgCount', mCount.toString()));
                  })
                  .catch(error => {});
              }
            }
          });
      }
    });
  };
  // const getAllMessages = (cha, num) => {
  //   // const myChannels = [cha];
  //   console.log(cha);
  //   console.log(num);

  //   pubnub.fetchMessages(
  //     {
  //       channels: cha,
  //       // count: 10,
  //       end: time,
  //     },

  //     (status, data) => {
  //       if (status.statusCode === 200) {
  //         let { channels } = data;
  //         console.log(status);
  //         console.log('___DATA', data);
  //         // const unixTimestamp = message.timetoken / 10000000;
  //         // const gmtDate = new Date(unixTimestamp * 1000);
  //         // const localeDateTime = gmtDate.toLocaleString();
  //         // const message =;
  //         // console.log('Hello', localeDateTime);
  //         console.log('new Msfg', channels['23_15_V3wNztfhu']);
  //         let redux = [];
  //         cha.map((item) => {
  //           console.log(item);
  //           console.log('__NEW DATA', channels[item]);
  //           const lst = channels[item][channels[item].length - 1].timetoken;
  //           const fst = channels[item][0].timetoken;
  //           const chm = { channel: item, messages: channels[item], lst, fst };
  //           redux.push(chm);
  //         });
  //         addMessages(channels[cha]);

  //         console.log('REDUX___', redux);

  //         // console.log(newMessage);
  //       }
  //     },
  //   );
  //   pubnub.subscribe({ channels });
  // };
  const addSignal = eventType => {
    pubnub.signal(
      {
        message: {
          eventType,
          sentBy: currentUser.firstname + ' ' + currentUser.lastname,
        },
        channel: channelName,
      },
      (status, response) => {
        // handle status, response
        console.log('addSignal: ', status, response);
      },
    );
  };

  const getSignal = () =>
    signals ? signals.find(i => i.channel === channelName) : null;

  const sendMessage = data => {
    // console.log('Channel name', channelName);
    // console.log('SENDING____')

    //UNCOMMENT LATER
    setErrorMessage('');
    setSending(true);
    setInputText('');
    setMessage(data);

    // chatRef.scrollToEnd();
    pubnub.setUUID(currentUser ? currentUser.chatId : 0);
    if (data) {
      pubnub.publish(
        {
          message: {
            // text: data[0].text,
            text: data,
            userType: 'patient',
            profile: {
              id: currentUser.id,
              name: currentUser.firstname + ' ' + currentUser.lastname,
            },
          },
          channel: channelName,
        },
        (status, response) => {
          // setMessage('');
          // handle status, response
          status.error
            ? setErrorMessage("Couldn't send message")
            : setErrorMessage('');
          console.log('Status', status);
          console.log('Response', response);
          // console.log(oldLength, 'SENT____', messages.length);
        },
      );
    } else {
      console.log('NO message');
    }
  };

  const sendFile = (fileData, type) => {
    // console.log(channelName);
    // console.log(fileData);
    // console.log('SENDING____');
    setErrorMessage('');
    setSending(true);
    setInputText('');
    setMessage(type ? type : 'media');
    setSending(true);
    // chatRef.scrollToEnd();
    pubnub.setUUID(currentUser ? currentUser.chatId : 0);
    if (fileData) {
      console.log('File Data', fileData);
      pubnub.sendFile(
        {
          channel: channelName,
          message: {
            text: '',
            userType: 'patient',
            profile: {
              id: currentUser.id,
              name: currentUser.firstname + ' ' + currentUser.lastname,
            },
          },
          file: fileData,
        },
        (status, response) => {
          // setMessage('');
          // handle status, response
          if (status) {
            if (fileData.fileSize >= 5000000 || fileData.size >= 5000000) {
              setErrorMessage('Opps Media or file exceeds 5mb');
            } else {
              setMessage('text');
              setErrorMessage("Couldn't send media or file");
              console.log('Status Message', status.message);
            }
          } else {
            setErrorMessage('');
          }

          console.log('Status', status);
          console.log('Response', response);
          // console.log('SENT____');
        },
      );
    } else {
      console.log('NO message');
    }
  };

  const getOldMessages = useCallback((cha, readyMessage) => {
    setRefreshing(true);
    console.log('=== GET OLD MESSAGES FROM CHANNEL =====: ', cha);
    const channelMsgs = allMessages.find(i => i.channel === cha);
    // console.log(channelMsgs);
    const channels = [cha];
    if (channelMsgs && !readyMessage) {
      pubnub.fetchMessages(
        {
          channels: [channels[0]],
          count: 25,
          start: channelMsgs.fst,
        },

        async (status, data) => {
          console.log(status);

          if (status.statusCode === 200) {
            console.log('DATA__', data);
            const msgs = data.channels[channels];
            console.log(
              '=== FOUND OLD MESSAGES FROM CHANNEL =====: ',
              cha,
              msgs,
              channelMsgs,
            );
            if (msgs && msgs.length && msgs[0].timetoken !== channelMsgs.fst) {
              // channelMsgs.lst = msgs[msgs.length - 1].timetoken
              channelMsgs.fst = msgs[0].timetoken;
              let newMsgs = await msgs.map(item =>
                Object.assign(item, {
                  _id: item.timetoken,
                  user: { _id: item.uuid },
                  day: addTime(item.timetoken),
                }),
              );
              console.log('POOOOO___', newMsgs);
              if (newMsgs) {
                channelMsgs.messages = [...msgs, ...channelMsgs.messages];

                // channelMsgs.messages = [...msgs]
                const newSavedMessages = allMessages.filter(
                  i => i.channel !== channelMsgs.channel,
                );
                console.log('=== channelMsgs =====: ', channelMsgs);
                console.log('=== newSavedMessages =====: ', newSavedMessages);

                // console.log('NEWWW__', newMsg);
                // dispatch(Actions.saveMsg([...newSavedMessages, channelMsgs]));
                addMessages(channelMsgs);
                setAllMessages([...newSavedMessages, channelMsgs]);
                // addMessages(channelMsgs);
                setRefreshing(false);
                setLoader(false);
                console.log('Length__ ', channelMsgs.messages.length - 1);
                // if (channelMsgs.messages.length) {
                //   cRef.scrollToIndex({
                //     animate: true,
                //     index: channelMsgs.messages.length - 1,
                //   });
                // }
                // cRef.scrollToEnd({ animated: true });
              }
            } else {
              console.log('Ready Message testing');
              const newSavedMessages = allMessages.filter(
                i => i.channel !== channelMsgs.channel,
              );
              setAllMessages([...newSavedMessages, channelMsgs]);
            }
            setLoader(false);
            setRefreshing(false);

            // pubnub.time((status, response)=>{
            // 	if(!status.error){

            // 		pubnub.objects.setMemberships({
            // 			channels: [{
            // 				id: channels[0],
            // 				custom: {
            // 						lastReadTimetoken: response.timetoken,
            // 				}
            // 			}]

            // 		})

            // 		dispatch(Actions.messagesCountUpdate(channels[0]))
            // 		console.log(channels[0], "=== MESSAGE COUNT =====:", messagesCount[channels[0]])

            // 	}

            // })
          }
          setLoader(false);
          setRefreshing(false);
        },
      );
    } else {
      console.log('Getting newer message');
      if (allMessages.length) {
        const newChannelMsgs = allMessages.find(i => i.channel === cha);
        if (newChannelMsgs) {
          const newSavedMessages = allMessages.filter(
            i => i.channel !== newChannelMsgs.channel,
          );

          // console.log('=== channelMsgs =====: ', channelMsgs);
          // console.log('=== newSavedMessages =====: ', newSavedMessages);
          setAllMessages([...newSavedMessages, newChannelMsgs]);
        }
      }

      // pubnub.fetchMessages(
      //   {
      //     channels: [channels[0]],
      //     count: 25,
      //     end: time,
      //   },

      //   (status, data) => {
      //     if (status.statusCode === 200) {
      //       console.log('=== GETTING MESSAGES FROM CHANNEL =====: ', cha);
      //       // addMessage([...data.channels[channels]])
      //       const addTime = (msg) => {
      //         const unixTimestamp = msg.timetoken / 10000000;
      //         const gmtDate = new Date(unixTimestamp * 1000);
      //         const localeDateTime = gmtDate.toLocaleString();
      //         // const time = localeDateTime.split(', ')[1];
      //         // return checkAmPm(time.slice(0, -3));
      //         return localeDateTime.split(', ')[0];
      //       };
      //       const msgs = data.channels[channels];
      //       if (msgs.length) {
      //         console.log('=== GET ALL MESSAGES FROM CHANNEL =====: ', cha);
      //         const lst = msgs[msgs.length - 1].timetoken;
      //         const fst = msgs[0].timetoken;
      //         let allMsgs = msgs.map((item) =>
      //           Object.assign(item, {
      //             _id: item.timetoken,
      //             user: { _id: item.uuid },
      //             day: addTime(item.timetoken),
      //           }),
      //         );
      //         setAllMessages([
      //           ...allMessages,
      //           { channel: cha, fst, lst, messages: allMsgs },
      //         ]);

      //         setRefreshing(false);
      //       }

      // pubnub.time((status, response)=>{
      // 	if(!status.error){

      // 		pubnub.objects.setMemberships({
      // 			channels: [{
      // 				id: channels[0],
      // 				custom: {
      // 						lastReadTimetoken: response.timetoken,
      // 				}
      // 			}]

      // 		})

      // 		dispatch(Actions.messagesCountUpdate(channels[0]))
      // 		console.log(channels[0], "=== MESSAGE COUNT =====:", messagesCount[channels[0]])

      // 	}

      // })
      setLoader(false);
      setRefreshing(false);
      // }
      // },
      // );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add Signal....... ANCHOR
  useEffect(() => {
    let timer;
    if (inputText && currentUser) {
      addSignal('typing_on');
      timer = setTimeout(() => addSignal('typing_off'), 10000);
    } else if (!inputText && currentUser) {
      addSignal('typing_off');
    }

    return () => {
      timer && clearTimeout(timer);
    };
  }, [inputText, currentUser]);

  // useEffect(() => {
  //   if (onRecording && currentUser) {
  //     console.log('Recordings');
  //     addSignal('recording_on');
  //   } else if (!onRecording && currentUser) {
  //     addSignal('recording_off');
  //   }
  // }, [onRecording, currentUser]);

  useMemo(() => {
    if (isFocused || allMessages) {
      // console.log('New MESSAgE Available__');
      resetMsgCount(channelName);
      addMessages(
        allMessages.find(item => item.channel === channelName)
          ? allMessages.find(item => item.channel === channelName).messages
          : [],
      );
      // if (chatRef !== undefined && messages.length > 1) {
      //   console.log('REF__', chatRef);
      //   chatRef && chatRef.scrollToIndex({ animated: true, index: 20 });
      // }
      setSending(false);
    }
    // console.log('Updated MESSAgE__', messages);
    //
  }, [allMessages, channelName, isFocused]);

  // useMemo(() => {}, [isFocused, chatRef, messages]);
  const getUniqueListBy = (arr, key) => {
    return [
      ...new Map([...arr].reverse().map(item => [item[key], item])).values(),
    ];
  };

  useMemo(() => {
    // console.log('Group_SUGGEST', groupSuggest);
    if (isFocused || (isFocused && type) || (isFocused && group)) {
      setCurrentChatChannel(channelName);
      // console.log(
      //   'Chat Ref___',
      //   allMessages.find((item) => item.channel === channelName).messages,
      // );
      if (
        allMessages.find(item => item.channel === channelName) &&
        allMessages.find(item => item.channel === channelName).messages.length <
          10
      ) {
        console.log('message is less than 10');
        setLoader(true);
        getOldMessages(channelName);
      }
      // else if{
      //   setLoader(true);
      // }
      else {
        console.log('message is less not than 10', channelName);
        // setLoader(false);
        setLoader(true);
        // getOldMessages(channelName);
        const readyMessage = true;
        getOldMessages(channelName, readyMessage);
      }
      // allMessages.find((item) => item.channel === channelName)
      //   ? setGroupSuggest(false)
      //   : setGroupSuggest(true);
    } else {
      setCurrentChatChannel('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, type, group]);

  useEffect(() => {
    extraData.setOptions({
      drawerLockMode: 'locked-closed',
      swipeEnabled: false,
    });

    return () =>
      extraData.setOptions({
        drawerLockMode: 'locked-closed',
        swipeEnabled: true,
      });
  }, [extraData]);

  // TODO
  // console.log('My CURRENT PRactice', currentPracticeId);
  console.log(
    'FIND JOINED',
    currentPracticeId,
    joinedPractices.find(item => item.id === currentPracticeId),
  );
  useEffect(() => {
    joinedPractices.find(item => item.id === currentPracticeId) === undefined &&
      navigation.navigate('ChatMessages');
  }, [currentPracticeId]);

  const [audioTime, setAudioTime] = useState();
  async function onStartRecord() {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log('write external stroage', grants);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
    setOnRecording(true);
    let date = Date.now().toString();
    const meteringEnabled = false;
    const dirs = RNFetchBlob.fs.dirs;
    const path = Platform.select({
      ios: `${generateName(4, 'vn')}_${date}.aac`,
      android: `${dirs.CacheDir}/${generateName(4, 'vn')}_${date}.aac`,
    });

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    const result = await audioRecorderPlayer.startRecorder(
      path,
      audioSet,
      meteringEnabled,
    );

    audioRecorderPlayer.addRecordBackListener(e => {
      setRecordTime({
        recordSecs: e.currentPosition,
        recordTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
      });
      return;
    });

    console.log('Audio result', result);
  }

  async function onStopRecord() {
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordTime({
      recordSecs: 0,
    });
  }

  const onSendRecordedFile = useCallback(async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordTime({
      recordSecs: 0,
    });
    console.log('Uri', result);
    let fileName = result.split(/[\s/]+/);
    setVnFile(result);
    console.log(fileName[fileName.length - 1]);
    setOnRecording(false);
    sendFile(
      {
        mimeType: 'audio/mp4',
        name: fileName[fileName.length - 1],
        uri: result,
      },
      'voiceNote',
    );
    // console.log('Generating Test', generateName(6, 'record'));
  }, []);

  const onStartPlay = useCallback(async uri => {
    console.log('onStartPlay', uri);
    try {
      const msg = await audioRecorderPlayer.startPlayer(uri);
      console.log('Play', msg);
      audioRecorderPlayer.addPlayBackListener(e => {
        setAudioTime({
          currentPositionSec: e.currentPosition,
          currentDurationSec: e.duration,
          playTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
          duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
        });
        return;
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const onPausePlay = useCallback(async () => {
    await audioRecorderPlayer.pausePlayer();
  }, []);

  const onStopPlay = useCallback(async () => {
    console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  }, []);

  // let dataMsg = [] allMessages.find((item) => item.channel === channelName);
  //TODO
  const renderActions = props => {
    return (
      <>
        {onRecording ? (
          <></>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <Actions
              {...props}
              icon={() => (
                <Icon
                  name={showAccessories ? 'x' : 'plus'}
                  type={'feather'}
                  // action={setShowEmoji}
                  // value={showEmoji}
                  size={22}
                  color={'white'}
                />
              )}
              onPressActionButton={() => {
                if (showAccessories) {
                  setShowAccessories(false);
                } else {
                  Keyboard.dismiss();
                  setShowAccessories(true);
                }
              }}
              containerStyle={{
                backgroundColor: colors.primary,
                borderRadius: 100,
                height: 28,
                width: 28,
                marginTop: 5,
                alignSelf: 'center',
                justifyContent: 'center',
              }}
            />
            <Actions
              {...props}
              icon={() => (
                <Icon
                  name={showEmoji ? 'keyboard' : 'emotsmile'}
                  type={showEmoji ? 'font-awesome-5' : 'simple-line-icon'}
                  // action={setShowEmoji}
                  // value={showEmoji}
                  size={normalize(Platform.OS === 'ios' ? 21 : 22)}
                  style={{ alignSelf: 'center' }}
                  color={colors.text}
                />
              )}
              onPressActionButton={() => {
                Keyboard.dismiss();
                showEmoji ? setShowEmoji(false) : setShowEmoji(true);
              }}
              containerStyle={{
                // backgroundColor: colors.primary,
                height: 28,
                width: 28,
                marginRight: 10,
                marginTop: 10,
                // marginBottom: 30,
                alignSelf: 'center',
              }}
            />
          </View>
        )}
      </>
    );
  };

  const renderAccessory = props => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          width: windowWidth,
          marginVertical: 10,
          paddingHorizontal: 10,
        }}>
        <Actions
          {...props}
          options
          icon={() => (
            <Icon
              name={'camera'}
              type={'font-awesome-5'}
              // action={setShowEmoji}
              // value={showEmoji}
              size={22}
              color={colors.text_2}
            />
          )}
          onPressActionButton={() =>
            launchCamera({ mediaType: 'photo' }, ({ assets, didCancel }) => {
              if (!didCancel) {
                console.log('Photo data', assets);
                setMediaFile({
                  name: assets[0].fileName,
                  uri: assets[0].uri,
                  mimeType: assets[0].type,
                  size: assets[0].fileSize,
                  height: assets[0].height,
                  width: assets[0].width,
                });
                setShowMediaPick(true);
              }
              console.log(mediaFile);
              console.log('setting Image');
            })
          }
        />
        <Actions
          {...props}
          options
          icon={() => (
            <Icon
              name={'video'}
              type={'font-awesome-5'}
              // action={setShowEmoji}
              // value={showEmoji}
              size={22}
              color={colors.text_2}
            />
          )}
          onPressActionButton={() =>
            launchCamera({ mediaType: 'video' }, ({ assets, didCancel }) => {
              if (!didCancel) {
                console.log('Video data', assets);
                setMediaFile({
                  name: assets[0].fileName,
                  uri: assets[0].uri,
                  mimeType: 'video/mp4',
                  size: assets[0].fileSize,
                  duration: assets[0].duration,
                });
                setShowMediaPick(true);
              }
              console.log(mediaFile);
              console.log('setting Image');
            })
          }
          containerStyle={{ marginLeft: 30 }}
        />
        <Actions
          {...props}
          options
          icon={() => (
            <Icon
              name={'perm-media'}
              type={'material-icons'}
              // action={setShowEmoji}
              // value={showEmoji}
              size={22}
              color={colors.text_2}
            />
          )}
          onPressActionButton={() =>
            launchImageLibrary(
              { mediaType: 'mixed' },
              ({ didCancel, assets }) => {
                console.log('Media data', assets);
                if (!didCancel) {
                  assets[0].duration
                    ? setMediaFile({
                        name: assets[0].fileName + '.mp4',
                        uri: assets[0].uri,
                        mimeType: 'video/mp4',
                        size: assets[0].fileSize,
                        duration: assets[0].duration,
                      })
                    : setMediaFile({
                        name: assets[0].fileName,
                        uri: assets[0].uri,
                        mimeType: assets[0].type,
                        size: assets[0].fileSize,
                        height: assets[0].height,
                        width: assets[0].width,
                      });
                  setShowMediaPick(true);
                }
                console.log(mediaFile);
                console.log('setting Image');
              },
            )
          }
          containerStyle={{ marginLeft: 30 }}
        />
        {/* <Actions
          {...props}
          options
          icon={() => (
            <Icon
              name={'file-medical'}
              type={'font-awesome-5'}
              // action={setShowEmoji}
              // value={showEmoji}
              size={22}
              color={colors.text_2}
            />
          )}
          onPressActionButton={() =>
            showEmoji ? setShowEmoji(false) : setShowEmoji(true)
          }
          containerStyle={{ marginLeft: 30 }}
        /> */}
      </View>
    );
  };
  // const backspace = (text) => {
  //   console.log(text.length);
  //   return runes.substr(text, text.length - 1, 1);
  // };

  const renderSender = props => {
    return (
      <Send
        {...props}
        alwaysShowSend={true}
        containerStyle={{
          borderTopColor: null,
          borderWidth: 0,
          alignSelf: 'center',
          marginRight: 10,
          justifyContent: 'center',
        }}>
        <Button
          TouchableComponent={() => {
            // return isLoading ? (
            //   <ActivityIndicator
            //     animating={true}
            //     size={normalize(21)}
            //     color={colors.text}
            //   />
            // ) : (
            return (
              <View
                style={{
                  backgroundColor: colors.primary,
                  height: 33,
                  width: 33,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  marginLeft: 10,
                  borderRadius: 10,
                }}>
                <Icon
                  name={'ios-send'}
                  type={'ionicon'}
                  color={'white'}
                  size={normalize(16)}
                  style={{
                    alignSelf: 'center',
                  }}
                />
              </View>
            );
            // );
          }}
        />
      </Send>
    );
  };

  // NOTE

  // console.log('All Practice data', practice

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageView
        images={[
          {
            uri: chatMediaPrev,
          },
        ]}
        imageIndex={0}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
      />
      {isVideoVisible && (
        <VideoModal
          navigation={navigation}
          chatMediaPrev={chatMediaPrev}
          setIsVideoVisible={setIsVideoVisible}
          setChatMediaPrev={setChatMediaPrev}
        />
      )}
      <View style={{ flex: 1 }}>
        {!isVideoVisible && !showMediaPick ? (
          <Header
            navigation={navigation}
            // title="Edit Profile"
            hideCancel={true}
            signalType={
              (getSignal() &&
                getSignal().message.eventType === 'typing_on' &&
                getSignal().publisher !== currentUser.chatId) ||
              (getSignal() &&
                getSignal().message.eventType === 'recording_on' &&
                getSignal().publisher !== currentUser.chatId)
                ? getSignal()
                : ''
            }
            subgroups={{
              show: groupSuggest,
              onShow: setGroupSuggest,
              data: subgroups,
              practiceDms: practiceDms,
              groupPractice: practice,
            }}
            textImage={true}
            backArrow={true}
            headerWithImage={{ chatUser: currentUser, status: 'Active Now' }}
            chatRight={
              type === 'dm'
                ? [
                    {
                      name: 'calendar',
                      type: 'ant-design',
                      onPress: () =>
                        navigation.navigate('Appointment', {
                          to: 'AppointmentBooking',
                          practice: practice,
                        }),
                      buttonType: 'save',
                    },
                    {
                      name: 'ios-call-outline',
                      type: 'ionicon',
                      onPress: () =>
                        Linking.openURL(`tel:${practice.mobileNo}`),
                      buttonType: 'save',
                    },
                  ]
                : null
            }
            practice={practice}
            group={group}
            // isLoading={isLoading}
          />
        ) : null}

        {!loader ? (
          <View style={{ flex: 1, marginTop: 50 }}>
            <GiftedChat
              // ref={(ref) => setChatRef(ref)}
              // extraData={generatedItems}
              // shouldUpdateMessage={(props, nextProps) => {
              //   generatedItems(props);
              //   // return props.extraData.someData !== nextProps.extraData.someData;
              // }}
              messages={messages.length ? [...messages].reverse() : []}
              // onSend={(text, shouldResetInputToolbar) => {
              //   // onSend(messages)
              //   setMessage(text);
              //   sendMessage(text);
              //   //  values.message = '';
              // }}
              onPressActionButton={() => console.log('actiossss-----')}
              // scrollToBottom={true}
              scrollToBottom={true}
              scrollToBottomComponent={() => (
                <View>
                  <Icon
                    name={'chevrons-down'}
                    type={'feather'}
                    color={
                      colors.mode === 'light' ? colors.text_1 : colors.text
                    }
                    size={normalize(18)}
                    style={{
                      color: colors.text,
                      // alignSelf: 'center',
                    }}
                  />
                </View>
              )}
              scrollToBottomStyle={{
                backgroundColor: colors.background_1,
              }}
              // listViewProps={{ style: { flexDirection: 'column-reverse' } }}
              renderMessage={(props, index) => {
                // console.log('MOMENT__', moment().format('DD/MM/YY'));
                // console.log(
                //   'TODAY__ ',
                //   moment().format('DD/MM/YY'),
                //   moment().add(-1, 'days').format('DD/MM/YY'),
                //   'Tester___',
                //   moment(props.currentMessage.timetoken / 1e4).format('DD/MM/YY'),
                // );
                if (messages.length) {
                  return (
                    //ANCHOR
                    <>
                      <ChatBubble
                        id={props.currentMessage.timetoken}
                        message={props.currentMessage}
                        navigation={navigation}
                        practice={practice}
                        groupPractice={groupPractice}
                        practiceDms={practiceDms}
                        patientChatId={currentUser ? currentUser.chatId : 0}
                        practiceStaff={practiceStaffs}
                        onStartPlay={onStartPlay}
                        onPausePlay={onPausePlay}
                        onStopPlay={onStopPlay}
                        audioTime={audioTime}
                        isVisible={isVisible}
                        setIsVisible={setIsVisible}
                        setChatMediaPrev={setChatMediaPrev}
                        setIsVideoVisible={setIsVideoVisible}
                      />
                      {messages.length &&
                        getUniqueListBy(messages, 'day').some(
                          item =>
                            item.timetoken === props.currentMessage.timetoken,
                        ) && (
                          <>
                            {moment().format('DD/MM/YY') ===
                              moment(
                                props.currentMessage.timetoken / 1e4,
                              ).format('DD/MM/YY') ||
                            moment().add(-1, 'days').format('DD/MM/YY') ===
                              moment(
                                props.currentMessage.timetoken / 1e4,
                              ).format('DD/MM/YY') ? (
                              <View
                                style={{
                                  backgroundColor: colors.background_1,
                                  marginTop: 5,
                                  paddingVertical: 5,
                                  paddingHorizontal: 12,
                                  borderRadius: 10,
                                  minWidth: 50,
                                  alignSelf: 'center',
                                }}>
                                {moment().format('DD/MM/YY') ===
                                moment(
                                  props.currentMessage.timetoken / 1e4,
                                ).format('DD/MM/YY') ? (
                                  <Text
                                    style={{
                                      color: colors.text,
                                      fontSize: normalize(10.5),
                                      fontFamily: 'SofiaProRegular',
                                      textAlign: 'center',
                                    }}>
                                    Today
                                  </Text>
                                ) : (
                                  <Text
                                    style={{
                                      color: colors.text,
                                      fontSize: normalize(10.5),
                                      fontFamily: 'SofiaProRegular',
                                      textAlign: 'center',
                                    }}>
                                    Yesterday
                                  </Text>
                                )}
                              </View>
                            ) : (
                              <Day
                                {...props}
                                textStyle={{
                                  color: colors.text,
                                  fontSize: normalize(10.5),
                                  fontFamily: 'SofiaProRegular',
                                  textAlign: 'center',
                                }}
                                wrapperStyle={{
                                  marginTop: 5,
                                  backgroundColor: colors.background_1,
                                  paddingVertical: 5,
                                  paddingHorizontal: 12,
                                  borderRadius: 10,
                                }}
                                currentMessage={{
                                  createdAt: new Date(
                                    props.currentMessage.timetoken / 1e4,
                                  ),
                                }}
                              />
                            )}
                          </>
                        )}
                    </>
                  );
                } else {
                  return <></>;
                }
              }}
              renderChatEmpty={() => (
                <View
                  style={{
                    marginVertical: 20,
                    marginHorizontal: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: [{ scaleY: -1 }],
                  }}>
                  <Text
                    style={{
                      color:
                        colors.mode === 'dark'
                          ? colors.quinary
                          : colors.primary,
                      fontSize: normalize(12),
                      fontFamily: 'SofiaProLight',
                      backgroundColor: colors.background_1,
                      borderRadius: 10,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      textAlign: 'center',
                    }}>
                    {type === 'dm'
                      ? `This is the beginning of your first message, chatting with ${practice.practiceName}`
                      : `This is the beginning and the first message in ${group.name}`}
                  </Text>
                </View>
              )}
              user={{
                _id: 1,
              }}
              listViewProps={{
                style: {
                  marginBottom: showAccessories ? 65 : 10,
                },
              }}
              isTyping={true}
              textInputProps={{
                onFocus: () => setShowEmoji(false),
              }}
              text={inputText}
              onInputTextChanged={text => setInputText(text)}
              // focusTextInput={true}
              textInputStyle={{
                backgroundColor: colors.background,
                color: colors.text,
                alignSelf: 'center',
                fontFamily: 'SofiaProRegular',
                fontSize: normalize(14),
                alignItems: 'center',
                // marginTop: 10,

                //fff
                // color: '#222B45',
                //       backgroundColor: '#EDF1F7',
                // borderWidth: 1,
                // borderRadius: 5,
                // borderColor: '#E4E9F2',
                // paddingTop: 8.5,
                paddingHorizontal: 12,
                marginLeft: 0,
              }}
              // renderInputToolbar={() => <></>}
              // renderInputToolbar={null}
              renderFooter={props => {
                return (
                  <View style={{ width: appwidth, alignSelf: 'center' }}>
                    {sending || errorMessage ? (
                      <View
                        style={{
                          alignSelf: 'flex-end',
                          flexDirection: 'column',
                          maxWidth: appwidth - 50,
                          marginVertical: 20,
                        }}>
                        {message === 'media' || message === 'doc' ? (
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
                            {message === 'media' ? (
                              <FastImage
                                source={{
                                  uri: mediaFile.uri,
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
                                ]}
                                resizeMode={FastImage.resizeMode.cover}
                              />
                            ) : (
                              <Text>Doc</Text>
                            )}
                          </View>
                        ) : (
                          <View
                            style={{
                              // minHeight: 50,
                              backgroundColor: errorMessage
                                ? 'red'
                                : colors.primary,
                              alignItems: 'flex-start',
                              width: message === 'voiceNote' ? 252 : null,
                              // maxWidth:
                              //   message === 'voiceNote' ? appwidth - 80 : null,
                              justifyContent: 'center',
                              borderTopLeftRadius: 20,
                              borderTopRightRadius: 20,
                              borderBottomRightRadius: 20,
                            }}>
                            {message === 'voiceNote' ? (
                              <VoiceNoteRecorder
                                position="right"
                                voiceNoteUrl={vnFile}
                                isSending={true}
                              />
                            ) : (
                              <Text
                                style={{
                                  fontSize: normalize(12),
                                  fontFamily: 'SofiaProRegular',
                                  color: 'white',
                                  textAlign: 'left',
                                  padding: 15,
                                }}>
                                {errorMessage ? errorMessage : message}
                              </Text>
                            )}
                          </View>
                        )}

                        <View
                          style={{
                            flexDirection: 'row',
                            alignSelf: 'flex-end',
                            alignItems: 'center',
                            paddingRight: 10,
                            paddingTop: 3,
                            textAlign: 'right',
                          }}>
                          <Text
                            style={{
                              fontSize: normalize(10),
                              fontFamily: 'SofiaProLight',
                              color: colors.text,
                            }}>
                            {errorMessage
                              ? errorMessage ===
                                'Opps Media or file exceeds 5mb'
                                ? '💾 Sorry, File size error...'
                                : '⚠️ Sorry, Internet error...'
                              : 'Sending...'}
                          </Text>
                          <ActivityIndicator
                            animating={errorMessage ? false : true}
                            size={normalize(10)}
                            color={colors.text}
                            style={{
                              alignSelf: 'center',
                              paddingLeft: 10,
                              textAlign: 'right',
                            }}
                          />
                        </View>
                      </View>
                    ) : (getSignal() &&
                        getSignal().message.eventType === 'typing_on' &&
                        getSignal().publisher !== currentUser.chatId) ||
                      (getSignal() &&
                        getSignal().message.eventType === 'recording_on' &&
                        getSignal().publisher !== currentUser.chatId) ? (
                      <>
                        <ChatBubble
                          id={344556455}
                          message={{
                            messageType: 10,
                            message: getSignal(),
                          }}
                          navigation={navigation}
                          practice={practice}
                          groupPractice={groupPractice}
                          practiceDms={practiceDms}
                          patientChatId={currentUser ? currentUser.chatId : 0}
                          practiceStaff={practiceStaffs}
                          onStartPlay={onStartPlay}
                          onPausePlay={onPausePlay}
                          onStopPlay={onStopPlay}
                          audioTime={audioTime}
                        />
                      </>
                    ) : null}
                  </View>
                );
              }}
              // TODO
              renderInputToolbar={props => (
                <InputToolbar
                  {...props}
                  renderAccessory={() =>
                    onRecording
                      ? null
                      : showAccessories
                      ? renderAccessory()
                      : null
                  }
                  renderComposer={cProps => (
                    <>
                      {onRecording ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            width: appwidth - normalize(40),
                            // width: appwidth + 50,
                            backgroundColor: colors.background_1,
                            height: 40,
                            marginHorizontal: 10,
                            paddingHorizontal: 10,
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderRadius: 20,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Icon
                              name={'mic'}
                              type={'ionicon'}
                              color={colors.primary}
                              size={normalize(25)}
                              style={{
                                alignSelf: 'center',
                              }}
                            />
                            <Text
                              style={{
                                color: colors.text,
                                alignSelf: 'center',
                                fontFamily: 'SofiaProRegular',
                                fontSize: normalize(14),
                                alignItems: 'center',
                                paddingLeft: 15,
                              }}>
                              {recordTime &&
                                recordTime.recordTime &&
                                recordTime.recordTime.substring(
                                  0,
                                  recordTime.recordTime.length - 3,
                                )}
                            </Text>
                          </View>

                          <TouchableOpacity
                            onPress={() => {
                              requestAnimationFrame(() => {
                                onStopRecord();
                                setOnRecording(false);
                              });
                            }}
                            style={{
                              alignSelf: 'center',
                              marginRight: 10,
                            }}>
                            <Text
                              style={{
                                color: colors.primary,
                                alignSelf: 'center',
                                fontFamily: 'SofiaProRegular',
                                fontSize: normalize(14),
                                alignItems: 'center',
                                paddingLeft: 15,
                              }}>
                              Cancel
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <Composer {...cProps} />
                      )}
                    </>
                  )}
                  renderActions={renderActions}
                  renderSend={
                    messageProps => {
                      return (
                        <>
                          {inputText ? (
                            <TouchableOpacity
                              onPress={() => sendMessage(messageProps.text)}
                              style={{
                                alignSelf: 'center',
                                marginRight: 10,
                                marginBottom: 10,
                              }}>
                              <View
                                style={{
                                  backgroundColor: colors.primary,
                                  height: 35,
                                  width: 35,
                                  alignSelf: 'center',
                                  justifyContent: 'center',
                                  marginLeft: 10,
                                  borderRadius: 10,
                                }}>
                                <Icon
                                  name={inputText ? 'ios-send' : 'mic'}
                                  type={'ionicon'}
                                  color={'white'}
                                  size={normalize(18)}
                                  style={{
                                    alignSelf: 'center',
                                  }}
                                />
                              </View>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                requestAnimationFrame(() => {
                                  if (inputText) {
                                    sendMessage(messageProps.text);
                                  } else {
                                    if (onRecording) {
                                      onSendRecordedFile();
                                    } else {
                                      console.log('Pressed');

                                      onStartRecord();
                                    }
                                  }
                                });
                              }}
                              style={{
                                alignSelf: 'center',
                                marginRight: 10,
                                alignItems: 'center',
                                marginBottom: onRecording ? 0 : 10,
                              }}>
                              <View
                                style={{
                                  backgroundColor: colors.primary,
                                  height: 35,
                                  width: 35,
                                  marginTop: 3,
                                  alignSelf: 'center',
                                  justifyContent: 'center',
                                  marginLeft: 10,
                                  borderRadius: 10,
                                }}>
                                <Icon
                                  name={
                                    inputText || onRecording
                                      ? 'ios-send'
                                      : 'mic'
                                  }
                                  type={'ionicon'}
                                  color={'white'}
                                  size={normalize(18)}
                                  style={{
                                    alignSelf: 'center',
                                  }}
                                />
                              </View>
                            </TouchableOpacity>
                          )}
                        </>
                      );
                    }
                    // renderSender
                  }
                  accessoryStyle={{ height: showAccessories ? null : 0 }}
                  containerStyle={{
                    // width: windowWidth - 60,
                    backgroundColor: colors.background,
                    // marginHorizontal: 20,
                    borderTopColor: colors.background_1,
                    borderBottomColor: colors.background_1,
                    borderWidth: 0.6,
                    borderTopWidth: 1,
                    paddingVertical: 2,
                    // marginTop: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
              )}
              keyboardShouldPersistTaps={false}
              // maxInputLength={20}
              inverted={true}
              renderLoadEarlier={props => (
                <LoadEarlier
                  {...props}
                  label="Load earlier messages"
                  wrapperStyle={{ backgroundColor: 'transparent' }}
                  textStyle={{
                    fontSize: normalize(11),
                    textAlign: 'center',
                    fontFamily: 'SofiaProRegular',
                    backgroundColor: colors.background_1,
                    paddingVertical: 6,
                    paddingHorizontal: 13,
                    borderRadius: 15,
                    color: colors.text,
                  }}
                  activityIndicatorStyle={{ padding: 10 }}
                  activityIndicatorColor={
                    // colors.primary
                    colors.text
                  }
                  activityIndicatorSize={normalize(25)}
                />
              )}
              // renderLoading
              onLoadEarlier={() => {
                setRefreshing(refreshing);
                getOldMessages(channelName);
              }}
              isLoadingEarlier={refreshing}
              loadEarlier={messages.length >= 5 ? true : false}
              infiniteScroll={true}
              maxComposerHeight={100}
              alignTop={true}
              // renderCustomView={() => (
              //   <View
              //     style={{
              //       position: 'absolute',
              //       backgroundColor: 'blue',
              //       zIndex: 100000000000000000000000,
              //       bottom: 5,
              //     }}>
              //     <Text>Hello</Text>
              //   </View>
              // )}
            />

            {/* <FlatList
          ref={(ref) => setChatRef(ref)}
          // keyExtractor={(item) => item.id.toString()}
          keyboardDismissMode="on-drag"
          // initialScrollIndex={0}
          // maintainVisibleContentPosition={{
          //   autoscrollToTopThreshold: 10,
          //   minIndexForVisible: 1,
          // }}
          // horizontal={true}
          refreshControl={
            <RefreshControl
              horizontal={true}
              refreshing={refreshing}
              onRefresh={() => getOldMessages(channelName)}
            />
          }
          // getItemLayout

          // onRefresh={() => getOldMessages(channelName)}
          // refreshing={refreshing}
          onContentSizeChange={(data, index, extra) => {
            if (messages.length > 25) {
              chatRef.scrollToOffset({
                animated: false,
                offset: 44894,
              });
            } else {
              chatRef.scrollToEnd({
                animated: false,
                index: messages.length - 1,
              });
            }
            console.log(chatRef.getScrollableNode());
          }} // scroll it
          onLayout={() =>
            chatRef.scrollToIndex({
              animated: false,
              index: messages.length - 1,
            })
          }
          // initialNumToRender={10}
          // windowSize={5}
          // removeClippedSubviews
          // ListEmptyComponent
          // initialNumToRender={5}
          // updateCellsBatchingPeriod={5}
          // initialScrollIndex={messages.length > 26 ? 25 : null}
          showsVerticalScrollIndicator={true}
          style={{
            // flex: 2,
            // minHeight: windowHeight - 140,
            backgroundColor: colors.background,
            marginTop: 55,
            // marginBottom: 60,
          }}
          data={messages}
          // numColumns={1}
          renderItem={({ item, index }) => (
            <ChatBubble
              id={item.id}
              message={item}
              navigation={navigation}
              practice={practice}
              practiceDms={practiceDms}
              patientChatId={currentUser ?currentUser.chatId : 0}
            />
          )}
          keyExtractor={(item, index) => index}
          // showsHorizontalScrollIndicator={false}
          // extraData={selected}
          // ListFooterComponent={}
        /> */}
            {/* //ANCHOR */}
          </View>
        ) : (
          <ActivityIndicator
            animating={true}
            size={normalize(30)}
            color={colors.text}
            style={{ position: 'absolute', top: '50%', left: '50%' }}
          />
        )}
        {/* </ScrollView> */}
        {/* <KeyboardAvoidingView behavior="height">
        <InputBox
          handleChange={handleChange}
          handleBlur={handleBlur}
          valuesType={values.message}
          name="message"
          placeholder={`Message ${
            practice
              ? practice.practiceName.length > 18
                ? practice.practiceName.substring(0, 11 - 3) + '...'
                : practice.practiceName
              : group && group.name
          }`}
          iconLeft={{
            name: 'smile',
            type: 'font-awesome-5',
            action: setShowEmoji,
            value: showEmoji,
          }}
          icon2Name="attachment"
          icon2Type="entypo"
          icon2Action={() =>
            launchImageLibrary({ mediaType: 'photo' }, (i) => {
              if (!i.didCancel) {
                setMediaFile({
                  name: i.fileName,
                  uri: i.uri,
                  mimeType: i.type,
                  size: i.fileSize,
                  height: i.height,
                  width: i.width,
                });
                setShowMediaPick(true);
              }
              console.log(mediaFile);
              console.log('setting Image');
            })
          }
          autoCompleteType="name"
          textContentType="givenName"
          keyboardType="default"
          autoCapitalize="sentences"
          boxStyle={{
            borderRadius: 50,
            width: windowWidth - 80,
            height: 45,
            marginTop: 0,
            justifyContent: 'space-between',
          }}
          styling={{
            input: {
              fontSize: normalize(15),
              color: colors.text,
              marginLeft: 6,
            },
            // icon: {},,
          }}
        />


      </KeyboardAvoidingView> */}
        {/* {showEmoji && (
        <View style={{ height: 300 }}>
          <EmojiSelector
            showTabs={true}
            theme={colors.background}
            showHistory={true}
            showSectionTitles={true}
            showSearchBar={false}
            categoriesEnabled={[flags, sports, food]}
            columns={10}
            category={Categories.symbols}
            onEmojiSelected={(emoji) => {
              Keyboard.dismiss();
              setInputText((input) => input + emoji);
            }}
            shouldInclude={
              (emoji) => {
                // eslint-disable-next-line radix
                if (Platform.OS === 'android') {
                  if (parseInt(emoji.added_in) <= 4.9) {
                    return emoji;
                  }
                } else {
                  return emoji;
                }
              }
              // emoji.lib.added_in === '6.0' ||
              // emoji.lib.added_in === '6.1'
            }
          />
        </View>
      )} */}
        {showEmoji && (
          <View style={{ height: 280 }}>
            <EmojiBoard
              // blackList={[]}
              showBoard={true}
              emojiSize={22}
              containerStyle={{
                backgroundColor: colors.background,
              }}
              categoryHighlightColor={colors.text}
              categoryDefautColor={colors.text_3}
              // tabBarStyle={{color: 'green'}}
              onClick={emoji => {
                Keyboard.dismiss();
                console.log(emoji);
                setInputText(input => input + emoji.code);
              }}
              onRemove={() => {
                // setInputText(backspace(inputText));
                setInputText(deleteEmoji(inputText));
              }}
            />
          </View>
        )}
        <MediaPicker
          navigation={navigation}
          practice={practice}
          group={group}
          showMediaPick={showMediaPick}
          setShowMediaPick={setShowMediaPick}
          mediaFile={mediaFile}
          setMediaFile={setMediaFile}
          sendFile={sendFile}
        />
      </View>
    </SafeAreaView>
  );
};

// function backspace(text) {
//   // var newText = text.split('').reverse().join('');
//   // text.substr;
//   console.log(runes.prototype);
//   console.log(text.length);
//   // text.gsub(/[^[:alnum:][:blank:][:punct:]]/, '').squeeze(' ').strip;
//   return runes(text).slice(0, -1);
// }

function deleteEmoji(emojiStr) {
  let emojisArray = emojiStr.match(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g);
  emojisArray = emojisArray.splice(0, emojisArray.length - 1);
  return emojisArray.join('');
}

const styles = StyleSheet.create({
  formFieldRow: {
    flexDirection: 'row',
    width: appwidth,
    justifyContent: 'space-between',
  },
});

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  isLoading: selectIsLoading,
  allMessages: selectAllMessages,
  practiceStaffs: selectPracticeStaffs,
  joinedPractices: selectJoinedPractices,
  currentPracticeId: selectCurrentPracticeId,
  signals: selectSignals,
  allNotifications: selectPatientNotifications,
});

const mapDispatchToProps = dispatch => ({
  // getPracticesAllStart: () => dispatch(getPracticesAllStart()),
  editProfile: data => dispatch(editProfile(data)),
  setAllMessages: data => dispatch(setAllMessages(data)),
  setCurrentChatChannel: data => dispatch(setCurrentChatChannel(data)),
  setMessagesCount: data => dispatch(setMessagesCount(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
