import React from 'react';
import { CheckBox, Text } from 'native-base';
import { StyleSheet, View } from 'react-native';
import { MenuOption } from 'react-native-popup-menu';
import normalize from '../../utils/normalize';

const MenuCheckOption = ({
  name,
  setCheckState,
  checkState,
  checkStateType,
  colors,
}) => {
  return (
    <MenuOption
      customStyles={{ backgroundColor: 'green' }}
      onSelect={() => {
        if (checkStateType[0] === 'opt1') {
          setCheckState({ ...checkState, opt1: !checkStateType[1] });
        } else if (checkStateType[0] === 'opt2') {
          setCheckState({ ...checkState, opt2: !checkStateType[1] });
        } else {
          setCheckState({ ...checkState, opt3: !checkStateType[1] });
        }
        return false;
      }}
      children={
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 13,
          }}>
          <Text
            style={{
              color: colors.text_1,
              fontSize: normalize(14),
              fontFamily: 'SofiaProRegular',
            }}>
            {name}
          </Text>
          <CheckBox
            checked={checkStateType[1]}
            color={colors.background_1}
            style={styles.spacer}
            onPress={() => {
              if (checkStateType[0] === 'opt1') {
                setCheckState({ ...checkState, opt1: !checkStateType[1] });
              } else if (checkStateType[0] === 'opt2') {
                setCheckState({ ...checkState, opt2: !checkStateType[1] });
              } else {
                setCheckState({ ...checkState, opt3: !checkStateType[1] });
              }
            }}
          />
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  spacer: {
    color: 'green',
    borderRadius: 50,
    alignItems: 'center',
  },
});

export default MenuCheckOption;
