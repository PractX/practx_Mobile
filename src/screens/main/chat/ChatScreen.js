import React, { useEffect, useMemo, useRef, useState } from 'react';
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
}) => {
  const chatRef = useRef();
  const { colors } = useTheme();
  const inputRef = useRef();
  const { params } = useRoute();
  const isFocused = useIsFocused();
  const { practice, practiceDms, channelName } = params;
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [style1, setStyle1] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [channels] = useState([channelName]);
  const [imageUri, setImageUri] = useState();
  const [messages, addMessages] = useState([]);
  const [message, setMessage] = useState('');
  const d = new Date();
  const time = d.getTime();
  const pubnub = usePubNub();
  // console.log(practice);
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
  const getMessages = (cha, num) => {
    const myChannels = [cha];
    console.log(cha);
    console.log(num);

    pubnub.fetchMessages(
      {
        channels: [myChannels[0]],
        count: 10,
        end: time,
      },

      (status, data) => {
        if (status.statusCode === 200) {
          let { channels } = data;
          console.log(status);

          // const unixTimestamp = message.timetoken / 10000000;
          // const gmtDate = new Date(unixTimestamp * 1000);
          // const localeDateTime = gmtDate.toLocaleString();
          // const message =;
          // console.log('Hello', localeDateTime);
          // console.log('new Msfg', channels[myChannels]);
          addMessages(channels[myChannels]);

          // console.log(newMessage);
        }
      },
    );
    pubnub.subscribe({ channels });
  };
  const sendMessage = (message) => {
    // console.log(values);
    if (message) {
      pubnub.publish(
        {
          message: {
            id: Math.random().toString(16).substr(2),
            userId: practice.id,
            text: message,
            type: 'text',
            email: practice.email,
          },
          messageType: 'text',
          channel: channelName,
        },
        (status, response) => {
          setMessage('');
          // handle status, response
          // console.log(status);
          // console.log(response);
        },
      );
    }
  };

  // const handleMessage = (event) => {
  //   const onMessage = event.message;
  //   console.log(event);
  //   if (typeof onMessage === 'string' || onMessage.hasOwnProperty('text')) {
  //     const text = onMessage.text || onMessage;
  //     addMessages((messagesData) => [...messagesData, text]);
  //     console.log(text);
  //   } else {
  //     console.log('Hellow', onMessage);
  //   }
  // };

  // const sendMessage = (message) => {
  //   if (message) {
  //     pubnub
  //       .publish({ channel: channels[0], message })
  //       .then(() => setMessage(''));
  //   }
  // };
  // '3b127b30-ecab-4f27-a04a-9e72974bc6e0';

  // useEffect(() => {
  //   // console.log(channels);
  //   // console.log('Hello nonjour');
  //   if (pubnub) {
  //     console.log('We day');
  //     pubnub.setUUID(currentUser.chatId);
  //     const listener = {
  //       message: (envelope) => {
  //         console.log(envelope);
  //         addMessages((msgs) => [
  //           ...msgs,
  //           {
  //             channel: envelope.channel,
  //             message: envelope.message,
  //             timetoken: envelope.timetoken,
  //             uuid: envelope.publisher,
  //           },
  //         ]);
  //         // setSending(false);
  //       },
  //     };
  //     pubnub.addListener(listener);
  //     // pubnub.addListener({
  //     //   status: function (event) {
  //     //     console.log(event);
  //     //     var affectedChannelGroups = event.affectedChannelGroups;
  //     //     var affectedChannels = event.affectedChannels;
  //     //     var category = event.category;
  //     //     var operation = event.operation;
  //     //     var lastTimetoken = event.lastTimetoken;
  //     //     var currentTimetoken = event.currentTimetoken;
  //     //     var subscribedChannels = event.subscribedChannels;
  //     //   },
  //     // });
  //     console.log(channelName);
  //     pubnub.subscribe({ channels: [channelName] });
  //   }
  // }, [pubnub]);

  // useEffect(() => {
  //   getMessages(channelName, 10);
  // }, []);

  useEffect(() => {
    if (pubnub) {
      pubnub.setUUID(currentUser.chatId);

      pubnub.addListener({
        message: (messageEvent) => {
          addMessages((msgs) => [
            ...msgs,
            {
              channel: messageEvent.channel,
              message: messageEvent.message,
              timetoken: messageEvent.timetoken,
              uuid: messageEvent.publisher,
            },
          ]);
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
          addMessages([
            ...messages,
            {
              channel: picture.channel,
              message: picture.message,
              timetoken: picture.timetoken,
              uuid: picture.publisher,
            },
          ]);
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

      if (messages < 1) {
        getMessages(channels[0]);
      }

      console.log(channels);

      pubnub.subscribe({ channels: channels, withPresence: true });

      // setChannel(channels);
    }
  }, [pubnub]);

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
        // isLoading={isLoading}
      />
      <FlatList
        ref={chatRef}
        // horizontal={true}
        // refreshControl={
        //   <RefreshControl
        //   // horizontal={true}
        //   // refreshing={practicesRefreshing}
        //   // onRefresh={() => getPracticesAllStart()}
        //   />
        // }
        onRefresh={() => console.log('bonjours')}
        refreshing={false}
        // onContentSizeChange={() => chatRef.} // scroll it
        inverted={false}
        // removeClippedSubviews
        // ListEmptyComponent
        // contentContainerStyle={{ flexDirection: 'column-reverse' }}
        initialNumToRender={5}
        updateCellsBatchingPeriod={5}
        showsVerticalScrollIndicator={false}
        style={{
          // flex: 2,
          // minHeight: windowHeight - 140,
          backgroundColor: colors.background,
          marginTop: 55,
          // marginBottom: 60,
        }}
        data={messages}
        numColumns={1}
        renderItem={({ item, index }) => (
          <ChatBubble
            id={index}
            message={item}
            navigation={navigation}
            practice={practice}
            practiceDms={practiceDms}
          />
        )}
        keyExtractor={(item, index) => index}
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
            backgroundColor: colors.primary,
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
                    practice && practice.practiceName.length > 18
                      ? practice.practiceName.substring(0, 11 - 3) + '...'
                      : practice.practiceName
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
});

const mapDispatchToProps = (dispatch) => ({
  // getPracticesAllStart: () => dispatch(getPracticesAllStart()),
  editProfile: (data) => dispatch(editProfile(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
