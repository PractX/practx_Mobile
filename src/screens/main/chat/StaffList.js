import React from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import { ActivityIndicator } from 'react-native-paper';
import normalize from '../../../utils/normalize';

const StaffList = ({
  showStaffs,
  setShowStaffs,
  colors,
  scanDevice,
  isLoadingDevice,
  deviceTypes,
  connectDevice,
  disconnectDevice,
  state,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      hasBackdrop={true}
      backdropColor="black"
      backdropOpacity={0.9}
      deviceWidth={Dimensions.get('window').height}
      deviceHeight={Dimensions.get('window').height}
      visible={showStaffs}
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
      <View
        style={{
          // position: 'absolute',
          justifyContent: 'space-between',
          backgroundColor: colors.background,
          borderColor: colors.background_1 + 25,
          borderWidth: 3,
          height: Dimensions.get('window').height / 1.7,
          width: Dimensions.get('window').width / 1.3,
          paddingVertical: 15,
          paddingHorizontal: 10,
          // alignItems: 'center',
          borderRadius: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            alignSelf: 'center',
            width: Dimensions.get('window').width / 1.3,
            height: 25,
          }}>
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              name="bluetooth"
              type="feather"
              color={colors.text}
              size={normalize(17)}
              style={{ paddingHorizontal: 5 }}
            />
            <Text
              style={{
                fontSize: normalize(15),
                // textAlign: 'center',
                color: colors.text,
                textTransform: 'capitalize',
                fontFamily: 'Comfortaa-Bold',
              }}>
              Devices
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => scanDevice()}
            style={{
              marginRight: 15,
            }}>
            <Icon
              name="refresh"
              type="ionicon"
              color={colors.text}
              size={normalize(20)}
              style={{ paddingHorizontal: 5 }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: Dimensions.get('window').height / 1.7 - 130,
            paddingHorizontal: 10,
          }}>
          {isLoadingDevice ? (
            <View
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                marginTop: 100,
              }}>
              <ActivityIndicator
                animating={true}
                size={normalize(30)}
                color={colors.text}
              />
            </View>
          ) : (
            <ScrollView>
              <View>
                <Text
                  style={{
                    fontSize: normalize(15),
                    color: colors.text_1,
                    textTransform: 'capitalize',
                    fontFamily: 'SofiaProSemiBold',
                  }}>
                  Paired Device
                </Text>
                {deviceTypes &&
                  deviceTypes.paired.map((item, i) => (
                    <TouchableOpacity
                      key={i}
                      style={{
                        marginVertical: 5,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                      onPress={() => connectDevice(item)}>
                      <Text
                        style={{
                          fontSize: normalize(14),
                          // textAlign: 'center',
                          color: colors.text,
                          textTransform: 'capitalize',
                          fontFamily: 'Comfortaa-Bold',
                        }}>
                        {item.name}
                      </Text>
                      <ActivityIndicator
                        animating={item.name === state.name && state.loading}
                        size={normalize(15)}
                        color={colors.text}
                      />
                    </TouchableOpacity>
                  ))}
              </View>

              <View style={{ marginTop: 20 }}>
                <Text
                  style={{
                    fontSize: normalize(15),
                    color: colors.text_1,
                    textTransform: 'capitalize',
                    fontFamily: 'SofiaProSemiBold',
                  }}>
                  New Available Device
                </Text>
                {deviceTypes &&
                  deviceTypes.found.map((item, i) => (
                    <TouchableOpacity
                      key={i}
                      style={{
                        marginVertical: 5,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                      onPress={() => connectDevice(item)}>
                      <Text
                        style={{
                          fontSize: normalize(14),
                          color: colors.text,
                          textTransform: 'capitalize',
                          fontFamily: 'Comfortaa-Bold',
                        }}>
                        {item.name}
                      </Text>
                      <ActivityIndicator
                        animating={item.name === state.name && state.loading}
                        size={normalize(15)}
                        color={colors.text}
                      />
                    </TouchableOpacity>
                  ))}
              </View>
            </ScrollView>
          )}
        </View>
        <Button
          title="Close"
          titleStyle={{
            fontSize: normalize(14),
            fontFamily: 'Comfortaa-Bold',
          }}
          onPress={() => setShowStaffs(false)}
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
        />
      </View>
    </Modal>
  );
};

export default StaffList;
