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
  TouchableOpacity,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { Icon } from 'react-native-elements';
import PracticesBox from '../../../components/hoc/PracticesBox';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Header from '../../../components/hoc/Header';
import {
  getJoinedPracticesStart,
  getPracticesAllStart,
  getPracticesDmsStart,
  setSearchData,
} from '../../../redux/practices/practices.actions';
import {
  selectAllPractices,
  selectFilter,
  selectisSearching,
  selectIsSearching,
  selectSearchData,
  selectSearchResult,
} from '../../../redux/practices/practices.selector';
import { selectCurrentUser } from '../../../redux/user/user.selector';
import { MenuProvider } from 'react-native-popup-menu';
import { ActivityIndicator } from 'react-native-paper';
import { normalize } from 'react-native-elements';
import Error from '../../../components/hoc/Error';
import BottomSheet from 'reanimated-bottom-sheet';
import PracticeDetails from '../../../components/hoc/PracticeDetails';
// import { getAllPracticesStart } from '../../redux/practices/practices.actions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const Practices = ({
  navigation,
  getPracticesAllStart,
  getJoinedPracticesStart,
  getPracticesDmsStart,
  isSearching,
  practices,
  currentUser,
  setSearchData,
  filter,
  extraData,
  searchData,
  searchResult,
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
    isSearching ? setRefreshing(true) : setRefreshing(false);
  }, [isSearching]);

  useEffect(() => {
    if (isFocused) {
      getPracticesAllStart();
      getJoinedPracticesStart();
      getPracticesDmsStart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

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
            name: searchData,
            action: () => navigation.navigate('PractxSearch'),
          }}
          checkState={checkState}
          setCheckState={setCheckState}
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
              // removeClippedSubviews
              ListEmptyComponent={() => (
                <View style={{ marginTop: windowHeight / 3 }}>
                  {isSearching ? (
                    <ActivityIndicator
                      animating={isSearching}
                      size={normalize(30)}
                      color={colors.text}
                    />
                  ) : (
                    <View style={{ alignItems: 'center' }}>
                      <Icon
                        name="search-off"
                        type="material-icons"
                        color={colors.text_1}
                        size={normalize(50)}
                      />
                      <Text
                        style={{
                          color: colors.text_1,
                          fontSize: normalize(13),
                          fontFamily: 'SofiaProSemiBold',
                        }}>
                        No Practice Found
                      </Text>
                      <TouchableOpacity
                        onPress={() => setSearchData(searchData)}
                        style={{
                          alignItems: 'center',
                          backgroundColor: colors.primary,
                          marginTop: 20,
                          borderRadius: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: normalize(13),
                            color: 'white',
                            paddingVertical: 6,
                            paddingHorizontal: 15,
                          }}>
                          Try again
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
              initialNumToRender={5}
              updateCellsBatchingPeriod={5}
              showsVerticalScrollIndicator={false}
              style={{ marginBottom: 20 }}
              data={searchResult}
              numColumns={1}
              renderItem={({ item, index }) => (
                <>
                  <PracticesBox
                    userId={currentUser ? currentUser.id : 0}
                    id={index}
                    practice={item}
                    navigation={navigation}
                    practiceData={practiceData}
                    setPracticeData={setPracticeData}
                  />
                  <View
                    style={{
                      height: practices.length === index + 1 ? 40 : 0,
                    }}
                  />
                </>
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
              {isSearching ? (
                <ActivityIndicator
                  animating={isSearching}
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
    </SafeAreaView>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  isSearching: selectIsSearching,
  practices: selectAllPractices,
  filter: selectFilter,
  searchData: selectSearchData,
  searchResult: selectSearchResult,
});

const mapDispatchToProps = (dispatch) => ({
  getPracticesAllStart: () => dispatch(getPracticesAllStart()),
  getJoinedPracticesStart: () => dispatch(getJoinedPracticesStart()),
  getPracticesDmsStart: () => dispatch(getPracticesDmsStart()),
  setSearchData: (searchData) => dispatch(setSearchData(searchData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Practices);
