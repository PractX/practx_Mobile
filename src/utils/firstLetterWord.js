const firstLetterWord = (str) => {
  let result = '';

  // Traverse the string.
  let v = true;
  for (let i = 0; i < str.length; i++) {
    // If it is space, set v as true.
    if (str[i] == ' ') {
      v = true;
    }

    // Else check if v is true or not.
    // If true, copy character in output
    // string and set v as false.
    else if (str[i] != ' ' && v == true) {
      result += str[i];
      v = false;
    }
  }
  return result;
};

export default firstLetterWord;
