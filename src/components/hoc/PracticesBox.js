import React, { useEffect, useState, useContext } from 'react';
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
import { Button } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@react-navigation/native';
import normalize from '../../utils/normalize';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { joinPractices } from '../../redux/practices/practices.actions';
import { selectIsLoading } from '../../redux/practices/practices.selector';
import { createStructuredSelector } from 'reselect';

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
          // placeHolder={<ActivityIndicator />}
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
              {practice.specialty}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <Thumbnail
            source={{ uri: 'https://image.ibb.co/b4kxGw/zach_1.jpg' }}
            width={50}
            height={50}
            small
          />
          <Thumbnail
            source={{ uri: 'https://image.ibb.co/fQKPww/kennith_1.jpg' }}
            width={50}
            height={50}
            style={{ marginLeft: -16 }}
            small
          />
          <Thumbnail
            source={{ uri: 'https://image.ibb.co/j4Ov3b/darth_vader_1.png' }}
            width={50}
            height={50}
            style={{ marginLeft: -16 }}
            small
          />
          <Thumbnail
            source={{ uri: 'https://image.ibb.co/dM6hib/tara_1.jpg' }}
            width={50}
            height={50}
            style={{ marginLeft: -16 }}
            small
          />
          <Thumbnail
            source={{ uri: 'https://image.ibb.co/iasYpG/ash_1.jpg' }}
            width={50}
            height={50}
            style={{ marginLeft: -16 }}
            small
          />

          <Text
            style={{
              color: theme.text2,
              fontSize: 13,
              marginTop: 8,
              marginLeft: 10,
            }}>
            +20 Members
          </Text>
        </View>
        {/* <Button
          style={{

            width: '100%',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            borderRadius: 15,
            borderColor: theme.highlight,
            borderWidth: 1,
          }}
          disabled>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: theme.highlight }}>Pending</Text>
          </View>
        </Button> */}
        {pending.length > 0 ? (
          <Button
            title="Pending"
            onPress={() => joinPractice(practice.id)}
            type="outline"
            rounded
            buttonStyle={[styles.buttonAction, { borderColor: colors.primary }]}
            titleStyle={{
              fontFamily: 'SofiaProSemiBold',
              fontSize: normalize(16),
              color: colors.primary,
            }}
            loading={loading}
          />
        ) : member.length > 0 ? (
          <Button
            title="You are a member"
            onPress={() => console.log('go to patient')}
            rounded
            buttonStyle={[
              styles.buttonAction,
              { backgroundColor: colors.primary },
            ]}
            titleStyle={{
              fontFamily: 'SofiaProSemiBold',
              fontSize: normalize(16),
            }}
            loading={loading}
          />
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
      {/* <Button
        style={{

          width: '100%',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          borderRadius: 15,
          borderColor: 'green',
          borderWidth: 1,
        }}
        disabled>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ color: 'green' }}> You are a member </Text>
        </View>
      </Button> */}

      {/*       <Button
        style={{

          width: '100%',
          justifyContent: 'center',
          backgroundColor: 'green',
          borderRadius: 15,
          borderColor: colors.background_1,
          borderWidth: 1,
        }}
        onPress={() => joinPractice(practiceId, token, Id)}>
        <View style={{ flexDirection: 'row' }}>
          <Text> Join Practice </Text>
        </View>
      </Button> */}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(PracticeBox);
