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
import { useTheme } from '@react-navigation/native';
import normalize from '../../utils/normalize';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import {
  joinPractices,
  setPracticeId,
} from '../../redux/practices/practices.actions';
import { selectIsLoading } from '../../redux/practices/practices.selector';
import { createStructuredSelector } from 'reselect';
import BottomSheet from 'reanimated-bottom-sheet';

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
  isLoading,
  navigation,
  setPracticeId,
  practiceData,
  setPracticeData,
  joinPractices,
}) => {
  const { colors } = useTheme();
  const { show, data, type } = practiceData;
  console.log(practiceData);
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
    <View
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
      <TouchableOpacity
        style={{
          justifyContent: 'center',
        }}
        onPress={() => {
          console.log(bottomSheetRef.current);
          bottomSheetRef.current.snapTo(2);
        }}>
        <View
          style={{
            alignSelf: 'center',
            backgroundColor: colors.text_1,
            width: 20,
            height: 3,
            marginTop: 10,
          }}
        />
      </TouchableOpacity>

      {practiceData.data && (
        <View style={{ width: windowWidth }}>
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
                uri: data.logo ? data.logo : '',
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
              {data.practiceName}
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: normalize(12),
                fontFamily: 'SofiaProRegular',
                textAlign: 'center',
                paddingTop: 10,
              }}>
              {data.email}
            </Text>
            {type === 'pending' || type === 'none-member' ? (
              <View
                style={{
                  position: 'absolute',
                  top: 20,
                  right: type === 'pending' ? 20 : 20,
                }}>
                {type === 'pending' ? (
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
                      joinPractice(data.id);
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
          {type === 'member' && (
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
                onPress={async () => {
                  bottomSheetRef.current.snapTo(2);

                  setTimeout(() => {
                    setPracticeId(data.id);
                    navigation.navigate('Chats');
                  }, 2200);
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
          {type === 'pending' && (
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
                  {data.description}
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
                  {data.specialty}
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
                  {data.mobileNo}
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
                  Location
                </ListItem.Title>
                <ListItem.Subtitle
                  style={{
                    color: colors.text_1,
                    fontSize: normalize(12),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  {data.location}
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
                  {data.address}
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
                  {data.website}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </View>
        </View>
      )}
    </View>
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
