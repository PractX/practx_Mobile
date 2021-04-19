import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
// import { SvgXml } from 'react-native-svg';
// import CryingLight from '../assets/svg/cryingLight.svg';
// import CryingDark from '../assets/svg/cryingDark.svg';
// import PadLockLight from '../assets/svg/padlock1.svg';
// import PadLockDark from '../assets/svg/padlock.svg';
// import LoginIcon from '../assets/svg/padlock.svg';
import { useTheme } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { normalize } from 'react-native-elements';

const Error = (props) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        alignItems: 'center',
        paddingBottom: 50,
      }}>
      {/* <SvgXml
        style={{ alignSelf: 'center', marginVertical: 20 }}
        width="100"
        height="100"
        xml={
          props.type === 'login'
            ? colors.mode === 'light'
              ? PadLockDark
              : PadLockLight
            : colors.mode === 'light'
            ? CryingDark
            : CryingLight
        }
      /> */}

      <Icon
        name={props.type === 'internet' ? 'wifi-off' : 'emoticon-cry-outline'}
        type={props.type === 'internet' ? 'feather' : 'material-community'}
        color={colors.text}
        size={normalize(50)}
        style={{ paddingHorizontal: 5 }}
      />
      <Text
        style={{
          fontSize: normalize(14),
          fontFamily: 'Comfortaa-Bold',
          color: colors.text,
          // fontWeight: 'bold',
          alignSelf: 'center',
          paddingVertical: 10,
        }}>
        {props.title}
      </Text>
      <Text
        style={{
          fontSize: normalize(13),
          color: colors.text,
          // fontWeight: 'bold',
          textAlign: 'center',
          alignSelf: 'center',
          marginHorizontal: 30,
          fontFamily: 'Comfortaa-Regular',
        }}>
        {props.subtitle}
      </Text>
      {props.action && (
        <TouchableOpacity
          onPress={props.action}
          style={{
            alignItems: 'center',
            backgroundColor: colors.primary,
            marginTop: 20,
            borderRadius: 10,
          }}>
          <Text
            style={{
              fontSize: normalize(13),
              color: 'white',
              paddingVertical: 6,
              paddingHorizontal: 15,
            }}>
            Try again
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Error;
