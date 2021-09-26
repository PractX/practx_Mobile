import React, { useEffect, useState, useContext, useRef } from 'react';
import * as Animatable from 'react-native-animatable';

import { Text, Thumbnail } from 'native-base';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Button, Icon, ListItem } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@react-navigation/native';
import { normalize } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import BottomSheet from 'reanimated-bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';

const Stack = createStackNavigator();

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.8;

const theme = {
  /* ---- THeme to be gotten from redux or context------*/
  background: '#1e1f36',
  highlight: '#ff0000',
  text: '#fff',
  text2: '#aaa',
  text3: '#555',
};

const AppointmentBooking = ({
  bottomSheetRef,
  isLoading,
  navigation,
  setPracticeId,
  practiceData,
  setPracticeData,
  joinPractices,
  leavePracticeStart,
}) => {
  const { colors } = useTheme();
  // const { show, data, type } = practiceData;
  console.log(practiceData);
  // const pending = practice.requests;
  // const member = practice.patients.filter((val) => val.id === userId);
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const date18 = new Date(today.setFullYear(today.getFullYear() - 16));
  const [date, setDate] = useState(date18);
  const [dateValue, setDateValue] = useState();
  const [selectedDate, setSelectedDate] = useState('');

  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  console.log('Selected date', selectedDate);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    console.log(
      'Data ---->',
      currentDate.toISOString().slice(0, 10).replace(/-/g, '-'),
    );
    setDateValue(currentDate.toISOString().slice(0, 10).replace(/-/g, '-'));
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('datetime');
  };

  const joinPractice = (practiceId) => {
    setLoading(true);
    joinPractices(practiceId);
  };

  useEffect(() => {
    !isLoading && setLoading(false);
  }, [isLoading]);

  return (
    <View
      style={{
        backgroundColor: colors.background,
        minHeight: 660,
        marginBottom: 70,
      }}>
      {/* <Icon
        onPress={() => console.log('hello')}
        name={'ios-remove-outline'}
        type={'ionicon'}
        color={colors.text_1}
        size={normalize(18)}
        style={[{ alignSelf: 'center' }]}
      /> */}
      <TouchableOpacity
        style={{
          justifyContent: 'center',
        }}
        onPress={() => {
          console.log(bottomSheetRef.current);
          bottomSheetRef.current.snapTo(1);
        }}>
        <Icon
          name="linear-scale"
          type="marterialIcon"
          color={colors.text}
          size={normalize(20)}
          style={{
            marginRight: 0,
            // alignSelf: 'center',
          }}
        />
      </TouchableOpacity>

      <DatePicker
        options={{
          backgroundColor: colors.background,
          textHeaderColor: colors.primary_light1,
          // textDefaultColor: colors.white,
          selectedTextColor: '#fff',
          mainColor: colors.primary,
          textSecondaryColor: colors.text,
          borderColor: 'rgba(122, 146, 165, 0.1)',
          textFontSize: normalize(11),
          defaultFont: 'SofiaProRegular',
          textHeaderFontSize: normalize(13),
        }}
        onSelectedChange={(date) => setSelectedDate(date)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonAction: {
    width: 43,
    height: 43,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
});

// const mapStateToProps = createStructuredSelector({
//   isLoading: selectIsLoading,
// });

// const mapDispatchToProps = (dispatch) => ({
//   joinPractices: (practiceId) => dispatch(joinPractices(practiceId)),
//   setPracticeId: (id) => dispatch(setPracticeId(id)),
//   leavePracticeStart: (id) => dispatch(leavePracticeStart(id)),
// });

// export default connect(mapStateToProps)(AppointmentBooking);
export default AppointmentBooking;
