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
    console.log(practiceDms);
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

        {practiceDms ? (
          <FlatList
            ref={ref}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={refreshing}
            //     onRefresh={() => getPracticesAllStart()}
            //   />
            // }
            // removeClippedSubviews
            // ListEmptyComponent
            initialNumToRender={5}
            updateCellsBatchingPeriod={5}
            showsVerticalScrollIndicator={true}
            style={{
              height: windowHeight - 60,
              width: style1 === 'open' ? appwidth - 50 : appwidth,
              alignSelf: 'center',
              marginTop: 10,
              // backgroundColor: 'yellow',
            }}
            data={practiceDms}
            numColumns={1}
            renderItem={({ item, index }) => (
              <DmsBox
                id={index}
                item={item}
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
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>No data</Text>
            {/* {errorData ? (
                <Error
                  title={errorData.includes('internet') ? 'OOPS!!!' : 'SORRY'}
                  subtitle={
                    errorData.includes('internet')
                      ? 'Poor internet connection, Please check your connectivity, And try again'
                      : errorData.includes('fetch')
                      ? 'Enable to fetch post, please try again later'
                      : 'Download link is not supported OR Account is private'
                  }
                />
              ) : (
                <Spinner
                  style={styles.spinner}
                  size={80}
                  type="Circle"
                  color={colors.primary}
                />
              )} */}
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
  getPracticesDmsStart: (data) => dispatch(getPracticesDmsStart(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessages);
