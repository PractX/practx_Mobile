import React, { useState, Component } from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {
  Player,
  Recorder,
  MediaStates,
} from '@react-native-community/audio-toolkit';
import { useEffect } from 'react';

// type Props = {};

// type State = {
//   playPauseButton: string,
//   recordButton: string,

//   stopButtonDisabled: boolean,
//   playButtonDisabled: boolean,
//   recordButtonDisabled: boolean,

//   loopButtonStatus: boolean,
//   progress: number,

//   error: string | null,
// };

const AudioPlayer = ({ fileUrl }) => {
  const fileName = 'test.mp4';
  const player = new Player(fileUrl);
  const recorder = new Recorder(fileName, {
    bitrate: 256000,
    channels: 2,
    sampleRate: 44100,
    quality: 'max',
  });
  const [lastSeek, setLastSeek] = useState(0);
  // player: Player | null;
  // recorder: Recorder | null;
  // lastSeek: number;
  // _progressInterval: IntervalID;

  const [state, setState] = useState({
    playPauseButton: 'Preparing...',
    recordButton: 'Preparing...',

    stopButtonDisabled: true,
    playButtonDisabled: true,
    recordButtonDisabled: true,

    loopButtonStatus: false,
    progress: 0,

    error: null,
    // my data
    duration: 0,
  });

  useEffect(() => {
    _reloadPlayer(fileUrl);
    // _reloadRecorder();
    console.log('Last seek');
  }, []);

  useEffect(() => {
    let _progressInterval;
    // if (player && Date.now() - lastSeek > 200) {
    // _progressInterval = setInterval(() => {
    console.log('Last seeks', player.isPlaying);
    // let currentProgress = Math.max(0, player.currentTime) / player.duration;
    // if (isNaN(currentProgress)) {
    //   currentProgress = 0;
    // }
    player &&
      player.isPlaying &&
      setState({ ...state, duration: player.duration });
    // }, 100);
    // }

    // return () => {
    //   clearInterval(_progressInterval);
    // };
  }, [player.isPlaying]);

  // function _shouldUpdateProgressBar() {
  //   // Debounce progress bar update by 200 ms
  //   return ;
  // }

  function _updateState(err) {
    setState({
      playPauseButton: player && player.isPlaying ? 'Pause' : 'Play',
      recordButton: recorder && recorder.isRecording ? 'Stop' : 'Record',

      stopButtonDisabled: !player || !player.canStop,
      playButtonDisabled: !player || !player.canPlay || recorder.isRecording,
      recordButtonDisabled: !recorder || (player && !player.isStopped),
    });
  }

  function _playPause() {
    player.playPause((err, paused) => {
      if (err) {
        setState({
          error: err.message,
        });
      }
      _updateState();
    });
  }

  function _stop() {
    player.stop(() => {
      _updateState();
    });
  }

  function _seek(percentage) {
    if (!player) {
      return;
    }

    setLastSeek(Date.now());

    let position = percentage * player.duration;

    player.seek(position, () => {
      _updateState();
    });
  }

  function _reloadPlayer(fileUrl) {
    if (player) {
      player.destroy();
    }
    console.log('FileLink', fileUrl);
    player.prepare((err) => {
      console.log('Player Test0', player);
      if (err) {
        console.log('error at _reloadPlayer():');
        console.log(err);
      } else {
        // player.looping = state.loopButtonStatus;
      }

      _updateState();
    });

    _updateState();

    setState({ ...state, duration: player.duration });

    player.on('ended', () => {
      _updateState();
    });
    player.on('pause', () => {
      _updateState();
    });
  }

  function _reloadRecorder() {
    if (recorder) {
      recorder.destroy();
    }

    _updateState();
  }

  function _toggleRecord() {
    if (player) {
      player.destroy();
    }

    let recordAudioRequest;
    if (Platform.OS == 'android') {
      recordAudioRequest = _requestRecordAudioPermission();
    } else {
      recordAudioRequest = new Promise(function (resolve, reject) {
        resolve(true);
      });
    }

    recordAudioRequest.then((hasPermission) => {
      if (!hasPermission) {
        setState({
          error: 'Record Audio Permission was denied',
        });
        return;
      }

      recorder.toggleRecord((err, stopped) => {
        if (err) {
          setState({
            error: err.message,
          });
        }
        if (stopped) {
          _reloadPlayer();
          _reloadRecorder();
        }

        _updateState();
      });
    });
  }

  async function _requestRecordAudioPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message:
            'ExampleApp needs access to your microphone to test react-native-audio-toolkit.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  function _toggleLooping(value) {
    setState({
      loopButtonStatus: value,
    });
    if (player) {
      player.looping = value;
    }
  }

  console.log(state.playPauseButton);
  console.log('Duration---', player && player.duration, '---', player);

  return (
    <SafeAreaView>
      <View>
        <Text style={styles.title}>Playback</Text>
      </View>
      <View>
        <Button
          title={'Play'}
          disabled={state.playButtonDisabled}
          onPress={() => _playPause()}
        />
        <Button
          title={'Stop'}
          disabled={state.stopButtonDisabled}
          onPress={() => _stop()}
        />
      </View>
      <View style={styles.settingsContainer}>
        <Switch
          onValueChange={(value) => _toggleLooping(value)}
          value={state.loopButtonStatus}
        />
        <Text>Toggle Looping</Text>
      </View>
      <View style={styles.slider}>
        <Slider
          step={0.0001}
          disabled={state.playButtonDisabled}
          onValueChange={(percentage) => _seek(percentage)}
          value={state.progress}
        />
      </View>
      {/* <View>
          <Text style={styles.title}>Recording</Text>
        </View>
        <View>
          <Button
            title={state.recordButton}
            disabled={state.recordButtonDisabled}
            onPress={() => _toggleRecord()}
          />
        </View> */}
      <View>
        <Text style={styles.errorMessage}>{state.error}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  slider: {
    height: 10,
    margin: 10,
    marginBottom: 50,
  },
  settingsContainer: {
    alignItems: 'center',
  },
  container: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
  errorMessage: {
    fontSize: 15,
    textAlign: 'center',
    padding: 10,
    color: 'red',
  },
});

export default AudioPlayer;
