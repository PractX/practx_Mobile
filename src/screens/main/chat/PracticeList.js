import { useTheme } from '@react-navigation/native';
import React, { useRef } from 'react';
import { Dimensions } from 'react-native';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Icon } from 'react-native-elements';
import normalize from '../../../utils/normalize';
import PracticesBox from './PracticeBox';
import StaffList from './StaffList';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const PracticeList = ({
  style1,
  setFilter,
  navigation,
  practicesRefreshing,
  joinedPractices,
  chatWithPracticeStart,
  setShowStaffs,
  currentPracticeId,
  getPracticesDmsStart,
  practiceDms,
}) => {
  const { colors } = useTheme();
  const ref = useRef();
  return (
    <View
      style={{
        height: 100,
        width: style1 === 'open' ? windowWidth - 50 : windowWidth,
        alignSelf: 'center',
        marginTop: 50,
        flexDirection: 'row',
        paddingVertical: 2,
      }}>
      <View
        style={{
          marginLeft: 20,
          marginRight: 5,
          flexDirection: 'column',
          alignSelf: 'center',
          alignItems: 'center',
          // borderBottomWidth: 0.8,
          // borderBottomColor: colors.background_1,
        }}>
        <TouchableOpacity
          onPress={() => {
            requestAnimationFrame(() => {
              setFilter({
                opt1: true,
                opt2: false,
                opt3: false,
              });
              navigation.navigate('Practices');
            });
          }}
          style={{
            backgroundColor: colors.background_1,
            height: 60,
            width: 60,
            borderRadius: 15,
            justifyContent: 'center',
            marginVertical: 5,
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
            fontSize: normalize(12),
            fontFamily: 'SofiaProSemiBold',
          }}>
          Join
        </Text>
      </View>
      {/* {practices ? ( */}
      <FlatList
        ref={ref}
        horizontal={true}
        refreshControl={
          <RefreshControl
            horizontal={true}
            refreshing={practicesRefreshing}
            // onRefresh={() => getPracticesAllStart()}
          />
        }
        // removeClippedSubviews
        // ListEmptyComponent
        initialNumToRender={5}
        updateCellsBatchingPeriod={5}
        showsVerticalScrollIndicator={false}
        // style={{}}
        data={joinedPractices}
        numColumns={1}
        renderItem={({ item, index }) => (
          <PracticesBox
            id={index}
            navigation={navigation}
            practice={item}
            chatWithPracticeStart={chatWithPracticeStart}
            setShowStaffs={setShowStaffs}
            currentPracticeId={currentPracticeId}
            getPracticesDmsStart={getPracticesDmsStart}
            practiceDms={practiceDms}
          />
        )}
        keyExtractor={(item, index) => item.display_url}
        // showsHorizontalScrollIndicator={false}
        // extraData={selected}
      />
      {/* ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>No data</Text>
            {/* {errorData ? ( */}
      {/* <Error
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
              )}
          </View>
           )} */}
      {/* <StaffList
        showStaffs={showStaffs}
        setShowStaffs={setShowStaffs}
        colors={colors}
      /> */}
    </View>
  );
};

export default PracticeList;
