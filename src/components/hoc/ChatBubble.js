import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { Dimensions } from 'react-native';
import normalize from '../../utils/normalize';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const ChatBubble = ({ practice }) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        width: appwidth,
        alignSelf: 'center',
        marginVertical: 20,
      }}>
      <FastImage
        source={{
          uri:
            (practice && practice.logo) ||
            'https://www.ischool.berkeley.edu/sites/default/files/default_images/avatar.jpeg',
        }}
        style={[
          {
            width: 35,
            height: 35,
            borderRadius: 15,
            backgroundColor: colors.background_1,
            marginVertical: 5,
            justifyContent: 'flex-end',
            alignSelf: 'flex-end',
            marginBottom: 17,
          },
        ]}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View
        style={{
          flexDirection: 'column',
          width: appwidth - 80,
          marginLeft: 15,
        }}>
        <View
          style={{
            // minHeight: 50,
            backgroundColor: colors.background_1,
            alignItems: 'center',
            justifyContent: 'center',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            padding: 15,
          }}>
          <Text
            style={{
              fontSize: normalize(14),
              fontFamily: 'SofiaProRegular',
              color: colors.text,
            }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
            debitis iste fugiat recusandae illo exercitationem dignissimos iure
            ab suscipit, doloremque, distinctio at optio velit atque? Sed
            consequatur libero facilis fugit?
          </Text>
        </View>
        <Text
          style={{
            fontSize: normalize(12),
            fontFamily: 'SofiaProRegular',
            color: colors.text,
          }}>
          Message seen 1:22pm
        </Text>
      </View>
    </View>
  );
};

export default ChatBubble;
