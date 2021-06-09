import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Dimensions,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Text, Content } from 'native-base';
import Header from '../../../components/hoc/Header';
import { DrawerActions, useRoute, useTheme } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../../redux/user/user.selector';
import { normalize } from 'react-native-elements';
import { ListItem, Icon } from 'react-native-elements';
import { useIsDrawerOpen } from '@react-navigation/drawer';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const ProfileScreen = ({ navigation, extraData, route, currentUser }) => {
  const { colors } = useTheme();
  // const props = useRoute();
  const [style1, setStyle1] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const isDrawerOpen = useIsDrawerOpen();

  useEffect(() => {
    if (isDrawerOpen) {
      setStyle1('open');
      console.log('Open');
    } else {
      setStyle1('close');
      console.log('Close');
    }
  }, [isDrawerOpen]);

  // useEffect(() => {
  //   isFetching ? setRefreshing(true) : setRefreshing(false);
  // }, [isFetching]);

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
        <Header navigation={navigation} title="Profile" notifyIcon={true} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            height: windowHeight - 60,
            width: style1 === 'open' ? appwidth - 50 : appwidth,
            alignSelf: 'center',
            marginTop: 50,
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
                width: 65,
                height: 65,
                borderRadius: 15,
                backgroundColor: colors.background_1,
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
                  fontSize: normalize(14),
                  fontFamily: 'SofiaProSemiBold',
                }}>
                {currentUser &&
                  currentUser.firstname + ' ' + currentUser.lastname}
              </Text>
              <Text
                style={{
                  color: colors.primary_light,
                  fontSize: normalize(12),
                  fontFamily: 'SofiaProRegular',
                }}>
                {currentUser && currentUser.email}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              // alignItems: 'center',
              justifyContent: 'space-evenly',
            }}>
            <Text
              style={{
                color: colors.text_1,
                fontSize: normalize(12),
                fontFamily: 'SofiaProRegular',
              }}>
              {(currentUser && currentUser.bio) || 'No bio'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              // alignItems: 'center',
              justifyContent: 'space-evenly',
              paddingVertical: 15,
            }}>
            <Text
              style={{
                color: colors.text,
                fontSize: normalize(14),
                fontFamily: 'SofiaProSemiBold',
                paddingBottom: 5,
              }}>
              Address
            </Text>
            <Text
              style={{
                color: colors.text_1,
                fontSize: normalize(12),
                fontFamily: 'SofiaProRegular',
              }}>
              {(currentUser && currentUser.address) || 'No address'}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'column',
              // alignItems: 'center',
              justifyContent: 'space-evenly',
              paddingVertical: 15,
            }}>
            <Text
              style={{
                color: colors.text,
                fontSize: normalize(14),
                fontFamily: 'SofiaProSemiBold',
                paddingBottom: 5,
              }}>
              Insurance Details
            </Text>
            <Text
              style={{
                color: colors.text_1,
                fontSize: normalize(12),
                fontFamily: 'SofiaProRegular',
              }}>
              {(currentUser && currentUser.insurance) || 'No Insurance details'}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() =>
                requestAnimationFrame(() => {
                  navigation.navigate('EditProfile');
                })
              }>
              <ListItem
                containerStyle={{
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: colors.background_1,
                  paddingVertical: 12,
                  borderRadius: 15,
                  marginVertical: 10,
                }}>
                <Icon
                  size={normalize(18)}
                  color={colors.text}
                  type="material-community"
                  name="account-edit-outline"
                />
                <ListItem.Content>
                  <ListItem.Title
                    style={{
                      color: colors.text,
                      fontSize: normalize(14),
                      fontFamily: 'SofiaProRegular',
                    }}>
                    Edit Profile
                  </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron size={normalize(20)} color={colors.text_1} />
              </ListItem>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                requestAnimationFrame(() => {
                  navigation.navigate('ResetPassword');
                })
              }>
              <ListItem
                containerStyle={{
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: colors.background_1,
                  paddingVertical: 12,
                  borderRadius: 15,
                  marginBottom: 20,
                }}>
                <Icon
                  size={normalize(18)}
                  color={colors.text}
                  type="material-community"
                  name="lock-outline"
                />
                <ListItem.Content>
                  <ListItem.Title
                    style={{
                      color: colors.text,
                      fontSize: normalize(14),
                      fontFamily: 'SofiaProRegular',
                    }}>
                    Reset Password
                  </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron size={normalize(20)} color={colors.text_1} />
              </ListItem>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

// const mapDispatchToProps = (dispatch) => ({
//   getPracticesAllStart: () => dispatch(getPracticesAllStart()),
//   setFilter: (data) => dispatch(setFilter(data)),
// });

export default connect(mapStateToProps)(ProfileScreen);
