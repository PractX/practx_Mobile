// @ts-check
// /** @type {import("./react-native-media-controls/index")} */

import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  BackHandler,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
import { Icon, normalize } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';

const noop = () => {};

const VideoModal = ({
  navigation,
  chatMediaPrev,
  setIsVideoVisible,
  setChatMediaPrev,
}) => {
  const { colors } = useTheme();
  const videoPlayer = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);

  const onSeek = seek => {
    videoPlayer?.current.seek(seek);
  };

  const onPaused = playerState => {
    setPaused(!paused);
    setPlayerState(playerState);
  };

  const onReplay = () => {
    setPlayerState(PLAYER_STATES.PLAYING);
    videoPlayer?.current.seek(0);
  };

  const onProgress = data => {
    // Video Player will continue progress even if the video already ended
    if (!isLoading) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = data => {
    setDuration(data.duration);
    setIsLoading(false);
  };

  const onLoadStart = () => setIsLoading(true);

  const onEnd = () => {
    // Uncomment this line if you choose repeat=false in the video player
    // setPlayerState(PLAYER_STATES.ENDED);
  };

  const onSeeking = currentTime => setCurrentTime(currentTime);

  const handleBackButton = useCallback(() => {
    if (isFullScreen) {
      Orientation.lockToPortrait();
      return true;
    } else {
      navigation.goBack();
      return false;
    }
  }, [isFullScreen, navigation]);

  const handleOrientation = orientation => {
    console.log('Orientation: ', orientation);
    orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
      ? (setIsFullScreen(true), StatusBar.setHidden(true))
      : (setIsFullScreen(false), StatusBar.setHidden(false));
  };

  const handleFullscreen = () => {
    isFullScreen ? Orientation.lockToPortrait() : Orientation.lockToLandscape();
  };

  useMemo(() => {
    Orientation.addOrientationListener(handleOrientation);
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      // setState({ play: true, showControls: false, sound: true });
      Orientation.removeOrientationListener(handleOrientation);
      // BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, [handleBackButton]);

  console.log('Is Full screen', isFullScreen);

  return (
    <View style={styles.container}>
      <Video
        onEnd={onEnd}
        onLoad={onLoad}
        onLoadStart={onLoadStart}
        onProgress={onProgress}
        paused={paused}
        ref={ref => (videoPlayer.current = ref)}
        fullscreenAutorotate={true}
        fullscreenOrientation="all"
        // fullscreen={true}
        // controls={false}
        onTouchCancel={() => {
          Orientation.lockToPortrait();
          // setIsVideoVisible(false);
          setIsFullScreen(false);
          setChatMediaPrev('');
          setIsVideoVisible(false);
        }}
        fullscreen={isFullScreen ? true : false}
        resizeMode="cover"
        source={{
          uri: chatMediaPrev,
        }}
        style={
          isFullScreen
            ? [
                styles.fullMediaPlayer,
                {
                  backgroundColor: colors.background,
                },
              ]
            : [
                styles.mediaPlayer,
                {
                  backgroundColor: colors.background,
                },
              ]
        }
        repeat
        // style={styles.mediaPlayer}
        volume={0.0}
      />
      {!isFullScreen && (
        <MediaControls
          isFullScreen={isFullScreen}
          containerStyle={{}}
          duration={duration}
          isLoading={isLoading}
          mainColor="orange"
          onFullScreen={() => handleFullscreen()}
          onPaused={onPaused}
          onReplay={onReplay}
          onSeek={onSeek}
          onSeeking={onSeeking}
          playerState={playerState}
          progress={currentTime}>
          <MediaControls.Toolbar>
            <TouchableOpacity
              style={styles.toolbar}
              onPress={() => setIsVideoVisible(false)}>
              <Icon
                name={'x'}
                type={'feather'}
                color={colors.text}
                size={normalize(28)}
                style={{
                  color: colors.text,
                  // alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
          </MediaControls.Toolbar>
        </MediaControls>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    zIndex: 10000,
    flex: 1,
  },
  toolbar: {
    position: 'absolute',
    marginTop: 20,
    marginRight: -10,
    right: 0,
    // backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  fullMediaPlayer: {
    display: 'none',
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
  },
});

export default VideoModal;
