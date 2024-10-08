import AsyncStorage from '@react-native-community/async-storage';

export const ColorList = [
  {
    mode: 'light',
    primary: '#e01b43',
    primary_light1: '#ff224e',
    primary_light: '#de5674',
    primary_dark: '#038125',
    secondary: '#00c7e5',
    tertiary: '#44b94e',
    tertiary_1: '#03a711',
    quaternary: '#5654dc',
    quinary: '#ffa873',
    senary: '#fce7ea',
    background: '#ffffff',
    background_1: '#eeeeee',
    background_2: '#252a3e',
    background_3: '#565657',
    card: '#ffffff',
    text: '#777777',
    text_1: '#646363',
    text_2: '#969696',
    text_4: '#9b9b9b',
    btn_hover: '#a8a8a8',
    fab: '#05af32',
    play_1: '#05af32',
    danger: '#e1213f',
    danger_0: ' #ff0e0e',
    danger_1: '#bf2b43',
    danger_2: '#c44860',
    danger_3: '#aa0022',
    success: '#24bb73',
    success0: '#00FF00',
    track: '#464647',
    track2: '#8d8d8d',
    white: '#ffffff',
  },
  {
    mode: 'dark',
    primary: '#df2441',
    primary_light: '#de5674',
    primary_light1: '#ff224e',
    primary_dark: '#038125',
    secondary: '#00c7e5',
    tertiary: '#44b94e',
    tertiary_1: '#03a711',
    quaternary: '#5654dc',
    quinary: '#ffa873',
    senary: '#fce7ea',
    background: '#000000',
    background_1: '#111111',
    background_2: '#141414',
    background_3: '#242424',
    card: '#191e32',
    text: '#fdffff',
    text_1: '#9397b1',
    text_2: '#81838a',
    text_4: '#aaaaaa',
    btn_hover: '#0b1d12',
    fab: '#038125',
    play_1: '#05af32',
    danger: '#e1213f',
    danger_0: ' #ff0e0e',
    danger_1: '#bf2b43',
    danger_2: '#c44860',
    danger_3: '#aa0022',
    success: '#24bb73',
    success0: '#00FF00',
    track: '#353535',
    track2: '#8d8d8d',
    white: '#ffffff',
  },
];

// old Dark theme
// background: '#191e32',
// background_1: '#2f3245',
// background_2: '#252a3e',

//Secondary "#2aa5bc"
// cursive;
//casual

export const AppColor = async () => {
  const color = await AsyncStorage.getItem('theme_color');
  const data = JSON.parse(color);
  // console.log(data);
  return data;
};
