import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { DrawerActions, useTheme } from '@react-navigation/native';
import normalize from '../../utils/normalize';

const Header = ({ navigation, title }) => {
  const { colors } = useTheme();
  const screenWidth = Math.round(Dimensions.get('window').width);
  console.log(screenWidth, '&', screenWidth / 2);

  return (
    <View
      style={{
        height: 50,
        width: Math.round(Dimensions.get('window').width),
        borderBottomColor: colors.background_1,
        borderBottomWidth: 0.8,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          flexDirection: 'column',
          // marginTop: 20,
          // marginLeft: 20,
          // backgroundColor: 'green',
          marginHorizontal: 20,
          marginVertical: 15,
          width: 40,
          height: 30,
          alignItems: 'center',
        }}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <View
          style={{
            backgroundColor: colors.text,
            width: 23,
            height: 2,
            alignSelf: 'flex-start',
          }}
        />
        <View
          style={{
            backgroundColor: colors.primary,
            width: 11,
            height: 2,
            marginTop: 6,
            alignSelf: 'flex-start',
          }}
        />
      </TouchableOpacity>
      <Text
        style={{
          position: 'absolute',
          fontSize: normalize(17.5),
          fontFamily: 'SofiaProSemiBold',
          color: colors.text,
          left: Math.round(Dimensions.get('window').width) / 2.5,
          // right: Math.round(Dimensions.get('window').width) / 3,
          //           xCenter: Dimensions.get('window').width / 2,
          // yCenter: Dimensions.get('window').height / 2,
          // position: 'absolute',
        }}>
        {title}
      </Text>
    </View>
  );
};

export default Header;
