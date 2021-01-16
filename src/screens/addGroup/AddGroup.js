import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';

const AddGroup = ({ navigation }) => {
  const { colors } = useTheme();
  const [style1, setStyle1] = useState();
  useEffect(() => {
    // console.log(navigation.toggleDrawer());
  }, [navigation]);
  React.useEffect(() => {
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
      console.log('Close');
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
          },
        ]}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 40, color: 'white' }}>Hellow worlds</Text>
          <Text style={{ fontSize: 40, color: 'white' }}>Hellow worlds</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddGroup;
