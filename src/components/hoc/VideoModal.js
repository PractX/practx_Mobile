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
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
  const [resizeMode, setResizeMode] = useState(true);

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
    Orientation.lockToPortrait();
    // setIsVideoVisible(false);
    setIsFullScreen(false);
    setChatMediaPrev('');
    setIsVideoVisible(false);
    return false;
  }, [isFullScreen, navigation]);

  const handleOrientation = orientation => {
    console.log('Orientation: ', orientation);
    // orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
    //   ? (setIsFullScreen(true), StatusBar.setHidden(true))
    //   : (setIsFullScreen(false), StatusBar.setHidden(false));
  };

  const handleFullscreen = () => {
    isFullScreen
      ? Orientation.lockToPortrait()
      : Orientation.lockToLandscapeLeft();
  };

  useMemo(() => {
    Orientation.lockToLandscape();
    StatusBar.setHidden(true);
    Orientation.addOrientationListener(handleOrientation);
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      // setState({ play: true, showControls: false, sound: true });

      Orientation.removeOrientationListener(handleOrientation);
      Orientation.lockToPortrait();

      // BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, [handleBackButton]);

  console.log('Is Full screen', isFullScreen);

  return (
    <View
      style={{
        ...styles.container,
        // height: isFullScreen
        //   ? Dimensions.get('window').width
        //   : Dimensions.get('window').height,
        // width: isFullScreen
        //   ? Dimensions.get('window').height
        //   : Dimensions.get('window').width,
      }}>
      <Video
        onEnd={onEnd}
        onLoad={onLoad}
        onLoadStart={onLoadStart}
        onProgress={onProgress}
        paused={paused}
        ref={ref => (videoPlayer.current = ref)}
        // fullscreenAutorotate={true}
        fullscreenOrientation="landscape"
        // fullscreen={true}
        // controls={false}
        onTouchCancel={() => {
          Orientation.lockToPortrait();
          // setIsVideoVisible(false);
          // setIsFullScreen(false);
          setChatMediaPrev('');
          setIsVideoVisible(false);
        }}
        fullscreen={true}
        resizeMode={resizeMode ? 'contain' : 'cover'}
        source={{
          uri: chatMediaPrev,
        }}
        style={
          // isFullScreen
          //   ? [
          //       styles.fullMediaPlayer,
          //       {
          //         backgroundColor: colors.background,
          //       },
          //     ]
          //   :
          [
            styles.mediaPlayer,
            {
              backgroundColor: colors.background,
            },
          ]
        }
        repeat
        // style={styles.mediaPlayer}
        // volume={0.0}
      />
      {/* {!isFullScreen && ( */}
      <MediaControls
        isFullScreen={true}
        containerStyle={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          // height: '100%',
          // width: '100%',
        }}
        duration={duration}
        isLoading={isLoading}
        mainColor="orange"
        onFullScreen={() => {
          setResizeMode(!resizeMode);
          // isFullScreen
          //   ? Orientation.lockToPortrait()
          //   : Orientation.lockToLandscape();
          // setTimeout(() => {
          //   setIsFullScreen(!isFullScreen);
          // }, 2000);
          // handleOrientation();
        }}
        onPaused={onPaused}
        onReplay={onReplay}
        onSeek={onSeek}
        onSeeking={onSeeking}
        playerState={playerState}
        progress={currentTime}>
        <MediaControls.Toolbar>
          <TouchableOpacity
            style={styles.toolbar}
            onPress={() => {
              // isFullScreen ? setIsFullScreen(false) : setIsFullScreen(true);
              Orientation.lockToPortrait();
              setIsVideoVisible(false);
              StatusBar.setHidden(false);
              // if (isFullScreen) {
              //   Orientation.lockToPortrait();
              //   setIsVideoVisible(false);
              // } else {
              //   Orientation.lockToPortrait();
              //   setIsVideoVisible(false);
              // }
              //
            }}>
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
      {/* )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
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
    // display: 'none',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').height,
    // width: Dimensions.get('window').height,
    alignItems: 'center',
    alignSelf: 'center',
    // aspectRatio: 2,
    // backgroundColor: 'white',
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
