import React, { useEffect } from 'react';
import { View, Text, Dimensions, Button, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Modal from 'react-native-modal';
import normalize from '../../../utils/normalize';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import { StatusBar } from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : require('react-native-extra-dimensions-android').get(
        'REAL_WINDOW_HEIGHT',
      );

const MediaPicker = ({
  showMediaPick,
  setShowMediaPick,
  practice,
  group,
  mediaFile,
  setMediaFile,
  sendFile,
}) => {
  const { colors } = useTheme();
  useEffect(() => {
    if (showMediaPick) {
      StatusBar.setHidden(true);
    } else {
      StatusBar.setHidden(false);
    }
  }, [showMediaPick]);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      hasBackdrop={true}
      backdropColor="black"
      backdropOpacity={0.9}
      coverScreen={true}
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      visible={showMediaPick}
      onBackButtonPress={() => setShowMediaPick(false)}
      style={{
        margin: 0,
        alignItems: 'center',
        backgroundColor: '#000000cb',
        height: Dimensions.get('window').height,
        // opacity: 0.8,
      }}
      // onBackButtonPress={() => {
      //   setLoggingIn(false);
      //   setLogInPop(false);
      //   setModalVisible(false);
      // }}
      // customBackdrop={<View style={{ flex: 1, backgroundColor: 'red' }} />}
    >
      <FastImage
        source={{
          uri: mediaFile
            ? mediaFile.uri
            : 'https://www.ischool.berkeley.edu/sites/default/files/default_images/avatar.jpeg',
        }}
        style={{
          // position: 'absolute',
          justifyContent: 'space-between',
          backgroundColor: 'black',
          borderColor: colors.background_1 + 25,
          borderWidth: 3,
          height: Dimensions.get('window').height,
          width: Dimensions.get('window').width,
          paddingVertical: 15,
          paddingHorizontal: 10,
          // alignItems: 'center',
          borderRadius: 10,
        }}
        resizeMode={FastImage.resizeMode.center}
        // placeHolder={<ActivityIndicator />}
      >
        <View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            alignSelf: 'center',
            width: Dimensions.get('window').width / 1.2,
            height: 70,
            top: 25,
            left: 10,
            // backgroundColor: 'red',
          }}>
          <TouchableOpacity
            style={{
              width: 40,
              // height: 50,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 5,
            }}
            onPress={() => setShowMediaPick(false)}>
            <Icon
              name="arrow-back"
              type="material-icons"
              color={colors.text}
              size={normalize(23)}
              style={{
                color: colors.text,
                // alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 40,
              // height: 30,
              marginLeft: 10,
              alignItems: 'center',
            }}
            // onPress={() => navigation.goBack()}
          >
            <FastImage
              source={{
                uri: practice
                  ? practice.logo ||
                    'https://www.ischool.berkeley.edu/sites/default/files/default_images/avatar.jpeg'
                  : group &&
                    'https://cdn.raceroster.com/assets/images/team-placeholder.png',
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 200,
                backgroundColor: colors.background_1,
                // alignSelf: 'center',
              }}
              resizeMode={FastImage.resizeMode.cover}
              // placeHolder={<ActivityIndicator />}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 50,
            right: 20,
            width: 60,
            height: 60,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 5,
            backgroundColor: colors.primary,
            borderRadius: 50,
          }}
          onPress={() => {
            sendFile(mediaFile);
            setShowMediaPick(false);
          }}>
          <Icon
            name="send"
            type="material-icons"
            color={colors.text}
            size={normalize(23)}
            style={{
              color: colors.text,
              // alignSelf: 'center',
            }}
          />
        </TouchableOpacity>
        {/* <Button
          title="Close"
          titleStyle={{
            fontSize: normalize(14),
            fontFamily: 'Comfortaa-Bold',
          }}
          // onPress={() => setShowStaffs(false)}
          buttonStyle={{
            width: 75,
            height: 30,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            alignSelf: 'center',
            borderRadius: 10,
          }}
          // loading={loggingIn}
        /> */}
      </FastImage>
    </Modal>
  );
};

export default MediaPicker;
