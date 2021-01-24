import React from 'react';
import { View, Dimensions, TextInput, StyleSheet } from 'react-native';
import { normalize } from 'react-native-elements';
import { useScrollToTop, useTheme } from '@react-navigation/native';
import { Icon, Button } from 'react-native-elements';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const appwidth = windowWidth * 0.8;

const InputBox = ({
  handleChange,
  handleBlur,
  valuesType,
  name,
  iconName,
  iconType,
  iconColor,
  iconSize,
  placeholder,
  placeholderTextColor,
  autoCompleteType,
  textContentType,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
  boxStyle,
  styling,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.formField,
        boxStyle,
        {
          backgroundColor: colors.background_1,
        },
      ]}>
      <Icon
        name={iconName}
        type={iconType}
        color={iconColor ? iconColor : colors.text_1}
        size={normalize(iconSize ? iconSize : 19)}
        style={[
          styles.formIcons,
          styling && styling.icon ? styling.icon : { alignSelf: 'center' },
        ]}
      />

      <TextInput
        autoCapitalize={autoCapitalize}
        autoCompleteType={autoCompleteType}
        textContentType={textContentType}
        keyboardType={keyboardType}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={
          placeholderTextColor ? placeholderTextColor : colors.text_2
        }
        style={[
          styles.formTextInput,
          styling && styling.input ? styling.input : { color: colors.text_1 },
        ]}
        onChangeText={handleChange(name)}
        onBlur={handleBlur(name)}
        value={valuesType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topText: {
    marginTop: 5,
    fontSize: normalize(16),
    fontFamily: 'SofiaProRegular',
  },

  formField: {
    flexDirection: 'row',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 0,
    marginTop: 15,
    alignItems: 'center',
  },

  formTextInput: {
    marginLeft: 20,
    width: '90%',
    fontSize: normalize(17),
    fontFamily: 'SofiaProRegular',
  },

  formIcons: {
    alignSelf: 'center',
  },

  flexrow: {
    flexDirection: 'row',
  },

  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: -40,
  },

  whiteFont: {
    fontSize: normalize(14),
    fontFamily: 'SofiaProRegular',
  },
  spacer: {
    marginRight: 15,
    borderRadius: 6,
    marginLeft: -10,
    width: 22,
    alignItems: 'center',
  },

  bellowFormView: {
    flexDirection: 'row',
    width: appwidth,
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 25,
  },

  bellowFormViewtext: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  loginButtonView: {
    width: windowWidth,
    alignItems: 'center',
  },

  loginButton: {
    width: appwidth,
    justifyContent: 'center',
    borderRadius: 10,
  },
  bellowButtonText: {
    alignItems: 'center',
    marginTop: windowHeight * 0.05,
    marginBottom: 23,
  },

  error: {
    fontSize: 13,
    color: 'red',
  },
});

export default InputBox;
