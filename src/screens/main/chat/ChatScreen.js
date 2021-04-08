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
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  FlatList,
  StatusBar,
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
import normalize from '../../../utils/normalize';
import { ListItem, Icon, Button } from 'react-native-elements';
import { ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import InputBox from '../../../components/hoc/InputBox';
import SmallInputBox from '../../../components/hoc/SmallInputBox';
import { editProfile } from '../../../redux/user/user.actions';
import { Platform } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import ChatBubble from '../../../components/hoc/ChatBubble';
import { usePubNub } from 'pubnub-react';
import { RefreshControl } from 'react-native';
import { selectAllMessages } from '../../../redux/practices/practices.selector';
import { setAllMessages } from '../../../redux/practices/practices.actions';
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
  Send,
} from 'react-native-gifted-chat';
import EmojiBoard from 'react-native-emoji-board';
import { SafeAreaView } from 'react-navigation';
import moment from 'moment';

const { flags, sports, food } = Categories;
// console.log(Categories);
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const ChatScreen = ({
  navigation,
  route,
  currentUser,
  extraData,
  editProfile,
  isLoading,
  allMessages,
  setAllMessages,
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
  const [messageDay, setMessageDay] = useState([]);
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

  const addTime = (timetoken) => {
    const unixTimestamp = timetoken / 10000000;
    const gmtDate = new Date(unixTimestamp * 1000);
    const localeDateTime = gmtDate.toLocaleString();
    // const time = localeDateTime.split(', ')[1];
    // return checkAmPm(time.slice(0, -3));
    return localeDateTime.split(', ')[0];
  };
  console.log('GROUP____', subgroups);
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
  const sendMessage = (data) => {
    console.log(channelName);
    console.log(data[0].text);
    // chatRef.scrollToEnd();
    pubnub.setUUID(currentUser.chatId);
    if (data) {
      pubnub.publish(
        {
          message: {
            text: data[0].text,
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
          console.log(status);
          console.log(response);
        },
      );
    } else {
      console.log('NO message');
    }
  };

  const sendFile = (fileData) => {
    console.log(channelName);
    console.log(fileData);
    // chatRef.scrollToEnd();
    pubnub.setUUID(currentUser.chatId);
    if (fileData) {
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
          callback: function (m) {
            console.log(m);
          },
        },
        (status, response) => {
          // setMessage('');
          // handle status, response
          console.log(status);
          console.log(response);
        },
      );
    } else {
      console.log('NO message');
    }
  };

  const getOldMessages = useCallback((cha) => {
    setRefreshing(true);
    console.log('=== GET OLD MESSAGES FROM CHANNEL =====: ', cha);
    const channelMsgs = allMessages.find((i) => i.channel === cha);
    // console.log(channelMsgs);
    const channels = [cha];
    if (channelMsgs) {
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
              let newMsgs = await msgs.map((item) =>
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
                  (i) => i.channel !== channelMsgs.channel,
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
      pubnub.fetchMessages(
        {
          channels: [channels[0]],
          count: 25,
          end: time,
        },

        (status, data) => {
          if (status.statusCode === 200) {
            console.log('=== GETTING MESSAGES FROM CHANNEL =====: ', cha);
            // addMessage([...data.channels[channels]])
            const addTime = (msg) => {
              const unixTimestamp = msg.timetoken / 10000000;
              const gmtDate = new Date(unixTimestamp * 1000);
              const localeDateTime = gmtDate.toLocaleString();
              // const time = localeDateTime.split(', ')[1];
              // return checkAmPm(time.slice(0, -3));
              return localeDateTime.split(', ')[0];
            };
            const msgs = data.channels[channels];
            if (msgs.length) {
              console.log('=== GET ALL MESSAGES FROM CHANNEL =====: ', cha);
              const lst = msgs[msgs.length - 1].timetoken;
              const fst = msgs[0].timetoken;
              let allMsgs = msgs.map((item) =>
                Object.assign(item, {
                  _id: item.timetoken,
                  user: { _id: item.uuid },
                  day: addTime(item.timetoken),
                }),
              );
              setAllMessages([
                ...allMessages,
                { channel: cha, fst, lst, messages: allMsgs },
              ]);

              setRefreshing(false);
            }

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
            setRefreshing(false);
          }
        },
      );
    }
  }, []);

  useMemo(() => {
    if (isFocused || allMessages) {
      console.log('New MESSAgE Available__');

      addMessages(
        allMessages.find((item) => item.channel === channelName)
          ? allMessages.find((item) => item.channel === channelName).messages
          : [],
      );
      // if (chatRef !== undefined && messages.length > 1) {
      //   console.log('REF__', chatRef);
      //   chatRef && chatRef.scrollToIndex({ animated: true, index: 20 });
      // }
    }
    // console.log('Updated MESSAgE__', messages);
    //
  }, [allMessages, channelName, isFocused]);

  // useMemo(() => {}, [isFocused, chatRef, messages]);
  const getUniqueListBy = (arr, key) => {
    return [
      ...new Map([...arr].reverse().map((item) => [item[key], item])).values(),
    ];
  };

  useMemo(() => {
    // console.log('Group_SUGGEST', groupSuggest);
    if (isFocused || type || group) {
      // console.log(
      //   'Chat Ref___',
      //   allMessages.find((item) => item.channel === channelName).messages,
      // );
      if (
        allMessages.find((item) => item.channel === channelName) &&
        allMessages.find((item) => item.channel === channelName).messages
          .length <= 1
      ) {
        setLoader(true);
        getOldMessages(channelName);
      }
      // else if{
      //   setLoader(true);
      // }
      else {
        getOldMessages(channelName);
        setLoader(false);
      }
      // allMessages.find((item) => item.channel === channelName)
      //   ? setGroupSuggest(false)
      //   : setGroupSuggest(true);
    }
  }, [isFocused, type, group]);

  useEffect(() => {
    console.log('rerendering_____');
    // chatRef.scrollToEnd();
    // console.log('ALLLL PROPSSS _____ ', practice);
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

  // let dataMsg = [] allMessages.find((item) => item.channel === channelName);

  const renderActions = (props) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
          onPressActionButton={() =>
            showAccessories
              ? setShowAccessories(false)
              : setShowAccessories(true)
          }
          containerStyle={{
            backgroundColor: colors.primary,
            borderRadius: 100,
            height: 28,
            width: 28,
            marginTop: 8,
            alignSelf: 'center',
            justifyContent: 'center',
          }}
        />
        <Actions
          {...props}
          icon={() => (
            <Icon
              name={showEmoji ? 'keyboard' : 'smile'}
              type={'font-awesome-5'}
              // action={setShowEmoji}
              // value={showEmoji}
              size={normalize(Platform.OS === 'ios' ? 20 : 22)}
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
    );
  };

  const renderAccessory = (props) => {
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
            launchCamera({ mediaType: 'photo' }, (i) => {
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
            launchCamera(
              { mediaType: 'video', quality: 'low', videoQuality: 'low' },
              (i) => {
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
              },
            )
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
            launchImageLibrary({}, (i) => {
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
          containerStyle={{ marginLeft: 30 }}
        />
        <Actions
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
        />
      </View>
    );
  };
  // const backspace = (text) => {
  //   console.log(text.length);
  //   return runes.substr(text, text.length - 1, 1);
  // };

  const renderSender = (props) => {
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Header
          navigation={navigation}
          // title="Edit Profile"
          subgroups={{
            show: groupSuggest,
            onShow: setGroupSuggest,
            data: subgroups,
            practiceDms: practiceDms,
            groupPractice: practice,
          }}
          backArrow={true}
          headerWithImage={{ chatUser: currentUser, status: 'Active Now' }}
          chatRight={
            type === 'dm'
              ? [
                  {
                    name: 'calendar-today',
                    type: 'material-community',
                    onPress: () => navigation.navigate('Appointments', {}),
                    buttonType: 'save',
                  },
                  {
                    name: 'ios-call',
                    type: 'ionicon',
                    onPress: null,
                    buttonType: 'save',
                  },
                ]
              : null
          }
          practice={practice}
          group={group}
          // isLoading={isLoading}
        />

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
              onSend={(text, shouldResetInputToolbar) => {
                // onSend(messages)
                setMessage(text);
                sendMessage(text);
                //  values.message = '';
              }}
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
                    <>
                      <ChatBubble
                        id={props.currentMessage.timetoken}
                        message={props.currentMessage}
                        navigation={navigation}
                        practice={practice}
                        groupPractice={groupPractice}
                        practiceDms={practiceDms}
                        patientChatId={currentUser.chatId}
                      />
                      {messages.length &&
                        getUniqueListBy(messages, 'day').some(
                          (item) =>
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
              renderChatEmpty={() => <View />}
              user={{
                _id: 1,
              }}
              listViewProps={{
                style: {
                  marginBottom: showAccessories ? 65 : 10,
                },
              }}
              textInputProps={{
                onFocus: () => setShowEmoji(false),
              }}
              text={inputText}
              onInputTextChanged={(text) => setInputText(text)}
              // focusTextInput={true}
              textInputStyle={{
                backgroundColor: colors.background,
                color: colors.text,
                alignSelf: 'center',
                fontFamily: 'SofiaProRegular',
                fontSize: normalize(14),
                alignItems: 'center',
                marginTop: 10,
              }}
              // renderInputToolbar={() => <></>}
              renderInputToolbar={(props) => (
                <InputToolbar
                  {...props}
                  renderAccessory={() =>
                    showAccessories ? renderAccessory() : null
                  }
                  renderActions={renderActions}
                  renderSend={renderSender}
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
              renderLoadEarlier={(props) => (
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
              loadEarlier={messages.length >= 25 ? true : false}
              infiniteScroll={true}
              maxComposerHeight={100}
              alignTop={true}

              // renderChatFooter={}
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
              patientChatId={currentUser.chatId}
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
              onClick={(emoji) => {
                Keyboard.dismiss();
                console.log(emoji);
                setInputText((input) => input + emoji.code);
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
});

const mapDispatchToProps = (dispatch) => ({
  // getPracticesAllStart: () => dispatch(getPracticesAllStart()),
  editProfile: (data) => dispatch(editProfile(data)),
  setAllMessages: (data) => dispatch(setAllMessages(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
