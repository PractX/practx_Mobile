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
} from '../../../redux/practices/practices.actions';
import { RefreshControl } from 'react-native';
import {
  selectAllMessages,
  selectCurrentPracticeId,
  selectIsFetching,
  selectJoinedPractices,
  selectPracticeDms,
  selectPracticeSubgroups,
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
  subgroups,
  allMessages,
  setAllMessages,
}) => {
  const { colors } = useTheme();
  const ref = useRef();
  // const props = useRoute();
  const pubnub = usePubNub();
  const [style1, setStyle1] = useState();
  const [practicesRefreshing, setPracticesRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const [showStaffs, setShowStaffs] = useState(false);
  const d = new Date();
  const time = d.getTime();

  const addTime = (timetoken) => {
    const unixTimestamp = timetoken / 10000000;
    const gmtDate = new Date(unixTimestamp * 1000);
    const localeDateTime = gmtDate.toLocaleString();
    // const time = localeDateTime.split(', ')[1];
    // return checkAmPm(time.slice(0, -3));
    return localeDateTime.split(', ')[0];
  };

  // const getMessages = (cha, num) => {
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
    const dmsCha = dms.map((i) => i.channelName);
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

    pubnub.subscribe({ channels: allChannels });
  }, []);

  // useMemo(() => {
  //   if (isFocused && practiceDms && practiceDms.length) {
  //     getAllChannelMessages(practiceDms, subgroups);
  //   }
  // }, [isFocused]);

  const getMessages = (cha) => {
    console.log('=== GET MESSAGES FROM CHANNEL =====: ', cha);
    console.log('ALL____', allMessages);

    const channelMsgs = allMessages.find((i) => i.channel === cha);
    const channels = [cha];
    console.log('Current Date____', time);
    if (channelMsgs) {
      console.log('Goods___');
      pubnub.fetchMessages(
        {
          channels: [channels[0]],
          start: channelMsgs.lst + 1,
          count: 1,
          end: time,
        },

        async (status, data) => {
          if (status.statusCode === 200) {
            console.log('=== FOUND MESSAGES FROM CHANNEL =====: ', cha);
            // addMessage([...channelMsgs.messages, ...data.channels[channels]])
            const msgs = data.channels[channels];
            console.log('=== FOUND NEW MESSAGES FROM CHANNEL =====: ', cha);

            console.log('=== msgs =====: ', msgs);
            if (msgs.length && msgs[0].timetoken !== channelMsgs.lst) {
              channelMsgs.lst = msgs[msgs.length - 1].timetoken;
              await msgs.map((item) =>
                Object.assign(item, {
                  _id: item.timetoken,
                  user: { _id: item.uuid },
                  day: addTime(item.timetoken),
                }),
              );
              channelMsgs.messages = [...channelMsgs.messages, ...msgs];
              // channelMsgs.messages = [...msgs]
              const newSavedMessages = allMessages.filter(
                (i) => i.channel !== channelMsgs.channel,
              );

              console.log('=== channelMsgs =====: ', channelMsgs);
              console.log('=== newSavedMessages =====: ', newSavedMessages);
              console.log('=== All messages =====: ', allMessages);
              setAllMessages([...newSavedMessages, channelMsgs]);
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

    // pubnub.subscribe({ channels });

    // return () => {
    //   pubnub.unsubscribeAll();
    // };
  };

  // const pract = useCallback(async () => {
  //   console.log('fetching');

  //   if (currentPracticeId > 0) {
  //     getPracticeSubgroupsStart(currentPracticeId);
  //   }

  //   // }
  // }, []);

  useMemo(() => {
    if (isFocused) {
      getJoinedPracticesStart();
      getPracticesDmsStart();
    }

    // if (!isFetching) {
  }, [isFocused]);

  useMemo(() => {
    if (currentPracticeId) {
      // pract();
      getPracticeSubgroupsStart(currentPracticeId);
      getPracticeStaffStart(currentPracticeId);
      // getMessages();
      // removeChannel();
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
      console.log('Getting all channels');
      console.log('All Subgroups', subgroups);
      if (practiceDms.length) {
        getAllChannelMessages(
          practiceDms,
          subgroups.map((item) => [...item.groups]),
        );
      }
    }
  }, [currentPracticeId, subgroups]);

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
        channel: '23_15_V3wNztfhu',
        start: Date.now(),
        end: '16148006508208300',
      },
      (result) => {
        console.log(result);
      },
    );
  };

  useEffect(() => {
    if (pubnub) {
      console.log('Add event  listener');
      pubnub.setUUID(currentUser ? currentUser.chatId : 0);

      const listener = {
        message: (messageEvent) => {
          // addMessages([
          //   ...messages,
          //   {
          //     channel: messageEvent.channel,
          //     message: messageEvent.message,
          //     timetoken: messageEvent.timetoken,
          //     uuid: messageEvent.publisher,
          //   },
          // ]);
          getMessages(messageEvent.channel);
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
          console.log('PICTURES____', picture);
          getMessages(picture.channel);
          // addMessages([
          //   ...messages,
          //   {
          //     channel: picture.channel,
          //     message: picture.message,
          //     timetoken: picture.timetoken,
          //     uuid: picture.publisher,
          //   },
          // ]);
        },

        signal: function (s) {
          // handle signal
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
      //   getMessages(channels);
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
  }, [subgroups, currentPracticeId]);

  // useEffect(() => {
  //   console.log(joinedPractices);
  //   // isFetching ? setRefreshing(true) : setRefreshing(false);
  //   // pubnub.getMessage('', (msg) => {
  //   //   console.log(msg);
  //   // });
  //   // getMessages(
  //   //   practiceDms &&
  //   //     practiceDms.length &&
  //   //     practiceDms.find((item) => item.practiceId === currentPracticeId)
  //   //       .channelName,
  //   //   10,
  //   // );
  // }, [pubnub]);

  useEffect(() => {
    // console.log(currentUser);
    // practiceDms.length && getAllChannelMessages(practiceDms, subgroups);

    const unsubscribe = extraData.addListener('drawerOpen', (e) => {
      // Do something
      setStyle1('open');
      console.log('Open');
    });

    return unsubscribe;
  }, [extraData, currentPracticeId, currentUser]);
  useMemo(() => {
    // console.log(
    //   practiceDms.find((item) => item.practiceId === currentPracticeId).Practice
    //     .channelName,
    // );
    const unsubscribe = extraData.addListener('drawerClose', (e) => {
      // Do something
      console.log('Close');
      setStyle1('close');
    });

    return unsubscribe;
  }, [extraData]);

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
            </View>
            <DmsBox
              id={currentPracticeId}
              item={
                practiceDms &&
                practiceDms.find((item) => item.id === currentPracticeId)
              }
              allMessages={
                practiceDms && allMessages
                  ? allMessages.find(
                      (it) =>
                        it.channel ===
                        practiceDms.find(
                          (item) => item.id === currentPracticeId,
                        ).Dm.channelName,
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
              }
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
                          item={item}
                          practices={
                            practiceDms &&
                            practiceDms.find(
                              (it) => it.practiceId === currentPracticeId,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessages);
