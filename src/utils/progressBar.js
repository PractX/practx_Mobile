import React from 'react';
// import Slider from '@react-native-community/slider';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { colors, Icon } from 'react-native-elements';
import getMinutesFromSeconds from './getMinutesFromSeconds';
import { Slider } from 'react-native-elements';

const ProgressBar = ({
  currentTime,
  duration,
  onSlideCapture,
  onSlideStart,
  onSlideComplete,
}) => {
  // const { colors } = useTheme();
  const position = getMinutesFromSeconds(currentTime);
  const fullDuration = getMinutesFromSeconds(duration, true);

  return (
    <View style={styles.wrapper}>
      <View style={styles.timeWrapper}>
        <Text style={[styles.timeLeft, { color: colors.white }]}>
          {position}
        </Text>
        <Text style={[styles.timeRight, { color: colors.white }]}>
          {fullDuration}
        </Text>
      </View>
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
        maximumValue={duration}
        step={1}
        onValueChange={handleOnSlide}
        onSlidingStart={onSlideStart}
        onSlidingComplete={onSlideComplete}
        allowTouchTrack={true}
        trackStyle={{ height: 5, backgroundColor: 'transparent' }}
        thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
        thumbProps={{
          children: (
            <Icon
              name="heartbeat"
              type="font-awesome"
              size={12}
              reverse
              containerStyle={{ bottom: 12, right: 12 }}
              color={colors.primary}
            />
          ),
        }}
      />
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
    // flex: 2,
    paddingHorizontal: 15,
    backgroundColor: 'purple',
  },
  timeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  timeLeft: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingLeft: 10,
  },
  timeRight: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'right',
    paddingRight: 10,
  },
});

export default ProgressBar;
