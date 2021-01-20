import { DrawerActions, useTheme } from '@react-navigation/native';
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
import PracticesBox from '../../components/hoc/PracticesBox';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Header from '../../components/hoc/Header';
import { getPracticesAllStart } from '../../redux/practices/practices.actions';
import {
  selectAllPractices,
  selectIsLoading,
} from '../../redux/practices/practices.selector';
import { selectCurrentUser } from '../../redux/user/user.selector';
// import { getAllPracticesStart } from '../../redux/practices/practices.actions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const AddGroup = ({
  navigation,
  getPracticesAllStart,
  isLoading,
  practices,
  currentUser,
}) => {
  const { colors } = useTheme();
  const [style1, setStyle1] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    isLoading ? setRefreshing(true) : setRefreshing(false);
  }, [isLoading]);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('drawerOpen', (e) => {
      // Do something
      setStyle1('open');
    });

    return unsubscribe;
  }, [navigation]);
  React.useEffect(() => {
    // console.log(practices);
    getPracticesAllStart();
    const unsubscribe = navigation.addListener('drawerClose', (e) => {
      // Do something
      setStyle1('close');
      console.log('Close');
    });

    return unsubscribe;
  }, [getPracticesAllStart, navigation]);
  const Item = ({ id, title, isVideo, name }) => {
    return (
      <View style={{ backgroundColor: 'red', width: '100%' }}>
        <Text style={{ color: 'white', fontSize: 18 }}>{name}</Text>
      </View>
    );
  };
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
          },
        ]}>
        <Header navigation={navigation} title="Group Request" />
        <View
          style={{
            height: windowHeight,
            width: style1 === 'open' ? appwidth - 50 : appwidth,
            alignSelf: 'center',
            justifyContent: 'center',
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
              style={{ marginBottom: 70 }}
              data={practices.rows}
              numColumns={1}
              renderItem={({ item, index }) => (
                <PracticesBox
                  userId={currentUser ? currentUser.id : 0}
                  id={index}
                  practice={item}
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
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  isLoading: selectIsLoading,
  practices: selectAllPractices,
});

const mapDispatchToProps = (dispatch) => ({
  getPracticesAllStart: () => dispatch(getPracticesAllStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddGroup);
