import React, { useEffect, useRef, useState } from 'react';
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
  getJoinedPracticesStart,
  setFilter,
} from '../../../redux/practices/practices.actions';
import { RefreshControl } from 'react-native';
import { selectJoinedPractices } from '../../../redux/practices/practices.selector';
import PracticesBox from './PracticeBox';
import { usePubNub } from 'pubnub-react';
import PracticeList from './PracticeList';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const appointmentData = [
  {
    type: 'voice',
  },
  {
    type: 'video',
  },
  {
    type: 'voice',
  },
  {
    type: 'voice',
  },
  {
    type: 'voice',
  },
];

const Chats = ({
  navigation,
  route,
  currentUser,
  getJoinedPracticesStart,
  joinedPractices,
  setFilter,
}) => {
  const { colors } = useTheme();
  const ref = useRef();
  // const props = useRoute();
  const pubnub = usePubNub();
  const [style1, setStyle1] = useState();
  const [practicesRefreshing, setPracticesRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const [showStaffs, setShowStaffs] = useState(false);

  const getMessages = (cha, num) => {
    const channels = [cha];
    console.log(channels);
    console.log(num);

    pubnub.fetchMessages(
      {
        channels: [channels[0]],
        count: num,
        // end: time,
      },

      (status, data) => {
        if (status.statusCode === 200) {
          console.log(status);
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

  // useEffect(() => {
  //   console.log(joinedPractices);
  //   // isFetching ? setRefreshing(true) : setRefreshing(false);
  //   // pubnub.getMessage('', (msg) => {
  //   //   console.log(msg);
  //   // });
  //   getMessages('c7fb1fce-aac7-492e-b07b-f1007c6edf96', 10);
  //   // pubnub
  //   //   .fetchMessages({
  //   //     channels: ['bced67cb-c735-4382-abe2-9c0f0c4e637f'],
  //   //     // count: 20,
  //   //     // end: time,
  //   //   })
  //   //   .then((status, data) => console.log(data));
  // }, [pubnub]);
  useEffect(() => {
    // console.log(currentUser);
    isFocused && getJoinedPracticesStart();
    const unsubscribe = navigation.addListener('drawerOpen', (e) => {
      // Do something
      setStyle1('open');
    });

    return unsubscribe;
  }, [navigation, isFocused, getJoinedPracticesStart]);
  useEffect(() => {
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
          showStaffs={showStaffs}
          setShowStaffs={setShowStaffs}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            height: windowHeight - 60,
            width: style1 === 'open' ? appwidth - 50 : appwidth,
            alignSelf: 'center',
            marginTop: 10,
            // backgroundColor: 'yellow',
          }}>
          <View
            style={{
              marginVertical: 20,
              flexDirection: 'row',
              // borderBottomWidth: 0.8,
              // borderBottomColor: colors.background_1,
            }}>
            <FastImage
              source={{
                uri:
                  currentUser && currentUser.avatar
                    ? currentUser.avatar
                    : 'https://www.ischool.berkeley.edu/sites/default/files/default_images/avatar.jpeg',
              }}
              style={{
                width: 63,
                height: 65,
                borderRadius: 15,
                backgroundColor: colors.background_1,
                marginVertical: 5,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View
              style={{
                marginLeft: 10,
                flexDirection: 'column',
                marginVertical: 2,
                paddingHorizontal: 4,
                // alignItems: 'center',
                justifyContent: 'space-evenly',
              }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: normalize(18),
                  fontFamily: 'SofiaProSemiBold',
                }}>
                {currentUser &&
                  currentUser.firstname + ' ' + currentUser.lastname}
              </Text>
              <Text
                style={{
                  color: colors.text_1,
                  fontSize: normalize(14),
                  fontFamily: 'SofiaProRegular',
                }}>
                Hello i love you
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  joinedPractices: selectJoinedPractices,
});

const mapDispatchToProps = (dispatch) => ({
  // getPracticesAllStart: () => dispatch(getPracticesAllStart()),
  getJoinedPracticesStart: () => dispatch(getJoinedPracticesStart()),
  setFilter: (data) => dispatch(setFilter(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Chats);
