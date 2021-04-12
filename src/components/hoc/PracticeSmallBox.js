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
import { Button, Icon, normalize as norm } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@react-navigation/native';
import normalize from '../../utils/normalize';

import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import {
  joinPractices,
  setPracticeId,
} from '../../redux/practices/practices.actions';
import {
  selectIsLoading,
  selectJoinedPractices,
} from '../../redux/practices/practices.selector';
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

const PracticeSmallBox = ({
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
  joinedPractices,
  sortType,
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
      onPress={async () => {
        if (practiceData.show) {
          setPracticeData({ show: true, data: null });
        } else {
          setPracticeData({
            show: true,
            data: practice,
            type:
              member && member.length
                ? 'member'
                : pending && pending.length
                ? 'pending'
                : 'none-member',
          });
        }
      }}
      style={{
        // borderWidth: 0.9,
        // borderColor: colors.background_1,
        // borderRadius: 30,
        width: 80,
        marginTop: 15,
        marginBottom: 15,
        marginRight: 20,
      }}>
      <View
        style={{
          flexDirection: 'row',
          borderWidth: 0.9,
          borderColor: colors.background_1,
          borderRadius: 15,
        }}>
        <FastImage
          source={{ uri: practice.logo }}
          style={{
            width: 85,
            height: 85,
            borderRadius: 15,
            backgroundColor: colors.background_1,
            justifyContent: 'flex-end',
            // marginRight: 15,
          }}
          resizeMode={FastImage.resizeMode.contain}>
          {(member && member.length > 0) || (pending && pending.length > 0) ? (
            <Icon
              name={member.length ? 'check' : 'clock'}
              type={member.length ? 'feather' : 'feather'}
              color={'white'}
              size={member.length ? normalize(10) : normalize(9)}
              style={{
                backgroundColor: member.length
                  ? colors.tertiary
                  : '#000000' + 98,
                width: 17,
                height: 17,
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
      </View>
      <View style={{ justifyContent: 'center' }}>
        <Text
          style={{
            fontSize: norm(10),
            fontFamily: 'SofiaProSemiBold',
            color: colors.text,
          }}>
          {practice.practiceName && practice.practiceName.length > 14
            ? practice.practiceName.substring(0, 14 - 3) + '...'
            : practice.practiceName}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'center',
          }}>
          <Icon
            name="medical-bag"
            type="material-community"
            color={colors.text}
            size={normalize(9)}
          />
          <Text
            style={{
              color: colors.text_2,
              fontSize: normalize(10),
              fontFamily: 'SofiaProRegular',
              textTransform: 'capitalize',
              marginLeft: 3,
            }}>
            {practice.specialty && practice.specialty.length > 15
              ? practice.specialty.substring(0, 15 - 3) + '...'
              : practice.specialty}
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
  joinedPractices: selectJoinedPractices,
});

const mapDispatchToProps = (dispatch) => ({
  joinPractices: (practiceId) => dispatch(joinPractices(practiceId)),
  setPracticeId: (id) => dispatch(setPracticeId(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PracticeSmallBox);
