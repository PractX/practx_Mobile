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
  View,
  Dimensions,
} from 'react-native';
import PracticesBox from '../../../../components/hoc/PracticesBox';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Header from '../../../../components/hoc/Header';
import {
  getJoinedPracticesStart,
  getPracticesAllStart,
  getPracticesDmsStart,
  setFilter,
} from '../../../../redux/practices/practices.actions';
import {
  selectAllPractices,
  selectFilter,
  selectIsFetching,
} from '../../../../redux/practices/practices.selector';
import { selectCurrentUser } from '../../../../redux/user/user.selector';
import { MenuProvider } from 'react-native-popup-menu';
import { ActivityIndicator } from 'react-native-paper';
import normalize from '../../../../utils/normalize';
import Error from '../../../../components/hoc/Error';
import BottomSheet from 'reanimated-bottom-sheet';
import PracticeDetails from '../../../../components/hoc/PracticeDetails';
// import { getAllPracticesStart } from '../../redux/practices/practices.actions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const Practices = ({
  navigation,
  getPracticesAllStart,
  getJoinedPracticesStart,
  getPracticesDmsStart,
  isFetching,
  practices,
  currentUser,
  setFilter,
  filter,
  extraData,
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
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('drawerOpen', (e) => {
      // Do something
      setStyle1('open');
    });

    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    if (isFocused) {
      getPracticesAllStart();
      getJoinedPracticesStart();
      getPracticesDmsStart();
    }
  }, [isFocused]);
  React.useEffect(() => {
    // console.log(practices);

    const unsubscribe = navigation.addListener('drawerClose', (e) => {
      // Do something
      setStyle1('close');
      // console.log('Close');
    });

    return unsubscribe;
  }, [getPracticesAllStart, navigation]);

  useEffect(() => {
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
        <Header
          navigation={navigation}
          // title="Practices"
          backArrow={true}
          // iconRight1={{
          //   name: 'equalizer',
          //   type: 'simple-line-icon',
          //   onPress: openMenu,
          //   buttonType: 'filter',
          // }}
          // notifyIcon={true}
          searchData={{
            name: 'John',
            action: () => console.log('search'),
          }}
          checkState={checkState}
          setCheckState={setCheckState}
          setFilter={setFilter}
        />
        <View
          style={{
            height: windowHeight - 100,
            width: style1 === 'open' ? appwidth - 50 : appwidth,
            alignSelf: 'center',
            justifyContent: 'center',
            marginTop: 50,
          }}>
          {practices ? (
            <FlatList
              ref={ref}
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
              showsVerticalScrollIndicator={false}
              // style={{ marginBottom: 10 }}
              data={practices}
              numColumns={1}
              renderItem={({ item, index }) => (
                <PracticesBox
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
        snapPoints={[560, 400, 0]}
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

export default connect(mapStateToProps, mapDispatchToProps)(Practices);
