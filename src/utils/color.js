import AsyncStorage from '@react-native-community/async-storage';

export const ColorList = [
  {
    mode: 'light',
    primary: '#e01b43',
    primary_light: '#05da3e',
    primary_dark: '#038125',
    secondary: '#00c7e5',
    tertiary: '#43b856',
    quaternary: '#4e58d6',
    quinary: '#ffa575',
    background: '#ffffff',
    background_1: '#eeeeee',
    card: '#f4f2f2',
    text: '#777777',
    text_1: '#242424',
    text_2: '#e6e1e1',
    text_4: '#9b9b9b',
    btn_hover: '#a8a8a8',
    fab: '#05af32',
    play_1: '#05af32',
  },
  {
    mode: 'dark',
    primary: '#e01b43',
    primary_light: '#05da3e',
    primary_dark: '#038125',
    secondary: '#00c7e5',
    tertiary: '#43b856',
    quaternary: '#4e58d6',
    quinary: '#ffa575',
    background: '#1e2435',
    background_1: '#323646',
    card: '#050e08',
    text: '#fefeff',
    text_1: '#a3a3a3',
    text_2: '#9298ad',
    text_4: '#aaaaaa',
    btn_hover: '#0b1d12',
    fab: '#038125',
    play_1: '#05af32',
  },
];

// cursive;
//casual

export const AppColor = async () => {
  const color = await AsyncStorage.getItem('theme_color');
  const data = JSON.parse(color);
  // console.log(data);
  return data;
};
