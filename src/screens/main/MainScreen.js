import React, { useContext, useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useWindowDimensions, Linking, Platform } from 'react-native';
import DrawerContent from './DrawerContent';
// import Practices from './practice/Practices';
import Profile from './profile/Profile';
import EditProfile from './profile/EditProfile';
// import AddGroup from '../addGroup/AddGroup';
import Appointments from './appointment/Appointments';
import Media from './media/Media';
import { Dimensions } from 'react-native';
import Chats from './chat/Chats';
import Practx from './practx/Practx';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, { Importance } from 'react-native-push-notification';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import {
  selectChatChannels,
  selectCurrentChatChannel,
  selectCurrentPracticeId,
} from '../../redux/practices/practices.selector';
import {
  getAllPatientNotificationStart,
  getJoinedPracticesStart,
  getPracticesAllStart,
  getPracticesDmsStart,
  setCurrentChatChannel,
  setPracticeId,
} from '../../redux/practices/practices.actions';
import { usePubNub } from 'pubnub-react';
import Appointment from './appointment/Appointment';
import { useIsFocused, useTheme } from '@react-navigation/native';
import notifee, {
  AndroidImportance,
  EventType,
  AndroidGroupAlertBehavior,
} from '@notifee/react-native';
import { selectCurrentUser, selectToken } from '../../redux/user/user.selector';
import SendReplyMessage from '../../components/hoc/SendReplyMessage';
import { SocketContext } from '../../context/socketContext';
import { getAppointmentStart } from '../../redux/appointment/appointment.actions';
import { showMessage } from 'react-native-flash-message';
import Notification from './notification/Notification';
import { Icon } from 'react-native-elements';
import HelpFeedback from './helpFeedback/HelpFeedback';

const Drawer = createDrawerNavigator();
const windowWidth = Dimensions.get('window').width;
const MainScreen = ({
  chatChannels,
  setCurrentChatChannel,
  currentChatChannel,
  currentUser,
  token,
  getPracticesAllStart,
  getJoinedPracticesStart,
  getAppointmentStart,
  getPracticesDmsStart,
  setPracticeId,
  currentPracticeId,
  getAllPatientNotificationStart,
}) => {
  const pubnub = usePubNub();
  const dimensions = useWindowDimensions();
  const [isInitialRender, setIsInitialRender] = useState(false);
  const { colors } = useTheme();
  const [groupCha, setGroupCha] = useState([]);

  const getSocket = useContext(SocketContext);
  useEffect(() => {
    if (token) {
      // loadPage();

      // subscribe to socket events
      const socket = getSocket(token);

      const listener = data => {
        console.log('notification data: ', data);
        switch (data.action) {
          case 'Accept join request':
            showMessage({
              message: `${data?.initiatorName} have approved your request to join there practice.`,
              type: 'none',
              duration: 6000,
              icon: { icon: 'auto', position: 'left' },
              renderFlashMessageIcon: () => (
                <Icon
                  type="ionicon"
                  name="ios-notifications-sharp"
                  color={'white'}
                  style={{ paddingRight: 10 }}
                />
              ),
              backgroundColor: colors.background_3,
            });
            getAllPatientNotificationStart();
            getPracticesAllStart();
            getJoinedPracticesStart();
            getAppointmentStart();
            break;
          case 'Book appointment for patient':
            showMessage({
              message: `${data?.initiatorName} have just scheduled an appointment for you.`,
              type: 'none',
              duration: 6000,
              icon: { icon: 'auto', position: 'left' },
              renderFlashMessageIcon: () => (
                <Icon
                  type="ionicon"
                  name="ios-notifications-sharp"
                  color={'white'}
                  style={{ paddingRight: 10 }}
                />
              ),
              backgroundColor: colors.background_3,
            });
            getAppointmentStart();
            getAllPatientNotificationStart();
            break;
          case 'Approved appointment':
            showMessage({
              message: `${data?.initiatorName} have approved your appointment schedule`,
              type: 'none',
              duration: 6000,
              icon: { icon: 'auto', position: 'left' },
              renderFlashMessageIcon: () => (
                <Icon
                  type="ionicon"
                  name="ios-notifications-sharp"
                  color={'white'}
                  style={{ paddingRight: 10 }}
                />
              ),
              backgroundColor: colors.background_3,
            });
            getAllPatientNotificationStart();
            getAppointmentStart();
            break;
          case 'Declined appointment':
            showMessage({
              message: `${data?.initiatorName} have just declined your appointment schedule`,
              type: 'none',
              duration: 6000,
              icon: { icon: 'auto', position: 'left' },
              renderFlashMessageIcon: () => (
                <Icon
                  type="ionicon"
                  name="ios-notifications-sharp"
                  color={'white'}
                  style={{ paddingRight: 10 }}
                />
              ),
              backgroundColor: colors.background_3,
            });
            getAllPatientNotificationStart();
            getAppointmentStart();
            break;
          case 'Remove patient':
            data?.practiceId === currentPracticeId && setPracticeId(0);
            showMessage({
              message: `You have being removed from ${data?.initiatorName}`,
              type: 'none',
              duration: 6000,
              icon: { icon: 'auto', position: 'left' },
              renderFlashMessageIcon: () => (
                <Icon
                  type="ionicon"
                  name="ios-notifications-sharp"
                  color={'white'}
                  style={{ paddingRight: 10 }}
                />
              ),
              backgroundColor: colors.background_3,
            });
            setTimeout(() => {
              getAllPatientNotificationStart();
              getAppointmentStart();
              getPracticesAllStart();
              getJoinedPracticesStart();
              getPracticesDmsStart();
            }, 1000);
            break;
          case 'Leave practice':
            getAllPatientNotificationStart();
            break;
          default:
            break;
        }
        if (
          data.action === 'Book appointment for patient' ||
          data.action === 'Book appointment' ||
          data.action === 'approved appointment' ||
          data.action === 'declined appointment'
        ) {
          // loadPage();
          console.log('New CHanges made from socket');
        }
      };

      socket.on('notifications', listener);

      return () => {
        // before the component is destroyed
        // unbind all event handlers used in this component
        socket.off('notifications', listener);
      };
    }
  }, [token, getSocket]);

  function toString(o) {
    Object.keys(o).forEach(k => {
      if (typeof o[k] === 'object') {
        return toString(o[k]);
      }

      o[k] = '' + o[k];
    });

    return o;
  }

  async function onDisplayChatNotification({ data, groupCha }) {
    console.log('Image', data);
    // Create a channel
    // const channelId = await notifee.createChannel({
    //   id: 'default',
    //   name: 'Default Channel',
    // });
    toString(data);
    // console.log('Data  Objectt', {
    //   ...data,
    //   userId: currentUser?.id.toString(),
    //   chatId: currentUser?.chatId,
    //   firstname: currentUser?.firstname,
    //   lastname: currentUser?.lastname,
    // });

    const channelId = await notifee.createChannel({
      id: 'important',
      name: 'Important Notifications',
      importance: AndroidImportance.HIGH,
    });
    if (Platform.OS === 'ios') {
      notifee.setNotificationCategories([
        {
          id: 'message',
          summaryFormat: 'You have %u+ unread messages from %@.',
          actions: [
            {
              id: 'reply',
              title: 'Reply',
              input: true,
            },
          ],
        },
      ]);
    } else {
      notifee.displayNotification({
        id: data.channel + '-group',
        title: 'Messages',
        subtitle: `${data.type === 'gm' ? data.subtitle : data.title}  ${
          data.type === 'gm' ? '• ' + data.title : ''
        }`,
        data: {
          ...data,
          userId: currentUser?.id.toString(),
          chatId: currentUser?.chatId,
          firstname: currentUser?.firstname,
          lastname: currentUser?.lastname,
          notifeeGroupId: data.channel + '-group',
        },
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          smallIcon: 'ic_notification',
          largeIcon: data.practiceImage,
          circularLargeIcon: data.practiceImage,
          groupSummary: true,
          groupId: data.channel,
          groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
          actions: [
            {
              title: 'Reply',
              icon: 'https://my-cdn.com/icons/reply.png',
              pressAction: {
                id: 'reply',
              },
              input: {
                placeholder: `Reply to ${data.title}...`,
              }, // enable free text input
            },
          ],
        },
      });
    }

    // Display a notification
    await notifee.displayNotification({
      title: data.title,
      subtitle: data.type === 'gm' ? data.subtitle : '',
      data: {
        ...data,
        userId: currentUser?.id.toString(),
        chatId: currentUser?.chatId,
        firstname: currentUser?.firstname,
        lastname: currentUser?.lastname,
      },
      body:
        data.messageType === 'text'
          ? data.body
          : data.messageType === 'image'
          ? '📷 Photo'
          : data.messageType === 'video'
          ? '🎥 Video'
          : data.messageType === 'voiceNote'
          ? '🎤 Voice message'
          : data.messageType === 'file'
          ? '📁 File'
          : data.body, // (required)
      android: {
        channelId: channelId,
        importance: AndroidImportance.HIGH,
        smallIcon: 'ic_notification', // optional, defaults to 'ic_launcher'.
        largeIcon: data.practiceImage,
        circularLargeIcon: data.practiceImage
          ? data.practiceImage
          : 'https://icon-library.com/images/staff-icon-png/staff-icon-png-17.jpg',
        sound: 'practx_notify',
        vibrationPattern: [300, 500],
        groupId: data.channel,
        // groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
        actions: [
          {
            title: 'Reply',
            icon: 'https://my-cdn.com/icons/reply.png',
            pressAction: {
              id: 'reply',
            },
            input: {
              placeholder: `Reply to ${data.title}...`,
            }, // enable free text input
          },
        ],
      },
      ios: {
        // attachments: [
        //   // {
        //   //   // iOS resource
        //   //   url: 'local-image.png',
        //   //   thumbnailHidden: true,
        //   // },
        //   // {
        //   //   // Local file path.
        //   //   url: '/Path/on/device/to/local/file.mp4',
        //   //   thumbnailTime: 3, // optional
        //   // },
        //   // {
        //   //   // React Native asset.
        //   //   url: require('./assets/my-image.gif'),
        //   // },
        //   {
        //     // Remote image
        //     url:
        //       'https://thumbs.dreamstime.com/b/golden-retriever-dog-21668976.jpg',
        //   },
        // ],
        categoryId: 'message',
        summaryArgument: data.title,
        summaryArgumentCount: 1,
        sound: 'practx_notify.wav',
      },
    });
  }

  // PushNotification.popInitialNotification((notification) => {
  //   console.log('Initial Notification', notification);
  // });
  PushNotification.configure({
    // Called when Token is generated.
    onRegister: function (token) {
      console.log('TOKEN:', token);
      if (token.os === 'ios' && pubnub) {
        // pubnub.push.addChannels(
        //   {
        //     channels: chatChannels,
        //     device: token.token,
        //     pushGateway: 'apns2',
        //     environment: 'production', /// Required for APNS2
        //     topic: 'com.bcapturetech.practx',
        //   },
        //   function (status) {
        //     console.log('Testing APNS2', status);
        //   },
        // );
        console.log('Date', new Date().getTime());
        pubnub.push.addChannels(
          {
            channels: chatChannels,
            // channels: ['channel1'],
            device: token.token,
            pushGateway: 'apns2',
            environment: 'development', // Required for APNs2
            topic: 'com.bcapturetech.practx', // Required for APNs2
          },
          function (status) {
            console.log(status);
          },
        );
        // Send iOS Notification from debug console: {"pn_apns":{"aps":{"alert":"Hello World."}}}
      } else if (token.os === 'android' && pubnub) {
        // console.log(pubnub);
        pubnub.push.addChannels({
          channels: chatChannels,
          device: token.token,
          pushGateway: 'gcm', // apns, gcm, mpns
        });
        // Send Android Notification from debug console: {"pn_gcm":{"data":{"message":"Hello World."}}}
      }
    },
    // Something not working?
    // See: https://support.pubnub.com/hc/en-us/articles/360051495432-How-can-I-troubleshoot-my-push-notification-issues-
    // Called when a remote or local notification is opened or received.
    onNotification: function (notification) {
      console.log('NOTIFICATION:----REMOTE', notification);
      // setInitialState('chats');
      setGroupCha([...new Set([...groupCha, notification.data.channel])]);
      console.log(notification.data.type);
      // if (!chaList.includes(notification.data.channel)) {
      console.log(
        'test channels',
        currentChatChannel,
        ' +----',
        notification.data.channel,
      );
      // }
      if (!notification.userInteraction) {
        // notification.data.channel;
        console.log('I am here 1');
        if (
          !notification.foreground ||
          currentChatChannel !== notification.data.channel
        ) {
          console.log('I am here 1a');
          // pushLocalNotification({
          //   id: notification.id ? notification.id : '2',
          //   data: notification.data,
          //   groupCha: groupCha,
          // });
          onDisplayChatNotification({
            data: notification.data,
            groupCha: groupCha,
          });
        }
      } else {
        console.log('I am here 2');
        setGroupCha([]);
        Linking.openURL(
          `practx://chatMessages/${
            notification.data.practiceId +
            '-' +
            notification.data.channel +
            '-' +
            notification.data.type +
            '-' +
            notification.data.groupId
          }`,
        );
        PushNotification.cancelAllLocalNotifications();
        console.log('NO Push', notification);
      }

      //   .then((url) => console.log('Hello uRl', url))
      //   .catch((err) => console.log(err));
      // Do something with the notification.
      // Required on iOS only (see fetchCompletionHandler docs: https://reactnative.dev/docs/pushnotificationios)
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATIONS:', notification);

      // PushNotification.getChannels(function (channel_ids) {
      //   console.log('Channel ID', channel_ids); // ['channel_id_1']
      // });

      // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err) {
      console.log('THis is the error registering notification', err);
      console.error(err.message, err);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
    // ANDROID: GCM or FCM Sender ID
    senderID: '732342770141',
  });

  useEffect(() => {
    // WhatsAppNum().then((res) => {
    //   console.log('WE MOVE');
    //   console.log('Hel', res);
    // });

    // SplashScreen.hide();
    // RNAudiotransition.initAudioTransition();

    // backgroundTask();
    // BackgroundFetch.registerHeadlessTask(MyHeadlessTask);
    // internetChecker();
    // hideNavigationBar();
    if (!isInitialRender) {
      setIsInitialRender(true);
      // setTimeout(() => {
      //   // getTimeSinceStartup().then((time) => {
      //   //   console.log(`Time since startup: ${time} ms`);
      //   // });
      // }, 1);
      // return true;
    }
  }, [isInitialRender]);
  const [permissions, setPermissions] = useState({});
  // useEffect(() => {
  //   PushNotificationIOS.addEventListener('notification', onRemoteNotification);
  // });

  // const onRemoteNotification = (notification) => {
  //   console.log('IOS NOTIFICATION TEST', notification);
  //   const isClicked = notification.getData().userInteraction === 1;

  //   if (isClicked) {
  //     // Navigate user to another screen
  //   } else {
  //     // Do something else with push notification
  //   }
  // };

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction, input } = detail;
    let displayedNotification = await notifee.getDisplayedNotifications();
    console.log('Notification Type ----', notification);

    if (type === EventType.ACTION_PRESS && pressAction.id === 'reply') {
      console.log('Replied Text-------------', input);
      console.log('Notification', notification);
      SendReplyMessage(notification?.data, input, pubnub);
      await notifee.cancelDisplayedNotifications(
        displayedNotification
          .filter(
            item =>
              item?.notification?.data?.channel ===
              detail.notification?.data?.channel,
          )
          .map(it => it?.id),
      );
      // updateChatOnServer(notification.data.conversationId, input);
    } else if (type === EventType.PRESS) {
      console.log(
        'Event is Pressed type for notification',
        EventType.ACTION_PRESS,
        notification,
      );
      Linking.openURL(
        `practx://chatMessages/${
          notification.data.practiceId +
          '-' +
          notification.data.channel +
          '-' +
          notification.data.type +
          '-' +
          notification.data.groupId
        }`,
      );
      await notifee.cancelDisplayedNotifications(
        displayedNotification
          .filter(
            item =>
              item?.notification?.data?.channel ===
              detail.notification?.data?.channel,
          )
          .map(it => it?.id),
      );
    }
  });

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(async ({ type, detail }) => {
      let displayedNotification = await notifee.getDisplayedNotifications();
      console.log('Forground event-------------', type);
      const { notification, pressAction, input } = detail;
      if (type === EventType.ACTION_PRESS && pressAction.id === 'reply') {
        console.log('In appss Replied Text-------------', input);
        // console.log('Notification', notification);
        SendReplyMessage(notification?.data, input, pubnub);
        await notifee.cancelDisplayedNotifications(
          displayedNotification
            .filter(
              item =>
                item?.notification?.data?.channel ===
                detail.notification?.data?.channel,
            )
            .map(it => it?.id),
        );
        // updateChatOnServer(notification.data.conversationId, input);
      } else {
        console.log('Action Type', type);
        switch (type) {
          case EventType.DISMISSED:
            console.log('User dismissed notification', detail.notification);
            break;
          case EventType.PRESS:
            console.log(
              'User pressed notification',
              detail.notification?.data?.channel,
            );
            // console.log(
            //   'DisplayedNotification ',
            //   displayedNotification
            //     .filter(
            //       item =>
            //         item?.notification?.data?.channel ===
            //         detail.notification?.data?.channel,
            //     )
            //     .map(it => it?.id),
            // );
            Linking.openURL(
              `practx://chatMessages/${
                notification.data.practiceId +
                '-' +
                notification.data.channel +
                '-' +
                notification.data.type +
                '-' +
                notification.data.groupId
              }`,
            );
            await notifee.cancelDisplayedNotifications(
              displayedNotification
                .filter(
                  item =>
                    item?.notification?.data?.channel ===
                    detail.notification?.data?.channel,
                )
                .map(it => it?.id),
            );
            break;
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      drawerStyle={{
        width: !isInitialRender ? 0 : windowWidth - 80,
        // backgroundColor: 'white',
      }}
      initialRouteName="Practx"
      overlayColor={0}
      drawerType="slide"
      detachInactiveScreens={true}>
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Practx" component={Practx} />
      <Drawer.Screen name="Chats" component={Chats} />
      <Drawer.Screen name="Appointment" component={Appointment} />
      <Drawer.Screen name="Media" component={Media} />
      <Drawer.Screen name="Notification" component={Notification} />
      <Drawer.Screen name="HelpFeedback" component={HelpFeedback} />
      {/* <Drawer.Screen
        name="EditProfile"
        component={EditProfile}
        navigationOptions={{
          drawerLockMode: 'locked-closed',
          swipeEnabled: false,
        }}
        // options={{ drawerLockMode: 'locked-closed', swipeEnabled: false }}
      /> */}
      {/*    <Drawer.Screen name="WhatsAppTabs" component={WhatsAppTabs} />
            <Drawer.Screen name="InstagramPro" component={InstagramPro} />
            <Drawer.Screen name="InstagramDownload" component={Instagram} />
            <Drawer.Screen name="TwitterDownload" component={Twitter} />
            <Drawer.Screen name="FacebookDownload" component={Facebook} />
            <Drawer.Screen name="SettingsScreen" component={SettingsScreen} /> */}
      {/* <Drawer.Screen name="HelpFeedBackScreen" component={HelpFeedbackScreen} />
      <Drawer.Screen
        name="VideoDownloadScreen"
        component={VideoDownloadScreen}
      />
      <Drawer.Screen
        name="CollectionDownloadScreen"
        component={CollectionDownloadScreen}
      />
      <Drawer.Screen
        name="CollectionVideoScreen"
        component={CollectionVideoScreen}
      />
      <Drawer.Screen name="VideoModalScreen" component={VideoModalScreen} />
      <Drawer.Screen name="ImageModalScreen" component={ImageModalScreen} /> */}
    </Drawer.Navigator>
  );
};

const mapStateToProps = createStructuredSelector({
  // themeMode: selectThemeMode,
  token: selectToken,
  currentUser: selectCurrentUser,
  chatChannels: selectChatChannels,
  currentChatChannel: selectCurrentChatChannel,
  currentPracticeId: selectCurrentPracticeId,
});
const mapDispatchToProps = dispatch => ({
  setCurrentChatChannel: data => dispatch(setCurrentChatChannel(data)),
  getPracticesAllStart: () => dispatch(getPracticesAllStart()),
  getJoinedPracticesStart: () => dispatch(getJoinedPracticesStart()),
  getAppointmentStart: data => dispatch(getAppointmentStart(data)),
  getPracticesDmsStart: () => dispatch(getPracticesDmsStart()),
  setPracticeId: id => dispatch(setPracticeId(id)),
  getAllPatientNotificationStart: () =>
    dispatch(getAllPatientNotificationStart()),
});
export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
