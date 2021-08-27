import React from 'react';
// import Slider from '@react-native-community/slider';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Icon, normalize } from 'react-native-elements';
import getMinutesFromSeconds from './getMinutesFromSeconds';
import { Slider } from 'react-native-elements';

const ProgressBar = ({
  currentTime,
  duration,
  onSlideCapture,
  onSlideStart,
  onSlideComplete,
  stylings,
  direction,
}) => {
  const { colors } = useTheme();
  const position = getMinutesFromSeconds(currentTime);
  const fullDuration = getMinutesFromSeconds(duration, true);

  return (
    <View style={{ ...styles.wrapper, ...stylings }}>
      {/* <Slider
        value={currentTime}
        minimumValue={0}
        maximumValue={duration}
        step={1}
        onValueChange={handleOnSlide}
        onSlidingStart={onSlideStart}
        onSlidingComplete={onSlideComplete}
        minimumTrackTintColor={colors.white}
        maximumTrackTintColor={colors.tertiary}
        thumbTintColor={colors.tertiary}
      /> */}
      <Slider
        value={currentTime}
        minimumValue={0}
        maximumValue={duration >= 0 ? duration : 0}
        step={1}
        onValueChange={handleOnSlide}
        onSlidingStart={onSlideStart}
        onSlidingComplete={onSlideComplete}
        allowTouchTrack={true}
        trackStyle={{
          height: 3,
          backgroundColor: 'transparent',
        }}
        style={{ width: '100%', flex: 1 }}
        thumbStyle={{ height: 17, width: 14, backgroundColor: 'transparent' }}
        thumbProps={{
          children: (
            <Icon
              name="heartbeat"
              type="font-awesome"
              size={5}
              reverse={direction === 'left'}
              raised={direction === 'right'}
              containerStyle={{ bottom: 6, right: 8 }}
              color={colors.primary}
              backgroundColor
            />
          ),
        }}
        minimumTrackTintColor={
          direction === 'right' ? colors.text : colors.primary
        }
        maximumTrackTintColor={
          direction === 'right' ? colors.track : colors.track2
        }
      />
      <View style={styles.timeWrapper}>
        <Text
          style={[
            styles.timeText,
            { color: direction === 'right' ? colors.white : colors.text },
          ]}>
          {position !== '0:00' ? position : duration ? fullDuration : '0:00'}
        </Text>
        {/* <Text style={[styles.timeRight, { color: colors.white }]}>
          {fullDuration}
        </Text> */}
      </View>
    </View>
  );

  // function msToTime(time) {
  //   // Pad to 2 or 3 digits, default is 2
  //   function pad(n, z) {
  //     z = z || 2;
  //     return ('00' + n).slice(-z);
  //   }

  //   var ms = time % 1000;
  //   time = (time - ms) / 1000;
  //   var secs = time % 60;
  //   time = (time - secs) / 60;
  //   var mins = time % 60;
  //   var hrs = (time - mins) / 60;

  //   if (hrs >= 1) {
  //     return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
  //   } else {
  //     return pad(mins) + ':' + pad(secs);
  //   }
  //   // + '.' + pad(ms, 3);
  // }

  function handleOnSlide(time) {
    onSlideCapture({ seekTime: time });
  }
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 2,
    flexDirection: 'row',
    paddingHorizontal: 6,
  },
  timeWrapper: {
    flex: 0.25,
    // flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    paddingLeft: 5,
  },
  timeText: {
    // flex: 1,
    fontSize: normalize(10),
    color: '#FFFFFF',
    textAlign: 'center',
  },
  timeRight: {
    // flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'right',
    paddingRight: 10,
  },
});

export default ProgressBar;
