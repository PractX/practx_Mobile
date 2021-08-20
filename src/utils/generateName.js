const generateName = (length, type) => {
  let result = `practx_${type}_`;

  // Traverse the string.
  let character =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charLength = character.length;
  for (let i = 0; i < length; i++) {
    result += character.charAt(Math.floor(Math.random() * charLength));
  }
  return result;
};

export default generateName;
