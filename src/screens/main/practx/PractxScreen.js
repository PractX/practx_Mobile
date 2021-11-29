import {
  DrawerActions,
  useIsFocused,
  useTheme,
} from '@react-navigation/native';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableOpacityBase,
  View,
  Dimensions,
} from 'react-native';
import PracticeSmallBox from '../../../components/hoc/PracticeSmallBox';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Header from '../../../components/hoc/Header';
import {
  getJoinedPracticesStart,
  getPracticesAllStart,
  getPracticesDmsStart,
  setFilter,
  chatWithPracticeStart,
  getPracticeSubgroupsStart,
  getAllPatientNotificationStart,
} from '../../../redux/practices/practices.actions';
import {
  selectAllPractices,
  selectFilter,
  selectIsFetching,
  selectPracticeDms,
  selectJoinedPractices,
  selectPatientNotifications,
} from '../../../redux/practices/practices.selector';
import { selectCurrentUser } from '../../../redux/user/user.selector';
import { MenuProvider } from 'react-native-popup-menu';
import { ActivityIndicator } from 'react-native-paper';
import { normalize } from 'react-native-elements';
import Error from '../../../components/hoc/Error';
import BottomSheet from 'reanimated-bottom-sheet';
import PracticeDetails from '../../../components/hoc/PracticeDetails';
import MainHeader from '../../../components/hoc/MainHeader';
import { ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
// import notifee from '@notifee/react-native';
// import { getAllPracticesStart } from '../../redux/practices/practices.actions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const Practx = ({
  navigation,
  extraData,
  getPracticesAllStart,
  getJoinedPracticesStart,
  getPracticesDmsStart,
  isFetching,
  practices,
  currentUser,
  setFilter,
  filter,
  joinedPractices,
  practiceDms,
  chatWithPracticeStart,
  getAllPatientNotificationStart,
  allNotifications,
}) => {
  const bottomSheetRef = useRef(null);
  const { colors } = useTheme();
  const [style1, setStyle1] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [checkState, setCheckState] = useState(filter);
  const ref = useRef(null);
  const isFocused = useIsFocused();
  const isDrawerOpen = useIsDrawerOpen();
  const [practiceData, setPracticeData] = useState({
    show: false,
    data: null,
  });

  const renderContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: 450,
      }}>
      <Text>Swipe down to close</Text>
    </View>
  );

  const openMenu = () => {
    console.log('opening');
  };

  useEffect(() => {
    // practiceData.show && bottomSheetRef.current.snapTo(0);
    // console.log("Practice DM____", practiceDms)
    // const dug = [{id: 2, name:'ab'},{id: 8, name:'abf'}, {id: 5, name: 'bc'}, {id: 2, name:'abb'}, {id: 3, name: 'bc'}]
    //  const dug2 = [{id: 8, name:'abf'},{id: 9, name:'ab'},{id: 2, name:'ab'}, {id: 5, name: 'bc'}, {id: 2, name:'abb'}, {id: 3, name: 'bc'}]
    // console.log("TestingValue ->>", dug2.find(i => !dug.some(k => i.id === k.id)));
  });

  useMemo(() => {
    if (practiceDms && practiceDms.length > 0) {
      let pract = joinedPractices.find(
        i => !practiceDms.some(k => i.id === k.id),
      );
      if (pract) {
        console.log('Startig new Chat', pract);
        chatWithPracticeStart(pract.id);
        getPracticesDmsStart();
      }
    } else {
      if (joinedPractices && joinedPractices.length > 0) {
        console.log('First new Chat');
        chatWithPracticeStart(joinedPractices.map(i => i.id)[0]);
        getPracticesDmsStart();
      }
    }
  }, [joinedPractices]);

  useEffect(() => {
    isFetching ? setRefreshing(true) : setRefreshing(false);
  }, [isFetching]);

  useEffect(() => {
    if (isFocused) {
      getAllPatientNotificationStart();
      setPracticeData({
        show: false,
        data: null,
      });
      setFilter({
        opt1: true,
        opt2: true,
        opt3: true,
      });
      getPracticesAllStart();
      getJoinedPracticesStart();
      getPracticesDmsStart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  useEffect(() => {
    if (isDrawerOpen) {
      setStyle1('open');
      console.log('Open');
    } else {
      setStyle1('close');
      console.log('Close');
    }
  }, [getPracticesAllStart, isDrawerOpen]);

  function sortRandomly(a, b) {
    return 0.5 - Math.random();
  }

  // async function onDisplayNotification() {
  //   // Create a channel
  //   const channelId = await notifee.createChannel({
  //     id: 'default',
  //     name: 'Default Channel',
  //   });

  //   // Display a notification
  //   await notifee.displayNotification({
  //     title: 'Notification Title',
  //     body: 'Main body content of the notification',
  //     android: {
  //       channelId,
  //       smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
  //     },
  //   });
  // }

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
            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            // Android
            elevation: 9,
            borderRadius: 30,
            overflow: 'hidden',
            borderColor:
              colors.mode === 'dark' ? colors.background_1 + '93' : null,
            borderBottomWidth: colors.mode === 'dark' ? 3 : 0,
            borderTopWidth: colors.mode === 'dark' ? 3 : 0,
            borderLeftWidth: colors.mode === 'dark' ? 1 : 0,
            // alignSelf: 'center',
          },
        ]}>
        <MainHeader
          navigation={extraData}
          title="Practices"
          iconRight1={{
            name: 'equalizer',
            type: 'simple-line-icon',
            onPress: openMenu,
            buttonType: 'filter',
          }}
          notifyIcon={true}
          allNotifications={
            allNotifications?.rows?.filter(it => !it.patientSeen)?.length
          }
          checkState={checkState}
          setCheckState={setCheckState}
          setFilter={setFilter}
          width={style1 === 'open' ? appwidth - 50 : appwidth}
        />
        {practices ? (
          <ScrollView
            style={{
              height: windowHeight,
              width: style1 === 'open' ? appwidth - 50 : windowWidth,
              alignSelf: 'center',
              // justifyContent: 'center',
              marginTop: 60,
            }}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 30,
                  width: style1 === 'open' ? appwidth - 50 : appwidth,
                  alignSelf: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: normalize(13),
                    fontFamily: 'SofiaProSemiBold',
                    color: colors.text,
                  }}>
                  Joined practices
                </Text>
                <Icon
                  name="arrow-forward"
                  type="material-icons"
                  color={colors.text}
                  size={normalize(15)}
                  style={{
                    color: colors.text,
                    // alignSelf: 'center',
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 95,
                    height: 95,
                    // marginTop: 15,
                    marginBottom: 45,
                    marginLeft: 10,
                    marginRight: 5,
                    flexDirection: 'column',
                    // alignSelf: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      requestAnimationFrame(() => {
                        // setFilter({
                        //   opt1: true,
                        //   opt2: false,
                        //   opt3: false,
                        // });
                        // navigation.navigate('PractxSearch');
                        // onDisplayNotification();
                      });
                    }}
                    style={{
                      backgroundColor: colors.background_1,
                      height: 85,
                      width: 85,
                      borderRadius: 15,
                      justifyContent: 'center',
                      marginTop: 10,
                      marginBottom: 8,
                    }}>
                    <Icon
                      name="plus"
                      type="feather"
                      color={colors.text}
                      size={normalize(25)}
                      style={
                        {
                          // alignSelf: 'center',
                        }
                      }
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: normalize(11.5),
                      fontFamily: 'SofiaProSemiBold',
                    }}>
                    Join
                  </Text>
                </View>
                <FlatList
                  ref={ref}
                  horizontal={true}
                  refreshControl={
                    <RefreshControl
                      refreshing={
                        practices && practices.length > 0 ? false : refreshing
                      }
                      onRefresh={() => {
                        getPracticesAllStart();
                        getJoinedPracticesStart();
                      }}
                    />
                  }
                  // removeClippedSubviews
                  // ListEmptyComponent
                  initialNumToRender={5}
                  updateCellsBatchingPeriod={5}
                  // pagingEnabled={true}
                  showsHorizontalScrollIndicator={false}
                  style={{
                    paddingLeft: style1 === 'open' ? 0 : 0,
                    paddingRight: 90,
                    marginBottom: 10,
                  }}
                  contentContainerStyle={{
                    paddingRight: 20,
                  }}
                  data={practices}
                  numColumns={1}
                  renderItem={({ item, index }) => {
                    const pending = item.requests;
                    const member = currentUser
                      ? item.patients.filter(val => val.id === currentUser.id)
                      : [];
                    if (member.length) {
                      return (
                        <PracticeSmallBox
                          userId={currentUser ? currentUser.id : 0}
                          id={index}
                          practice={item}
                          navigation={navigation}
                          practiceData={practiceData}
                          setPracticeData={setPracticeData}
                          bottomSheetRef={bottomSheetRef}
                        />
                      );
                    }
                  }}
                  keyExtractor={(item, index) => item.display_url}
                />
              </View>
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  width: style1 === 'open' ? appwidth - 50 : appwidth,
                  alignSelf: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: normalize(12),
                    fontFamily: 'SofiaProSemiBold',
                    color: colors.text,
                  }}>
                  Suggested for you
                </Text>
                <Icon
                  name="arrow-forward"
                  type="material-icons"
                  color={colors.text}
                  size={normalize(15)}
                  style={{
                    color: colors.text,
                    // alignSelf: 'center',
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FlatList
                  ref={ref}
                  horizontal={true}
                  refreshControl={
                    <RefreshControl
                      refreshing={
                        practices && practices.length > 0 ? false : refreshing
                      }
                      onRefresh={() => {
                        getPracticesAllStart();
                        getJoinedPracticesStart();
                      }}
                    />
                  }
                  // removeClippedSubviews
                  // ListEmptyComponent
                  initialNumToRender={5}
                  updateCellsBatchingPeriod={5}
                  // pagingEnabled={true}
                  showsHorizontalScrollIndicator={false}
                  style={{
                    paddingLeft: style1 === 'open' ? 0 : 15,
                    paddingRight: 90,
                    marginBottom: 10,
                  }}
                  contentContainerStyle={{
                    paddingRight: 20,
                  }}
                  data={practices}
                  numColumns={1}
                  renderItem={({ item, index }) => (
                    <PracticeSmallBox
                      userId={currentUser ? currentUser.id : 0}
                      id={index}
                      practice={item}
                      navigation={navigation}
                      practiceData={practiceData}
                      sortType={'all'}
                      setPracticeData={setPracticeData}
                      bottomSheetRef={bottomSheetRef}
                    />
                  )}
                  keyExtractor={(item, index) => item.display_url}
                />
              </View>
            </View>
          </ScrollView>
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}>
            {isFetching ? (
              <ActivityIndicator
                animating={isFetching}
                size={normalize(30)}
                color={colors.text}
              />
            ) : (
              <Error
                title={'OOPS!!!'}
                type="internet"
                subtitle={
                  'Unable to get Practices, Please check your internet connectivity'
                }
                action={getPracticesAllStart}
              />
            )}
          </View>
        )}
      </View>
      {practiceData.show && (
        <View
          style={{
            flex: 1,
            position: 'absolute',
            backgroundColor: '#000000b9',
            height: '100%',
            width: '100%',
          }}
        />
      )}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={[660, 0]}
        borderRadius={40}
        renderContent={() => (
          <>
            <View
              style={{
                flex: 1,
                position: 'absolute',
                backgroundColor: '#000000b9',
                height: '100%',
                width: '100%',
              }}
            />
            <PracticeDetails
              bottomSheetRef={bottomSheetRef}
              navigation={navigation}
              practiceData={practiceData}
            />
          </>
        )}
        initialSnap={1}
        onOpenStart={() => setPracticeData({ ...practiceData, show: true })}
        onOpenEnd={() => setPracticeData({ ...practiceData, show: true })}
        onCloseStart={() => setPracticeData({ ...practiceData, show: false })}
        onCloseEnd={() => setPracticeData({ show: false })}
      />
    </SafeAreaView>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  isFetching: selectIsFetching,
  joinedPractices: selectJoinedPractices,
  practices: selectAllPractices,
  practiceDms: selectPracticeDms,
  allNotifications: selectPatientNotifications,
  filter: selectFilter,
});

const mapDispatchToProps = dispatch => ({
  getPracticesAllStart: () => dispatch(getPracticesAllStart()),
  getJoinedPracticesStart: () => dispatch(getJoinedPracticesStart()),
  getPracticesDmsStart: () => dispatch(getPracticesDmsStart()),
  getPracticeSubgroupsStart: id => dispatch(getPracticeSubgroupsStart()),
  setFilter: data => dispatch(setFilter(data)),
  chatWithPracticeStart: data => dispatch(chatWithPracticeStart(data)),
  getAllPatientNotificationStart: data =>
    dispatch(getAllPatientNotificationStart(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Practx);
