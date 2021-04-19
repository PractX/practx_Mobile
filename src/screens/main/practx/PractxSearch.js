import {
  DrawerActions,
  useIsFocused,
  useTheme,
  useFocusEffect,
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
import PracticesBox from '../../../components/hoc/PracticesBox';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Header from '../../../components/hoc/Header';
import {
  getJoinedPracticesStart,
  getPracticesAllStart,
  getPracticesDmsStart,
  setFilter,
  setSearchData,
  setSearchHistory,
} from '../../../redux/practices/practices.actions';
import {
  selectAllPractices,
  selectFilter,
  selectIsFetching,
  selectSearchData,
  selectSearchResult,
  selectSearchHistory,
} from '../../../redux/practices/practices.selector';
import { selectCurrentUser } from '../../../redux/user/user.selector';
import { MenuProvider } from 'react-native-popup-menu';
import { ActivityIndicator } from 'react-native-paper';
import { Icon, normalize } from 'react-native-elements';
import Error from '../../../components/hoc/Error';
import BottomSheet from 'reanimated-bottom-sheet';
import PracticeDetails from '../../../components/hoc/PracticeDetails';
import { TouchableOpacity } from 'react-native';
// import { getAllPracticesStart } from '../../redux/practices/practices.actions';
// import Voice from '@react-native-voice/voice';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const PractxSearch = ({
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
  setSearchData,
  searchResult,
  searchData,
  setSearchHistory,
  searchHistory,
}) => {
  const bottomSheetRef = useRef(null);
  const { colors } = useTheme();
  const [style1, setStyle1] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [checkState, setCheckState] = useState(filter);
  const [textInput, setTextInput] = useState();
  const [searchText, setSearchText] = useState('');
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

  useFocusEffect(
    React.useCallback(() => {
      if (textInput) {
        console.log(textInput.getNativeRef());
        console.log('Welcome___now');
        textInput.focus();
      }
    }, [textInput]),
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      style={{
        flex: 1,
      }}>
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
          setTextInput={setTextInput}
          searchText={searchText}
          setSearchText={setSearchText}
          search={{
            placeholder: 'Search for practice',
            action: (data) => {
              setSearchData(data);
            },
            onSubmit: () => {
              if (searchHistory.length > 3) {
                let newHistory = searchHistory;
                newHistory.shift();
                newHistory.push(searchData);
                setSearchHistory([...new Set(newHistory)]);
              } else {
                setSearchHistory([...searchHistory, searchData]);
              }
              navigation.navigate('Practices');
            },
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
          <FlatList
            ref={ref}
            refreshControl={<RefreshControl refreshing={refreshing} />}
            keyboardShouldPersistTaps={'handled'}
            // removeClippedSubviews
            ListEmptyComponent={() => (
              <View>
                {searchHistory.length > 0 ? (
                  searchHistory.map((data) => (
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignSelf: 'center',
                        justifyContent: 'space-between',
                        width: appwidth - 20,
                        marginTop: 30,
                      }}
                      // onPress={() => navigation.navigate('Practices')}
                      onPress={
                        () => {
                          setSearchData(data);
                          setSearchText(data);
                          navigation.navigate('Practices');
                        }
                        // navigation.navigate('SinglePractice', {
                        //   navigation,
                        //   practice: item,
                        //   userId: currentUser ? currentUser.id : 0,
                        //   searchData,
                        // })
                      }>
                      <View style={{ flexDirection: 'row' }}>
                        <Icon
                          name="history"
                          type="fontisto"
                          color={colors.text}
                          size={normalize(17)}
                          style={{
                            color: colors.text,
                            marginRight: 20,
                            // alignSelf: 'center',
                          }}
                        />
                        <Text
                          style={{
                            color: colors.text,
                            fontSize: normalize(13),
                            fontFamily: 'SofiaProRegular',
                          }}>
                          {data}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={{
                          alignItems: 'center',
                          paddingTop: 5,
                          zIndex: 20,
                        }}
                        onPress={() => console.log('go')}>
                        <Icon
                          name="arrow-up-left"
                          type="feather"
                          color={colors.text}
                          size={normalize(18)}
                          style={{
                            color: colors.text,
                            // alignSelf: 'center',
                          }}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View
                    style={{
                      marginTop: windowHeight / 4,
                      alignItems: 'center',
                    }}>
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
                  </View>
                )}
              </View>
            )}
            initialNumToRender={5}
            updateCellsBatchingPeriod={5}
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: 20 }}
            data={searchResult && searchResult.length > 0 ? searchResult : []}
            numColumns={1}
            renderItem={({ item, index }) => (
              <>
                {index === 0 &&
                  searchHistory &&
                  searchHistory.length > 0 &&
                  searchHistory
                    .filter((it) => it === searchData)
                    .map((data, i) => (
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignSelf: 'center',
                          justifyContent: 'space-between',
                          width: appwidth - 20,
                          marginTop: 30,
                          // marginBottom: searchHistory.length === i + 1 ? 0 : 0,
                        }}
                        // onPress={() => navigation.navigate('Practices')}
                        onPress={() => navigation.navigate('Practices')}>
                        <View style={{ flexDirection: 'row' }}>
                          <Icon
                            name="history"
                            type="fontisto"
                            color={colors.text}
                            size={normalize(17)}
                            style={{
                              color: colors.text,
                              marginRight: 20,
                              // alignSelf: 'center',
                            }}
                          />
                          <Text
                            style={{
                              color: colors.text,
                              fontSize: normalize(13),
                              fontFamily: 'SofiaProRegular',
                            }}>
                            {data}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={{
                            alignItems: 'center',
                            paddingTop: 5,
                            zIndex: 20,
                          }}
                          onPress={() => console.log('go')}>
                          <Icon
                            name="arrow-up-left"
                            type="feather"
                            color={colors.text}
                            size={normalize(18)}
                            style={{
                              color: colors.text,
                              // alignSelf: 'center',
                            }}
                          />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))}
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    justifyContent: 'space-between',
                    width: appwidth - 20,
                    marginTop: 30,
                    marginBottom: searchResult.length === index + 1 ? 40 : 0,
                  }}
                  // onPress={() => navigation.navigate('Practices')}
                  onPress={() =>
                    navigation.navigate('SinglePractice', {
                      navigation,
                      practice: item,
                      userId: currentUser ? currentUser.id : 0,
                      searchData,
                    })
                  }>
                  <View style={{ flexDirection: 'row' }}>
                    <Icon
                      name="search"
                      type="fontisto"
                      color={colors.text}
                      size={normalize(17)}
                      style={{
                        color: colors.text,
                        marginRight: 20,
                        // alignSelf: 'center',
                      }}
                    />
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: normalize(13),
                        fontFamily: 'SofiaProRegular',
                      }}>
                      {item.practiceName}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      paddingTop: 5,
                      zIndex: 20,
                    }}
                    onPress={() => console.log('go')}>
                    <Icon
                      name="arrow-up-left"
                      type="feather"
                      color={colors.text}
                      size={normalize(18)}
                      style={{
                        color: colors.text,
                        // alignSelf: 'center',
                      }}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </>
            )}
            keyExtractor={(item, index) => item.display_url}
            // showsHorizontalScrollIndicator={false}
            // extraData={selected}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  isFetching: selectIsFetching,
  practices: selectAllPractices,
  filter: selectFilter,
  searchResult: selectSearchResult,
  searchData: selectSearchData,
  searchHistory: selectSearchHistory,
});

const mapDispatchToProps = (dispatch) => ({
  getPracticesAllStart: () => dispatch(getPracticesAllStart()),
  getJoinedPracticesStart: () => dispatch(getJoinedPracticesStart()),
  getPracticesDmsStart: () => dispatch(getPracticesDmsStart()),
  setFilter: (data) => dispatch(setFilter(data)),
  setSearchData: (searchData) => dispatch(setSearchData(searchData)),
  setSearchHistory: (history) => dispatch(setSearchHistory(history)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PractxSearch);
