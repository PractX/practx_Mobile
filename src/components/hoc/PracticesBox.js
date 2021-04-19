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
import { TouchableOpacity } from 'react-native';
import SinglePractice from '../../screens/main/practx/SinglePractice';

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
  userId,
  isLoading,
  navigation,
  searchData,
  practiceData,
  setPracticeData,
}) => {
  const { colors } = useTheme();
  const pending = practice.requests;
  const member = practice.patients.filter((val) => val.id === userId);
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
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('SinglePractice', {
          navigation,
          practice,
          userId,
          searchData,
        })
      }
      style={{
        marginTop: 15,
        marginBottom: 10,
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 10,
      }}>
      <FastImage
        source={{ uri: practice.logo }}
        style={{
          width: 60,
          height: 60,
          borderRadius: 15,
          backgroundColor: colors.background_1,
          marginRight: 15,
          justifyContent: 'flex-end',
          // marginRight: 15,
        }}
        resizeMode={FastImage.resizeMode.contain}>
        {(member && member.length > 0) || (pending && pending.length > 0) ? (
          <Icon
            name={member.length ? 'check' : 'clock'}
            type={member.length ? 'feather' : 'feather'}
            color={'white'}
            size={member.length ? normalize(9) : normalize(7)}
            style={{
              backgroundColor: member.length ? colors.tertiary : '#000000' + 98,
              width: 14,
              height: 14,
              color: 'white',
              alignSelf: 'flex-end',
              justifyContent: 'center',
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
            }}
          />
        ) : null}
      </FastImage>

      <View style={{ justifyContent: 'space-around' }}>
        <Text
          style={{
            fontSize: normalize(13),
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
          {/* <Text
            style={{
              color: colors.text_2,
              fontSize: normalize(12),
              fontFamily: 'SofiaProSemiBold',
            }}>
            Specialty:{'  '}
          </Text> */}
          <Text
            style={{
              color: colors.text_2,
              fontSize: normalize(11),
              fontFamily: 'SofiaProRegular',
              textTransform: 'capitalize',
            }}>
            {practice.specialty && practice.specialty.length > 32
              ? practice.specialty.substring(0, 32 - 3) + '...'
              : practice.specialty}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Icon
            name="location-city"
            type="material-icons"
            color={colors.text}
            size={normalize(13)}
            style={{
              color: colors.text,
              // alignSelf: 'center',
            }}
          />
          <Text
            style={{
              fontSize: normalize(10),
              fontFamily: 'SofiaProRegular',
              color: colors.text,
              paddingLeft: 5,
            }}>
            {practice.state
              ? practice.state.length > 28
                ? practice.state.substring(0, 38 - 3) + '...'
                : practice.state
              : 'No location'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
