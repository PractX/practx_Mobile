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
} from 'react-native';
import { Text, Content } from 'native-base';
import Header from '../../../components/hoc/Header';
import {
  DrawerActions,
  useIsFocused,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../../redux/user/user.selector';
import { normalize } from 'react-native-elements';
import { ListItem, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native';
import {
  chatWithPracticeStart,
  getJoinedPracticesStart,
  getPracticesDmsStart,
  getPracticeSubgroupsStart,
  setFilter,
  setAllMessages,
  getPracticeStaffStart,
  leavePracticeStart,
  setSignals,
} from '../../../redux/practices/practices.actions';
import { RefreshControl } from 'react-native';
import {
  selectAllMessages,
  selectCurrentPracticeId,
  selectIsFetching,
  selectJoinedPractices,
  selectPracticeDms,
  selectPracticeSubgroups,
  selectSignals,
} from '../../../redux/practices/practices.selector';
import PracticesBox from './PracticeBox';
import { usePubNub } from 'pubnub-react';
import PracticeList from './PracticeList';
import DmsBox from './DmsBox';
import { ActivityIndicator } from 'react-native-paper';
import GroupBox from './GroupBox';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const ChatMessages = ({
  navigation,
  extraData,
  route,
  currentUser,
  getJoinedPracticesStart,
  joinedPractices,
  setFilter,
  getPracticesDmsStart,
  isFetching,
  currentPracticeId,
  practiceDms,
  chatWithPracticeStart,
  getPracticeSubgroupsStart,
  getPracticeStaffStart,
  leavePracticeStart,
  subgroups,
  allMessages,
  setAllMessages,
  signals,
  setSignals,
}) => {
  const { colors } = useTheme();
  const ref = useRef();
  // const props = useRoute();
  const pubnub = usePubNub();
  const [style1, setStyle1] = useState();
  const [practicesRefreshing, setPracticesRefreshing] = useState(false);
  const [dmMessage, setDmMessage] = useState(null);
  const isFocused = useIsFocused();
  const isDrawerOpen = useIsDrawerOpen();
  const [showStaffs, setShowStaffs] = useState(false);
  const d = new Date();
  const time = d.getTime();
  const [newMsgAvailable, setNewMsgAvailable] = useState(false);

  const addTime = (timetoken) => {
    const unixTimestamp = timetoken / 10000000;
    const gmtDate = new Date(unixTimestamp * 1000);
    const localeDateTime = gmtDate.toLocaleString();
    // const time = localeDateTime.split(', ')[1];
    // return checkAmPm(time.slice(0, -3));
    return localeDateTime.split(', ')[0];
  };

  // const getLastMessages = (cha, num) => {
  //   console.log('Chass', cha);
  //   const channels = [cha];
  //   console.log(channels);
  //   console.log(num);

  //   pubnub.fetchMessages(
  //     {
  //       channels: [channels[0]],
  //       count: 10,
  //       end: time,
  //     },

  //     (status, data) => {
  //       if (status.statusCode === 200) {
  //         // console.log(status);
  //         console.log('Datas', data);
  //       }
  //     },
  //   );
  // };

  const getAllChannelMessages = useCallback((dms, subGroups) => {
    // const dmsCha = dms.map((i) => i.channelName); /// When backend guy delete
    const dmsCha = dms.map((i) => i.Dm.channelName);
    let newSubGroups = [];
    subGroups.map((i) =>
      i.map((j) =>
        newSubGroups.push(j.subgroupChats[0].PatientSubgroup.channelName),
      ),
    );

    console.log('subgroupsCha__', newSubGroups);
    const allChannels = [...dmsCha, ...newSubGroups];

    console.log('=== GET MESSAGES FROM ALL CHANNEL =====: ', allChannels);

    pubnub.fetchMessages(
      {
        channels: allChannels,
        count: 10,
        end: time,
      },

      (status, data) => {
        if (status.statusCode === 200) {
          const { channels } = data;
          let allMsgs = [];
          // console.log('C_DATA__', channels);

          allChannels.map(async (i) => {
            const msgs = channels[i];
            const newMsg = msgs.map((item) =>
              Object.assign(item, {
                _id: item.timetoken,
                user: { _id: item.uuid },
                day: addTime(item.timetoken),
              }),
            );
            const lst = newMsg[newMsg.length - 1].timetoken;
            const fst = newMsg[0].timetoken;
            // console.log('NEMES', newMsg);
            allMsgs.push({ channel: i, lst, fst, messages: newMsg });
            // setAllMessages(allMsgs);
            // return i;
          });
          console.log('NEW_ALL_MESSAGE+++++', allMsgs);
          setAllMessages(allMsgs);
          // console.log('NEW_ALL_MESSAGE+++++', allMsgs);
          // setAllMessages(allMsgs);

          // pubnub.time((status, response) => {
          //   if (!status.error) {
          //     pubnub.objects.setMemberships({
          //       channels: [
          //         {
          //           id: allChannels[0],
          //           custom: {
          //             lastReadTimetoken: response.timetoken,
          //           },
          //         },
          //       ],
          //     });

          //     // dispatch(Actions.messagesCountUpdate(allChannels[0]));
          //     // console.log(
          //     //   allChannels[0],
          //     //   '=== MESSAGE COUNT =====:',
          //     //   messagesCount[allChannels[0]],
          //     // );
          //   }
          // });
        }
      },
    );

    // console.log('___ALLCHANNELS SUBSCRIBING TO___', allChannels);

    pubnub.subscribe({ channels: allChannels, withPresence: true });
  }, []);

  // useEffect(() => {
  //   practiceDms && allMessages
  //     ? allMessages.find(
  //         (it) =>
  //           it.channel ===
  //           practiceDms.find((item) => item.id === currentPracticeId).Dm
  //             .channelName,
  //       )
  //       ? setDmMessage(
  //           allMessages.find(
  //             (it) =>
  //               it.channel ===
  //               practiceDms.find((item) => item.id === currentPracticeId).Dm
  //                 .channelName,
  //           ),
  //         )
  //       : null
  //     : null;
  // }, [isFocused]);

  const getMessages = useCallback(
    (cha, msg) => {
      console.log('=== GET MESSAGES FROM CHANNEL =====: ', cha);
      console.log('ALL____', allMessages);

      const channelMsgs = allMessages.find((i) => i.channel === cha);
      console.log('Finding--', channelMsgs);
      // console.log('Current Date____', time);
      if (channelMsgs) {
        channelMsgs.lst = msg.timetoken;
        channelMsgs.messages = [...channelMsgs.messages, msg];
        const newSavedMessages = allMessages.filter(
          (i) => i.channel !== channelMsgs.channel,
        );

        console.log('=== channelMsgs =====: ', channelMsgs);
        console.log('=== newSavedMessages =====: ', newSavedMessages);
        setAllMessages([...newSavedMessages, channelMsgs]);
        setNewMsgAvailable(false);

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
      } else {
        console.log('TESTING mESSAGE eRROR');
        setAllMessages([
          ...allMessages,
          {
            channel: cha,
            fst: msg.timetoken,
            lst: msg.timetoken,
            messages: [msg],
          },
        ]);
        setNewMsgAvailable(true);

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

      // pubnub.subscribe({ channels });

      // return () => {
      //   pubnub.unsubscribeAll();
      // };
    },
    [practiceDms.length, subgroups.length, allMessages],
  );

  // const getLastMessages = (cha, msg) => {
  //   console.log('=== newSavedMessages GET MESSAGES FROM CHANNEL =====: ', cha);
  //   //   console.log('ALL____', allMessages);
  //   // console.log(
  //   //   '=== GET ALLL LAST MESSAGE FROM CHANNEL =====: ',
  //   //   cha,
  //   //   msg,
  //   //   allMessages,
  //   // );
  //   const channelMsgs = allMessages.find((i) => i.channel === cha);
  //   let allMsgs = allMessages;
  //   if (channelMsgs) {
  //     channelMsgs.lst = msg.timetoken;
  //     channelMsgs.messages = [...channelMsgs.messages, msg];
  //     // channelMsgs.messages = [...msgs]
  //     const newallMessages = allMessages.filter(
  //       (i) => i.channel !== channelMsgs.channel,
  //     );
  //     allMsgs = [channelMsgs, ...newallMessages];
  //     setAllMessages(allMsgs);
  //   } else {
  //     allMsgs = [
  //       {
  //         channel: cha,
  //         fst: msg.timetoken,
  //         lst: msg.timetoken,
  //         messages: [msg],
  //       },
  //       ...allMsgs,
  //     ];
  //     setAllMessages(allMsgs);
  //   }
  //   // setLastScrollTop((prev) => {
  //   //   if (prev && prev.find((i) => i.channel === cha)) {
  //   //     return [
  //   //       ...prev.filter((i) => i.channel !== cha),
  //   //       { channel: cha, lastScrollTop: 0 },
  //   //     ];
  //   //   }
  //   //   return [...prev, { channel: cha, lastScrollTop: 0 }];
  //   // });
  //   // let newDMS = [];
  //   // let newGMS = [];
  //   // let subgroupsCha = [];
  //   // subgroups
  //   //   .map((l) => l.subgroupChats)
  //   //   .map(
  //   //     (k) => k.length && k.map((a) => subgroupsCha.push(a.PatientSubgroup)),
  //   //   );
  //   // const sorted = allMsgs.sort((a, b) => Number(b.lst) - Number(a.lst));
  //   // sorted.map((i) => {
  //   //   // const d = dms.find(j => j.channelName === i.channel)
  //   //   if (i.type === 'dm') {
  //   //     newDMS.push(dms.find((j) => j.Dm.channelName === i.channel));
  //   //   }
  //   //   if (i.type === 'gm') {
  //   //     newGMS.push(subgroupsCha.find((j) => j.channelName === i.channel));
  //   //   }
  //   // });
  //   // console.log("=== Sort =====: ", allMsgs, dms, [
  //   //   ...newDMS,
  //   //   ...dms.filter(
  //   //     (i) => !sorted.find((j) => j.channel === i.Dm.channelName)
  //   //   ),
  //   // ]);
  //   // dispatch(
  //   //   Actions.requestDMSSuccess([
  //   //     ...newDMS,
  //   //     ...dms.filter(
  //   //       (i) => !sorted.find((j) => j.channel === i.Dm.channelName)
  //   //     ),
  //   //   ])
  //   // );
  // };

  // const pract = useCallback(async () => {
  //   console.log('fetching');

  //   if (currentPracticeId > 0) {
  //     getPracticeSubgroupsStart(currentPracticeId);
  //   }

  //   // }
  // }, []);

  // ANCHOR Add Signals

  useMemo(() => {
    if (isFocused) {
      chatWithPracticeStart(
        currentPracticeId === 0
          ? joinedPractices && joinedPractices.length > 0
            ? joinedPractices.map((i) => i.id)[joinedPractices.length - 1]
            : 0
          : currentPracticeId,
      );
      getJoinedPracticesStart();
      getPracticesDmsStart();
      getPracticeSubgroupsStart(
        currentPracticeId === 0
          ? joinedPractices && joinedPractices.length > 0
            ? joinedPractices.map((i) => i.id)[joinedPractices.length - 1]
            : 0
          : currentPracticeId,
      );
    }

    // if (!isFetching) {
  }, [isFocused]);
  const removeChannel = () => {
    console.log('Deleting');
    // pubnub.removeMessageAction(
    //   {
    //     channel: ['23_15_V3wNztfhu'],
    //     messageTimetoken: '16130166805908223',
    //     actionTimetoken: Date.now(),
    //   },
    //   function (status, response) {
    //     console.log(response);
    //   },
    // );
    pubnub.deleteMessages(
      {
        channel: '32_13_ciqrmNksp',
        start: Date.now(),
        end: '16306181371452321',
      },
      (result) => {
        console.log(result);
      },
    );
  };

  useMemo(() => {
    if (currentPracticeId) {
      console.log('CurrenId');
      // pract();
      getPracticeSubgroupsStart(currentPracticeId);
      getPracticeStaffStart(currentPracticeId);
      // getLastMessages();
      removeChannel();
      const me = subgroups.find((item) => item.practiceId === currentPracticeId)
        ? subgroups.find((item) => item.practiceId === currentPracticeId)
        : [];

      console.log('WORKING__', me);
    }
  }, [currentPracticeId]);

  useMemo(() => {
    // console.log(
    //   'Checkin GROUP DATA__',
    //   subgroups.find((item) => item.practiceId === currentPracticeId).groups
    //     .length > 0,
    // );
    if (currentPracticeId) {
      // console.log('Getting all channels');
      // console.log('All Subgroups', subgroups);
      if (practiceDms.length) {
        getAllChannelMessages(
          practiceDms,
          subgroups.map((item) => [...item.groups]),
        );
      }
    }
  }, [currentPracticeId, subgroups]);

  useEffect(() => {
    console.log('useEffect');
    if (pubnub) {
      pubnub.setUUID(currentUser ? currentUser.chatId : 0);

      const listener = {
        message: (messageEvent) => {
          console.log('Add event  listener', messageEvent);
          const msg = {
            channel: messageEvent.channel,
            message: messageEvent.message,
            messageType: null,
            timetoken: messageEvent.timetoken,
            uuid: messageEvent.publisher,
            _id: messageEvent.timetoken,
            user: { _id: messageEvent.uuid },
            day: addTime(messageEvent.timetoken),
          };

          console.log('Events', messageEvent);
          getMessages(messageEvent.channel, msg);
          // getLastMessages(messageEvent.channel, msg);
          console.log('Events', messageEvent);

          pubnub.objects.setMemberships({
            channels: [
              {
                id: messageEvent.channel,
                custom: {
                  lastReadTimetoken: messageEvent.timetoken,
                },
              },
            ],
          });

          // Get memberships and all messages count as well
          // pubnub.his
          pubnub.objects
            .getMemberships({
              uuid: messageEvent.publisher,
              include: {
                customFields: true,
              },
            })
            .then((data) => {
              if (data.status === 200) {
                if (data.data.length > 0) {
                  const channels = data.data.map((res) => res.channel.id);
                  const timetoken = data.data.map(
                    (res) => res.custom.lastReadTimetoken,
                  );

                  pubnub
                    .messageCounts({
                      channels: channels,
                      channelTimetokens: timetoken,
                    })
                    .then((response) => {
                      // set all messages count to a global variable
                      // dispatch(setMessagesCount(response.channels))
                    })
                    .catch((error) => {
                      console.log(
                        error,
                        '------ Error Message count ======== ',
                      );
                    });
                } else {
                  console.log(data, '------ No Message count ======== ');
                }
              }
            });
        },

        file: (picture) => {
          const msg = {
            channel: picture.channel,
            message: { file: picture.file, message: picture.message },
            messageType: 4,
            timetoken: picture.timetoken,
            uuid: picture.publisher,
            _id: picture.timetoken,
            user: { _id: picture.uuid },
            day: addTime(picture.timetoken),
          };
          console.log('Picture Events', picture);
          getMessages(picture.channel, msg);
        },

        signal: function (s) {
          // handle signal
          console.log('pubnub signal: ', s);
          const _signals = signals.filter((i) => i.channel !== s.channel);
          setSignals([..._signals, s]);
          var channelName = s.channel; // The channel to which the signal was published
          var channelGroup = s.subscription; // The channel group or wildcard subscription match (if exists)
          var pubTT = s.timetoken; // Publish timetoken
          var msg = s.message; // The Payload
          var publisher = s.publisher; //The Publisher
        },

        status: function (s) {
          var affectedChannelGroups = s.affectedChannelGroups; // The channel groups affected in the operation, of type array.
          var affectedChannels = s.affectedChannels; // The channels affected in the operation, of type array.
          var category = s.category; //Returns PNConnectedCategory
          var operation = s.operation; //Returns PNSubscribeOperation
          var lastTimetoken = s.lastTimetoken; //The last timetoken used in the subscribe request, of type long.
          var currentTimetoken = s.currentTimetoken; //The current timetoken fetched in the subscribe response, which is going to be used in the next request, of type long.
          var subscribedChannels = s.subscribedChannels; //All the current subscribed channels, of type array.
        },

        presence: function (p) {
          console.log('============ PRESENCE LISTENER ============', p);
          // handle presence
          // var action = p.action; // Can be join, leave, state-change, or timeout
          // var channelName = p.channel; // The channel to which the message was published
          // var occupancy = p.occupancy; // Number of users subscribed to the channel
          // var state = p.state; // User State
          // var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
          // var publishTime = p.timestamp; // Publish timetoken
          // var timetoken = p.timetoken;  // Current timetoken
          // var uuid = p.uuid; // UUIDs of users who are subscribed to the channel
        },
      };

      // Fetch messaged from pubnub history..............

      // if (messages < 1) {
      //   getLastMessages(channels);
      // }

      // console.log(channels);

      // pubnub.subscribe({ channels: channels, withPresence: true });
      pubnub.addListener(listener);

      return () => {
        console.log('Removing listener');
        pubnub.removeListener(listener);
      };

      // setChannel(channels);
    }
  }, [
    subgroups,
    currentPracticeId,
    pubnub,
    allMessages.length <= 1,
    newMsgAvailable,
    signals.length,
  ]);

  useEffect(() => {
    if (isDrawerOpen) {
      setStyle1('open');
      console.log('Open');
    } else {
      setStyle1('close');
      console.log('Close');
    }
  }, [isDrawerOpen, currentPracticeId, currentUser]);

  return (
    <SafeAreaView
      style={[
        style1 === 'open' && {
          borderWidth: 18,
          // borderColor: colors.background_1,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: colors.background_1,
          borderRightColor: 'transparent',
          flex: 1,
          // borderRadius: 240,
          borderTopLeftRadius: 110,
          borderBottomLeftRadius: 110,
        },
      ]}>
      <View
        style={[
          style1 === 'open' && {
            // borderWidth: 20,
            backgroundColor: colors.background,
            height: '100%',
            // zIndex: 100,
            // IOS
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            // Android
            elevation: 3,
            borderRadius: 30,
            overflow: 'hidden',
          },
        ]}>
        <Header navigation={navigation} title="Messages" notifyIcon={true} />
        {/* {appointmentData ? ( */}

        {/* ------------------------------ Pactices Lists -----------------------------  */}

        <PracticeList
          style1={style1}
          setFilter={setFilter}
          navigation={navigation}
          practicesRefreshing={practicesRefreshing}
          joinedPractices={joinedPractices}
          chatWithPracticeStart={chatWithPracticeStart}
          setShowStaffs={setShowStaffs}
          getPracticesDmsStart={getPracticesDmsStart}
          currentPracticeId={currentPracticeId}
          // practiceDms={
          //   practiceDms &&
          //   practiceDms.find((item) => item.practiceId === currentPracticeId)
          // }
        />

        {practiceDms && practiceDms.length && currentPracticeId ? (
          <>
            <View
              style={{
                width: style1 === 'open' ? appwidth - 50 : appwidth,
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 30,
              }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: normalize(13),
                  fontFamily: 'SofiaProSemiBold',
                }}>
                Direct message
              </Text>
              <TouchableOpacity
                style={{}}
                onPress={() =>
                  leavePracticeStart({
                    practiceId: currentPracticeId,
                    practiceName: joinedPractices.find(
                      (item) => item.id === currentPracticeId,
                    ).practiceName,
                  })
                }>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: normalize(13),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  Leave
                </Text>
              </TouchableOpacity>
            </View>
            <DmsBox
              id={currentPracticeId}
              signals={signals}
              item={
                practiceDms &&
                practiceDms.find((item) => item.id === currentPracticeId)
              }
              allMessages={
                practiceDms
                  ? allMessages.find((it) =>
                      practiceDms.find((item) => item.id === currentPracticeId)
                        ? it.channel ===
                          practiceDms.find(
                            (item) => item.id === currentPracticeId,
                          ).Dm.channelName
                        : '',
                    )
                    ? allMessages.find(
                        (it) =>
                          it.channel ===
                          practiceDms.find(
                            (item) => item.id === currentPracticeId,
                          ).Dm.channelName,
                      )
                    : null
                  : null
                // dmMessage
              }
              currentUser={currentUser}
              practiceDms={practiceDms}
              subgroups={subgroups}
              navigation={navigation}
              newDate={d}
              styling={{
                width: style1 === 'open' ? appwidth - 50 : appwidth,
              }}
            />
            {subgroups && (
              <View style={{ marginTop: 0 }}>
                <View
                  style={{
                    width: style1 === 'open' ? appwidth - 50 : appwidth,
                    alignSelf: 'center',
                    paddingVertical: 5,
                  }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: normalize(13),
                      fontFamily: 'SofiaProSemiBold',
                    }}>
                    Groups
                  </Text>
                </View>
                {currentPracticeId &&
                subgroups.length > 0 &&
                subgroups.find(
                  (item) => item.practiceId === currentPracticeId,
                ) &&
                subgroups.find((item) => item.practiceId === currentPracticeId)
                  .groups.length > 0 ? (
                  <View
                    style={{
                      height: windowHeight - 350,
                    }}>
                    <FlatList
                      ref={ref}
                      horizontal={false}
                      refreshControl={
                        <RefreshControl
                          horizontal={true}
                          refreshing={practicesRefreshing}
                          // onRefresh={() => getPracticesAllStart()}
                        />
                      }
                      // removeClippedSubviews
                      // ListEmptyComponent
                      initialNumToRender={5}
                      updateCellsBatchingPeriod={5}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ flexGrow: 1 }}
                      data={
                        subgroups.find(
                          (item) => item.practiceId === currentPracticeId,
                        )
                          ? subgroups.find(
                              (item) => item.practiceId === currentPracticeId,
                            ).groups
                          : []
                      }
                      numColumns={1}
                      renderItem={({ item, index }) => (
                        <GroupBox
                          id={currentPracticeId}
                          signals={signals}
                          item={item}
                          practices={
                            practiceDms &&
                            practiceDms.find(
                              (it) => it.id === currentPracticeId,
                            )
                          }
                          allMessages={
                            practiceDms && allMessages && subgroups
                              ? allMessages.find(
                                  (it) =>
                                    it.channel ===
                                    item.subgroupChats[0].PatientSubgroup
                                      .channelName,
                                )
                                ? allMessages.find(
                                    (it) =>
                                      it.channel ===
                                      item.subgroupChats[0].PatientSubgroup
                                        .channelName,
                                  )
                                : null
                              : null
                          }
                          currentUser={currentUser}
                          practiceDms={practiceDms}
                          navigation={navigation}
                          subgroups={subgroups}
                          // channel
                          styling={[
                            {
                              width:
                                style1 === 'open' ? appwidth - 50 : appwidth,
                            },
                            subgroups.find(
                              (item) => item.practiceId === currentPracticeId,
                            ) &&
                              index ===
                                subgroups.find(
                                  (item) =>
                                    item.practiceId === currentPracticeId,
                                ).groups.length -
                                  1 && {
                                paddingBottom: 60,
                              },
                          ]}
                        />
                      )}
                      keyExtractor={(item, index) => item.display_url}
                      // showsHorizontalScrollIndicator={false}
                      // extraData={selected}
                    />
                  </View>
                ) : (
                  <View style={{ padding: 80, alignItems: 'center' }}>
                    {practiceDms === null || isFetching ? (
                      <ActivityIndicator
                        animating={isFetching}
                        size={normalize(25)}
                        color={colors.text}
                      />
                    ) : (
                      <>
                        <Icon
                          name="deleteusergroup"
                          type="antdesign"
                          color={colors.text_2}
                          size={normalize(35)}
                          style={{ color: colors.text_1, alignSelf: 'center' }}
                        />
                        <Text
                          style={{
                            color: colors.text_2,
                            alignSelf: 'center',
                            fontSize: normalize(14),
                            fontFamily: 'SofiaProRegular',
                            textAlign: 'center',
                          }}>
                          No group added
                        </Text>
                      </>
                    )}
                  </View>
                )}
              </View>
            )}
          </>
        ) : (
          <View style={{ padding: 80, alignItems: 'center' }}>
            {practiceDms === null || isFetching ? (
              <ActivityIndicator
                animating={isFetching}
                size={normalize(35)}
                color={colors.text}
              />
            ) : (
              <>
                <Icon
                  name="ios-chatbubbles-outline"
                  type="ionicon"
                  color={colors.text_2}
                  size={normalize(50)}
                  style={{ color: colors.text_1, alignSelf: 'center' }}
                />
                <Text
                  style={{
                    color: colors.text_2,
                    alignSelf: 'center',
                    fontSize: normalize(15),
                    fontFamily: 'SofiaProRegular',
                    textAlign: 'center',
                  }}>
                  Join a Practice to have access to chat message
                </Text>
              </>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  joinedPractices: selectJoinedPractices,
  isFetching: selectIsFetching,
  currentPracticeId: selectCurrentPracticeId,
  practiceDms: selectPracticeDms,
  subgroups: selectPracticeSubgroups,
  allMessages: selectAllMessages,
  signals: selectSignals,
});

const mapDispatchToProps = (dispatch) => ({
  // getPracticesAllStart: () => dispatch(getPracticesAllStart()),
  getJoinedPracticesStart: () => dispatch(getJoinedPracticesStart()),
  setFilter: (data) => dispatch(setFilter(data)),
  getPracticesDmsStart: () => dispatch(getPracticesDmsStart()),
  chatWithPracticeStart: (data) => dispatch(chatWithPracticeStart(data)),
  getPracticeSubgroupsStart: (id) => dispatch(getPracticeSubgroupsStart(id)),
  setAllMessages: (msg) => dispatch(setAllMessages(msg)),
  getPracticeStaffStart: (id) => dispatch(getPracticeStaffStart(id)),
  leavePracticeStart: (id) => dispatch(leavePracticeStart(id)),
  setSignals: (data) => dispatch(setSignals(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessages);
