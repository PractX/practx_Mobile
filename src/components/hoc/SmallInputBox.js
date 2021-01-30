import React from 'react';
import { View, Dimensions, TextInput, StyleSheet } from 'react-native';
import { normalize } from 'react-native-elements';
import { useScrollToTop, useTheme } from '@react-navigation/native';
import { Icon, Button } from 'react-native-elements';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.8;

const SmallInputBox = ({
  handleChange,
  handleBlur,
  valuesType,
  name,
  iconName,
  iconType,
  placeholder,
  autoCompleteType,
  textContentType,
  keyboardType,
  autoCapitalize,
  maxLength,
  boxStyle,
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.formField,
        boxStyle,
        { width: appwidth * 0.28, backgroundColor: colors.background_1 },
      ]}>
      <Icon
        name={iconName}
        type={iconType}
        color={colors.text_1}
        size={normalize(18)}
        style={[
          styles.formIcons,
          { color: colors.text_1, alignSelf: 'center' },
        ]}
      />

      <TextInput
        autoCapitalize={autoCapitalize}
        autoCompleteType={autoCompleteType}
        textContentType={textContentType}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={colors.text_2}
        style={[styles.formTextInput, { color: colors.text_1 }]}
        onChangeText={handleChange(name)}
        onBlur={handleBlur(name)}
        value={valuesType}
        maxLength={maxLength}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formField: {
    flexDirection: 'row',
    borderRadius: 10,
    paddingHorizontal: 0,
    // paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  formTextInput: {
    fontSize: normalize(15),
    fontFamily: 'SofiaProRegular',
    alignItems: 'center',
    alignSelf: 'center',
    width: appwidth * 0.15,
    textAlign: 'center',
  },
  formIcons: {
    alignSelf: 'center',
  },
});

export default SmallInputBox;
