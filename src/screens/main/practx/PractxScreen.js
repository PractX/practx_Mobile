import {
  DrawerActions,
  useIsFocused,
  useTheme,
} from '@react-navigation/native';
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
} from '../../../redux/practices/practices.actions';
import {
  selectAllPractices,
  selectFilter,
  selectIsFetching,
} from '../../../redux/practices/practices.selector';
import { selectCurrentUser } from '../../../redux/user/user.selector';
import { MenuProvider } from 'react-native-popup-menu';
import { ActivityIndicator } from 'react-native-paper';
import normalize from '../../../utils/normalize';
import Error from '../../../components/hoc/Error';
import BottomSheet from 'reanimated-bottom-sheet';
import PracticeDetails from '../../../components/hoc/PracticeDetails';
import MainHeader from '../../../components/hoc/MainHeader';
import { ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
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
}) => {
  const bottomSheetRef = useRef(null);
  const { colors } = useTheme();
  const [style1, setStyle1] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [checkState, setCheckState] = useState(filter);
  const ref = useRef(null);
  const isFocused = useIsFocused();
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
    practiceData.show && bottomSheetRef.current.snapTo(0);
  });

  useEffect(() => {
    isFetching ? setRefreshing(true) : setRefreshing(false);
  }, [isFetching]);

  useEffect(() => {
    if (isFocused) {
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
  }, []);

  React.useEffect(() => {
    const unsubscribe = extraData.addListener('drawerOpen', (e) => {
      // Do something
      setStyle1('open');
    });

    return unsubscribe;
  }, [extraData]);
  React.useEffect(() => {
    // console.log(practices);

    const unsubscribe = extraData.addListener('drawerClose', (e) => {
      // Do something
      setStyle1('close');
      // console.log('Close');
    });

    return unsubscribe;
  }, [getPracticesAllStart, extraData]);

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
            borderColor:
              colors.mode === 'dark' ? colors.background_1 + '93' : null,
            borderBottomWidth: colors.mode === 'dark' ? 3 : 0,
            borderTopWidth: colors.mode === 'dark' ? 3 : 0,
            borderLeftWidth: colors.mode === 'dark' ? 1 : 0,
            // alignSelf: 'center',
          },
        ]}>
        <MainHeader
          navigation={navigation}
          title="Practices"
          iconRight1={{
            name: 'equalizer',
            type: 'simple-line-icon',
            onPress: openMenu,
            buttonType: 'filter',
          }}
          notifyIcon={true}
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
                    fontSize: normalize(15),
                    fontFamily: 'SofiaProSemiBold',
                    color: colors.text,
                  }}>
                  Suggested for you
                </Text>
                <Icon
                  name="arrow-forward"
                  type="material-icons"
                  color={colors.text}
                  size={normalize(21)}
                  style={{
                    color: colors.text,
                    // alignSelf: 'center',
                  }}
                />
              </View>
              <FlatList
                ref={ref}
                horizontal={true}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => getPracticesAllStart()}
                  />
                }
                // removeClippedSubviews
                // ListEmptyComponent
                initialNumToRender={5}
                updateCellsBatchingPeriod={5}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                style={{
                  paddingLeft: style1 === 'open' ? 0 : 20,
                  paddingRight: 90,
                  marginBottom: 70,
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
                    setPracticeData={setPracticeData}
                  />
                )}
                keyExtractor={(item, index) => item.display_url}
                // showsHorizontalScrollIndicator={false}
                // extraData={selected}
              />
            </View>
          </ScrollView>
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
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
        snapPoints={[660, 500, 0]}
        borderRadius={20}
        renderContent={() => (
          <PracticeDetails
            bottomSheetRef={bottomSheetRef}
            navigation={navigation}
            practiceData={practiceData}
          />
        )}
        initialSnap={2}
        onCloseEnd={() => setPracticeData({ show: false, data: null })}
      />
    </SafeAreaView>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  isFetching: selectIsFetching,
  practices: selectAllPractices,
  filter: selectFilter,
});

const mapDispatchToProps = (dispatch) => ({
  getPracticesAllStart: () => dispatch(getPracticesAllStart()),
  getJoinedPracticesStart: () => dispatch(getJoinedPracticesStart()),
  getPracticesDmsStart: () => dispatch(getPracticesDmsStart()),
  setFilter: (data) => dispatch(setFilter(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Practx);
