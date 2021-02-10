import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Dimensions,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Text, Content } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '../../../components/hoc/Header';
import { DrawerActions, useRoute, useTheme } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectCurrentUser,
  selectIsLoading,
} from '../../../redux/user/user.selector';
import normalize from '../../../utils/normalize';
import { ListItem, Icon, Button } from 'react-native-elements';
import { ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import InputBox from '../../../components/hoc/InputBox';
import SmallInputBox from '../../../components/hoc/SmallInputBox';
import { editProfile } from '../../../redux/user/user.actions';
import { Platform } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import ChatBubble from '../../../components/hoc/ChatBubble';
import { usePubNub } from 'pubnub-react';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const ChatScreen = ({
  navigation,
  route,
  currentUser,
  extraData,
  editProfile,
  isLoading,
}) => {
  const { colors } = useTheme();
  const inputRef = useRef();
  const { params } = useRoute();
  const { practice, practiceDms } = params;
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [style1, setStyle1] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [imageUri, setImageUri] = useState();

  const pubnub = usePubNub();
  console.log(practice);
  const saveChanges = () => {
    // console.log(imageUri);
    // console.log(inputRef.current.values);
    let newData = {
      ...inputRef.current.values,
      dob: `${inputRef.current.values.MM}/${inputRef.current.values.DD}/${inputRef.current.values.YY}`,
      avatar: imageUri,
    };
    delete newData.DD;
    delete newData.MM;
    delete newData.YY;
    // console.log(newData);
    editProfile(newData);
  };
  const sendMessage = (values) => {
    // console.log(values);
    pubnub.publish(
      {
        message: values.message,
        channel: practiceDms.channelName,
      },
      (status, response) => {
        // handle status, response
        console.log(status);
        console.log(response);
      },
    );
  };

  useEffect(() => {
    console.log(inputRef);
    console.log('ALLLL PROPSSS _____ ', practice);
    extraData.setOptions({
      drawerLockMode: 'locked-closed',
      swipeEnabled: false,
    });

    return () =>
      extraData.setOptions({
        drawerLockMode: 'locked-closed',
        swipeEnabled: true,
      });
  }, [extraData]);

  return (
    <View
      style={[
        style1 === 'open' && {
          borderWidth: 18,
          // borderColor: colors.background_1,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: colors.background_1,
          borderRightColor: 'transparent',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          // borderRadius: 240,
          // position: 'fixed',
          // bottom: 0,
          borderTopLeftRadius: 110,
          borderBottomLeftRadius: 110,
        },
      ]}>
      <Header
        navigation={navigation}
        // title="Edit Profile"
        backArrow={true}
        headerWithImage={{ chatUser: currentUser, status: 'Active Now' }}
        iconRight1={{
          name: 'save-outline',
          type: 'ionicon',
          onPress: saveChanges,
          buttonType: 'save',
        }}
        practice={practice}
        // isLoading={isLoading}
      />
      <KeyboardAwareScrollView
        behavior="height"
        style={[
          style1 === 'open' && {
            // borderWidth: 20,
            backgroundColor: colors.background,
            // height: '100%',
            // zIndex: 100,
            // IOS
            shadowOffset: {
              width: 0,
              height: 2,
            },
            flex: 1,
            shadowOpacity: 0.1,
            shadowRadius: 2,
            // Android
            elevation: 3,
            borderRadius: 30,
            overflow: 'hidden',
          },
        ]}>
        <ScrollView
          style={{
            minHeight: windowHeight - 65,
            backgroundColor: colors.background,
            marginTop: 55,
            marginBottom: 60,
          }}>
          <ChatBubble practice={practice} />
          <ChatBubble practice={practice} />
          <ChatBubble practice={practice} />
          <ChatBubble practice={practice} />
          <ChatBubble practice={practice} />
          <ChatBubble practice={practice} />
          <ChatBubble practice={practice} />
          <ChatBubble practice={practice} />
          <ChatBubble practice={practice} />
          <ChatBubble practice={practice} />
          <ChatBubble practice={practice} />
          <ChatBubble practice={practice} />
          <ChatBubble practice={practice} />
          <ChatBubble practice={practice} />
          <ChatBubble practice={practice} />
          <ChatBubble practice={practice} />
        </ScrollView>
      </KeyboardAwareScrollView>
      <Animatable.View
        animation="bounceInLeft"
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          // marginTop: -10,
          // marginBottom: 10,
          // height: 100,
          backgroundColor: colors.background,
        }}>
        <Formik
          innerRef={inputRef}
          initialValues={{
            message: '',
          }}
          style={{}}
          onSubmit={(values) => {
            // signupPatient(values);
            sendMessage(values);
            // console.log('Lets go');
          }}>
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View
              style={{
                margin: 0,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.background,
                borderTopWidth: 0.8,
                borderColor: colors.background_1,
                height: 56,
              }}>
              {/* ------------------- BIO SECTION --------------------------------------- */}

              <InputBox
                handleChange={handleChange}
                handleBlur={handleBlur}
                valuesType={values.message}
                name="message"
                // placeholder={`Message ${
                //   practice && practice.practiceName.length > 18
                //     ? practice.practiceName.substring(0, 11 - 3) + '...'
                //     : practice.practiceName
                // }`}
                icon2Name="attachment"
                icon2Type="entypo"
                icon2Action={console.log}
                autoCompleteType="name"
                textContentType="givenName"
                keyboardType="default"
                autoCapitalize="sentences"
                boxStyle={{
                  borderRadius: 50,
                  width: windowWidth - 80,
                  height: 45,
                  marginTop: 0,
                }}
                styling={{
                  input: {
                    fontSize: normalize(15),
                    color: colors.text,
                    marginLeft: 5,
                  },
                }}
              />
              <Button
                TouchableComponent={() => {
                  // return isLoading ? (
                  //   <ActivityIndicator
                  //     animating={true}
                  //     size={normalize(21)}
                  //     color={colors.text}
                  //   />
                  // ) : (
                  return (
                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={{
                        backgroundColor: colors.primary,
                        height: 40,
                        width: 40,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        // marginTop: 10,
                        marginLeft: 10,
                        borderRadius: 10,
                      }}>
                      <Icon
                        name={'ios-send'}
                        type={'ionicon'}
                        color={'white'}
                        size={normalize(21)}
                        style={{
                          alignSelf: 'center',
                        }}
                      />
                    </TouchableOpacity>
                  );
                  // );
                }}
              />
            </View>
          )}
        </Formik>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  formFieldRow: {
    flexDirection: 'row',
    width: appwidth,
    justifyContent: 'space-between',
  },
});

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  isLoading: selectIsLoading,
});

const mapDispatchToProps = (dispatch) => ({
  // getPracticesAllStart: () => dispatch(getPracticesAllStart()),
  editProfile: (data) => dispatch(editProfile(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
