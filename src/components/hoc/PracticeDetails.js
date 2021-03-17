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
}) => {
  const { colors } = useTheme();
  const { show, data } = practiceData;
  // console.log(practiceData);
  // const pending = practice.requests;
  // const member = practice.patients.filter((val) => val.id === userId);
  // const [loading, setLoading] = useState(false);

  // const joinPractice = (practiceId) => {
  //   if (practiceId === practice.id) {
  //     setLoading(true);
  //   }
  //   joinPractices(practiceId);
  // };

  // useEffect(() => {
  //   !isLoading && setLoading(false);
  // }, [isLoading, practice]);

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
      <View
        style={{
          alignSelf: 'center',
          backgroundColor: colors.text_1,
          width: 20,
          height: 1,
          marginTop: 10,
        }}
      />

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
                fontSize: normalize(16),
                fontFamily: 'SofiaProSemiBold',
                textAlign: 'center',
                paddingTop: 10,
              }}>
              {data.practiceName}
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: normalize(13),
                fontFamily: 'SofiaProRegular',
                textAlign: 'center',
                paddingTop: 10,
              }}>
              {data.email}
            </Text>
          </View>
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
                }, 1000);
              }}>
              <Icon
                name="ios-chatbubble"
                type="ionicon"
                color={colors.text}
                size={normalize(23)}
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
                size={normalize(23)}
                style={{
                  color: colors.text,
                  // alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{ marginVertical: 10, backgroundColor: colors.background }}>
            <ListItem containerStyle={{ backgroundColor: colors.background }}>
              <Icon
                name="pencil"
                type="material-community"
                color={colors.text}
                size={normalize(23)}
              />
              <ListItem.Content>
                <ListItem.Title style={{ color: colors.text }}>
                  Description
                </ListItem.Title>
                <ListItem.Subtitle style={{ color: colors.text_1 }}>
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
                size={normalize(23)}
              />
              <ListItem.Content>
                <ListItem.Title style={{ color: colors.text }}>
                  Specialty
                </ListItem.Title>
                <ListItem.Subtitle style={{ color: colors.text_1 }}>
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
                size={normalize(23)}
              />
              <ListItem.Content>
                <ListItem.Title style={{ color: colors.text }}>
                  Phone
                </ListItem.Title>
                <ListItem.Subtitle style={{ color: colors.text_1 }}>
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
                size={normalize(23)}
              />
              <ListItem.Content>
                <ListItem.Title style={{ color: colors.text }}>
                  Location
                </ListItem.Title>
                <ListItem.Subtitle style={{ color: colors.text_1 }}>
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
                size={normalize(23)}
              />
              <ListItem.Content>
                <ListItem.Title style={{ color: colors.text }}>
                  Address
                </ListItem.Title>
                <ListItem.Subtitle style={{ color: colors.text_1 }}>
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
                size={normalize(23)}
              />
              <ListItem.Content>
                <ListItem.Title style={{ color: colors.text }}>
                  Website
                </ListItem.Title>
                <ListItem.Subtitle style={{ color: colors.text_1 }}>
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
    width: 50,
    height: 50,
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
