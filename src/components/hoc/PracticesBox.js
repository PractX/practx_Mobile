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
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@react-navigation/native';
import { normalize } from 'react-native-elements';
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

const PracticeBox = ({
  joinPractices,
  practice,
  getpractx,
  token,
  id,
  userId,
  isLoading,
  navigation,
  setPracticeId,
  practiceData,
  setPracticeData,
}) => {
  const { colors } = useTheme();
  const pending = 'practice.requests';
  const member = 'practice.patients.filter((val) => val.id === userId)';
  const [loading, setLoading] = useState(false);

  const joinPractice = (practiceId) => {
    if (practiceId === practice.id) {
      setLoading(true);
    }
    joinPractices(practiceId);
  };

  useEffect(() => {
    !isLoading && setLoading(false);
  }, [isLoading, practice]);

  return (
    <View
      style={{
        borderWidth: 0.9,
        borderColor: colors.background_1,
        borderRadius: 30,
        marginTop: 15,
        marginBottom: 15,
      }}>
      <View
        style={{
          padding: 20,
          flexDirection: 'row',
          borderBottomWidth: 0.8,
          borderColor: colors.background_1,
        }}>
        <FastImage
          source={{ uri: practice.logo }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 15,
            backgroundColor: colors.background_1,
            marginRight: 15,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />

        <View style={{ justifyContent: 'center' }}>
          <Text
            style={{
              fontSize: normalize(16),
              fontFamily: 'SofiaProSemiBold',
              color: colors.text,
            }}>
            {practice.practiceName}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // justifyContent: 'center',
            }}>
            <Text
              style={{
                color: colors.text_2,
                fontSize: normalize(15),
                fontFamily: 'SofiaProSemiBold',
              }}>
              Specialty:{'  '}
            </Text>
            <Text
              style={{
                color: colors.text_2,
                fontSize: normalize(14),
                fontFamily: 'SofiaProRegular',
                textTransform: 'capitalize',
              }}>
              {practice.specialty && practice.specialty.length > 20
                ? practice.specialty.substring(0, 20 - 3) + '...'
                : practice.specialty}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Icon
              name="location-city"
              type="material-icons"
              color={colors.text}
              size={normalize(18)}
              style={{
                color: colors.text,
                // alignSelf: 'center',
              }}
            />
            <Text
              style={{
                fontSize: normalize(15),
                fontFamily: 'SofiaProRegular',
                color: colors.text,
                paddingLeft: 10,
              }}>
              {practice.location
                ? practice.location.length > 10
                  ? practice.location.substring(0, 10 - 3) + '...'
                  : practice.location
                : 'No location'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Icon
              name="doctor"
              type="material-community"
              color={colors.text}
              size={normalize(18)}
              style={{
                color: colors.text,
                // alignSelf: 'center',
              }}
            />
            <Text
              style={{
                fontSize: normalize(15),
                fontFamily: 'SofiaProRegular',
                color: colors.text,
                paddingLeft: 10,
              }}>
              60k
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Icon
              name="ios-people-sharp"
              type="ionicon"
              color={colors.text}
              size={normalize(18)}
              style={{
                color: colors.text,
                // alignSelf: 'center',
              }}
            />
            <Text
              style={{
                fontSize: normalize(15),
                fontFamily: 'SofiaProRegular',
                color: colors.text,
                paddingLeft: 10,
              }}>
              450k
            </Text>
          </View>
        </View>

        {pending.length > 0 ? (
          <Button
            title="Pending"
            onPress={() => joinPractice(practice.id)}
            type="outline"
            rounded
            disabled
            buttonStyle={[styles.buttonAction, { borderColor: colors.primary }]}
            titleStyle={{
              fontFamily: 'SofiaProSemiBold',
              fontSize: normalize(16),
              color: colors.primary,
            }}
            loading={loading}
          />
        ) : member.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: appwidth,
            }}>
            <Button
              title="Chat"
              onPress={async () => {
                await setPracticeId(practice.id);
                await navigation.navigate('Chats');
              }}
              icon={
                <Icon
                  name="ios-chatbubble"
                  type="ionicon"
                  color={'white'}
                  size={normalize(16)}
                  style={{
                    color: 'white',
                    paddingRight: 5,
                    // alignSelf: 'center',
                  }}
                />
              }
              rounded
              buttonStyle={[
                styles.buttonAction,
                { backgroundColor: colors.primary, width: appwidth / 3.8 },
              ]}
              titleStyle={{
                fontFamily: 'SofiaProSemiBold',
                fontSize: normalize(14),
              }}
              loading={loading}
            />

            <Button
              title="View"
              onPress={async () => {
                if (practiceData.show) {
                  setPracticeData({ show: true, data: null });
                } else {
                  setPracticeData({ show: true, data: practice });
                }
              }}
              icon={
                <Icon
                  name="ios-eye"
                  type="ionicon"
                  color={'white'}
                  size={normalize(16)}
                  style={{
                    color: 'white',
                    paddingRight: 5,
                    // alignSelf: 'center',
                  }}
                />
              }
              rounded
              buttonStyle={[
                styles.buttonAction,
                { backgroundColor: colors.primary, width: appwidth / 3.8 },
              ]}
              titleStyle={{
                fontFamily: 'SofiaProSemiBold',
                fontSize: normalize(14),
              }}
              loading={loading}
            />
            <Button
              title="Call"
              onPress={async () => {
                await setPracticeId(practice.id);
                await navigation.navigate('Chats');
              }}
              icon={
                <Icon
                  name="ios-call"
                  type="ionicon"
                  color={'white'}
                  size={normalize(16)}
                  style={{
                    color: 'white',
                    paddingRight: 5,
                    // alignSelf: 'center',
                  }}
                />
              }
              rounded
              buttonStyle={[
                styles.buttonAction,
                { backgroundColor: colors.primary, width: appwidth / 3.8 },
              ]}
              titleStyle={{
                fontFamily: 'SofiaProSemiBold',
                fontSize: normalize(14),
              }}
              loading={loading}
            />
          </View>
        ) : (
          <Button
            title="Join"
            onPress={() => joinPractice(practice.id)}
            rounded
            buttonStyle={[
              styles.buttonAction,
              { backgroundColor: colors.tertiary },
            ]}
            titleStyle={{
              fontFamily: 'SofiaProSemiBold',
              fontSize: normalize(17),
            }}
            loading={loading}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonAction: {
    width: appwidth,
    justifyContent: 'center',
    fontFamily: 'SofiaProRegular',
    borderRadius: 10,
  },
});

const mapStateToProps = createStructuredSelector({
  isLoading: selectIsLoading,
});

const mapDispatchToProps = (dispatch) => ({
  joinPractices: (practiceId) => dispatch(joinPractices(practiceId)),
  setPracticeId: (id) => dispatch(setPracticeId(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PracticeBox);
