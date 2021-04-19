import React, { useEffect, useState, useContext, useRef } from 'react';
import * as Animatable from 'react-native-animatable';

import { Text, Thumbnail } from 'native-base';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Button, Icon, ListItem } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { useRoute, useTheme } from '@react-navigation/native';
import { normalize } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import {
  joinPractices,
  setPracticeId,
} from '../../../redux/practices/practices.actions';
import { selectIsLoading } from '../../../redux/practices/practices.selector';
import { createStructuredSelector } from 'reselect';
import BottomSheet from 'reanimated-bottom-sheet';
import Header from '../../../components/hoc/Header';

const Stack = createStackNavigator();

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.8;

const theme = {
  /* ---- THeme to be gotten from redux or context------*/
  background: '#1e1f36',
  highlight: '#ff0000',
  text: '#fff',
  text2: '#aaa',
  text3: '#555',
};

const PracticeDetails = ({
  bottomSheetRef,
  navigation,
  isLoading,
  mainNavigation,
  setPracticeId,
  setPracticepractice,
  joinPractices,
}) => {
  const { colors } = useTheme();
  const { params } = useRoute();
  const { practice, userId, searchData } = params;
  console.log(practice);
  const pending = practice.requests;
  const member = practice.patients.filter((val) => val.id === userId);
  // const pending = practice.requests;
  // const member = practice.patients.filter((val) => val.id === userId);
  const [loading, setLoading] = useState(false);

  const joinPractice = (practiceId) => {
    setLoading(true);
    joinPractices(practiceId);
  };

  useEffect(() => {
    !isLoading && setLoading(false);
  }, [isLoading]);

  return (
    <ScrollView
      style={{
        backgroundColor: colors.background,
        minHeight: 660,
        marginBottom: 70,
      }}>
      {/* <Icon
        onPress={() => console.log('hello')}
        name={'ios-remove-outline'}
        type={'ionicon'}
        color={colors.text_1}
        size={normalize(18)}
        style={[{ alignSelf: 'center' }]}
      /> */}
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
          name:
            searchData && searchData.length > 0
              ? searchData
              : 'Search for a practice',
          action: () => console.log('search'),
          hideBorder: true,
          hideTitle: true,
        }}
        // checkState={checkState}
        // setCheckState={setCheckState}
      />

      {practice && (
        <View style={{ width: windowWidth, marginTop: 10 }}>
          <View
            style={{
              padding: 20,
              flexDirection: 'column',
              // borderBottomWidth: 0.8,
              // borderColor: colors.background_1,
              width: windowWidth,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <FastImage
              source={{
                uri: practice.logo ? practice.logo : '',
              }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 200,
                backgroundColor: colors.background_1,
                // alignSelf: 'center',
              }}
              resizeMode={FastImage.resizeMode.cover}
              // placeHolder={<ActivityIndicator />}
            />
            <Text
              style={{
                color: colors.text,
                fontSize: normalize(14),
                fontFamily: 'SofiaProSemiBold',
                textAlign: 'center',
                paddingTop: 10,
              }}>
              {practice.practiceName}
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: normalize(12),
                fontFamily: 'SofiaProRegular',
                textAlign: 'center',
                paddingTop: 10,
              }}>
              {practice.email}
            </Text>
            {pending.length > 0 ||
            (!pending.length > 0 && !member.length > 0) ? (
              <View
                style={{
                  position: 'absolute',
                  top: 20,
                  right: pending ? 20 : 20,
                }}>
                {pending.length > 0 ? (
                  <Icon
                    name="progress-clock"
                    type="material-community"
                    color={colors.text_2}
                    size={normalize(20)}
                  />
                ) : (
                  <Button
                    title="Join"
                    onPress={() => {
                      console.log('Joining');
                      joinPractice(practice.id);
                      // await setPracticeId(practice.id);
                      // await navigation.navigate('Chats');
                    }}
                    type="clear"
                    icon={
                      <Icon
                        name="medical"
                        type="ionicon"
                        color={colors.text}
                        size={normalize(12)}
                        style={{
                          color: 'white',
                          marginRight: 0,
                          // alignSelf: 'center',
                        }}
                      />
                    }
                    buttonStyle={{
                      borderRadius: 10,
                      // borderColor: colors.tertiary,
                      paddingVertical: 2,
                      paddingHorizontal: 10,
                      alignItems: 'center',
                    }}
                    titleStyle={{
                      fontFamily: 'SofiaProSemiBold',
                      color: colors.text,
                      fontSize: normalize(14),
                      marginLeft: 3,
                    }}
                    loadingProps={{ color: colors.text }}
                    loading={loading}
                  />
                )}
              </View>
            ) : null}
          </View>
          {member.length > 0 && (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={[
                  styles.buttonAction,
                  {
                    backgroundColor: colors.background_1,
                  },
                ]}
                onPress={() => {
                  setPracticeId(practice.id);
                  navigation.navigate('Chats');
                }}>
                <Icon
                  name="ios-chatbubble"
                  type="ionicon"
                  color={colors.text}
                  size={normalize(20)}
                  style={{
                    color: colors.text,
                    // alignSelf: 'center',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.buttonAction,
                  {
                    backgroundColor: colors.background_1,
                  },
                ]}
                onPress={() => console.log('Hello bro')}>
                <Icon
                  name="ios-call"
                  type="ionicon"
                  color={colors.text}
                  size={normalize(20)}
                  style={{
                    color: colors.text,
                    // alignSelf: 'center',
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
          {pending.length > 0 && (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Icon
                name="clock-outline"
                type="material-community"
                color={colors.text_2}
                size={normalize(15)}
              />
              <Text
                style={{
                  color: colors.text_2,
                  fontSize: normalize(12),
                  fontFamily: 'SofiaProRegular',
                  textAlign: 'center',
                  paddingLeft: 5,
                }}>
                Waiting for approval
              </Text>
            </View>
          )}
          <View
            style={{ marginVertical: 10, backgroundColor: colors.background }}>
            <ListItem containerStyle={{ backgroundColor: colors.background }}>
              <Icon
                name="pencil"
                type="material-community"
                color={colors.text}
                size={normalize(18)}
              />
              <ListItem.Content>
                <ListItem.Title
                  style={{
                    color: colors.text,
                    fontSize: normalize(13),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  Description
                </ListItem.Title>
                <ListItem.Subtitle
                  style={{
                    color: colors.text_1,
                    fontSize: normalize(12),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  {practice.description}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
            <ListItem containerStyle={{ backgroundColor: colors.background }}>
              <Icon
                name="medical-bag"
                type="material-community"
                color={colors.text}
                size={normalize(18)}
              />
              <ListItem.Content>
                <ListItem.Title
                  style={{
                    color: colors.text,
                    fontSize: normalize(14),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  Specialty
                </ListItem.Title>
                <ListItem.Subtitle
                  style={{
                    color: colors.text_1,
                    fontSize: normalize(12),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  {practice.specialty}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
            <ListItem containerStyle={{ backgroundColor: colors.background }}>
              <Icon
                name="ios-call"
                type="ionicon"
                color={colors.text}
                size={normalize(18)}
              />
              <ListItem.Content>
                <ListItem.Title
                  style={{
                    color: colors.text,
                    fontSize: normalize(14),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  Phone
                </ListItem.Title>
                <ListItem.Subtitle
                  style={{
                    color: colors.text_1,
                    fontSize: normalize(12),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  {practice.mobileNo}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
            <ListItem containerStyle={{ backgroundColor: colors.background }}>
              <Icon
                name="location-city"
                type="material-icons"
                color={colors.text}
                size={normalize(18)}
              />
              <ListItem.Content>
                <ListItem.Title
                  style={{
                    color: colors.text,
                    fontSize: normalize(14),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  City
                </ListItem.Title>
                <ListItem.Subtitle
                  style={{
                    color: colors.text_1,
                    fontSize: normalize(12),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  {practice.city}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
            <ListItem containerStyle={{ backgroundColor: colors.background }}>
              <Icon
                name="address"
                type="entypo"
                color={colors.text}
                size={normalize(18)}
              />
              <ListItem.Content>
                <ListItem.Title
                  style={{
                    color: colors.text,
                    fontSize: normalize(14),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  Address
                </ListItem.Title>
                <ListItem.Subtitle
                  style={{
                    color: colors.text_1,
                    fontSize: normalize(12),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  {practice.address}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem containerStyle={{ backgroundColor: colors.background }}>
              <Icon
                name="map"
                type="ionicon"
                color={colors.text}
                size={normalize(18)}
              />
              <ListItem.Content>
                <ListItem.Title
                  style={{
                    color: colors.text,
                    fontSize: normalize(14),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  State
                </ListItem.Title>
                <ListItem.Subtitle
                  style={{
                    color: colors.text_1,
                    fontSize: normalize(12),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  {practice.state}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem containerStyle={{ backgroundColor: colors.background }}>
              <Icon
                name="flag"
                type="entypo"
                color={colors.text}
                size={normalize(18)}
              />
              <ListItem.Content>
                <ListItem.Title
                  style={{
                    color: colors.text,
                    fontSize: normalize(14),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  Country
                </ListItem.Title>
                <ListItem.Subtitle
                  style={{
                    color: colors.text_1,
                    fontSize: normalize(12),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  {practice.country}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem containerStyle={{ backgroundColor: colors.background }}>
              <Icon
                name="web"
                type="material-community"
                color={colors.text}
                size={normalize(18)}
              />
              <ListItem.Content>
                <ListItem.Title
                  style={{
                    color: colors.text,
                    fontSize: normalize(14),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  Website
                </ListItem.Title>
                <ListItem.Subtitle
                  style={{
                    color: colors.text_1,
                    fontSize: normalize(12),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  {practice.website}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonAction: {
    width: 43,
    height: 43,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
});

const mapStateToProps = createStructuredSelector({
  isLoading: selectIsLoading,
});

const mapDispatchToProps = (dispatch) => ({
  joinPractices: (practiceId) => dispatch(joinPractices(practiceId)),
  setPracticeId: (id) => dispatch(setPracticeId(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PracticeDetails);
