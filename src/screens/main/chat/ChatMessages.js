import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  setFilter,
} from '../../../redux/practices/practices.actions';
import { RefreshControl } from 'react-native';
import {
  selectCurrentPracticeId,
  selectIsFetching,
  selectJoinedPractices,
  selectPracticeDms,
} from '../../../redux/practices/practices.selector';
import PracticesBox from './PracticeBox';
import { usePubNub } from 'pubnub-react';
import PracticeList from './PracticeList';
import DmsBox from './DmsBox';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const ChatMessages = ({
  navigation,
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

  const getMessages = (cha, num) => {
    console.log('Chass', cha);
    const channels = [cha];
    console.log(channels);
    console.log(num);

    pubnub.fetchMessages(
      {
        channels: [channels[0]],
        count: 10,
        end: time,
      },

      (status, data) => {
        if (status.statusCode === 200) {
          // console.log(status);
          console.log('Datas', data);
        }
      },
    );
  };
  // const pubnub = usePubNub();
  const [channels] = useState(['c7fb1fce-aac7-492e-b07b-f1007c6edf96']);
  const [messages, addMessage] = useState([]);
  const [message, setMessage] = useState('');
  const handleMessage = (event) => {
    const message = event.message;
    if (typeof message === 'string' || message.hasOwnProperty('text')) {
      const text = message.text || message;
      addMessage((messages) => [...messages, text]);
    }
  };
  // useEffect(() => {
  //   pubnub.addListener({ message: handleMessage });
  //   pubnub.subscribe({ channels });
  // }, [pubnub, channels]);

  useEffect(() => {
    console.log(joinedPractices);
    // isFetching ? setRefreshing(true) : setRefreshing(false);
    // pubnub.getMessage('', (msg) => {
    //   console.log(msg);
    // });
    getMessages(
      practiceDms &&
        practiceDms.length &&
        practiceDms.find((item) => item.practiceId === currentPracticeId)
          .channelName,
      10,
    );
    // pubnub
    //   .fetchMessages({
    //     channels: ['bced67cb-c735-4382-abe2-9c0f0c4e637f'],
    //     // count: 20,
    //     // end: time,
    //   })
    //   .then((status, data) => console.log(data));
  }, [pubnub]);
  const pract = async () => {
    await getJoinedPracticesStart();
    // if (!isFetching) {
    await getPracticesDmsStart(currentPracticeId);
    // }
  };
  useEffect(() => {
    // console.log(currentUser);

    if (isFocused) {
      pract();
      // getMessages();
    }
    const unsubscribe = navigation.addListener('drawerOpen', (e) => {
      // Do something
      setStyle1('open');
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, isFocused]);
  useEffect(() => {
    // console.log(
    //   practiceDms.find((item) => item.practiceId === currentPracticeId).Practice
    //     .channelName,
    // );
    const unsubscribe = navigation.addListener('drawerClose', (e) => {
      // Do something
      setStyle1('close');
    });

    return unsubscribe;
  }, [navigation]);

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

        {practiceDms && practiceDms.length ? (
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
              practiceDms={practiceDms}
              navigation={navigation}
              // channel
              styling={{
                width: style1 === 'open' ? appwidth - 50 : appwidth,
              }}
            />
          </>
        ) : (
          <View style={{ padding: 80, alignItems: 'center' }}>
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
});

const mapDispatchToProps = (dispatch) => ({
  // getPracticesAllStart: () => dispatch(getPracticesAllStart()),
  getJoinedPracticesStart: () => dispatch(getJoinedPracticesStart()),
  setFilter: (data) => dispatch(setFilter(data)),
  getPracticesDmsStart: () => dispatch(getPracticesDmsStart()),
  chatWithPracticeStart: (data) => dispatch(chatWithPracticeStart(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessages);
