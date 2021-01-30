import React, { useEffect, useState, useContext } from 'react';
import * as Animatable from 'react-native-animatable';

import { Thumbnail } from 'native-base';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Header from '../../../components/hoc/Header';
import FastImage from 'react-native-fast-image';
import normalize from '../../../utils/normalize';

const Stack = createStackNavigator();

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.9;

const theme = {
  /* ---- THeme to be gotten from redux or context------*/
  background: '#1e1f36',
  highlight: '#ff0000',
  text: '#fff',
  text2: '#aaa',
  text3: '#555',
};

const Media = ({ navigation }) => {
  const { colors } = useTheme();
  const [style1, setStyle1] = useState();
  const [refreshing, setRefreshing] = useState(false);

  React.useEffect(() => {
    console.log(navigation.dangerouslyGetState().index);
    const unsubscribe = navigation.addListener('drawerOpen', (e) => {
      // Do something
      setStyle1('open');
    });

    return unsubscribe;
  }, [navigation]);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('drawerClose', (e) => {
      // Do something
      setStyle1('close');
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <SafeAreaView
      style={[
        style1 === 'open' && {
          borderWidth: 18,
          // borderColor: colors.background_1,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: colors.background_1,
          borderRightColor: 'transparent',
          flex: 1,
          // borderRadius: 240,
          borderTopLeftRadius: 110,
          borderBottomLeftRadius: 110,
        },
      ]}>
      <View
        style={[
          style1 === 'open' && {
            // borderWidth: 20,
            backgroundColor: colors.background,
            height: '100%',
            // zIndex: 100,
            // IOS
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            // Android
            elevation: 3,
            borderRadius: 30,
            overflow: 'hidden',
          },
        ]}>
        <Header navigation={navigation} title="Media request" />

        <ScrollView
          style={{
            width: style1 === 'open' ? appwidth - 50 : appwidth,
            alignSelf: 'center',
            marginTop: 50,
            backgroundColor: colors.background,
          }}>
          <View
            style={{
              borderBottomWidth: 0.8,
              borderBottomColor: colors.background_1,
              paddingVertical: 20,
            }}>
            <View style={{ flexDirection: 'row' }}>
              <FastImage
                source={{
                  uri:
                    'https://cdn.britannica.com/12/130512-004-AD0A7CA4/campus-Riverside-Ottawa-The-Hospital-Ont.jpg',
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 15,
                  backgroundColor: colors.background_1,
                  marginRight: 15,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />

              <View style={{}}>
                <Text style={[styles.heading, { color: colors.text }]}>
                  Team Diabities
                </Text>

                <Text
                  style={{
                    color: colors.text_1,
                    fontSize: normalize(12),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  31 Aug, 2020; 4:41PM
                </Text>
              </View>
            </View>

            <Text style={[styles.text, { color: colors.text_1 }]}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Loypesetting industry.
            </Text>

            <View style={{ flexDirection: 'row' }}>
              <FastImage
                source={{
                  uri:
                    'https://wwwnc.cdc.gov/travel/images/travel-with-medicine.jpg',
                }}
                onError={(error) => console.log(error)}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 15,
                  backgroundColor: colors.background_1,
                  marginRight: 15,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <FastImage
                source={{
                  uri:
                    'https://image.shutterstock.com/image-vector/various-meds-pills-capsules-blisters-260nw-1409823341.jpg',
                }}
                onError={(error) => console.log(error)}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 15,
                  backgroundColor: colors.background_1,
                  marginRight: 15,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <FastImage
                source={{
                  uri:
                    'https://res.cloudinary.com/devex/image/fetch/c_scale,f_auto,q_auto,w_720/https://lh6.googleusercontent.com/pqzA565QxaPcdtTDqyTJz0i_ddN2_kqHoEyC1DW9e7xMWLufyZhl4EyEsvAYl_oDzWslTyTDMD0J9k4oGGaswxfMIl8h8AD1M1IO-BY051iE45JqD4gTFP_52-PdxQ-vaMmOXIcL',
                }}
                onError={(error) => console.log(error)}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 15,
                  backgroundColor: colors.background_1,
                  marginRight: 15,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <FastImage
                source={{
                  uri:
                    'https://e3.365dm.com/18/07/2048x1152/skynews-brexit-medicines-health_4365434.jpg',
                }}
                onError={(error) => console.log(error)}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 15,
                  backgroundColor: colors.background_1,
                  // marginRight: 15,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
          </View>

          <View
            style={{
              paddingTop: 20,
              borderBottomWidth: 0.8,
              borderBottomColor: colors.background_1,
              paddingBottom: 20,
            }}>
            <View style={{ flexDirection: 'row' }}>
              <FastImage
                source={{
                  uri:
                    'https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fd1e00ek4ebabms.cloudfront.net%2Fproduction%2F31a68098-e568-4f55-b7db-af17c3a2c16e.jpg?source=google-amp&fit=scale-down&width=500',
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 15,
                  backgroundColor: colors.background_1,
                  marginRight: 15,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />

              <View style={{}}>
                <Text style={[styles.heading, { color: colors.text }]}>
                  Team Cancer
                </Text>

                <Text
                  style={{
                    color: colors.text_1,
                    fontSize: normalize(12),
                    fontFamily: 'SofiaProRegular',
                  }}>
                  29 Aug, 2020; 2:32PM
                </Text>
              </View>
            </View>

            <Text style={[styles.text, { color: colors.text_1 }]}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Loypesetting industry.
            </Text>

            <View style={{ flexDirection: 'row' }}>
              <FastImage
                source={{
                  uri:
                    'https://media.npr.org/assets/img/2019/07/01/gettyimages-826753434_custom-4b8d6dc04d2e72b759aae4abc32570d6c84f15b9-s800-c85.jpg',
                }}
                onError={(error) => console.log(error)}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 15,
                  backgroundColor: colors.background_1,
                  marginRight: 15,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <FastImage
                source={{
                  uri:
                    'https://i1.wp.com/www.irishcatholic.com/wp-content/uploads/2020/02/medical-02.jpg?fit=494%2C306&ssl=1',
                }}
                onError={(error) => console.log(error)}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 15,
                  backgroundColor: colors.background_1,
                  marginRight: 15,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <FastImage
                source={{
                  uri:
                    'https://www.simcoemuskokahealth.org/images/default-source/homeslider/istock-174825736-webbanner.jpg?sfvrsn=2',
                }}
                onError={(error) => console.log(error)}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 15,
                  backgroundColor: colors.background_1,
                  marginRight: 15,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: normalize(16),
    fontFamily: 'SofiaProSemiBold',
    color: theme.text,
  },
  text: {
    paddingVertical: 10,
    fontSize: normalize(14),
    fontFamily: 'SofiaProRegular',
  },
  image: {
    width: 50,
    height: 50,
    backgroundColor: 'gray',
    borderRadius: 15,
    marginRight: 10,
  },
  topThumbnails: {
    paddingVertical: 10,
    paddingLeft: 15,
    backgroundColor: theme.background,
  },
  topThumbnailsItem: {
    marginRight: 5,
  },
  topThumbnailsName: {
    color: theme.text2,
    fontSize: 12,
    textAlign: 'center',
    width: 50,
  },

  flexrow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flexGrow: 1,
  },

  card: {
    width: '100%',
    paddingVertical: 16,
    borderBottomColor: theme.text3,
    borderBottomWidth: 0.5,
  },
  cardbody: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flexGrow: 1,
    borderRightWidth: 1,
    paddingHorizontal: 16,
    width: '100%',
  },
  cardhead: {
    flexDirection: 'row',
    width: windowWidth * 0.74,
  },

  notificationHeader: {
    color: theme.text,
    fontSize: 12,
    fontWeight: 'bold',
    flex: 2,
  },

  notificationBody: {
    marginTop: 5,
    fontSize: 12,
    paddingRight: 80,
    color: theme.text2,
    fontWeight: 'bold',
  },
  notificationBody2: {
    color: 'green',
    fontSize: 11,
  },

  dot: {
    backgroundColor: 'green',
    borderRadius: 10,
    justifyContent: 'flex-end',
    width: 9,
    height: 9,
    marginRight: 5,
    alignSelf: 'center',
  },
});

export default Media;
