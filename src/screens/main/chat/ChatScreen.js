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
import { launchImageLibrary } from 'react-native-image-picker';
import MediaPicker from './MediaPicker';
import { GiftedChat } from 'react-native-gifted-chat';

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
  const { practice, practiceDms, channelName, subgroups, group, type } = params;
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [style1, setStyle1] = useState();
  const [refreshing, setRefreshing] = useState(false);
  // const [channels] = useState();
  const [imageUri, setImageUri] = useState();
  const [messages, addMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showMediaPick, setShowMediaPick] = useState(false);
  const [mediaFile, setMediaFile] = useState();
  const [groupSuggest, setGroupSuggest] = useState(false);
  const d = new Date();
  const time = d.getTime();
  const pubnub = usePubNub();

  // console.log('GROUP____', group);
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
    chatRef.scrollToEnd({ animated: false });
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
          // setMessage('');
          // handle status, response
          // console.log(status);
          // console.log(response);
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
          },
          file: fileData,
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
          start: channelMsgs.fst,
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
              addMessages(channelMsgs);
              setRefreshing(false);
              setLoader(false);
              console.log('Length__ ', channelMsgs.messages.length - 1);
              if (channelMsgs.messages.length > 25) {
                chatRef.scrollToOffset({
                  animated: false,
                  offset: 300,
                });
              }
              // if (channelMsgs.messages.length) {
              //   cRef.scrollToIndex({
              //     animate: true,
              //     index: channelMsgs.messages.length - 1,
              //   });
              // }
              // cRef.scrollToEnd({ animated: true });
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
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
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
    console.log(messages);
    //
  }, [allMessages, isFocused, messages]);

  // useMemo(() => {}, [isFocused, chatRef, messages]);

  useMemo(() => {
    // console.log('Group_SUGGEST', groupSuggest);

    if (isFocused) {
      // console.log('Chat Ref___', chatRef);
      if (
        allMessages.find((item) => item.channel === channelName).messages
          .length <= 1
      ) {
        setLoader(true);
        getOldMessages(channelName);
      } else {
        setLoader(false);
      }
      allMessages.find((item) => item.channel === channelName)
        ? setGroupSuggest(false)
        : setGroupSuggest(true);
    }
  }, [isFocused]);

  useEffect(() => {
    // console.log(inputRef);
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
                onPress={() => {
                  // console.log(item);
                  navigation.navigate('ChatScreen', {
                    practice: null,
                    channelName: item && item.channelName && item.channelName,
                    practiceDms,
                    subgroups: [],
                    group: item,
                    type: 'group',
                  });
                }}
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
      {/* <ScrollView
        contentContainerStyle={
          {
            // flexDirection: 'row',
            // alignSelf: 'flex-end',
            // flexGrow: 1,
          }
        }
        > */}

      {!loader ? (
        <FlatList
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
        />
      ) : (
        <ActivityIndicator
          animating={true}
          size={normalize(30)}
          color={colors.text}
          style={{ position: 'absolute', top: '50%', left: '50%' }}
        />
      )}

      {/* </ScrollView> */}
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
            // backgroundColor: colors.background,
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
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              setValues,
            }) => (
              <View style={{ margin: 0 }}>
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
                {showEmoji && (
                  <View style={{ height: 300 }}>
                    <EmojiSelector
                      showTabs={true}
                      theme={colors.background}
                      showHistory={true}
                      showSectionTitles={true}
                      showSearchBar={false}
                      // categoriesEnabled={[flags, sports, food]}
                      columns={10}
                      // category={Categories.symbols}
                      onEmojiSelected={(emoji) => {
                        Keyboard.dismiss();
                        setValues({ message: (values.message += emoji) });
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
                )}
              </View>
            )}
          </Formik>
        </Animatable.View>
      </KeyboardAvoidingView>
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
