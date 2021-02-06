import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import normalize from '../../../utils/normalize';
import StaffList from './StaffList';

const PracticesBox = ({ id, practice, showStaffs, setShowStaffs }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => setShowStaffs(true)}
      key={id}
      style={{
        marginLeft: 10,
        flexDirection: 'column',
        alignSelf: 'center',
        alignItems: 'center',
        // borderBottomWidth: 0.8,
        // borderBottomColor: colors.background_1,
      }}>
      <FastImage
        source={{
          uri:
            (practice && practice.logo) ||
            'https://www.ischool.berkeley.edu/sites/default/files/default_images/avatar.jpeg',
        }}
        style={{
          width: 55,
          height: 60,
          borderRadius: 15,
          backgroundColor: colors.background_1,
          marginVertical: 5,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
      <Text
        style={{
          color: colors.text,
          fontSize: normalize(12),
          fontFamily: 'SofiaProSemiBold',
        }}>
        {}
        {practice && practice.practiceName.length > 11
          ? practice.practiceName.substring(0, 11 - 3) + '...'
          : practice.practiceName}
      </Text>
    </TouchableOpacity>
  );
};

export default PracticesBox;
