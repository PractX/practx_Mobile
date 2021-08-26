import React, { useCallback, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { Dimensions } from 'react-native';
import { normalize } from 'react-native-elements';
import timeAgo from '../../utils/timeAgo';
import { usePubNub } from 'pubnub-react';
import { Day } from 'react-native-gifted-chat';
import moment from 'moment';
import { Icon } from 'react-native-elements';
import Video from 'react-native-video';
import { useRef } from 'react';
import AudioPlayer from '../../utils/audioPlayer';
import { TouchableOpacity } from 'react-native';
// import WaveForm from 'react-native-audiowaveform';
import Audio from 'react-native-video';
import ProgressBar from '../../utils/progressBar';
import { useState } from 'react';
import SoundPlayer from 'react-native-sound-player';
import { Player } from '@react-native-community/audio-toolkit';
import getMinutesFromSeconds from '../../utils/getMinutesFromSeconds';
import { ActivityIndicator } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const VoiceNoteRecorder = ({ position, voiceNoteUrl }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const { colors } = useTheme();

  const [play, setPlay] = useState(false);

  const [audioState, setAudioState] = useState({
    play: false,
    currentTime: 0,
    duration: 0,
    sound: true,
  });
  // console.log('Bubble ID', audioRef);

  // const fileUrl =
  //   message.messageType === 4 &&
  //   message.message.file.name.match(/.(m4a|mp3|aac|ogg|wav|webm)$/i)
  //     ? pubnub.getFileUrl({
  //         channel: message.channel,
  //         id: message.message.file.id,
  //         name: message.message.file.name,
  //       })
  //     : null;

  function handlePlayPause() {
    // If playing, pause and show controls immediately.
    if (play) {
      // setPlay(false);
      setAudioState({ ...audioState, play: false });
      return;
    }

    setAudioState({ ...audioState, play: true });
  }

  // function skipBackward() {
  //   audioRef.current.seek(audioState.currentTime - 15);
  //   setAudioState({ ...audioState, currentTime: state.currentTime - 15 });
  // }

  // function skipForward() {
  //   audioRef.current.seek(state.currentTime + 15);
  //   setAudioState({ ...state, currentTime: state.currentTime + 15 });
  // }

  function onSeek(data) {
    console.log('Hello', audioRef);
    audioRef.current.seek(data.seekTime);
    setAudioState({ ...audioState, currentTime: data.seekTime });
  }

  function onLoad(data) {
    setAudioState((s) => ({
      ...s,
      duration: data.duration,
      currentTime: data.currentTime,
      play: false,
    }));
  }

  function onProgress(data) {
    setAudioState((s) => ({
      ...s,
      currentTime: data.currentTime,
    }));
  }

  function onEnd(e) {
    console.log('Audio ended', e);
    setAudioState({ ...audioState, play: false, currentTime: 0 });
    setTimeout(() => {
      audioRef.current.seek(0);
    }, 500);
  }

  // console.log('Audio state', audioState);
  // console.log(
  //   'Minutes--->',
  //   getMinutesFromSeconds(audioState ? audioState.duration : 0),
  // );

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'blue',
        width: '100%',
        height: 55,
        paddingHorizontal: 10,
      }}>
      <Audio
        ref={audioRef}
        source={{
          uri: voiceNoteUrl,
        }}
        controls={false}
        audioOnly={true}
        repeat={false}
        // resizeMode="contain"
        onLoad={onLoad}
        onProgress={onProgress}
        onEnd={onEnd}
        paused={!audioState.play}
        onError={(error) => console.log('Audio Error---', error)}
        // muted={!sound}
      />
      {/* ANCHOR */}
      <View>
        {audioState.duration ? (
          <TouchableOpacity
            style={
              {
                // marginTop: 60,
                // // padding: 16,
                // backgroundColor: 'gray',
              }
            }
            onPress={() => {
              // setPlay(true);
              audioState.play
                ? setAudioState({ ...audioState, play: false })
                : setAudioState({ ...audioState, play: true });
              // setAudioState({ ...audioState, play: false });
            }}>
            <Icon
              name={audioState.play ? 'ios-pause' : 'ios-play'}
              type="ionicon"
              color={position === 'right' ? colors.white : colors.text}
              size={normalize(30)}
            />
          </TouchableOpacity>
        ) : (
          <ActivityIndicator
            animating={true}
            size={normalize(30)}
            color={position === 'right' ? colors.white : colors.text}
          />
        )}
      </View>
      <ProgressBar
        currentTime={audioState.currentTime}
        duration={audioState.duration}
        onSlideStart={handlePlayPause}
        onSlideComplete={handlePlayPause}
        onSlideCapture={onSeek}
        direction={position}
        // stylings={{ flex: 1 }}
      />
      <View>
        <Icon
          name="mic"
          type="ionicon"
          color={position === 'right' ? colors.white : colors.primary}
          size={normalize(15)}
        />
      </View>
    </View>
  );
};

export default VoiceNoteRecorder;
