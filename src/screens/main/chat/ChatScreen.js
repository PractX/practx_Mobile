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
  SafeAreaView,
  KeyboardAvoidingView,
  FlatList,
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
  const { practice, practiceDms, channelName, subgroups, group } = params;
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [style1, setStyle1] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [channels] = useState();
  const [imageUri, setImageUri] = useState();
  const [messages, addMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [groupSuggest, setGroupSuggest] = useState(false);
  const d = new Date();
  const time = d.getTime();
  const pubnub = usePubNub();
  console.log('GROUP____', group);
  const saveChanges = () => {
    // console.log(imageUri);
    // console.log(inputRef.current.values);
    let newData = {
      ...inputRef.current.values,
      dob: `${inputRef.current.values.MM}/${inputRef.current.values.DD}/${inputRef.current.values.YY}`,
      avatar: imageUri,
    };
    delete newData.DD;
    delete newData.MM;
    delete newData.YY;
    // console.log(newData);
    editProfile(newData);
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
  const sendMessage = (message) => {
    console.log(channelName);
    console.log(message);
    // chatRef.scrollToEnd();
    pubnub.setUUID(currentUser.chatId);
    if (message) {
      pubnub.publish(
        {
          message: {
            text: message,
            userType: 'patient',
          },
          channel: channelName,
        },
        (status, response) => {
          setMessage('');
          // handle status, response
          console.log(status);
          // console.log(response);
        },
      );
    } else {
      console.log('NO message');
    }
  };

  const getMessages = (cha) => {
    console.log('=== GET MESSAGES FROM CHANNEL =====: ', cha);
    const channelMsgs = allMessages.find((i) => i.channel === cha);
    console.log('===  CHANNELS MESSAGES FROM =====: ', channelMsgs);
    const channels = [cha];
    if (channelMsgs) {
      pubnub.fetchMessages(
        {
          channels: [channels[0]],
          start: channelMsgs.lst + 1,
          end: time,
        },

        (status, data) => {
          if (status.statusCode === 200) {
            console.log('=== FOUND MESSAGES FROM CHANNEL =====: ', cha);
            // addMessage([...channelMsgs.messages, ...data.channels[channels]])
            const msgs = data.channels[channels];
            console.log(
              '=== FOUND NEW MESSAGES FROM CHANNEL =====: ',
              cha,
              msgs,
            );
            if (channelMsgs.messages !== msgs) {
              if (msgs.length && msgs[0].timetoken !== channelMsgs.lst) {
                channelMsgs.lst = msgs[msgs.length - 1].timetoken;
                channelMsgs.messages = [...channelMsgs.messages, ...msgs];
                // channelMsgs.messages = [...msgs]
                const newSavedMessages = allMessages.filter(
                  (i) => i.channel !== channelMsgs.channel,
                );
                console.log('=== channelMsgs =====: ', channelMsgs);
                console.log('=== newSavedMessages =====: ', newSavedMessages);
                setAllMessages([...newSavedMessages, channelMsgs]);
              }
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
          }
        },
      );
    } else {
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
            const msgs = data.channels[channels];
            if (msgs.length) {
              console.log('=== GET ALL MESSAGES FROM CHANNEL =====: ', cha);
              const lst = msgs[msgs.length - 1].timetoken;
              const fst = msgs[0].timetoken;
              setAllMessages([
                ...allMessages,
                { channel: cha, fst, lst, messages: msgs },
              ]);
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
          }
        },
      );
    }

    pubnub.subscribe({ channels });

    return () => {
      pubnub.unsubscribeAll();
    };
  };

  const getOldMessages = useCallback((cha) => {
    // setRefreshing(true);
    console.log('=== GET OLD MESSAGES FROM CHANNEL =====: ', cha);
    const channelMsgs = allMessages.find((i) => i.channel === cha);
    console.log(channelMsgs);
    const channels = [cha];
    if (channelMsgs) {
      pubnub.fetchMessages(
        {
          channels: [channels[0]],
          count: 25,
          start: channelMsgs.fst - 1,
        },

        (status, data) => {
          console.log(status);
          if (status.statusCode === 200) {
            const msgs = data.channels[channels];
            console.log(
              '=== FOUND OLD MESSAGES FROM CHANNEL =====: ',
              cha,
              msgs,
              channelMsgs,
            );
            if (msgs.length && msgs[0].timetoken !== channelMsgs.fst) {
              // channelMsgs.lst = msgs[msgs.length - 1].timetoken
              channelMsgs.fst = msgs[0].timetoken;
              channelMsgs.messages = [...msgs, ...channelMsgs.messages];
              // channelMsgs.messages = [...msgs]
              const newSavedMessages = allMessages.filter(
                (i) => i.channel !== channelMsgs.channel,
              );
              console.log('=== channelMsgs =====: ', channelMsgs);
              console.log('=== newSavedMessages =====: ', newSavedMessages);
              // dispatch(Actions.saveMsg([...newSavedMessages, channelMsgs]));
              setAllMessages([...newSavedMessages, channelMsgs]);
              setRefreshing(false);
            }
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
          setRefreshing(false);
        },
      );
    }

    return () => {
      pubnub.unsubscribeAll();
    };
  }, []);

  const getAllChannelMessages = (myChannel) => {
    // const dmsCha = dms.map((i) => i.channelName); /// When backend guy delete
    // const dmsCha = dms.map((i) => i.channelName);
    // console.log(dmsCha);
    // const subgroupsCha = subGroups.map((i) => i.Subgroup.channelName);
    const allChannels = [myChannel];

    console.log('=== GET MESSAGES FROM ALL CHANNEL =====: ', allChannels);

    pubnub.fetchMessages(
      {
        channels: allChannels,
        count: 25,
        end: time,
      },

      (status, data) => {
        if (status.statusCode === 200) {
          const { channels } = data;
          const allMsgs = [];

          allChannels.map((i) => {
            const msgs = channels[i];
            if (msgs) {
              const lst = msgs[msgs.length - 1].timetoken;
              const fst = msgs[0].timetoken;

              allMsgs.push({ channel: i, lst, fst, messages: msgs });
            }
            return i;
          });
          console.log('ALL_MESSAGE+++++', allMsgs);
          setAllMessages(allMsgs);

          pubnub.time((status, response) => {
            if (!status.error) {
              pubnub.objects.setMemberships({
                channels: [
                  {
                    id: allChannels[0],
                    custom: {
                      lastReadTimetoken: response.timetoken,
                    },
                  },
                ],
              });

              // dispatch(Actions.messagesCountUpdate(allChannels[0]));
              // console.log(
              //   allChannels[0],
              //   '=== MESSAGE COUNT =====:',
              //   messagesCount[allChannels[0]],
              // );
            }
          });
        }
      },
    );

    console.log('___ALLCHANNELS___', allChannels);

    // pubnub.subscribe({ channels: allChannels });
  };

  // useEffect(() => {
  //   console.log(
  //     'CHANNELSS_+++++++',
  //     practiceDms.find((item) => item.channelName),
  //   );
  //   if (pubnub) {
  //     pubnub.setUUID(currentUser.chatId);

  //     pubnub.addListener({
  //       message: (messageEvent) => {
  //         // addMessages([
  //         //   ...messages,
  //         //   {
  //         //     channel: messageEvent.channel,
  //         //     message: messageEvent.message,
  //         //     timetoken: messageEvent.timetoken,
  //         //     uuid: messageEvent.publisher,
  //         //   },
  //         // ]);
  //         getMessages(messageEvent.channel);
  //         console.log('Events', messageEvent);

  //         pubnub.objects.setMemberships({
  //           channels: [
  //             {
  //               id: messageEvent.channel,
  //               custom: {
  //                 lastReadTimetoken: messageEvent.timetoken,
  //               },
  //             },
  //           ],
  //         });

  //         // Get memberships and all messages count as well
  //         // pubnub.his
  //         pubnub.objects
  //           .getMemberships({
  //             uuid: messageEvent.publisher,
  //             include: {
  //               customFields: true,
  //             },
  //           })
  //           .then((data) => {
  //             if (data.status === 200) {
  //               if (data.data.length > 0) {
  //                 const channels = data.data.map((res) => res.channel.id);
  //                 const timetoken = data.data.map(
  //                   (res) => res.custom.lastReadTimetoken,
  //                 );

  //                 pubnub
  //                   .messageCounts({
  //                     channels: channels,
  //                     channelTimetokens: timetoken,
  //                   })
  //                   .then((response) => {
  //                     // set all messages count to a global variable
  //                     // dispatch(setMessagesCount(response.channels))
  //                   })
  //                   .catch((error) => {
  //                     console.log(
  //                       error,
  //                       '------ Error Message count ======== ',
  //                     );
  //                   });
  //               } else {
  //                 console.log(data, '------ No Message count ======== ');
  //               }
  //             }
  //           });
  //       },

  //       file: (picture) => {
  //         addMessages([
  //           ...messages,
  //           {
  //             channel: picture.channel,
  //             message: picture.message,
  //             timetoken: picture.timetoken,
  //             uuid: picture.publisher,
  //           },
  //         ]);
  //       },

  //       signal: function (s) {
  //         // handle signal
  //         var channelName = s.channel; // The channel to which the signal was published
  //         var channelGroup = s.subscription; // The channel group or wildcard subscription match (if exists)
  //         var pubTT = s.timetoken; // Publish timetoken
  //         var msg = s.message; // The Payload
  //         var publisher = s.publisher; //The Publisher
  //       },

  //       status: function (s) {
  //         var affectedChannelGroups = s.affectedChannelGroups; // The channel groups affected in the operation, of type array.
  //         var affectedChannels = s.affectedChannels; // The channels affected in the operation, of type array.
  //         var category = s.category; //Returns PNConnectedCategory
  //         var operation = s.operation; //Returns PNSubscribeOperation
  //         var lastTimetoken = s.lastTimetoken; //The last timetoken used in the subscribe request, of type long.
  //         var currentTimetoken = s.currentTimetoken; //The current timetoken fetched in the subscribe response, which is going to be used in the next request, of type long.
  //         var subscribedChannels = s.subscribedChannels; //All the current subscribed channels, of type array.
  //       },

  //       presence: function (p) {
  //         // console.log('============ PRESENCE LISTENER ============', p);
  //         // handle presence
  //         // var action = p.action; // Can be join, leave, state-change, or timeout
  //         // var channelName = p.channel; // The channel to which the message was published
  //         // var occupancy = p.occupancy; // Number of users subscribed to the channel
  //         // var state = p.state; // User State
  //         // var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
  //         // var publishTime = p.timestamp; // Publish timetoken
  //         // var timetoken = p.timetoken;  // Current timetoken
  //         // var uuid = p.uuid; // UUIDs of users who are subscribed to the channel
  //       },
  //     });

  //     // Fetch messaged from pubnub history..............

  //     // if (messages < 1) {
  //     //   getMessages(channels);
  //     // }

  //     // console.log(channels);

  //     // pubnub.subscribe({ channels: channels, withPresence: true });

  //     // setChannel(channels);
  //   }
  //   return () => {
  //     pubnub.unsubscribeAll();
  //   };
  // }, [pubnub]);

  useEffect(() => {
    console.log('Group_SUGGEST', groupSuggest);
    if (isFocused) {
      allMessages.find((item) => item.channel === channelName)
        ? setGroupSuggest(false)
        : setGroupSuggest(true);
      getAllChannelMessages(channelName);
    }
  }, [isFocused, groupSuggest]);

  useEffect(() => {
    console.log(inputRef);
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

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        // height: '100%',
      }}>
      <Header
        navigation={navigation}
        // title="Edit Profile"
        backArrow={true}
        headerWithImage={{ chatUser: currentUser, status: 'Active Now' }}
        iconRight1={{
          name: 'save-outline',
          type: 'ionicon',
          onPress: saveChanges,
          buttonType: 'save',
        }}
        practice={practice}
        group={group}
        // isLoading={isLoading}
      />
      {groupSuggest && subgroups && subgroups.length > 0 && (
        <View
          style={{
            width: '100%',
            alignSelf: 'center',
            flexDirection: 'row',
            marginTop: 55,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              paddingVertical: 7,
              paddingHorizontal: 10,
              color: colors.text_2,
              fontSize: normalize(14),
              fontFamily: 'SofiaProRegular',
            }}>
            Join a group for more conversation❓
          </Text>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              flexDirection: 'row',
              marginTop: 15,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
            {subgroups.map((item) => (
              <TouchableOpacity
                style={{
                  marginVertical: 6,
                  marginHorizontal: 10,
                  backgroundColor: colors.secondary,
                  borderRadius: 25,
                }}>
                <Text
                  style={{
                    paddingVertical: 7,
                    paddingHorizontal: 10,
                    color: 'white',
                    fontSize: normalize(12),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      <FlatList
        ref={(ref) => setChatRef(ref)}
        // keyExtractor={(item) => item.id.toString()}
        keyboardDismissMode="on-drag"
        // maintainVisibleContentPosition={{
        //   autoscrollToTopThreshold: 10,
        //   minIndexForVisible: 1,
        // }}
        // horizontal={true}
        // refreshControl={
        //   <RefreshControl
        //   // horizontal={true}
        //   // refreshing={practicesRefreshing}
        //   // onRefresh={() => getPracticesAllStart()}
        //   />
        // }
        onRefresh={() => getOldMessages(channelName)}
        refreshing={refreshing}
        onContentSizeChange={() => chatRef.scrollToEnd({ animated: true })} // scroll it
        // onLayout={() => chatRef.scrollToEnd({ animated: true })}
        // inverted={false}
        // removeClippedSubviews
        // ListEmptyComponent
        // contentContainerStyle={{ flexDirection: 'column-reverse' }}
        // initialNumToRender={5}
        // updateCellsBatchingPeriod={5}
        showsVerticalScrollIndicator={true}
        style={{
          // flex: 2,
          // minHeight: windowHeight - 140,
          backgroundColor: colors.background,
          marginTop: 55,
          // marginBottom: 60,
        }}
        data={
          allMessages.find((item) => item.channel === channelName)
            ? allMessages.find((item) => item.channel === channelName).messages
            : []
        }
        // numColumns={1}
        renderItem={({ item, index }) => (
          <ChatBubble
            id={index}
            message={item}
            navigation={navigation}
            practice={practice}
            practiceDms={practiceDms}
            patientChatId={currentUser.chatId}
          />
        )}
        keyExtractor={(item, index) => item.id}
        // showsHorizontalScrollIndicator={false}
        // extraData={selected}
      />
      <KeyboardAvoidingView behavior="height">
        <Animatable.View
          animation="bounceInLeft"
          style={{
            // position: 'absolute',
            // bottom: 0,
            width: '100%',
            // marginTop: -10,
            // marginBottom: 10,
            // height: 100,
            backgroundColor: colors.background,
          }}>
          <Formik
            innerRef={inputRef}
            initialValues={{
              message: '',
            }}
            style={{}}
            onSubmit={(values) => {
              // signupPatient(values);

              setMessage(values.message);
              sendMessage(values.message);
              values.message = '';
              // console.log('Lets go');
            }}>
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View
                style={{
                  margin: 0,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.background,
                  borderTopWidth: 0.8,
                  borderColor: colors.background_1,
                  height: 56,
                }}>
                {/* ------------------- BIO SECTION --------------------------------------- */}

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
                  icon2Name="attachment"
                  icon2Type="entypo"
                  icon2Action={console.log}
                  autoCompleteType="name"
                  textContentType="givenName"
                  keyboardType="default"
                  autoCapitalize="sentences"
                  boxStyle={{
                    borderRadius: 50,
                    width: windowWidth - 80,
                    height: 45,
                    marginTop: 0,
                  }}
                  styling={{
                    input: {
                      fontSize: normalize(15),
                      color: colors.text,
                      marginLeft: 5,
                    },
                  }}
                />
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
                      <TouchableOpacity
                        onPress={handleSubmit}
                        style={{
                          backgroundColor: colors.primary,
                          height: 40,
                          width: 40,
                          alignSelf: 'center',
                          justifyContent: 'center',
                          // marginTop: 10,
                          marginLeft: 10,
                          borderRadius: 10,
                        }}>
                        <Icon
                          name={'ios-send'}
                          type={'ionicon'}
                          color={'white'}
                          size={normalize(21)}
                          style={{
                            alignSelf: 'center',
                          }}
                        />
                      </TouchableOpacity>
                    );
                    // );
                  }}
                />
              </View>
            )}
          </Formik>
        </Animatable.View>
      </KeyboardAvoidingView>
    </View>
  );
};

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
