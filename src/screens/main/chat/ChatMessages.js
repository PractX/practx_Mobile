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
import normalize from '../../../utils/normalize';
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

  const getAllChannelMessages = (dms, subGroups) => {
    // const dmsCha = dms.map((i) => i.channelName); /// When backend guy delete
    const dmsCha = dms.map((i) => i.channelName);
    console.log(dmsCha);
    const subgroupsCha = subGroups.map((i) => i.channelName);
    const allChannels = [...dmsCha, ...subgroupsCha];

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

    console.log('___ALLCHANNELS___', allChannels);

    pubnub.subscribe({ channels: allChannels });
  };

  useMemo(() => {
    if (isFocused && practiceDms && practiceDms.length) {
      getAllChannelMessages(practiceDms, subgroups);
    }
  }, [isFocused]);

  const getMessages = (cha) => {
    console.log('=== GET MESSAGES FROM CHANNEL =====: ', cha);
    const channelMsgs = allMessages.find((i) => i.channel === cha);
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

            console.log('=== msgs =====: ', msgs);
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

    // pubnub.subscribe({ channels });

    // return () => {
    //   pubnub.unsubscribeAll();
    // };
  };

  // useEffect(() => {
  //   if (isFocused && currentPracticeId) {

  //   }
  // }, [isFocused, currentPracticeId]);

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
        channel: '23_13_jZ_GFSXex',
        start: Date.now(),
        end: '16134350735442841',
      },
      (result) => {
        console.log(result);
      },
    );
  };

  useEffect(() => {
    if (isFocused && pubnub) {
      pubnub.setUUID(currentUser.chatId);

      pubnub.addListener({
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
      });

      // Fetch messaged from pubnub history..............

      // if (messages < 1) {
      //   getMessages(channels);
      // }

      // console.log(channels);

      // pubnub.subscribe({ channels: channels, withPresence: true });

      // return () => {
      //   pubnub.unsubscribeAll();
      // };

      // setChannel(channels);
    }
  }, [pubnub]);

  useEffect(() => {
    console.log(joinedPractices);
    // isFetching ? setRefreshing(true) : setRefreshing(false);
    // pubnub.getMessage('', (msg) => {
    //   console.log(msg);
    // });
    // getMessages(
    //   practiceDms &&
    //     practiceDms.length &&
    //     practiceDms.find((item) => item.practiceId === currentPracticeId)
    //       .channelName,
    //   10,
    // );
  }, [pubnub]);
  const pract = async () => {
    console.log('fetching');
    await getJoinedPracticesStart();
    // if (!isFetching) {
    await getPracticesDmsStart(currentPracticeId);

    // }
  };

  useEffect(() => {
    // console.log(currentUser);
    // practiceDms.length && getAllChannelMessages(practiceDms, subgroups);
    if (currentUser) {
      if (isFocused || currentPracticeId) {
        pract();

        // getMessages();
        // removeChannel();
        if (currentPracticeId > 0) {
          getPracticeSubgroupsStart(currentPracticeId);
        }
      }
    }
    const unsubscribe = extraData.addListener('drawerOpen', (e) => {
      // Do something
      setStyle1('open');
      console.log('Open');
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraData, isFocused, currentPracticeId, currentUser]);
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
          practiceDms={
            practiceDms &&
            practiceDms.find((item) => item.practiceId === currentPracticeId)
          }
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
                  fontSize: normalize(14),
                  fontFamily: 'SofiaProSemiBold',
                }}>
                Direct message
              </Text>
            </View>
            <DmsBox
              id={currentPracticeId}
              item={
                practiceDms &&
                practiceDms.find(
                  (item) => item.practiceId === currentPracticeId,
                )
              }
              allMessages={
                practiceDms && allMessages
                  ? allMessages.find(
                      (it) =>
                        it.channel ===
                        practiceDms.find(
                          (item) => item.practiceId === currentPracticeId,
                        ).channelName,
                    )
                    ? allMessages.find(
                        (it) =>
                          it.channel ===
                          practiceDms.find(
                            (item) => item.practiceId === currentPracticeId,
                          ).channelName,
                      )
                    : null
                  : null
              }
              practiceDms={practiceDms}
              subgroups={subgroups}
              navigation={navigation}
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
                      fontSize: normalize(14),
                      fontFamily: 'SofiaProSemiBold',
                    }}>
                    Groups
                  </Text>
                </View>
                {subgroups.length > 0 ? (
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
                    style={{ height: windowHeight - 350 }}
                    data={subgroups}
                    numColumns={1}
                    renderItem={({ item, index }) => (
                      <GroupBox
                        id={currentPracticeId}
                        item={item}
                        allMessages={
                          practiceDms && allMessages && subgroups
                            ? allMessages.find(
                                (it) => it.channel === item.channelName,
                              )
                              ? allMessages.find(
                                  (it) => it.channel === item.channelName,
                                )
                              : null
                            : null
                        }
                        practiceDms={practiceDms}
                        navigation={navigation}
                        // channel
                        styling={{
                          width: style1 === 'open' ? appwidth - 50 : appwidth,
                        }}
                      />
                    )}
                    keyExtractor={(item, index) => item.display_url}
                    // showsHorizontalScrollIndicator={false}
                    // extraData={selected}
                  />
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
                          name="deleteusergroup"
                          type="antdesign"
                          color={colors.text_2}
                          size={normalize(50)}
                          style={{ color: colors.text_1, alignSelf: 'center' }}
                        />
                        <Text
                          style={{
                            color: colors.text_2,
                            alignSelf: 'center',
                            fontSize: normalize(16),
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
                  name="chat-alert-outline"
                  type="material-community"
                  color={colors.text_2}
                  size={normalize(50)}
                  style={{ color: colors.text_1, alignSelf: 'center' }}
                />
                <Text
                  style={{
                    color: colors.text_2,
                    alignSelf: 'center',
                    fontSize: normalize(16),
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
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessages);
