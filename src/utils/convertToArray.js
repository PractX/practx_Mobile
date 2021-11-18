const convertToArray = obj => {
  const length = Math.max(...Object.keys(obj));
  const res = Array.from({ length }, (_, i) => obj[i + 1] || 0).filter(
    it => it !== 0,
  );
  return res;
};

export default convertToArray;
