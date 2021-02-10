import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { setPracticeId } from '../../../redux/practices/practices.actions';
import normalize from '../../../utils/normalize';
import StaffList from './StaffList';

const PracticesBox = ({
  id,
  navigation,
  practice,
  chatWithPracticeStart,
  currentPracticeId,
  getPracticesDmsStart,
  setPracticeId,
  practiceDms,
}) => {
  const { colors } = useTheme();
  // console.log(practice);
  return (
    <TouchableOpacity
      onPress={async () => {
        await chatWithPracticeStart(practice.id);
        await getPracticesDmsStart();
        // await navigation.navigate('ChatScreen', {
        //   practice,
        //   practiceDms,
        // });
        await setPracticeId(practice.id);
      }}
      key={id}
      style={{
        marginLeft: 10,
        flexDirection: 'column',
        alignSelf: 'center',
        alignItems: 'center',
        // height: 90,
        // width: 80,
      }}>
      <View>
        <FastImage
          source={{
            uri:
              (practice && practice.logo) ||
              'https://www.ischool.berkeley.edu/sites/default/files/default_images/avatar.jpeg',
          }}
          style={[
            {
              width: 55,
              height: 60,
              borderRadius: 15,
              backgroundColor: colors.background_1,
              marginVertical: 5,
              justifyContent: 'flex-end',
            },
            currentPracticeId === practice.id && {
              borderWidth: 2,
              borderColor: colors.primary,
            },
          ]}
          resizeMode={FastImage.resizeMode.cover}>
          {/* {currentPracticeId === practice.id && <Icon
            name={'primitive-dot'}
            type={'octicon'}
            color={colors.text}
            size={normalize(13)}
            style={[
              {
                right: 5,
                alignSelf: 'flex-end',
              },
            ]}
          />} */}
        </FastImage>
      </View>
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
const mapDispatchToProps = (dispatch) => ({
  // getPracticesAllStart: () => dispatch(getPracticesAllStart()),
  setPracticeId: (data) => dispatch(setPracticeId(data)),
});

export default connect(null, mapDispatchToProps)(PracticesBox);
